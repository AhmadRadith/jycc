import mongoose, { Schema, model, models } from "mongoose";
//Skema user
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    required: true,
    enum: ["pusat", "daerah", "sekolah", "murid", "mitra"],
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  schoolId: { type: String }, 
  district: { type: String }, 
  class: { type: String }, 
  gender: { type: String, enum: ["L", "P"] }, 
  status: { type: String, default: "Hadir" },  
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);
