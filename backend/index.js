import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// import routes
import dishRoutes from "./routes/dishRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import wasenderRoutes from "./routes/wasenderRoutes.js";



const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/dishes", dishRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/wasender", wasenderRoutes);

app.get("/", (req, res) => res.send("Restaurant POS API Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
