import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Save, Trash2 } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config"; 
import "./settingspage.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", isGuest: false });
  const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User not logged in");

        const loggedInUser = JSON.parse(storedUser);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/users/${loggedInUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If user is a guest, show a "guest" style email like "Guest_XXXX@guest.com"
        setUser({
          username: response.data.username,
          email: response.data.isGuest
            ? `${response.data.username.toLowerCase()}@guest.com`
            : response.data.email,
          isGuest: response.data.isGuest,
        });

        setIsGuest(response.data.isGuest);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    // Prevent updates if user is guest
    if (isGuest) return;

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE_URL}/users/${loggedInUser.id}`,
        { username: user.username, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    // Prevent updates if user is guest
    if (isGuest) return;

    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/users/${loggedInUser.id}/password`,
        { newPassword: password.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated successfully!");
      setPassword({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    // Prevent deletion if user is guest
    if (isGuest) return;

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE_URL}/users/${loggedInUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account deleted successfully!");

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-description">Manage your account settings and preferences.</p>

      {/* Guest Warning */}
      {isGuest && (
        <div className="guest-warning">
          You are logged in as a guest and cannot make changes.
        </div>
      )}

      {/* Profile Settings */}
      <div className="card">
        <div className="card-header">
          <h2>User Profile</h2>
          <p>Update your personal information.</p>
        </div>
        <div className="card-content">
          <label className="block mb-4">
            Username:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="input"
              disabled={isGuest}
            />
          </label>
          <label className="block mb-4">
            Email Address:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="input"
              disabled={isGuest}
            />
          </label>
        </div>
        <div className="card-footer">
          <button
            onClick={handleSaveChanges}
            className={`button primary ${isGuest ? "disabled" : ""}`}
            disabled={isGuest}
          >
            <Save className="icon" /> Save Changes
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="card-header">
          <h2>Security Settings</h2>
          <p>Update your password.</p>
        </div>
        <div className="card-content">
          <label className="block mb-4">
            New Password:
            <input
              type="password"
              name="newPassword"
              value={password.newPassword}
              onChange={handlePasswordChange}
              className="input"
              disabled={isGuest}
            />
          </label>
          <label className="block mb-4">
            Confirm New Password:
            <input
              type="password"
              name="confirmPassword"
              value={password.confirmPassword}
              onChange={handlePasswordChange}
              className="input"
              disabled={isGuest}
            />
          </label>
        </div>
        <div className="card-footer">
          <button
            onClick={handleUpdatePassword}
            className={`button primary ${isGuest ? "disabled" : ""}`}
            disabled={isGuest}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card danger">
        <div className="card-header">
          <h2>Data Management</h2>
          <p>Manage your account data and preferences.</p>
        </div>
        <div className="card-footer">
          <button
            onClick={handleDeleteAccount}
            className={`button danger ${isGuest ? "disabled" : ""}`}
            disabled={isGuest}
          >
            <Trash2 className="icon" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
