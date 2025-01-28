import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IncomePage.css";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [formData, setFormData] = useState({
    source: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [filter, setFilter] = useState("");
  const [actionMenu, setActionMenu] = useState(null);

  const fetchIncomes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`http://localhost:5000/incomes/${user.id}`);
      setIncomes(response.data);

      const total = response.data.reduce((sum, income) => sum + income.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (isEditing) {
        await axios.put(`http://localhost:5000/incomes/${editingIncome.id}`, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
        setIsEditing(false);
        setEditingIncome(null);
      } else {
        await axios.post("http://localhost:5000/incomes", {
          ...formData,
          amount: parseFloat(formData.amount),
          userId: user.id,
        });
      }
      fetchIncomes();
      setFormData({ source: "", category: "", amount: "", date: new Date().toISOString().split("T")[0] });
    } catch (error) {
      console.error("Error adding/updating income:", error);
    }
  };

  const handleEditIncome = (income) => {
    setIsEditing(true);
    setEditingIncome(income);
    setFormData({
      source: income.source,
      category: income.category,
      amount: income.amount.toString(),
      date: new Date(income.date).toISOString().split("T")[0],
    });
    document.getElementById("add-income-form").scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axios.delete(`http://localhost:5000/incomes/${id}`);
        fetchIncomes();
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const filteredIncomes = filter
    ? incomes.filter((income) => income.category === filter)
    : incomes;

  useEffect(() => {
    fetchIncomes();
  }, []);

  const toggleActionMenu = (id) => {
    setActionMenu((prev) => (prev === id ? null : id));
  };

  return (
    <div className="income-page">
      {/* Title and Add Income Button */}
      <div className="header">
        <h1>Income Management</h1>
        <button className="add-income-btn" onClick={() => document.getElementById("add-income-form").scrollIntoView({ behavior: "smooth" })}>
          <Plus size={16} /> Add Income
        </button>
      </div>

      {/* Income Overview */}
      <div className="income-overview">
        <div className="card">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="filter">Filter by Category:</label>
        <select id="filter" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          {Array.from(new Set(incomes.map((income) => income.category))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Income Entries */}
      <div id="income-entries" className="income-entries card">
        <h2>Income Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncomes.map((income) => (
              <tr key={income.id}>
                <td>{new Date(income.date).toLocaleDateString()}</td>
                <td>{income.source}</td>
                <td>{income.category}</td>
                <td>${income.amount.toFixed(2)}</td>
                <td>
                  <div className="action-menu">
                    <MoreHorizontal onClick={() => toggleActionMenu(income.id)} />
                    {actionMenu === income.id && (
                      <div className="dropdown">
                        <div onClick={() => handleEditIncome(income)}>
                          <Edit size={16} /> Edit
                        </div>
                        <div onClick={() => handleDeleteIncome(income.id)}>
                          <Trash2 size={16} style={{ color: "red" }} /> Delete
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

      {/* Add Income Form */}
      <div id="add-income-form" className="add-income-card">
        <h2>{isEditing ? "Edit Income" : "Add Income"}</h2>
        <form onSubmit={handleAddIncome}>
          <input
            type="text"
            placeholder="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          <button type="submit">{isEditing ? "Update Income" : "Add Income"}</button>
        </form>
      </div>
    </div>
  );
};

export default IncomePage;
