import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div>
        <h2>Expense Tracker</h2>
        {user && <p>Hello, {user.name}!</p>}
        <nav>
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/budget">💰 Budgets</Link>
          <Link to="/expenses">🧾 Expenses</Link>
          <Link to="/settings">⚙️ Settings</Link>
        </nav>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
