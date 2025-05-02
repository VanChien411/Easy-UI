import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaEllipsisH, FaPlus } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import './Profile.css';

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Default user data in case auth data is not available
  const [userData, setUserData] = useState({
    name: "Tien Pham",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Designer & Developer",
  });

  // Update user data when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserData({
        name: user.name || user.userName || "User",
        avatar: user.avatar || "/placeholder.svg?height=100&width=100",
        bio: user.bio || "UI Component Creator",
      });
    }
  }, [isAuthenticated, user]);

  // Function to determine if a nav link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active-nav-link' : '';
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="profile-avatar"
            />
          </div>

          <h1 className="profile-name">{userData.name}</h1>
          {userData.bio && <p className="profile-bio">{userData.bio}</p>}

          <div className="profile-actions">
            <Link to="/profile/edit" className="edit-profile-button">
              Edit Profile
            </Link>
            <button className="more-options-button">
              <FaEllipsisH size={20} />
            </button>
          </div>
        </div>

        <div className="profile-navigation">
          <nav className="profile-nav">
            <Link to="/profile" className={`profile-nav-link ${isActive('/profile')}`}>
              Work
            </Link>
            <Link
              to="/profile/services"
              className={`profile-nav-link ${isActive('/profile/services')}`}
            >
              Services
              <span className="new-badge">NEW</span>
            </Link>
            <Link
              to="/profile/boosted"
              className={`profile-nav-link ${isActive('/profile/boosted')}`}
            >
              Boosted Shots
            </Link>
            <Link
              to="/profile/collections"
              className={`profile-nav-link ${isActive('/profile/collections')}`}
            >
              Collections
            </Link>
            <Link
              to="/profile/liked"
              className={`profile-nav-link ${isActive('/profile/liked')}`}
            >
              Liked Shots
            </Link>
            <Link
              to="/profile/about"
              className={`profile-nav-link ${isActive('/profile/about')}`}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="upload-container">
          <div className="upload-icon">
            <FaPlus size={32} />
          </div>
          <h2 className="upload-title">Upload your first shot</h2>
          <p className="upload-description">
            Show off your best work. Get feedback, likes and be a part of a growing community.
          </p>
          <button className="upload-button">
            Upload your first shot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;