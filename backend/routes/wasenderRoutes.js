import express from "express";
import axios from "axios";

const router = express.Router();

// Load your API key from .env
const WASENDER_API_KEY = process.env.WASENDER_API_KEY;
const WASENDER_URL = "https://www.wasenderapi.com/api/send-message";
console.log(
  "🟢 Loaded Wasender API Key:",
  WASENDER_API_KEY ? "✅ Loaded" : "❌ Missing"
);

const sendMessage = async (payload) => {
  const key = process.env.WASENDER_API_KEY; // read at runtime
  console.log("🔑 API key loaded:", key ? "✅ Found" : "❌ Missing");

  const response = await axios.post(WASENDER_URL, payload, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// ------------------ ROUTES ------------------ //

// 1️⃣ Send basic text message
router.post("/text", async (req, res) => {
  try {
    const { to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ error: "'to' and 'text' are required" });
    }

    const data = await sendMessage({ to, text });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 2️⃣ Send document message
router.post("/document", async (req, res) => {
  try {
    const { to, documentUrl, text, fileName } = req.body;
    if (!to || !documentUrl) {
      return res
        .status(400)
        .json({ error: "'to' and 'documentUrl' are required" });
    }

    const payload = { to, documentUrl };
    if (text) payload.text = text;
    if (fileName) payload.fileName = fileName;

    const data = await sendMessage(payload);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 3️⃣ Send image message
router.post("/image", async (req, res) => {
  try {
    const { to, imageUrl, text } = req.body;
    if (!to || !imageUrl) {
      return res
        .status(400)
        .json({ error: "'to' and 'imageUrl' are required" });
    }

    const payload = { to, imageUrl };
    if (text) payload.text = text;

    const data = await sendMessage(payload);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

export default router;
