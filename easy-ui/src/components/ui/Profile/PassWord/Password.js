import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Password.css';
import useAuth from '../../../../hooks/useAuth';
import { ProfileHeader, ProfileSidebar } from '../shared';

const Password = () => {
  const { user } = useAuth();
  
  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Show/hide password toggles
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Error state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing again
    if (error) setError("");
    if (success) setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    // In a real app, this would call an API to change the password
    console.log("Password change submitted:", passwords);

    // Show success message
    setSuccess("Password changed successfully");

    // Reset form
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="password-page">
      <div className="profile-container">
        {/* Use the shared ProfileHeader component */}
        <ProfileHeader 
          section="Password"
          description="Update your password"
        />

        <div className="profile-layout">
          {/* Use the shared ProfileSidebar component */}
          <ProfileSidebar activeTab="password" />

          {/* Main Content */}
          <div className="profile-content">
            <div className="password-card">
              <h2 className="password-section-title">Change Password</h2>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handleChange}
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="password-toggle-button"
                    >
                      {showPasswords.currentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handleChange}
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="password-toggle-button"
                    >
                      {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      className="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="password-toggle-button"
                    >
                      {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="password-submit-button">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password; 