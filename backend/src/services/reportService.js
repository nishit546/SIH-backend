const prisma = require('../config/database');
const { NotFoundError, AppError } = require('../utils/errors');
const { ProcessingStatus, RiskLevel, ReportType } = require('@prisma/client');

class ReportService {
  /**
   * Create a new safety report in the database
   */
  async createReport(data) {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const reportNumber = `REP-${timestamp}-${randomSuffix}`;

    const report = await prisma.safetyReport.create({
      data: {
        reportNumber,
        description: (data.description || data.reportText).trim(),
        reportType: data.reportType,
        site: data.site.trim(),
        department: data.department?.trim() || null,
        activity: data.activity.trim(),
        contractorType: data.contractorType?.trim() || null,
        workPhase: data.workPhase?.trim() || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
        status: ProcessingStatus.PENDING,
        reporterId: data.reporterId || null,
        sourceMetadata: data.sourceMetadata || undefined,
      },
    });

    return report;
  }

  /**
   * Create and immediately analyze a safety report from an uploaded PDF document
   */
  async createReportFromPdf(file, metadata = {}) {
    const { getAiService } = require('./ai');
    const aiService = getAiService();

    // 1. Invoke Python AI Service to extract text & perform SIF inference
    const { analysis, extractedText, filename } = await aiService.analyzePdf(
      file.buffer,
      file.originalname
    );

    // 2. Generate Report Number & persist report
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const reportNumber = `PDF-${timestamp}-${randomSuffix}`;

    const reportType = metadata.reportType || 'UNSAFE_CONDITION';
    const site = metadata.site?.trim() || 'Field Operations (PDF Ingestion)';
    const activity = metadata.activity?.trim() || 'Industrial Operations';
    const department = metadata.department?.trim() || 'HSE & Field Operations';

    const sourceMetadata = {
      source: 'PDF_UPLOAD',
      originalFilename: filename,
      fileSize: file.size,
      mimeType: file.mimetype,
      ingestedAt: new Date().toISOString(),
    };

    // 3. Create SafetyReport in MySQL with ANALYZED status
    const report = await prisma.safetyReport.create({
      data: {
        reportNumber,
        description: extractedText || `Incident report imported from ${filename}`,
        reportType,
        site,
        department,
        activity,
        contractorType: metadata.contractorType?.trim() || null,
        workPhase: metadata.workPhase?.trim() || 'Operations & Maintenance',
        eventDate: metadata.eventDate ? new Date(metadata.eventDate) : new Date(),
        status: ProcessingStatus.ANALYZED,
        reporterId: metadata.reporterId || null,
        sourceMetadata,
      },
    });

    // 4. Create SafetyAnalysis linked to the report
    const savedAnalysis = await prisma.safetyAnalysis.create({
      data: {
        reportId: report.id,
        sifPotential: analysis.sifPotential,
        probability: analysis.probability,
        riskLevel: analysis.riskLevel,
        hazards: analysis.hazards,
        exposures: analysis.exposures,
        criticalControls: analysis.criticalControls,
        controlFailures: analysis.controlFailures,
        barrierStatus: analysis.barrierStatus,
        potentialConsequences: analysis.potentialConsequences,
        iogpRules: analysis.iogpRules,
        explanation: analysis.explanation,
        modelVersion: analysis.modelVersion,
        ontologyVersion: analysis.ontologyVersion,
        isLatest: true,
        rawResponse: analysis.rawResponse,
      },
    });

    return {
      report: {
        ...report,
        latestAnalysis: savedAnalysis,
        analyses: [savedAnalysis],
      },
      analysis: savedAnalysis,
      extractedText,
    };
  }

  /**
   * Retrieve paginated safety reports list
   */
  async getReports(params = {}) {
    const page = typeof params.page === 'number' ? params.page : parseInt(params.page || '1', 10);
    const limit = typeof params.limit === 'number' ? params.limit : parseInt(params.limit || '20', 10);

    const safePage = Math.max(1, isNaN(page) ? 1 : page);
    const safeLimit = Math.min(100, Math.max(1, isNaN(limit) ? 20 : limit));
    const skip = (safePage - 1) * safeLimit;

    // Build dynamic Prisma where filter
    const where = {};

    // 1. Full-text search across description, site, activity, and reportNumber
    if (params.search && params.search.trim()) {
      const term = params.search.trim();
      where.OR = [
        { description: { contains: term } },
        { site: { contains: term } },
        { activity: { contains: term } },
        { reportNumber: { contains: term } },
      ];
    }

    // 2. Structured facet filters
    if (params.site && params.site !== 'ALL') {
      where.site = { contains: params.site.trim() };
    }

    if (params.department && params.department !== 'ALL') {
      where.department = { contains: params.department.trim() };
    }

    if (params.activity && params.activity !== 'ALL') {
      where.activity = { contains: params.activity.trim() };
    }

    if (params.reportType && params.reportType !== 'ALL' && params.reportType in ReportType) {
      where.reportType = params.reportType;
    }

    if (params.status && params.status !== 'ALL' && params.status in ProcessingStatus) {
      where.status = params.status;
    }

    // 3. Date range filters
    const fromDate = params.from || params.fromDate;
    const toDate = params.to || params.toDate;
    if (fromDate || toDate) {
      where.eventDate = {};
      if (fromDate) where.eventDate.gte = new Date(fromDate);
      if (toDate) where.eventDate.lte = new Date(toDate);
    }

    // 4. AI-derived filters (via latest SafetyAnalysis)
    const analysisFilter = {};
    if (params.riskLevel && params.riskLevel !== 'ALL' && params.riskLevel in RiskLevel) {
      analysisFilter.riskLevel = params.riskLevel;
    }

    if (params.sifPotential && params.sifPotential !== 'ALL') {
      if (params.sifPotential === 'SIF_ONLY' || params.sifPotential === 'true') {
        analysisFilter.sifPotential = true;
      } else if (params.sifPotential === 'NON_SIF' || params.sifPotential === 'false') {
        analysisFilter.sifPotential = false;
      }
    }

    if (Object.keys(analysisFilter).length > 0) {
      where.analyses = {
        some: {
          isLatest: true,
          ...analysisFilter,
        },
      };
    }

    // Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    const orderBy = { [sortBy]: sortOrder };

    const [total, reports] = await Promise.all([
      prisma.safetyReport.count({ where }),
      prisma.safetyReport.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy,
        include: {
          analyses: {
            where: { isLatest: true },
            select: {
              id: true,
              sifPotential: true,
              probability: true,
              riskLevel: true,
              iogpRules: true,
              hazards: true,
              modelVersion: true,
            },
          },
          _count: {
            select: {
              actions: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / safeLimit) || 1;

    const transformedReports = reports.map((r) => {
      const latestAnalysis = r.analyses && r.analyses.length > 0 ? r.analyses[0] : null;
      const { analyses, _count, ...baseReport } = r;
      return {
        ...baseReport,
        latestAnalysis,
        actionCount: _count?.actions ?? 0,
      };
    });

    return {
      data: transformedReports,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Retrieve a single safety report by ID with full analysis and action history
   */
  async getReportById(id) {
    const report = await prisma.safetyReport.findFirst({
      where: {
        OR: [{ id }, { reportNumber: id }],
      },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
        actions: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignee: {
              select: { id: true, fullName: true, email: true },
            },
            creator: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
        reporter: {
          select: { id: true, fullName: true, email: true, department: true },
        },
        patternMappings: {
          include: {
            pattern: {
              select: {
                id: true,
                title: true,
                hazardCategory: true,
                iogpRule: true,
                riskLevel: true,
                patternType: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundError(`Safety report with ID "${id}" was not found`);
    }

    return report;
  }

  /**
   * Update an existing safety report by ID
   * Enforces role and ownership checks:
   * - ADMIN / HSE_ANALYST: Can update any report
   * - REPORTER / REVIEWER: Can only update their own report
   */
  async updateReport(id, data, user = null) {
    const existing = await prisma.safetyReport.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError(`Safety report with ID "${id}" was not found`);
    }

    // Ownership check for reporter role
    if (user) {
      const isReporter = user.role === 'REVIEWER' || user.role === 'REPORTER';
      const isAdminOrAnalyst = user.role === 'ADMIN' || user.role === 'ANALYST' || user.role === 'HSE_ANALYST' || user.role === 'MANAGER';

      if (isReporter && !isAdminOrAnalyst) {
        if (existing.reporterId && existing.reporterId !== user.userId) {
          throw new AppError('You do not have permission to modify another user\'s safety report', 403, 'FORBIDDEN');
        }
      }
    }

    const updateData = {};
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.reportType !== undefined) updateData.reportType = data.reportType;
    if (data.site !== undefined) updateData.site = data.site.trim();
    if (data.department !== undefined) updateData.department = data.department ? data.department.trim() : null;
    if (data.activity !== undefined) updateData.activity = data.activity.trim();
    if (data.contractorType !== undefined) updateData.contractorType = data.contractorType ? data.contractorType.trim() : null;
    if (data.workPhase !== undefined) updateData.workPhase = data.workPhase ? data.workPhase.trim() : null;
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate ? new Date(data.eventDate) : new Date();
    if (data.sourceMetadata !== undefined) updateData.sourceMetadata = data.sourceMetadata;

    const updated = await prisma.safetyReport.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Delete a safety report by ID
   */
  async deleteReport(id) {
    const existing = await prisma.safetyReport.findUnique({
      where: { id },
      select: { id: true, reportNumber: true },
    });

    if (!existing) {
      throw new NotFoundError(`Safety report with ID "${id}" was not found`);
    }

    await prisma.safetyReport.delete({
      where: { id },
    });

    return existing;
  }
}

const reportService = new ReportService();

module.exports = {
  ReportService,
  reportService,
};
