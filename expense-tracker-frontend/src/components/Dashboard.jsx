import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `http://localhost:5000/expenses/${user.id}`
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Expense Overview</h1>
      <p className="dashboard-subtext">
        Welcome back! Here's your spending summary.
      </p>

      {/* Add Expense Form */}
      <div className="expense-form-container">
        <ExpenseForm setExpenses={setExpenses} />
      </div>

      {/* Expense List */}
      <div className="expense-list-container">
        <ExpenseList expenses={expenses} setExpenses={setExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;
