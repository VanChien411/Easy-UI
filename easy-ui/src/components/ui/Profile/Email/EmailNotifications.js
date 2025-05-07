import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaBell, FaCommentAlt, FaHeart, FaBriefcase, FaUsers } from 'react-icons/fa';
import './EmailNotifications.css';
import useAuth from '../../../../hooks/useAuth';
import userManagerService from '../../../../services/usermanagerService';
import { toast } from 'react-toastify';
import { ProfileHeader, ProfileSidebar } from '../shared';

const EmailNotifications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Email data
  const [emailData, setEmailData] = useState({
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
        setEmailData(prevData => ({
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
      toast.success(`Verification email sent to ${emailData.email}`);
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
        {/* Use the shared ProfileHeader component */}
        <ProfileHeader 
          section="Email Notifications"
          description="Manage your email notification preferences"
        />

        <div className="profile-layout">
          {/* Use the shared ProfileSidebar component */}
          <ProfileSidebar activeTab="notifications" />

          {/* Main Content */}
          <div className="profile-content">
            <div className="settings-card">
              <h2 className="settings-section-title">Email Address</h2>

              <div className="email-address-container">
                <div>
                  <div className="email-address">{emailData.email}</div>
                  {!emailData.emailVerified && <div className="email-status">Not verified</div>}
                </div>
                <button
                  onClick={handleVerifyEmail}
                  className={`verify-email-button ${emailData.emailVerified ? 'verified' : ''}`}
                  disabled={loading || emailData.emailVerified}
                >
                  {loading ? "Sending..." : emailData.emailVerified ? "Active" : "Verify Email"}
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
                          <div className="preference-description">When someone likes your work</div>
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
                          <div className="preference-description">When someone sends you a message</div>
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
                  <h3 className="preferences-section-title">Professional Notifications</h3>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaBriefcase className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Job Opportunities</div>
                          <div className="preference-description">When job opportunities match your profile</div>
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
                  <h3 className="preferences-section-title">Updates from EASYUI</h3>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <div className="preference-icon-wrapper">
                          <FaEnvelope className="preference-icon" />
                        </div>
                        <div className="preference-details">
                          <div className="preference-title">Weekly Digest</div>
                          <div className="preference-description">Weekly summary of activity and trending components</div>
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
                          <div className="preference-description">New features and improvements to EASYUI</div>
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
                <button onClick={handleSavePreferences} className="save-preferences-button">
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
