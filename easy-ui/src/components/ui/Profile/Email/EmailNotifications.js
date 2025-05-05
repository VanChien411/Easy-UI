import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaBell, FaCommentAlt, FaHeart, FaBriefcase, FaUsers } from 'react-icons/fa';
import './EmailNotifications.css';
import useAuth from '../../../../hooks/useAuth';
import userManagerService from '../../../../services/usermanagerService';
import { toast } from 'react-toastify';

const EmailNotifications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Mock user data, will be replaced with real auth data when available
  const [userData, setUserData] = useState({
    name: user?.name || "Tien Pham",
    avatar: user?.avatar || "/placeholder.svg?height=100&width=100",
    email: user?.email || "tien.pham@example.com",
    emailVerified: false,
  });

  // Notification preferences
  const [preferences, setPreferences] = useState({
    comments: true,
    likes: true,
    followers: true,
    messages: true,
    jobOpportunities: true,
    teamInvites: false,
    weeklyDigest: true,
    productUpdates: true,
  });

  // Check email verification status when component mounts
  useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        setLoading(true);
        const response = await userManagerService.getEmailStatus();
        console.log('Email status response:', response);
        setUserData(prevData => ({
          ...prevData,
          emailVerified: response.isEmailConfirmed || response.isMailConfirmed || false,
          email: response.email || prevData.email
        }));
      } catch (error) {
        console.error("Failed to check email status:", error);
        toast.error("Failed to check email verification status");
      } finally {
        setLoading(false);
      }
    };

    checkEmailStatus();
  }, []);

  const handleToggle = (preference) => {
    setPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      await userManagerService.sendConfirmationEmail();
      toast.success(`Verification email sent to ${userData.email}`);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    console.log("Saving preferences:", preferences);
    toast.success("Your notification preferences have been saved.");
  };

  return (
    <div className="email-notifications-page">
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
            {userData.name} <span className="profile-subheading">/ Email Notifications</span>
          </h1>
          <p className="profile-bio">Manage your email notification preferences</p>
        </div>

        <div className="notification-settings-container">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <h2 className="sidebar-heading">ACCOUNT</h2>
            <div className="sidebar-links">
              <Link to="/profile/edit" className="sidebar-nav-item">
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
              <Link to="/profile/notifications" className="sidebar-nav-item active">
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
          <div className="notification-settings-content">
            <div className="settings-card">
              <h2 className="settings-section-title">Email Address</h2>

              <div className="email-address-container">
                <div>
                  <div className="email-address">{userData.email}</div>
                  {!userData.emailVerified && <div className="email-status">Not verified</div>}
                </div>
                <button
                  onClick={handleVerifyEmail}
                  className={`verify-email-button ${userData.emailVerified ? 'verified' : ''}`}
                  disabled={loading || userData.emailVerified}
                >
                  {loading ? "Sending..." : userData.emailVerified ? "Active" : "Verify Email"}
                </button>
              </div>

              <p className="settings-description">
                This is the email address where you'll receive notifications. To change your email address, please
                contact support.
              </p>
            </div>

            <div className="settings-card">
              <h2 className="settings-section-title">Notification Preferences</h2>
              <p className="settings-description">Choose which types of email notifications you'd like to receive.</p>

              <div className="notification-preferences">
                <div className="preferences-section">
                  <h3 className="preferences-section-title">Activity Notifications</h3>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaCommentAlt className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Comments</div>
                          <div className="preference-description">When someone comments on your shots</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.comments}
                          onChange={() => handleToggle("comments")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaHeart className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Likes</div>
                          <div className="preference-description">When someone likes your shots</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.likes}
                          onChange={() => handleToggle("likes")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaUsers className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Followers</div>
                          <div className="preference-description">When someone follows you</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.followers}
                          onChange={() => handleToggle("followers")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaEnvelope className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Messages</div>
                          <div className="preference-description">When you receive a new message</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.messages}
                          onChange={() => handleToggle("messages")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="preferences-section">
                  <h3 className="preferences-section-title">Opportunities</h3>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaBriefcase className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Job Opportunities</div>
                          <div className="preference-description">Notifications about relevant job opportunities</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.jobOpportunities}
                          onChange={() => handleToggle("jobOpportunities")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaUsers className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Team Invites</div>
                          <div className="preference-description">When you're invited to join a team</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.teamInvites}
                          onChange={() => handleToggle("teamInvites")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="preferences-section">
                  <h3 className="preferences-section-title">Smart UI Studio Updates</h3>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaBell className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Weekly Digest</div>
                          <div className="preference-description">Weekly summary of activity and inspiration</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.weeklyDigest}
                          onChange={() => handleToggle("weeklyDigest")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaBell className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Product Updates</div>
                          <div className="preference-description">News about Smart UI Studio features and updates</div>
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.productUpdates}
                          onChange={() => handleToggle("productUpdates")}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="save-preferences">
                <button onClick={handleSavePreferences} className="save-button">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;
