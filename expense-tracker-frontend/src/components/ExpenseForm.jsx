import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const ExpenseForm = ({ setExpenses }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0], // Default to today's date
    category: "",
  });

  const fetchExpenses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_BASE_URL}/expenses/${user.id}`);
      setExpenses(response.data);
    } catch (error) {
      alert("Error fetching expenses: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_BASE_URL}/expenses`, {
        ...formData,
        amount: parseFloat(formData.amount), 
        userId: user.id, 
        date: new Date(formData.date).toISOString() 
      });
      fetchExpenses();
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: ""
      });
    } catch (error) {
      alert("Error adding expense: " + 
        (error.response?.data?.error || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
        required
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Expense
      </button>
    </form>
  );
};
export default ExpenseForm;
