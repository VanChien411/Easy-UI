import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEnvelope } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  
  // Initialize user state with default values
  const [user, setUser] = useState({
    name: "Tien Pham",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "",
    location: "",
    workEmail: "",
    phoneNumber: "",
    website: "",
    customUrl: "",
  });

  // Update user data from auth when available
  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUser(prevUser => ({
        ...prevUser,
        name: authUser.name || authUser.userName || prevUser.name,
        avatar: authUser.avatar || prevUser.avatar,
        bio: authUser.bio || prevUser.bio,
        workEmail: authUser.email || prevUser.workEmail,
      }));
    }
  }, [isAuthenticated, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the profile data to a database
    console.log("Profile data saved:", user);
    // Redirect to profile page
    navigate("/profile");
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="profile-header-section">
          <div className="profile-header-avatar">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar-small"
            />
          </div>
          <div>
            <h1 className="edit-profile-title">
              {user.name} <span className="edit-profile-subtitle">/ Edit Profile</span>
            </h1>
            <p className="edit-profile-description">Set up your Easy UI presence and profile information</p>
          </div>
        </div>

        <div className="edit-profile-layout">
          {/* Sidebar */}
          <div className="edit-profile-sidebar">
            <div className="sidebar-sticky">
              <h2 className="sidebar-heading">General</h2>
              <nav className="sidebar-nav">
                <Link
                  to="/profile/edit"
                  className="sidebar-nav-item active"
                >
                  Edit Profile
                </Link>
                <Link to="/profile/password" className="sidebar-nav-item">
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
              </nav>

              <div className="delete-account-section">
                <Link to="/profile/delete" className="delete-account-link">
                  Delete Account
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="edit-profile-content">
            <form onSubmit={handleSubmit}>
              {/* Profile picture section */}
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <div className="profile-picture-wrapper">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="profile-picture"
                    />
                  </div>
                  <div className="profile-picture-actions">
                    <button
                      type="button"
                      className="profile-picture-button"
                    >
                      Upload new picture
                    </button>
                    <button
                      type="button"
                      className="profile-picture-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic info section */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name <span className="required-field">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <div className="form-input-with-icon">
                    <FaSearch className="form-input-icon" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={user.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      className="form-input with-icon"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label-with-counter">
                    <label htmlFor="bio" className="form-label">
                      Bio
                    </label>
                    <span className="form-counter">{user.bio.length}/1024</span>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    rows={5}
                    className="form-textarea"
                    maxLength={1024}
                  ></textarea>
                </div>
              </div>

              {/* Work history & education */}
              <div className="form-section">
                <h2 className="section-title">Work History & Education</h2>

                <div className="work-education-section">
                  <div className="work-history-item">
                    <h3 className="subsection-title">Work History</h3>
                    <button type="button" className="add-item-button">
                      + Add job
                    </button>
                  </div>

                  <div className="education-item">
                    <h3 className="subsection-title">Education</h3>
                    <button type="button" className="add-item-button">
                      + Add education
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="form-section">
                <h2 className="section-title">Contact Details</h2>

                <div className="contact-details-section">
                  <div className="form-group">
                    <div className="form-label-with-icon">
                      <FaEnvelope className="form-label-icon" />
                      <label htmlFor="workEmail" className="form-label">
                        Work Display Email
                      </label>
                    </div>
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={user.workEmail}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website" className="form-label">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={user.website}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customUrl" className="form-label">
                      Custom URL
                    </label>
                    <input
                      type="text"
                      id="customUrl"
                      name="customUrl"
                      value={user.customUrl}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-button"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
