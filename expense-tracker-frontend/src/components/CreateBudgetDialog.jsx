import React, { useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "./createbudgetdialog.css";

const CreateBudgetDialog = ({ onClose, fetchBudgets }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    emoji: "💰",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post("http://localhost:5000/budgets", {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: user.id,
      });
      fetchBudgets();
      onClose();
    } catch (error) {
      alert("Error creating budget: " + error.message);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Create New Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Emoji</label>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                fontSize: "24px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
              }}
            >
              {formData.emoji}
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setFormData({ ...formData, emoji: emoji.emoji });
                  setShowEmojiPicker(false);
                }}
              />
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Budget Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Budget Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="dialog-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetDialog;
