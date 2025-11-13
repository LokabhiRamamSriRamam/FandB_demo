import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  dish_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  media: {
    type: [String], // array of image/video URLs
    default: [],
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Dish", dishSchema);
