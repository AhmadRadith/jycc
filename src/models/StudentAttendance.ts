import mongoose, { Schema, Document } from "mongoose";

export interface IStudentAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: string; 
  date: Date;
  timestamp: Date;
  status: "received" | "skipped";
}

const StudentAttendanceSchema = new Schema<IStudentAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: String, required: true },
    date: { type: Date, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["received", "skipped"],
      default: "received",
    },
  },
  { timestamps: true }
);

StudentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.models.StudentAttendance ||
  mongoose.model<IStudentAttendance>(
    "StudentAttendance",
    StudentAttendanceSchema
  );
