import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    table_no: {
      type: Number,
      required: true,
      unique: true,
    },
  room: {
    type: String,
    enum: ["AC", "Non-AC"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Vacant", "Occupied", "Pending Order", "Needs Cleaning"],
    default: "Vacant",
  },
  totalOrderAmount: {
    type: Number,
    default: 0,
  },
  eta: {
    type: Date, // estimated time to free table
  },
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);
