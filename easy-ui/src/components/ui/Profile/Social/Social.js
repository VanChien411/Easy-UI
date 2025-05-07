import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import userManagerService from "../../../../services/usermanagerService";
import { showSuccessAlert, showErrorAlert } from "../../../../utils/alertUtils";
import { ProfileHeader, ProfileSidebar } from "../shared";
import "./Social.css";

const Social = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Social profiles state
  const [socialProfiles, setSocialProfiles] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    youtube: "",
    dribbble: "",
    behance: "",
  });

  // Load social profiles from API
  useEffect(() => {
    const loadSocialProfiles = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userDetail = await userManagerService.getCurrentUserDetail();
        
        // Load social profiles if they exist
        setSocialProfiles({
          twitter: userDetail.twitter || "",
          facebook: userDetail.facebook || "",
          instagram: userDetail.instagram || "",
          linkedin: userDetail.linkedin || "",
          github: userDetail.github || "",
          youtube: userDetail.youtube || "",
          dribbble: userDetail.dribbble || "",
          behance: userDetail.behance || "",
        });
      } catch (error) {
        console.error("Failed to load social profiles:", error);
        showErrorAlert("Failed to load social profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSocialProfiles();
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialProfiles((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Prepare data for API request
      const profileData = {
        ...socialProfiles
      };
      
      // Call the API to update social profiles
      await userManagerService.updateSocialProfiles(profileData);
      
      showSuccessAlert("Social profiles updated successfully!");
    } catch (error) {
      console.error("Failed to update social profiles:", error);
      showErrorAlert(error.message || "Failed to update social profiles. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="loading-indicator"></div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="profile-container">
        {/* Use the shared ProfileHeader component that now fetches user data on its own */}
        <ProfileHeader 
          section="Social Profiles"
          description="Connect your social media accounts"
        />

        <div className="profile-layout">
          {/* Use the shared ProfileSidebar component */}
          <ProfileSidebar activeTab="social" />

          {/* Main Content */}
          <div className="profile-content">
            <div className="social-profiles-section edit-profile-card">
              <h2 className="section-title">Social Profiles</h2>
              <p className="section-description">
                Connect your social media accounts to share your work and build your network.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="social-grid">
                  <div className="social-input-group">
                    <label htmlFor="twitter" className="social-label">
                      <i className="fab fa-twitter social-icon twitter-color"></i>
                      Twitter
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">twitter.com/</span>
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        value={socialProfiles.twitter}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="facebook" className="social-label">
                      <i className="fab fa-facebook social-icon facebook-color"></i>
                      Facebook
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">facebook.com/</span>
                      <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        value={socialProfiles.facebook}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="instagram" className="social-label">
                      <i className="fab fa-instagram social-icon instagram-color"></i>
                      Instagram
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">instagram.com/</span>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={socialProfiles.instagram}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="linkedin" className="social-label">
                      <i className="fab fa-linkedin social-icon linkedin-color"></i>
                      LinkedIn
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">linkedin.com/in/</span>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={socialProfiles.linkedin}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="github" className="social-label">
                      <i className="fab fa-github social-icon github-color"></i>
                      GitHub
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">github.com/</span>
                      <input
                        type="text"
                        id="github"
                        name="github"
                        value={socialProfiles.github}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="youtube" className="social-label">
                      <i className="fab fa-youtube social-icon youtube-color"></i>
                      YouTube
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">youtube.com/</span>
                      <input
                        type="text"
                        id="youtube"
                        name="youtube"
                        value={socialProfiles.youtube}
                        onChange={handleChange}
                        placeholder="channel"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="dribbble" className="social-label">
                      <i className="fab fa-dribbble social-icon dribbble-color"></i>
                      Dribbble
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">dribbble.com/</span>
                      <input
                        type="text"
                        id="dribbble"
                        name="dribbble"
                        value={socialProfiles.dribbble}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>

                  <div className="social-input-group">
                    <label htmlFor="behance" className="social-label">
                      <i className="fab fa-behance social-icon behance-color"></i>
                      Behance
                    </label>
                    <div className="social-input-container">
                      <span className="social-prefix">behance.net/</span>
                      <input
                        type="text"
                        id="behance"
                        name="behance"
                        value={socialProfiles.behance}
                        onChange={handleChange}
                        placeholder="username"
                        className="social-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Social Profiles"}
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

export default Social; 