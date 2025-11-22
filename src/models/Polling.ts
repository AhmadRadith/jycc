import mongoose, { Schema, Document } from "mongoose";

export interface IPolling extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: string;
  menuChoice: string;
  suggestion?: string;
  createdAt: Date;
}

const PollingSchema = new Schema<IPolling>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schoolId: {
    type: String,
    required: true,
  },
  menuChoice: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Polling ||
  mongoose.model<IPolling>("Polling", PollingSchema);
