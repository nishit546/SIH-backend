const SafetyReport = require('../models/SafetyReport');
const mongoose = require('mongoose');

class SafetyReportMongoController {
  /**
   * CREATE - Create a new SafetyReport in MongoDB
   * POST /api/mongo/reports
   */
  async createReport(req, res, next) {
    try {
      const {
        reportNumber,
        description,
        reportType,
        site,
        department,
        activity,
        contractorType,
        workPhase,
        eventDate,
        status,
        sourceMetadata,
      } = req.body;

      const reporterId = req.user?.userId || req.body.reporterId || null;

      const newReport = new SafetyReport({
        reportNumber,
        description,
        reportType,
        site,
        department,
        activity,
        contractorType,
        workPhase,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        status,
        reporterId,
        sourceMetadata,
      });

      const savedReport = await newReport.save();

      return res.status(201).json({
        success: true,
        message: 'Safety report created successfully in MongoDB',
        data: savedReport,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', '),
          error: { code: 'VALIDATION_ERROR', details: messages },
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A report with this reportNumber already exists',
          error: { code: 'DUPLICATE_KEY_ERROR' },
        });
      }

      next(error);
    }
  }

  /**
   * GET ALL - Get all SafetyReports from MongoDB (supports filtering & pagination)
   * GET /api/mongo/reports
   */
  async getReports(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        reportType,
        site,
        status,
        department,
        search,
      } = req.query;

      const filter = {};

      if (reportType) filter.reportType = reportType;
      if (site) filter.site = { $regex: site, $options: 'i' };
      if (status) filter.status = status;
      if (department) filter.department = { $regex: department, $options: 'i' };
      if (search) {
        filter.$or = [
          { description: { $regex: search, $options: 'i' } },
          { reportNumber: { $regex: search, $options: 'i' } },
          { activity: { $regex: search, $options: 'i' } },
        ];
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [total, reports] = await Promise.all([
        SafetyReport.countDocuments(filter),
        SafetyReport.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean({ virtuals: true }),
      ]);

      return res.status(200).json({
        success: true,
        data: reports,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET BY ID - Get a single SafetyReport by ID
   * GET /api/mongo/reports/:id
   */
  async getReportById(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid MongoDB ObjectId format',
        });
      }

      const report = await SafetyReport.findById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: `Safety report with ID "${id}" was not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE - Update an existing SafetyReport by ID
   * PUT /api/mongo/reports/:id
   */
  async updateReport(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid MongoDB ObjectId format',
        });
      }

      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.id;

      const updatedReport = await SafetyReport.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedReport) {
        return res.status(404).json({
          success: false,
          message: `Safety report with ID "${id}" was not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Safety report updated successfully',
        data: updatedReport,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', '),
          error: { code: 'VALIDATION_ERROR', details: messages },
        });
      }

      next(error);
    }
  }

  /**
   * DELETE - Delete a SafetyReport by ID
   * DELETE /api/mongo/reports/:id
   */
  async deleteReport(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid MongoDB ObjectId format',
        });
      }

      const deletedReport = await SafetyReport.findByIdAndDelete(id);

      if (!deletedReport) {
        return res.status(404).json({
          success: false,
          message: `Safety report with ID "${id}" was not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Safety report deleted successfully from MongoDB',
        data: { id: deletedReport._id },
      });
    } catch (error) {
      next(error);
    }
  }
}

const safetyReportMongoController = new SafetyReportMongoController();

module.exports = {
  SafetyReportMongoController,
  safetyReportMongoController,
};
