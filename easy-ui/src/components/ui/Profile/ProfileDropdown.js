import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaBookmark, FaUpload, FaCog, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Default user data in case auth data is not available
  const userData = {
    name: user?.name || user?.userName || "User",
    avatar: user?.avatar || "/placeholder.svg?height=100&width=100",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-dropdown-button"
        aria-label="Open user menu"
      >
        <img
          src={userData.avatar}
          alt="User avatar"
          className="profile-dropdown-avatar"
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-user">
              <div className="profile-dropdown-avatar-container">
                <img
                  src={userData.avatar}
                  alt="User avatar"
                  className="profile-dropdown-avatar-large"
                />
              </div>
              <div className="profile-dropdown-user-info">
                <div className="profile-dropdown-name">{userData.name}</div>
                <Link to="/profile" className="profile-dropdown-view-profile" onClick={() => setIsOpen(false)}>
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="profile-dropdown-section">
            <Link to="/profile/work" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <FaUser className="profile-dropdown-icon" />
              <span>Work</span>
            </Link>
            <Link to="/profile/collections" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <FaBookmark className="profile-dropdown-icon" />
              <span>Collections</span>
            </Link>
            <Link to="/profile/liked" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <FaHeart className="profile-dropdown-icon" />
              <span>Liked Components</span>
            </Link>
            <Link to="/upload" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <FaUpload className="profile-dropdown-icon" />
              <span>Upload Component</span>
            </Link>
          </div>

          <div className="profile-dropdown-section">
            <Link to="/profile/edit" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <FaCog className="profile-dropdown-icon" />
              <span>Edit Profile</span>
            </Link>
            <button onClick={handleLogout} className="profile-dropdown-item profile-dropdown-button-link">
              <FaSignOutAlt className="profile-dropdown-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
