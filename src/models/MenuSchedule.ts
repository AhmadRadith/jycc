import mongoose, { Schema, model, models } from "mongoose";

const MenuScheduleSchema = new Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  menuId: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
  mitraId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

MenuScheduleSchema.index({ date: 1, mitraId: 1 }, { unique: true });

export const MenuSchedule =
  models.MenuSchedule || model("MenuSchedule", MenuScheduleSchema);
