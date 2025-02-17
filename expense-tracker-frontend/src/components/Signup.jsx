import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import API_BASE_URL from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username: formData.username,
        email: formData.email || null,
        password: formData.password,
      });

      alert("Registration successful!");
      
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({
        username: response.data.username,
        email: response.data.email || "", 
        profilePicture: response.data.profilePicture, 
      }));

    
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });

      navigate("/");
      
    } catch (error) {
      alert("Error registering: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Enter your details to create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email (optional)</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Create account
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
