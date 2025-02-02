import React, { useState, useEffect } from "react";
import { CreditCard, Download, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import "./ExpensesPage.css";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [actionMenu, setActionMenu] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch("http://localhost:5000/expenses", {
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

  const toggleActionMenu = (id) => {
    setActionMenu(actionMenu === id ? null : id);
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for expense ID: ${id} coming soon!`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
  
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }, 
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
  
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction.");
    }
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

      {/* Expense Entries Card */}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>
                  <div className="action-menu">
                    <button
                      className="action-btn"
                      onClick={() => toggleActionMenu(expense.id)}
                    >
                      <MoreHorizontal />
                    </button>
                    {actionMenu === expense.id && (
                      <div className="dropdown">
                        <div onClick={() => handleEdit(expense.id)}>
                          <Edit size={16} /> Edit
                        </div>
                        <div
                          onClick={() => handleDelete(expense.id)}
                          style={{ color: "red" }}
                        >
                          <Trash2 size={16} /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesPage;
