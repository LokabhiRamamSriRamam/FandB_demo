// dropIndex.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Order from "./models/Order.js";

const dropIndex = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();

    console.log("🔍 Checking existing indexes...");
    const indexes = await Order.collection.indexes();
    console.log("📌 Current Indexes:", indexes);

    // Correct index name -> invoice.number_1
    console.log("🗑️ Dropping index: invoice.number_1 ...");
    await Order.collection.dropIndex("invoice.number_1");

    console.log("✅ Index successfully dropped!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

dropIndex();
