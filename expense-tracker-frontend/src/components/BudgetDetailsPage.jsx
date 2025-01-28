import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SlidersHorizontal } from "lucide-react"; // Dropdown icon
import "./BudgetDetailsPage.css";

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
  });
  const [showMenu, setShowMenu] = useState(false); // Dropdown menu state

  const fetchBudgetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/budget/${id}`);
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
      fetchBudgetDetails();
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

  const handleDeleteBudget = async () => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`http://localhost:5000/budget/${id}`);
        navigate("/budgets");
      } catch (error) {
        alert("Error deleting budget: " + error.message);
      }
    }
  };

  const handleEditBudget = () => {
    navigate(`/edit-budget/${id}`);
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
          <div className="edit-delete-container">
            <SlidersHorizontal
              className="icon"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="menu-dropdown">
                <p onClick={handleEditBudget}>Edit</p>
                <p className="delete" onClick={handleDeleteBudget}>
                  Delete
                </p>
              </div>
            )}
          </div>
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
            <div key={expense.id} className="transaction-item">
              <div>
                <h3>{expense.description}</h3>
                <p>
                  {expense.category} |{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <h3 className="expense-amount">${expense.amount.toFixed(2)}</h3>
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
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default BudgetDetailsPage;
