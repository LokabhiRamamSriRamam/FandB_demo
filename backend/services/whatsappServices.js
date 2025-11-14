import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const WASENDER_URL = "https://www.wasenderapi.com/api/send-message";
const API_KEY = process.env.WASENDER_API_KEY;

export const sendWhatsAppMessage = async ({ to, text, imageUrl, documentUrl, fileName }) => {
  try {
    console.log("📩 Sending WhatsApp message...");

    const payload = { to };

    if (text) payload.text = text;
    if (imageUrl) payload.imageUrl = imageUrl;
    if (documentUrl) {
      payload.documentUrl = documentUrl;
      if (fileName) payload.fileName = fileName;
    }

    const res = await axios.post(WASENDER_URL, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ WhatsApp message sent:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ WhatsApp message failed:", err.response?.data || err.message);
    throw err;
  }
};
