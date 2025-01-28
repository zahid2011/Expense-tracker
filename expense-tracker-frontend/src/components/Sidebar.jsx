import { Link, useNavigate } from "react-router-dom";
import { FaChartBar, FaPiggyBank, FaFileInvoiceDollar, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      {/* Sidebar Title */}
      <h1 className="sidebar-title">Expense Tracker</h1>

      {/* User Info */}
      <div className="user-info">
        {user && (
          <>
            <p className="user-name">Hello, {user.name}!</p>
            <p className="user-email">{user.email}</p>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-link">
          <FaChartBar className="nav-icon" /> Dashboard
        </Link>
        <Link to="/budget" className="nav-link">
          <FaPiggyBank className="nav-icon" /> Budgets
        </Link>
        <Link to="/expenses" className="nav-link">
          <FaFileInvoiceDollar className="nav-icon" /> Expenses
        </Link>
        <Link to="/settings" className="nav-link">
          <FaCog className="nav-icon" /> Settings
        </Link>
      </nav>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
