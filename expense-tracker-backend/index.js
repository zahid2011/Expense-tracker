const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is Running!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
    res.json({ token, userId: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`;

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, profilePicture },
    });

    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Username or email already exists" });
  }
});

const authenticate = require("./middlewares/authMiddleware");

app.get("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});



app.put("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (parseInt(id) !== req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username: username, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user data" });
  }
});



app.put("/users/:id/password", authenticate, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (parseInt(id) !== req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to update password" });
  }
});


// Login Endpoint
app.post("/expenses", async (req, res) => {
  const { description, amount, date, category, userId } = req.body;

  if (!description || !amount || !date || !category || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount), 
        date: new Date(date), 
        category,
        userId: parseInt(userId) 
      }
    });
    res.json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/expenses", authenticate, async (req, res) => {
  const { budgetId, category, dateFrom, dateTo } = req.query;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
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



app.get("/expenses/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (parseInt(userId) !== req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/budgets", authenticate, async (req, res) => {
  const { name, amount, emoji } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ error: "Name and amount are required" });
  }

  try {
    const newBudget = await prisma.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        emoji: emoji || "💰", 
        userId: req.userId, 
      },
    });

    res.json(newBudget);
  } catch (error) {
    res.status(500).json({ error: "Failed to create budget" });
  }
});


// Get Budgets for a User
app.get("/budgets", authenticate, async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId },
      include: { expenses: true }, 
    });

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});



app.get("/budget/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
      include: { expenses: true },
    });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    if (budget.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budget details" });
  }
});


app.post("/budget/:id/expense", authenticate, async (req, res) => {
  const { id } = req.params;
  const { description, amount, date, category } = req.body;

  try {
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
    });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    if (budget.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        budgetId: parseInt(id),
        userId: req.userId,
      },
    });

    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.delete("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    await prisma.expense.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.income.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.budget.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Account and all related data deleted successfully!" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({ error: "Failed to delete account." });
  }
});


app.put("/budget/:id/edit", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, amount, emoji } = req.body;

  try {
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
    });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    if (budget.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: parseInt(id) },
      data: {
        name: name || budget.name,
        amount: amount ? parseFloat(amount) : budget.amount,
        emoji: emoji || budget.emoji,
      },
    });

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ error: "Failed to update budget" });
  }
});


app.delete("/transactions/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    if (expense.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});


app.post("/incomes", authenticate, async (req, res) => {
  const { source, category, amount, date } = req.body;

  try {
    const newIncome = await prisma.income.create({
      data: { 
        source, 
        category, 
        amount: parseFloat(amount), 
        date: new Date(date), 
        userId: req.userId 
      },
    });

    res.json(newIncome);
  } catch (error) {
    res.status(400).json({ error: "Failed to add income" });
  }
});


app.get("/incomes", authenticate, async (req, res) => {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.userId }, 
    });

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incomes" });
  }
});

app.put("/incomes/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { source, category, amount, date } = req.body;

  try {
    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    if (income.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: parseInt(id) },
      data: { source, category, amount: parseFloat(amount), date: new Date(date) },
    });

    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ error: "Failed to update income" });
  }
});

app.delete("/incomes/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    if (income.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await prisma.income.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete income" });
  }
});


app.get("/summary", authenticate, async (req, res) => {
  try {
    const userId = req.userId; 
    const totalIncome = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalExpenses = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const budgets = await prisma.budget.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const usedBudget = totalExpenses._sum.amount || 0;
    const totalBudget = budgets._sum.amount || 0;
    const balance = (totalIncome._sum.amount || 0) - usedBudget;

    res.json({
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: usedBudget,
      balance,
      budgetUtilization: { used: usedBudget, total: totalBudget },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
});


app.get("/chart-data", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const incomeData = await prisma.income.groupBy({
      by: ["date"],
      where: { userId },
      _sum: { amount: true },
      orderBy: { date: "asc" }
    });
    const expenseData = await prisma.expense.groupBy({
      by: ["date"],
      where: { userId },
      _sum: { amount: true },
      orderBy: { date: "asc" }
    });

    const labels = [...new Set([...incomeData, ...expenseData].map(entry =>
      new Date(entry.date).toISOString().slice(0, 7) // Format: YYYY-MM
    ))];

    labels.sort();

    const income = labels.map(month =>
      incomeData
        .filter(entry => new Date(entry.date).toISOString().slice(0, 7) === month)
        .reduce((sum, entry) => sum + entry._sum.amount, 0)
    );

    const expenses = labels.map(month =>
      expenseData
        .filter(entry => new Date(entry.date).toISOString().slice(0, 7) === month)
        .reduce((sum, entry) => sum + entry._sum.amount, 0)
    );
    const formattedLabels = labels.map(label => {
      const [year, month] = label.split("-");
      return new Date(year, month - 1).toLocaleString("default", { month: "short", year: "numeric" });
    });

    res.json({ labels: formattedLabels, income, expenses });

  } catch (error) {
    console.error("Chart Data Error:", error);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});

const calculateMonthlyTotal = (data, month) => {

  return data
    .filter((item) => new Date(item.date).toLocaleString("default", { month: "long" }) === month)
    .reduce((sum, item) => sum + item.amount, 0);
};

app.get("/pie-chart-data", authenticate, async (req, res) => {
  try {
    const userId = req.userId; 

    const categoryTotals = await prisma.expense.groupBy({
      by: ["category"],
      where: { userId },
      _sum: { amount: true },
    });

    const categories = categoryTotals.map((item) => item.category);
    const amounts = categoryTotals.map((item) => item._sum.amount);

    res.json({ categories, amounts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
});

// Start the server
// app.listen(5000, () => {
//   console.log("Server is running on http://localhost:5000");
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});