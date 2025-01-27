import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserForm from "./components/UserForm";
import BudgetPage from "./components/BudgetPage";
import ExpensesPage from "./components/ExpensesPage";
import SettingsPage from "./components/SettingsPage";
import ProtectedLayout from "./components/ProtectedLayout";
import Sidebar from "./components/Sidebar";
import BudgetDetailsPage from "./components/BudgetDetailsPage"; // Import BudgetDetailsPage

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<UserForm />} />

        {/* Protected routes with sidebar */}
        <Route element={<ProtectedLayout />}>
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
            path="/budget/:id" // Add the route for Budget Details Page
            element={
              <div className="flex">
                <Sidebar />
                <div className="main-content">
                  <BudgetDetailsPage />
                </div>
              </div>
            }
          />
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
