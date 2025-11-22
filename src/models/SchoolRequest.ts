import mongoose, { Schema, Document } from "mongoose";

export interface ISchoolRequest extends Document {
  schoolName: string;
  menuName: string;
  quantity: number;
  requestDate: Date;
  status: "pending" | "approved" | "rejected";
  mitraId: string; 
}

const SchoolRequestSchema = new Schema<ISchoolRequest>(
  {
    schoolName: { type: String, required: true },
    menuName: { type: String, required: true },
    quantity: { type: Number, required: true },
    requestDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    mitraId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SchoolRequest ||
  mongoose.model<ISchoolRequest>("SchoolRequest", SchoolRequestSchema);
