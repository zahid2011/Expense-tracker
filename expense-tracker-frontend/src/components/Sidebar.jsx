import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaPiggyBank, FaFileInvoiceDollar, FaCog, FaDollarSign } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

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
        <Link
          to="/dashboard"
          className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          <FaChartBar className="nav-icon" /> Dashboard
        </Link>
        <Link
          to="/budget"
          className={`nav-link ${isActive("/budget") ? "active" : ""}`}
        >
          <FaPiggyBank className="nav-icon" /> Budgets
        </Link>
        <Link
          to="/income"
          className={`nav-link ${isActive("/income") ? "active" : ""}`}
        >
          <FaDollarSign className="nav-icon" /> Income
        </Link>
        <Link
          to="/expenses"
          className={`nav-link ${isActive("/expenses") ? "active" : ""}`}
        >
          <FaFileInvoiceDollar className="nav-icon" /> Expenses
        </Link>
        <Link
          to="/settings"
          className={`nav-link ${isActive("/settings") ? "active" : ""}`}
        >
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
