import React, { useState } from "react";
import axios from "axios";

const ExpenseForm = ({ setExpenses }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    userId: 1, // Replace with actual userId
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/expenses", {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      });
      alert("Expense created: " + response.data.description);

      // Fetch updated list of expenses after adding the new one
      const updatedExpenses = await axios.get("http://localhost:5000/expenses");
      setExpenses(updatedExpenses.data); // Update the state with the new list
    } catch (error) {
      alert("Error creating expense: " + error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
      />
      <input
        type="date"
        placeholder="Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
