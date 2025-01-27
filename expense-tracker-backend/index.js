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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json(user); // Send user details back to the client
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
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

// Login Endpoint
app.post("/expenses", async (req, res) => {
  const { description, amount, date, category, userId } = req.body;

  // Validate required fields
  if (!description || !amount || !date || !category || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Convert data types
  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount), // Ensure amount is a number
        date: new Date(date), // Convert to Date object
        category,
        userId: parseInt(userId) // Ensure userId is an integer
      }
    });
    res.json(newExpense);
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

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/expenses/:userId", async (req, res) => {
  const { userId } = req.params; // Get userId from route params
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: parseInt(userId) }, // Ensure userId matches the logged-in user
    });
    res.json(expenses); // Return the fetched expenses
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/budgets", async (req, res) => {
  const { name, amount, emoji, userId } = req.body;

  if (!name || !amount || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newBudget = await prisma.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        emoji: emoji || "💰", // Default emoji
        userId: parseInt(userId),
      },
    });
    res.json(newBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Budgets for a User
app.get("/budgets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
