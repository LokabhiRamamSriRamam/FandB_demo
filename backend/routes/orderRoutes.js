import express from "express";
import Order from "../models/Order.js";
import Dish from "../models/Dish.js";
import Table from "../models/Table.js";
import { sendWhatsAppMessage } from "../services/whatsappServices.js";
import MessageConfig from "../models/messagesConfig.js";
import Customer from "../models/Customer.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    // Attach customer info only
    for (let order of orders) {
      if (order.customer_id) {
        order._doc.customer = await Customer.findOne({
          customer_id: order.customer_id,
        });
      }
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    // create order
    const order = new Order(orderData);
    await order.save();

    // check config
    const config = await MessageConfig.findOne();
    if (config?.events?.orderPlaced?.enabled) {
      const customer = await Customer.findOne({
        customer_id: order.customer_id,
      });
      const msg = config.events.orderPlaced.template
        .replace("{{customer_name}}", customer.name)
        .replace("{{order_id}}", order.order_id);

      await sendWhatsAppMessage({ to: customer.phone, text: msg });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// // POST new order
// router.post("/", async (req, res) => {
//   try {
//     const orderData = req.body;
//     let total = 0;

//     // Fetch dish prices if missing and calculate total
//     for (let item of orderData.items) {
//       const dish = await Dish.findOne({ dish_id: item.dish_id });
//       if (!dish) throw new Error(`Dish ${item.dish_id} not found`);
//       item.price = dish.cost;
//       total += dish.cost * item.qty;
//     }

//     orderData.totalAmount = total;

//     const order = new Order(orderData);
//     await order.save();

//     // If dining order → update table status
//     if (order.order_type === "Dining" && order.table_no) {
//       await Table.findOneAndUpdate(
//         { table_no: order.table_no }, // match by table_no
//         { status: "Occupied", totalOrderAmount: total }
//       );
//     }

//     res.status(201).json(order);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// PUT update order
router.put("/:order_id", async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      req.body,
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

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

// Route: Update order status
router.put("/:order_id/status", async (req, res) => {
  try {
    const { order_status } = req.body;
    if (!order_status)
      return res.status(400).json({ error: "'order_status' is required" });

    const validStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled",
      "Placed",
    ];
    if (!validStatuses.includes(order_status))
      return res.status(400).json({ error: "Invalid order_status value" });

    const order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { order_status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    // If dining order and becoming Completed, mark table Vacant
    if (order.order_type === "Dining" && order_status === "Completed") {
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

// Route: Update payment status
router.put("/:order_id/payment", async (req, res) => {
  try {
    const { payment_status } = req.body;

    if (!payment_status)
      return res.status(400).json({ error: "'payment_status' is required" });

    const validPayments = ["Pending", "Paid", "Failed", "Refunded"];
    if (!validPayments.includes(payment_status))
      return res.status(400).json({ error: "Invalid payment_status value" });

    const order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { payment_status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    // ===============================
    // 📌 If payment completed
    // ===============================
    if (payment_status === "Paid") {
      order.order_status = "Completed";
      await order.save();

      if (order.order_type === "Dining") {
        await Table.findOneAndUpdate(
          { table_no: order.table_no },
          { status: "Vacant", totalOrderAmount: 0 }
        );
      }

      // ===============================
      // 📩 WhatsApp: Payment Received Message
      // ===============================
      const config = await MessageConfig.findOne();

      const eventCfg = config?.events?.paymentReceived;
      if (eventCfg?.enabled) {
        const customer = await Customer.findOne({
          customer_id: order.customer_id,
        });

        if (customer) {
          // Prepare message text
          const msg = eventCfg.template
            .replace("{{customer_name}}", customer.name)
            .replace("{{order_id}}", order.order_id);

          // Prepare payload for WhatsApp
          const messagePayload = {
            to: customer.phone,
            text: msg,
          };

          // Media Support:
          if (eventCfg.imageUrl) {
            messagePayload.imageUrl = eventCfg.imageUrl;
          }

          // Document message allowed only in paymentReceived
          if (eventCfg.documentUrl) {
            messagePayload.documentUrl = eventCfg.documentUrl;
            messagePayload.fileName = eventCfg.fileName || "invoice.pdf";
          }

          await sendWhatsAppMessage(messagePayload);
        }
      }
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE order
router.delete("/:order_id", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      order_id: req.params.order_id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
