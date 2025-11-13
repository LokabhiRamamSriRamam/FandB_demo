import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: true,
  },
  joining_date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
