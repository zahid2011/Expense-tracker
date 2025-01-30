import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import BudgetPage from "./components/BudgetPage";
import ExpensesPage from "./components/ExpensesPage";
import SettingsPage from "./components/SettingsPage";
import IncomePage from "./components/IncomePage"; // Import the IncomePage component
import ProtectedLayout from "./components/ProtectedLayout";
import Sidebar from "./components/Sidebar";
import BudgetDetailsPage from "./components/BudgetDetailsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <Dashboard />
                </div>
              </div>
            }
          />
          {/* Budgets */}
          <Route
            path="/budget"
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <BudgetPage />
                </div>
              </div>
            }
          />
          <Route
            path="/budget/:id"
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <BudgetDetailsPage />
                </div>
              </div>
            }
          />
          {/* Expenses */}
          <Route
            path="/expenses"
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <ExpensesPage />
                </div>
              </div>
            }
          />
          {/* Income */}
          <Route
            path="/income" // Add the route for IncomePage
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <IncomePage />
                </div>
              </div>
            }
          />
          {/* Settings */}
          <Route
            path="/settings"
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <SettingsPage />
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
