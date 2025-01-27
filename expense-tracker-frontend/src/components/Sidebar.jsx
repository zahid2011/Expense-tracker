import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar p-6 min-h-screen bg-gray-800 text-white flex flex-col justify-between w-64">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Expense Tracker</h2>
        {user && <p className="text-gray-400 mb-8">Hi, {user.name}!</p>}

        {/* Navigation Links */}
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="block py-3 px-4 hover:bg-gray-700 rounded transition text-lg"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/budget"
            className="block py-3 px-4 hover:bg-gray-700 rounded transition text-lg"
          >
            💰 Budget
          </Link>
          <Link
            to="/expenses"
            className="block py-3 px-4 hover:bg-gray-700 rounded transition text-lg"
          >
            🧾 Expenses
          </Link>
          <Link
            to="/settings"
            className="block py-3 px-4 hover:bg-gray-700 rounded transition text-lg"
          >
            ⚙️ Settings
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded transition text-lg font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
