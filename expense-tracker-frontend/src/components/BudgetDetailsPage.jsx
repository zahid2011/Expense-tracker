import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SlidersHorizontal, Trash } from "lucide-react";
import "./BudgetDetailsPage.css";
import API_BASE_URL from "../config";

const BudgetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    customCategory: "",
  });
  const [showMenu, setShowMenu] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);


  const categories = [
    "Groceries",
    "Rent",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Dining Out",
    "Healthcare",
    "Education",
    "Savings",
    "Other",
  ];

  const fetchBudgetDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token
      const response = await axios.get(`${API_BASE_URL}/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
      });
  
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
      const category =
        formData.category === "Other" ? formData.customCategory : formData.category;

      await axios.post(`${API_BASE_URL}/budget/${budget.id}/expense`, {
        ...formData,
        category,
        amount: parseFloat(formData.amount),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Send token
      });

      fetchBudgetDetails();
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        customCategory: "",
      });
    } catch (error) {
      alert("Error adding expense: " + error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!isConfirmed) return;
  
    console.log("Deleting expense with ID:", expenseId);
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/transactions/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Delete response:", response.data);
  
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Error deleting expense: " + (error.response?.data?.error || error.message));
    }
  };
  
  
  const confirmDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/transactions/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Error deleting expense: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteBudget = () => {
    setShowDeleteBudgetModal(true); 
  };
  const confirmDeleteBudget = async () => {
    try {
      await axios.delete(`http://localhost:5000/budget/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      setShowDeleteBudgetModal(false); 
      navigate("/budgets"); 
    } catch (error) {
      alert("Error deleting budget: " + error.message);
    }
  };

  useEffect(() => {
    fetchBudgetDetails();
  }, []);

  if (!budget) return <div>Loading...</div>;

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget.amount - totalSpent;
  const percentageUsed = ((totalSpent / budget.amount) * 100).toFixed(1);

  return (
    <div className="budget-details-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>

      {/* Budget Header */}
      <div className="budget-header">
        <h1>
          {budget.emoji} {budget.name} Budget
        </h1>
        <div className="header-buttons">
          <button
            className="add-transaction-btn"
            onClick={() =>
              document.getElementById("add-transaction-form").scrollIntoView()
            }
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Budget Stats */}
      <div className="budget-stats">
        <div className="stat-card">
          <p>Total Budget</p>
          <h3>${budget.amount.toFixed(2)}</h3>
        </div>
        <div className="stat-card spent">
          <p>Spent</p>
          <h3>${totalSpent.toFixed(2)}</h3>
        </div>
        <div className="stat-card remaining">
          <p>Remaining</p>
          <h3>${remainingBudget.toFixed(2)}</h3>
        </div>
      </div>

      {/* Total Progress */}
      <div className="progress-card">
        <h2>Total Budget Progress</h2>
        <div className="progress-header">
          <p>
            ${totalSpent.toFixed(2)} spent of ${budget.amount.toFixed(2)} budget
          </p>
          <p className="percentage-used">{percentageUsed}% used</p>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${percentageUsed}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Recent Transactions */}
        <div className="transactions-card">
        <h2>Recent Transactions</h2>
        {expenses
            .slice(0)
            .reverse()
            .map((expense) => (
            <div key={expense.id} className="transaction-card">
                <div className="transaction-details">
                <h3>{expense.description}</h3>
                <p>{expense.category}</p>
                <p className="transaction-date">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </p>
                </div>

                <div className="transaction-actions">
                <h3 className="expense-amount">${expense.amount.toFixed(2)}</h3>
                <Trash
                    className="delete-icon"
                    onClick={() => handleDeleteExpense(expense.id)}
                />
                </div>
            </div>
            ))}
        </div>
            
      {/* Add Transaction Form */}
      <div id="add-transaction-form" className="add-transaction-card">
        <h2>Add Transaction</h2>
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formData.category === "Other" && (
            <input
              type="text"
              placeholder="Enter custom category"
              value={formData.customCategory}
              onChange={(e) =>
                setFormData({ ...formData, customCategory: e.target.value })
              }
              required
            />
          )}
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default BudgetDetailsPage;
