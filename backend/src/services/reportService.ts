import prisma from '../config/database';
import { CreateReportDTO, PaginatedResult } from '../types/report.types';
import { NotFoundError } from '../utils/errors';
import { ProcessingStatus, SafetyReport, Prisma } from '@prisma/client';

export class ReportService {
  /**
   * Create a new safety report in the database
   */
  async createReport(data: CreateReportDTO): Promise<SafetyReport> {
    // Generate a unique human-readable report number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const reportNumber = `REP-${timestamp}-${randomSuffix}`;

    const report = await prisma.safetyReport.create({
      data: {
        reportNumber,
        description: (data.description || data.reportText)!.trim(),
        reportType: data.reportType,
        site: data.site.trim(),
        department: data.department?.trim() || null,
        activity: data.activity.trim(),
        contractorType: data.contractorType?.trim() || null,
        workPhase: data.workPhase?.trim() || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
        status: ProcessingStatus.PENDING,
        reporterId: data.reporterId || null,
        sourceMetadata: data.sourceMetadata ? (data.sourceMetadata as Prisma.InputJsonValue) : undefined,
      },
    });

    return report;
  }

  /**
   * Retrieve paginated safety reports list
   */
  async getReports(page: number = 1, limit: number = 20): Promise<PaginatedResult<any>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [total, reports] = await Promise.all([
      prisma.safetyReport.count(),
      prisma.safetyReport.findMany({
        skip,
        take: safeLimit,
        orderBy: {
          createdAt: 'desc',
        },
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

    // Transform reports to attach latest analysis cleanly if present
    const transformedReports = reports.map((r) => {
      const latestAnalysis = r.analyses && r.analyses.length > 0 ? r.analyses[0] : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { analyses, _count, ...baseReport } = r;
      return {
        ...baseReport,
        latestAnalysis,
        actionCount: _count.actions,
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
  async getReportById(id: string): Promise<any> {
    const report = await prisma.safetyReport.findUnique({
      where: { id },
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
   * Delete a safety report by ID
   */
  async deleteReport(id: string): Promise<{ id: string; reportNumber: string | null }> {
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

export const reportService = new ReportService();
