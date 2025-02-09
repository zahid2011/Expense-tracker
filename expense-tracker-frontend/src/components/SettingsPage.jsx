import React, { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import "./settingspage.css";

const SettingsPage = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [password, setPassword] = useState({ newPassword: "", confirmPassword: "" });

  const handleSaveChanges = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const response = await axiosInstance.put(`/users/${loggedInUser.id}`, {
        username: user.username, 
        email: user.email,
      });
  
      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    }
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedInUser) throw new Error("User not logged in");

        const response = await axiosInstance.get(`/users/${loggedInUser.id}`);
        setUser({ username: response.data.username, email: response.data.email });
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

  const handleUpdatePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      await axiosInstance.put(`/users/${loggedInUser.id}/password`, {
        newPassword: password.newPassword,
      });

      alert("Password updated successfully!");
      setPassword({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;
  
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      await axiosInstance.delete(`/users/${loggedInUser.id}`);
  
      alert("Account deleted successfully!");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account.");
    }
  };
  

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-description">Manage your account settings and preferences.</p>

      {/* Profile Settings */}
      <div className="card">
        <div className="card-header">
          <h2>User Profile</h2>
          <p>Update your personal information.</p>
        </div>
        <div className="card-content">
          <label className="block mb-4">
            Username:
            <input type="text" name="username" value={user.username} onChange={handleInputChange} className="input" />
          </label>
          <label className="block mb-4">
            Email Address:
            <input type="email" name="email" value={user.email} onChange={handleInputChange} className="input" />
          </label>
        </div>
        <div className="card-footer">
          <button onClick={handleSaveChanges} className="button primary">
            Save Changes
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
            <input type="password" name="newPassword" value={password.newPassword} onChange={handlePasswordChange} className="input" />
          </label>
          <label className="block mb-4">
            Confirm New Password:
            <input type="password" name="confirmPassword" value={password.confirmPassword} onChange={handlePasswordChange} className="input" />
          </label>
        </div>
        <div className="card-footer">
          <button onClick={handleUpdatePassword} className="button primary">Update Password</button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card danger">
        <div className="card-header">
          <h2>Data Management</h2>
          <p>Manage your account data and preferences.</p>
        </div>
        <div className="card-footer">
          <button onClick={handleDeleteAccount} className="button danger">
            <Trash2 className="icon" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
