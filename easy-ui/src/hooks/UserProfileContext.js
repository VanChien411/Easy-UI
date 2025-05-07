import React, { createContext, useState, useEffect, useContext } from 'react';
import userManagerService from '../services/usermanagerService';
import useAuth from './useAuth';
import { showErrorAlert } from '../utils/alertUtils';

// Create the context
const UserProfileContext = createContext();

// Context provider component
export const UserProfileProvider = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user details once when the provider is mounted
  useEffect(() => {
    const loadUserDetails = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userDetail = await userManagerService.getCurrentUserDetail();
        setUserProfileData(userDetail);
      } catch (error) {
        console.error("Failed to load user details:", error);
        setError("Failed to load user details. Please try again later.");
        
        // Fall back to auth data if API fails
        if (authUser) {
          setUserProfileData({
            fullName: authUser.name || authUser.userName || "",
            avatar: authUser.avatar || "/placeholder.svg?height=100&width=100"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetails();
  }, [isAuthenticated, authUser]);

  // Force refresh function to reload user data when needed
  const refreshUserProfile = async () => {
    try {
      setIsLoading(true);
      const userDetail = await userManagerService.getCurrentUserDetail();
      setUserProfileData(userDetail);
      return userDetail;
    } catch (error) {
      console.error("Failed to refresh user details:", error);
      showErrorAlert("Failed to refresh user profile");
      setError("Failed to refresh user profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Value to be provided by the context
  const contextValue = {
    userProfileData,
    isLoading,
    error,
    refreshUserProfile
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

export default UserProfileContext; 