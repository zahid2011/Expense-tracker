import React, { useState, useEffect } from 'react'; // Add this at the top
import axios from "axios";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`http://localhost:5000/expenses/${user.id}`);
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Expense Overview</h1>
      <p className="text-gray-600 mb-8">Welcome back! Here's your spending summary</p>
      
      {/* Add Expense Form */}
      <div className="mb-8">
        <ExpenseForm setExpenses={setExpenses} />
      </div>

      {/* Expense List */}
      <div className="border-t border-gray-200 pt-8">
        <ExpenseList expenses={expenses} setExpenses={setExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;