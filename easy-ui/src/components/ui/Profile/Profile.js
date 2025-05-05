import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, Routes, Route } from 'react-router-dom';
import { FaEllipsisH, FaPlus, FaUserFriends } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import UserManagerService from '../../../services/usermanagerService';
import CardItem from '../Product/Card-item';
import About from './About';
import './Profile.css';

const Profile = ({ children }) => {
  const { isAuthenticated, user, userId: currentUserId } = useAuth();
  const location = useLocation();
  const { id: profileId } = useParams();
  
  // Determine if we're viewing current user's profile or another user's profile
  const targetUserId = profileId || currentUserId;
  const isOwnProfile = !profileId || profileId === currentUserId;
  
  // Default user data in case data is not available
  const [userData, setUserData] = useState({
    name: "Tien Pham",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Designer & Developer",
    followersCount: 0,
    followingCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [userComponents, setUserComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(true);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        if (targetUserId) {
          const userProfile = await UserManagerService.getUserProfile(targetUserId);
          
          setUserData({
            name: userProfile.fullName || userProfile.userName || "User",
            avatar: userProfile.avatarUrl || "/placeholder.svg?height=100&width=100",
            bio: userProfile.bio || "UI Component Creator",
            followersCount: userProfile.followersCount || 0,
            followingCount: userProfile.followingCount || 0
          });

          // Check if current user follows this user (if viewing someone else's profile)
          if (!isOwnProfile) {
            const followStatus = await UserManagerService.isFollowingUser(targetUserId);
            setIsFollowing(followStatus);
          }
        } else if (user) {
          // Fallback to auth data if no specific user is requested
          setUserData({
            name: user.name || user.userName || "User",
            avatar: user.avatar || "/placeholder.svg?height=100&width=100",
            bio: user.bio || "UI Component Creator",
            followersCount: 0,
            followingCount: 0
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fall back to auth data if profile fetch fails and viewing own profile
        if (isOwnProfile && user) {
          setUserData({
            name: user.name || user.userName || "User",
            avatar: user.avatar || "/placeholder.svg?height=100&width=100",
            bio: user.bio || "UI Component Creator",
            followersCount: 0,
            followingCount: 0
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [targetUserId, isOwnProfile, user]);

  // Fetch user components
  useEffect(() => {
    const fetchUserComponents = async () => {
      if (targetUserId) {
        setComponentsLoading(true);
        try {
          const response = await UserManagerService.getUserComponents(targetUserId);
          setUserComponents(response.components || []);
        } catch (error) {
          console.error("Error fetching user components:", error);
          setUserComponents([]);
        } finally {
          setComponentsLoading(false);
        }
      }
    };

    fetchUserComponents();
  }, [targetUserId]);

  // Toggle follow status
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await UserManagerService.unfollowUser(targetUserId);
        setIsFollowing(false);
        setUserData(prev => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1)
        }));
      } else {
        await UserManagerService.followUser(targetUserId);
        setIsFollowing(true);
        setUserData(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  // Function to determine if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle card expand/collapse
  const handleCardExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  // Check if we're on the About tab
  const isAboutPage = location.pathname.includes('/about');

  return (
    <div className="profile-page">
      <div className="profile-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-avatar-container">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="profile-avatar"
                />
              </div>

              <h1 className="profile-name">{userData.name}</h1>
              
              <div className="profile-follow-stats">
                <span className="profile-stat-value">{userData.followersCount}</span>
                <span className="profile-stat-label">Followers</span>
                <span className="profile-stat-separator"></span>
                <span className="profile-stat-value">{userData.followingCount}</span>
                <span className="profile-stat-label">Following</span>
              </div>
              
              {userData.bio && <p className="profile-bio">{userData.bio}</p>}

              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <Link to="/profile/edit" className="edit-profile-button">
                      Edit Profile
                    </Link>
                    <button className="more-options-button">
                      <FaEllipsisH size={20} />
                    </button>
                  </>
                ) : (
                  <button 
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            <div className="profile-tabs-container">
              <nav className="profile-tabs">
                <Link 
                  to={`/profile${profileId ? `/${profileId}` : ''}`} 
                  className={`profile-tab ${isActive(`/profile${profileId ? `/${profileId}` : ''}`) ? 'active' : ''}`}
                >
                  Work
                </Link>
                <Link 
                  to={`/profile${profileId ? `/${profileId}` : ''}/services`} 
                  className={`profile-tab ${isActive(`/profile${profileId ? `/${profileId}` : ''}/services`) ? 'active' : ''}`}
                >
                  Artical
                  <span className="new-badge">NEW</span>
                </Link>
                <Link 
                  to={`/profile${profileId ? `/${profileId}` : ''}/liked`} 
                  className={`profile-tab ${isActive(`/profile${profileId ? `/${profileId}` : ''}/liked`) ? 'active' : ''}`}
                >
                  Liked Shots
                </Link>
                <Link 
                  to={`/profile${profileId ? `/${profileId}` : ''}/about`} 
                  className={`profile-tab ${isActive(`/profile${profileId ? `/${profileId}` : ''}/about`) ? 'active' : ''}`}
                >
                  About
                </Link>
              </nav>
            </div>

            <div className="profile-content">
              {isAboutPage ? (
                // Render About component or children if we're on the About tab
                children || <About />
              ) : (
                // Otherwise render the default content (components grid)
                <div className="profile-grid-container">
                  {componentsLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading components...</p>
                    </div>
                  ) : userComponents.length === 0 ? (
                    <div className="empty-components">
                      <p>No components found.</p>
                      {isOwnProfile && (
                        <Link to="/components" className="create-component-button">
                          <FaPlus size={14} />
                          Create Component
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="profile-grid">
                      {userComponents.map((component, index) => (
                        <div key={component.id || index} className="profile-grid-item">
                          <CardItem
                            item={{
                              ...component,
                              createdBy: {
                                id: targetUserId,
                                name: userData.name,
                                avatar: userData.avatar
                              }
                            }}
                            isExpanded={expandedCardIndex === index}
                            onExpand={() => handleCardExpand(index)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;