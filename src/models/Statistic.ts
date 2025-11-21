import mongoose from "mongoose";

const StatisticSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["pusat", "daerah", "sekolah", "mitra"],
    index: true,
  },
  identifier: {
    type: String, 
    required: true,
    index: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Statistic ||
  mongoose.model("Statistic", StatisticSchema);
