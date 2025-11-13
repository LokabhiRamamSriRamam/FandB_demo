import express from "express";
import Order from "../models/Order.js";
import Dish from "../models/Dish.js";
import Table from "../models/Table.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id")
      .populate("employee_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    let total = 0;

    // Fetch dish prices if missing and calculate total
    for (let item of orderData.items) {
      const dish = await Dish.findOne({ dish_id: item.dish_id });
      if (!dish) throw new Error(`Dish ${item.dish_id} not found`);
      item.price = dish.cost;
      total += dish.cost * item.qty;
    }

    orderData.totalAmount = total;

    const order = new Order(orderData);
    await order.save();

    // If dining order → update table status
    if (order.order_type === "Dining" && order.table_no) {
      await Table.findOneAndUpdate(
        { table_no: order.table_no }, // match by table_no
        { status: "Occupied", totalOrderAmount: total }
      );
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If order is completed → mark table as Vacant
    if (order.order_status === "Completed" && order.order_type === "Dining") {
      await Table.findOneAndUpdate(
        { table_no: order.table_no },
        { status: "Vacant", totalOrderAmount: 0 }
      );
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
