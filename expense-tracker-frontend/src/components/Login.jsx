import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Wallet } from "lucide-react";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error) {
      alert("Error logging in: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="welcome-icon">
          <Wallet size={42} color="#000000" strokeWidth={1.5} />
        </div>
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="password-helper">
            <Link to="/forgot-password" className="password-helper-link">
              Forgot your password?
            </Link>
          </div>

          <button type="submit" className="auth-button">
            Sign in
          </button>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;