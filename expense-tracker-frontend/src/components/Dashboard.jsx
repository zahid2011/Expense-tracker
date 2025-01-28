import React from "react";
import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Expense Dashboard</h1>
      <p className="dashboard-subtext">Visualize your spending trends at a glance.</p>

      {/* Graph Placeholder */}
      <div className="graph-container">
        <div className="graph-placeholder">
          <p>Graph 1: Monthly Expenses</p>
        </div>
        <div className="graph-placeholder">
          <p>Graph 2: Category Breakdown</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
