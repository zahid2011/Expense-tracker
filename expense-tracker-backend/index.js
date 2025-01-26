const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is Running!");
});

// Create a User
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create an Expense
app.post("/expenses", async (req, res) => {
  const { description, amount, date, category, userId } = req.body;
  try {
    const newExpense = await prisma.expense.create({
      data: { description, amount, date, category, userId },
    });
    res.json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch All Expenses
app.get("/expenses", async (req, res) => {
  const expenses = await prisma.expense.findMany();
  res.json(expenses);
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
