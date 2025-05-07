import React from "react";
import { Link } from "react-router-dom";
import "./shared.css";

/**
 * Shared sidebar component for profile pages
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab
 */
const ProfileSidebar = ({ activeTab }) => {
  return (
    <div className="profile-sidebar">
      <h2 className="sidebar-heading">ACCOUNT</h2>
      <div className="sidebar-links">
        <Link 
          to="/profile/edit" 
          className={`sidebar-nav-item ${activeTab === "edit" ? "active" : ""}`}
        >
          Edit Profile
        </Link>
        <Link 
          to="/profile/password" 
          className={`sidebar-nav-item ${activeTab === "password" ? "active" : ""}`}
        >
          Password
        </Link>
        <Link 
          to="/profile/social" 
          className={`sidebar-nav-item ${activeTab === "social" ? "active" : ""}`}
        >
          Social Profiles
        </Link>
        <Link 
          to="/profile/payouts" 
          className={`sidebar-nav-item ${activeTab === "payouts" ? "active" : ""}`}
        >
          Payouts
        </Link>
        <Link 
          to="/profile/notifications" 
          className={`sidebar-nav-item ${activeTab === "notifications" ? "active" : ""}`}
        >
          Email Notifications
        </Link>
        <Link 
          to="#" 
          className={`sidebar-nav-item `}
        >
          Company
        </Link>
        <Link 
          to="#" 
          className={`sidebar-nav-item `}
        >
          Billing
        </Link>
        <Link 
          to="#" 
          className={`sidebar-nav-item `}
        >
          Sessions
        </Link>
        <Link 
          to="#" 
          className={`sidebar-nav-item `}
        >
          Applications
        </Link>
        <Link 
          to="#" 
          className={`sidebar-nav-item `}
        >
          Data Export
        </Link>
      </div>

      <div className="delete-account-section">
        <Link to="#" className="delete-account-link">
          Delete Account
        </Link>
      </div>
    </div>
  );
};

export default ProfileSidebar; 