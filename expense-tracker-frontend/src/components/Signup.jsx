import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      await axios.post("http://localhost:5000/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      alert("Registration successful!");
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
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
