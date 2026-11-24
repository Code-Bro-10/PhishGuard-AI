import mongoose from 'mongoose';

const indicatorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    category: { type: String, required: true },
    severity: {
      type: String,
      enum: ['info', 'low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    explanation: { type: String, required: true },
    scoreImpact: { type: Number, default: 0 },
  },
  { _id: false }
);

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scanType: {
      type: String,
      enum: ['url', 'email'],
      required: true,
      index: true,
    },
    originalInput: {
      type: String,
      required: true,
    },
    normalizedInput: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      index: true,
    },
    detectedIndicators: [indicatorSchema],
    recommendations: [{ type: String }],
    analysisDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick history querying and user isolation
scanSchema.index({ userId: 1, createdAt: -1 });
scanSchema.index({ userId: 1, scanType: 1, createdAt: -1 });
scanSchema.index({ userId: 1, riskLevel: 1 });

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;

