import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import "./Auth.css";
import API_BASE_URL from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Regular Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Error logging in: " + (error.response?.data?.error || error.message));
    }
  };

  // Guest Login
  const handleGuestLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/guest-login`);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.userId,
          username: response.data.username,
          email: `${response.data.username.toLowerCase()}@guest.com`,
          isGuest: true,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      // Debug info:
      console.error("Guest login error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      alert("Error logging in as guest: " + (error.response?.data?.error || error.message));
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
            <label className="auth-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

          <button type="submit" className="auth-button">
            Sign in
          </button>

          <button type="button" className="guest-btn" onClick={handleGuestLogin}>
            Sign in as Guest
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
