import mongoose, { Schema, model, models } from "mongoose";

const ReportSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "escalated", "resolved", "open"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  category: { type: String, required: true },
  reporterId: { type: String, required: true }, 
  reporterRole: { type: String, required: true },
  schoolId: { type: String },
  schoolName: { type: String },
  district: { type: String },
  assignedMitra: [{ type: String }],
  comments: [
    {
      author: String,
      role: String,
      message: String,
      type: {
        type: String,
        enum: [
          "text",
          "image",
          "signature",
          "system",
          "escalation",
          "status_change",
          "rejection",
          "approval",
        ],
        default: "text",
      },
      attachment: String,
      time: { type: Date, default: Date.now },
    },
  ],
  studentReports: [
    {
      studentName: String,
      summary: String,
      time: Number, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
  image: { type: String }, 
  totalStudents: { type: Number }, 
  mealsDistributed: { type: Number }, 
});

export const Report = models.Report || model("Report", ReportSchema);
