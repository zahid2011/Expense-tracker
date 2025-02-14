import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChartBar, FaPiggyBank, FaFileInvoiceDollar, FaCog, FaDollarSign } from "react-icons/fa";
import axios from "axios"; 
import API_BASE_URL from "../config"; // Import API base URL

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout API (if your backend supports it)
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error logging out, please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;
  
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || {});
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Expense Tracker</h1>

      <div className="user-info">
        {/* Profile Picture */}
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="profile-pic" />
        ) : (
          <div className="default-profile-pic">{user.username?.charAt(0).toUpperCase()}</div>
        )}

        <div>
          <p className="user-name">
            <strong>Hello, {user.username || "User"}!</strong>
          </p>
          {user.email && <p className="user-email">{user.email}</p>}
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
          <FaChartBar className="nav-icon" /> Dashboard
        </Link>
        <Link to="/budget" className={`nav-link ${isActive("/budget") ? "active" : ""}`}>
          <FaPiggyBank className="nav-icon" /> Budgets
        </Link>
        <Link to="/income" className={`nav-link ${isActive("/income") ? "active" : ""}`}>
          <FaDollarSign className="nav-icon" /> Income
        </Link>
        <Link to="/expenses" className={`nav-link ${isActive("/expenses") ? "active" : ""}`}>
          <FaFileInvoiceDollar className="nav-icon" /> Expenses
        </Link>
        <Link to="/settings" className={`nav-link ${isActive("/settings") ? "active" : ""}`}>
          <FaCog className="nav-icon" /> Settings
        </Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
