import React, { useEffect } from "react";
import axios from "axios";

const ExpenseList = ({ expenses, setExpenses }) => {
  // Fetch expenses when the component loads
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/expenses");
        setExpenses(response.data);
      } catch (error) {
        alert("Error fetching expenses: " + error.message);
      }
    };

    fetchExpenses();
  }, [setExpenses]); // Dependency ensures it runs only on mount

  return (
    <div>
      <h2>Expense List</h2>
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
