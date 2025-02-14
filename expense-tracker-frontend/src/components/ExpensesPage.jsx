import React, { useState, useEffect } from "react";
import { CreditCard, Download } from "lucide-react";
import "./ExpensesPage.css";
import API_BASE_URL from "../config";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  return (
    <div className="expenses-container">
      {/* Header */}
      <div className="expenses-header">
        <div className="expenses-title-container">
          <h1 className="expenses-title">All Expenses</h1>
          <p className="expenses-subtitle">View and manage your transaction history</p>
        </div>
        <button className="export-button" onClick={handleExport}>
          <Download className="icon" /> Export
        </button>
      </div>

      {/* Search Bar */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input with-icon"
        />
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Expenses</h3>
          <CreditCard className="icon" />
          <p className="summary-total">${totalExpenses.toFixed(2)}</p>
          <p>{filteredExpenses.length} transactions</p>
        </div>
      </div>

      {/* Expense Entries Table */}
      <div className="expense-history-card">
        <h2 className="card-title">Expense Entries</h2>
        <p className="card-description">A detailed list of all your expenses</p>
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesPage;
