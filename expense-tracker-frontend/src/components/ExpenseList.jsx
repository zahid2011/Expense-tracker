import React, { useEffect } from "react";
import axios from "axios";

const ExpenseList = ({ expenses, setExpenses }) => {
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Get the logged-in user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        // Include the user ID in the API call
        const response = await axios.get(`http://localhost:5000/expenses/${user.id}`);
        setExpenses(response.data);
      } catch (error) {
        alert("Error fetching expenses: " + error.message);
      }
    };
    fetchExpenses();
  }, [setExpenses]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount} ({expense.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
