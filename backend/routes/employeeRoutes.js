import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

router.post("/", async (req, res) => {
  try {
    let result;

    if (Array.isArray(req.body)) {
      // Bulk insert
      result = await Employee.insertMany(req.body);
    } else {
      // Single insert
      const emp = new Employee(req.body);
      result = await emp.save();
    }

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
