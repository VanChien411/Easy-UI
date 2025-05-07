import React from "react";
import { useUserProfile } from "../../../../hooks/UserProfileContext";
import "./shared.css";

/**
 * Shared header component for profile pages that uses the shared context for user data
 * @param {Object} props
 * @param {string} props.section - Current profile section name (e.g. "Password", "Social Profiles")
 * @param {string} props.description - Optional description text for the section
 */
const ProfileHeader = ({ section, description }) => {
  const { userProfileData, isLoading } = useUserProfile();
  
  if (isLoading) {
    return <div className="loading-indicator"></div>;
  }

  // Default values if userProfileData is not available
  const name = userProfileData?.fullName || userProfileData?.userName || "";
  const avatar = userProfileData?.avatar || "/placeholder.svg?height=100&width=100";

  return (
    <div className="profile-header">
      <div className="profile-avatar-container">
        <img
          src={avatar}
          alt={name}
          className="profile-avatar"
        />
      </div>

      <h1 className="profile-name">
        {name} {section && <span className="profile-subheading">/ {section}</span>}
      </h1>
      
      {description && <p className="profile-bio">{description}</p>}
    </div>
  );
};

export default ProfileHeader; 