import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BudgetDetailsPage.css";

const BudgetDetailsPage = ({ match }) => {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
  });

  const fetchBudgetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/budget/${match.params.id}`);
      setBudget(response.data);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching budget details:", error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`http://localhost:5000/budget/${budget.id}/expense`, {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: user.id,
      });
      fetchBudgetDetails(); // Refresh after adding an expense
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
      });
    } catch (error) {
      alert("Error adding expense: " + error.message);
    }
  };

  useEffect(() => {
    fetchBudgetDetails();
  }, []);

  if (!budget) return <div>Loading...</div>;

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget.amount - totalSpent;

  return (
    <div className="budget-details-container">
      <h1 className="budget-title">
        {budget.emoji} {budget.name}
      </h1>
      <div className="budget-info">
        <p>Total Budget: ${budget.amount.toFixed(2)}</p>
        <p>Total Spent: ${totalSpent.toFixed(2)}</p>
        <p>Remaining Budget: ${remainingBudget.toFixed(2)}</p>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${(totalSpent / budget.amount) * 100}%`,
              backgroundColor: totalSpent > budget.amount ? "red" : "green",
            }}
          ></div>
        </div>
      </div>

      {/* Add Expense Form */}
      <h2>Add Expense</h2>
      <form onSubmit={handleAddExpense} className="expense-form">
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Expense List */}
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount.toFixed(2)} ({expense.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetDetailsPage;
