import express from "express";
import MessageConfig from "../models/messagesConfig.js";

const router = express.Router();

// Get current config
router.get("/", async (req, res) => {
  const config = await MessageConfig.findOne();
  res.json(config || {});
});

// Create or update config (POST)
router.post("/", async (req, res) => {
  try {
    const existing = await MessageConfig.findOne();
    const config = existing
      ? await MessageConfig.findByIdAndUpdate(existing._id, req.body, { new: true })
      : await MessageConfig.create(req.body);

    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update config (PUT) — for partial updates
router.put("/:id", async (req, res) => {
  try {
    const config = await MessageConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!config) {
      return res.status(404).json({ error: "Config not found" });
    }
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
