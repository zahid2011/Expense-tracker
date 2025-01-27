import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import CreateBudgetDialog from "./CreateBudgetDialog";
import "./budgetpage.css";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const fetchBudgets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`http://localhost:5000/budgets/${user.id}`);
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleBudgetClick = (budgetId) => {
    navigate(`/budget/${budgetId}`); // Navigate to the Budget Details Page
  };

  return (
    <div className="budget-container">
      <h1 className="budget-header">My Budgets</h1>
      <div className="budget-grid">
        {/* Create New Budget Card */}
        <div className="create-budget-button" onClick={() => setIsDialogOpen(true)}>
          + Create New Budget
        </div>
        {/* Budget Cards */}
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="budget-card"
            onClick={() => handleBudgetClick(budget.id)} // Handle click on budget card
          >
            <div className="budget-emoji">{budget.emoji}</div>
            <div className="budget-name">{budget.name}</div>
            <div className="budget-amount">${budget.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
      {isDialogOpen && (
        <CreateBudgetDialog onClose={() => setIsDialogOpen(false)} fetchBudgets={fetchBudgets} />
      )}
    </div>
  );
};

export default BudgetPage;
