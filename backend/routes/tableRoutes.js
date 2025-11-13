import express from "express";
import Table from "../models/Table.js";

const router = express.Router();

// Get all tables
router.get("/", async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
});

// Create one or multiple tables
router.post("/", async (req, res) => {
  try {
    let result;

    if (Array.isArray(req.body)) {
      // If it's an array, insert many documents
      result = await Table.insertMany(req.body);
    } else {
      // If it's a single table
      const table = new Table(req.body);
      result = await table.save();
    }

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Update a table
router.put("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
