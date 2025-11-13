import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Add new customer
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
