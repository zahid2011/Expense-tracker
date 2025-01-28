import React, { useState, useEffect } from "react";
import { CreditCard, Download } from "lucide-react";
import "./ExpensesPage.css";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("http://localhost:5000/expenses");
      const data = await response.json();
      setExpenses(data);
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
        {/* Title and Subtitle */}
        <div className="expenses-title-container">
          <h1 className="expenses-title">All Expenses</h1>
          <p className="expenses-subtitle">View and manage your transaction history</p>
        </div>

        {/* Export Button */}
        <button className="export-button" onClick={handleExport}>
          <Download className="icon" /> Export
        </button>
      </div>

      {/* Search Bar */}
      <div className="filters-container">
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input with-icon"
          />
        </div>
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

      {/* Expense Table */}
      <div className="expense-history-card">
        <div className="card-header">
          <h2 className="card-title">Expense History</h2>
          <p className="card-description">A detailed list of all your expenses</p>
        </div>
        <div className="card-content">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Budget</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.budget ? expense.budget.name : "N/A"}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
