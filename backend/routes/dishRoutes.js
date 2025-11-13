import express from "express";
import Dish from "../models/Dish.js";

const router = express.Router();

// GET all dishes
router.get("/", async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// POST new dish
router.post("/", async (req, res) => {
  try {
    const dish = new Dish(req.body);
    await dish.save();
    res.status(201).json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update dish
router.put("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE dish
router.delete("/:id", async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ message: "Dish removed" });
});

export default router;
