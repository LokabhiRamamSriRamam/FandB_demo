import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
