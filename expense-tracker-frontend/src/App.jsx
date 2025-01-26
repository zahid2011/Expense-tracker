import React, { useState } from "react";
import UserForm from "./components/UserForm";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const App = () => {
  const [expenses, setExpenses] = useState([]);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <UserForm />
      <ExpenseForm setExpenses={setExpenses} />
      <ExpenseList expenses={expenses} setExpenses={setExpenses} />
    </div>
  );
};

export default App;
