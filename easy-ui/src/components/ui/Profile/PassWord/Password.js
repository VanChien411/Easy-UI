import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Password.css';
import useAuth from '../../../../hooks/useAuth';

const Password = () => {
  const { user } = useAuth();
  
  // Mock user data, will be replaced with real auth data when available
  const [userData, setUserData] = useState({
    name: user?.name || "Tien Pham",
    avatar: user?.avatar || "/placeholder.svg?height=100&width=100",
  });

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
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="profile-avatar"
            />
          </div>

          <h1 className="profile-name">
            {userData.name} <span className="profile-subheading">/ Password</span>
          </h1>
          <p className="profile-bio">Update your password</p>
        </div>

        <div className="password-container">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <h2 className="sidebar-heading">ACCOUNT</h2>
            <div className="sidebar-links">
              <Link to="/profile/edit" className="sidebar-nav-item">
                Edit Profile
              </Link>
              <Link to="/profile/password" className="sidebar-nav-item active">
                Password
              </Link>
              <Link to="/profile/social" className="sidebar-nav-item">
                Social Profiles
              </Link>
              <Link to="/profile/company" className="sidebar-nav-item">
                Company
              </Link>
              <Link to="/profile/payouts" className="sidebar-nav-item">
                Payouts
              </Link>
              <Link to="/profile/notifications" className="sidebar-nav-item">
                Email Notifications
              </Link>
              <Link to="/profile/billing" className="sidebar-nav-item">
                Billing
              </Link>
              <Link to="/profile/sessions" className="sidebar-nav-item">
                Sessions
              </Link>
              <Link to="/profile/applications" className="sidebar-nav-item">
                Applications
              </Link>
              <Link to="/profile/data-export" className="sidebar-nav-item">
                Data Export
              </Link>
            </div>

            <div className="delete-account-section">
              <Link to="/profile/delete" className="delete-account-link">
                Delete Account
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="password-content">
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
                  <p className="password-hint">Password must be at least 8 characters long</p>
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
                  <button
                    type="submit"
                    className="update-password-button"
                  >
                    Update Password
                  </button>
                </div>
              </form>

              <div className="forgot-password-section">
                <h3 className="forgot-password-title">Forgot your password?</h3>
                <p className="forgot-password-text">
                  If you can't remember your current password, you can{" "}
                  <Link to="/forgot-password" className="forgot-password-link">
                    reset your password here
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password; 