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

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user data" });
  }
});


app.put("/users/:id/password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: newPassword },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update password" });
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
  const { userId, budgetId, category, dateFrom, dateTo } = req.query;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: userId ? parseInt(userId) : undefined,
        budgetId: budgetId ? parseInt(budgetId) : undefined,
        category: category || undefined,
        date: {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        },
      },
      include: {
        budget: true,
      },
    });
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
      include: { expenses: true }, // Include expenses in the response
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/budget/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
      include: { expenses: true }, // Include associated expenses
    });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budget details" });
  }
});

// Add an expense to a budget
app.post("/budget/:id/expense", async (req, res) => {
  const { id } = req.params;
  const { description, amount, date, category, userId } = req.body;

  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        budgetId: parseInt(id), // Link to the budget
        userId, // Link to the user
      },
    });
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params; // Transaction ID
  try {
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

app.post("/incomes", async (req, res) => {
  const { source, category, amount, date, userId } = req.body;

  try {
    const newIncome = await prisma.income.create({
      data: { source, category, amount, date: new Date(date), userId: parseInt(userId) },
    });
    res.json(newIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/incomes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: parseInt(userId) },
    });

    const expenses = await prisma.expense.findMany({
      where: { userId: parseInt(userId) },
    });

    const budgets = await prisma.budget.findMany({
      where: { userId: parseInt(userId) },
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const usedBudget = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      budgetUtilization: {
        used: usedBudget,
        total: totalBudget,
      },
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
});

app.get("/chart-data/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const incomeData = await prisma.income.findMany({
      where: { userId: parseInt(userId) },
    });

    const expenseData = await prisma.expense.findMany({
      where: { userId: parseInt(userId) },
    });

    const labels = ["January", "February", "March", "April"]; // Replace with actual months
    const income = labels.map((label) => calculateMonthlyTotal(incomeData, label));
    const expenses = labels.map((label) => calculateMonthlyTotal(expenseData, label));

    res.json({ labels, income, expenses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});

const calculateMonthlyTotal = (data, month) => {
  // Calculate total for the given month
  return data
    .filter((item) => new Date(item.date).toLocaleString("default", { month: "long" }) === month)
    .reduce((sum, item) => sum + item.amount, 0);
};

app.get("/pie-chart-data/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: parseInt(userId) },
    });

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    res.json({ categories, amounts });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
});
// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
