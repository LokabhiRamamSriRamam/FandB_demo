import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  dish_id: {
    type: String,
    ref: "Dish",
    required: true,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Served", "Cancelled"],
    default: "Pending",
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    table_no: {
      type: Number,
      required: function () {
        return this.order_type === "Dining";
      },
    },
    items: [itemSchema],
    customer_id: {
      type: String,
      ref: "Customer",
      required: true,
    },
    employee_id: {
      type: String,
      ref: "Employee",
      required: true,
    },
    mop: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Other"],
    },
    order_type: {
      type: String,
      enum: ["Takeaway", "Dining"],
      default: "Dining",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    order_status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    placed_at: {
      type: Date,
      default: Date.now,
    },
    completed_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
