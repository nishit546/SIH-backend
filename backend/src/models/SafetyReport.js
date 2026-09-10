const mongoose = require('mongoose');

const reportTypeEnum = ['UNSAFE_ACT', 'UNSAFE_CONDITION', 'NEAR_MISS', 'INCIDENT'];
const processingStatusEnum = ['PENDING', 'ANALYZING', 'ANALYZED', 'FAILED'];

const safetyReportSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long'],
    },
    reportType: {
      type: String,
      required: [true, 'Report type is required'],
      enum: {
        values: reportTypeEnum,
        message: '{VALUE} is not a valid report type (allowed: UNSAFE_ACT, UNSAFE_CONDITION, NEAR_MISS, INCIDENT)',
      },
    },
    site: {
      type: String,
      required: [true, 'Site location is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    activity: {
      type: String,
      required: [true, 'Activity is required'],
      trim: true,
    },
    contractorType: {
      type: String,
      trim: true,
      default: null,
    },
    workPhase: {
      type: String,
      trim: true,
      default: null,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: processingStatusEnum,
        message: '{VALUE} is not a valid processing status (allowed: PENDING, ANALYZING, ANALYZED, FAILED)',
      },
      default: 'PENDING',
    },
    reporterId: {
      type: String,
      default: null,
    },
    sourceMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for common queries
safetyReportSchema.index({ reportType: 1 });
safetyReportSchema.index({ site: 1 });
safetyReportSchema.index({ status: 1 });
safetyReportSchema.index({ createdAt: -1 });

// Helper to auto-generate reportNumber if omitted
safetyReportSchema.pre('save', async function (next) {
  if (!this.reportNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.reportNumber = `MGO-REP-${timestamp}-${random}`;
  }
  next();
});

const SafetyReport = mongoose.models.SafetyReport || mongoose.model('SafetyReport', safetyReportSchema);

module.exports = SafetyReport;
