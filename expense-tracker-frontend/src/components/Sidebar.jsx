import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChartBar, FaPiggyBank, FaFileInvoiceDollar, FaCog, FaDollarSign } from "react-icons/fa";
import axios from "axios"; 
import API_BASE_URL from "../config"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (user?.isGuest) {
        // If the user is a guest we delete the account and related data
        await axios.delete(`${API_BASE_URL}/logout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Guest user deleted from the database.");
      } else {
        // If it's a regular user, just log them out
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
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
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="profile-pic" />
        ) : (
          <div className="default-profile-pic">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="user-details">
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

      {user.isGuest && (
        <div className="guest-banner">
          <strong className="guest-banner-title">You&#39;re using a guest account</strong>
          <p className="guest-banner-subtitle">
            Your data won&#39;t be saved after logout. Create an account to save your expenses.
          </p>
        </div>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
