import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateBudgetDialog from "./CreateBudgetDialog";
import "./budgetpage.css";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

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
  }, []); // Fetch budgets when the component is mounted

  const handleBudgetClick = (budgetId) => {
    navigate(`/budget/${budgetId}`);
  };

  return (
    <div className="budget-container">
      <h1 className="budget-header">My Budgets</h1>
      <div className="budget-grid">
        <div className="create-budget-card" onClick={() => setIsDialogOpen(true)}>
          <div className="create-budget-content">
            <span className="create-budget-icon">+</span>
            <p className="create-budget-text">Create New Budget</p>
            <p className="create-budget-subtext">Add a new budget to track your expenses</p>
          </div>
        </div>

        {budgets.map((budget) => {
          const expenses = budget.expenses || [];
          const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
          const remainingBudget = budget.amount - totalSpent;

          return (
            <div
              key={budget.id}
              className="budget-card"
              onClick={() => handleBudgetClick(budget.id)}
            >
              <div className="budget-header-content">
                <span className="budget-emoji">{budget.emoji}</span>
                <span className="budget-name">{budget.name}</span>
                <span className="budget-amount">${budget.amount.toFixed(2)}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(totalSpent / budget.amount) * 100}%`,
                    backgroundColor: "#1f1f1f",
                  }}
                ></div>
              </div>
              <div className="budget-footer">
                <p className="budget-spent">Spent: ${totalSpent.toFixed(2)}</p>
                <p className="budget-remaining">Remaining: ${remainingBudget.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
      {isDialogOpen && (
        <CreateBudgetDialog onClose={() => setIsDialogOpen(false)} fetchBudgets={fetchBudgets} />
      )}
    </div>
  );
};

export default BudgetPage;
