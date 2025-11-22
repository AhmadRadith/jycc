import mongoose, { Schema, Document } from "mongoose";

export interface IFoodItem extends Document {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mitraId: string;
  createdAt: Date;
}

const FoodItemSchema = new Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    mitraId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FoodItem ||
  mongoose.model<IFoodItem>("FoodItem", FoodItemSchema);
