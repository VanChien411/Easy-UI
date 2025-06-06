import apiClient from "../config/axios";
import UserProfile from "../models/UserProfile";
import FollowUser from "../models/FollowUser";
import UserDetail from "../models/UserDetail";

/**
 * Service for managing user-related operations
 * Handles user profiles, following/unfollowing, and component retrieval
 */
class UserManagerService {
  /**
   * Get user's detailed information by ID
   * @param {string} userId - The ID of the user
   * @returns {Promise<UserDetail>} - User's detailed information
   */
  async getUserDetail(userId) {
    try {
      const response = await apiClient.get(`/User/${userId}/detail`);
      return UserDetail.fromJson(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user details!";
      console.error("Error fetching user details:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update current user's profile
   * @param {Object} profileData - User profile data to update
   * @returns {Promise<Object>} - Updated user data
   */
  async updateUserProfile(profileData) {
    try {
      console.log("Sending profile update:", JSON.stringify(profileData, null, 2));
      
      // Make sure workHistory and education have all required fields
      const formattedData = {
        ...profileData,
        workHistory: (profileData.workHistory || []).map(job => ({
          title: job.title || "",
          company: job.company || "",
          yearStart: job.yearStart || "",
          yearEnd: job.yearEnd || "",
          description: job.description || ""
        })),
        education: (profileData.education || []).map(edu => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          description: edu.description || ""
        }))
      };

      const response = await apiClient.put('/User/me', formattedData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update user profile!";
      console.error("Update profile error:", error.response?.data || error.message);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get current user's detailed information
   * @returns {Promise<UserDetail>} - Current user's detailed information
   */
  async getCurrentUserDetail() {
    try {
      const response = await apiClient.get('/User/me/detail');
      return UserDetail.fromJson(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user details!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user profile by ID
   * @param {string} userId - The ID of the user
   * @returns {Promise<UserProfile>} - User profile data
   */
  async getUserProfile(userId) {
    try {
      const response = await apiClient.get(`/User/${userId}/profile`);
      return UserProfile.fromJson(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user profile!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Follow a user
   * @param {string} userId - The ID of the user to follow
   * @returns {Promise<Object>} - Response data
   */
  async followUser(userId) {
    try {
      const response = await apiClient.post(`/User/${userId}/follow`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to follow user!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Unfollow a user
   * @param {string} userId - The ID of the user to unfollow
   * @returns {Promise<Object>} - Response data
   */
  async unfollowUser(userId) {
    try {
      const response = await apiClient.post(`/User/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to unfollow user!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get followers of a user
   * @param {string} userId - The ID of the user
   * @param {number} page - Page number for pagination (optional)
   * @param {number} limit - Number of items per page (optional)
   * @returns {Promise<Object>} - Followers data with pagination
   */
  async getUserFollowers(userId, page = 1, limit = 9) {
    try {
      const response = await apiClient.get(`/User/${userId}/followers`, {
        params: { page, limit }
      });
      
      return {
        followers: FollowUser.fromJsonArray(response.data.items || response.data),
        pagination: response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.data.length || 0,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user followers!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get users that a user is following
   * @param {string} userId - The ID of the user
   * @param {number} page - Page number for pagination (optional)
   * @param {number} limit - Number of items per page (optional)
   * @returns {Promise<Object>} - Following data with pagination
   */
  async getUserFollowing(userId, page = 1, limit = 9) {
    try {
      const response = await apiClient.get(`/User/${userId}/following`, {
        params: { page, limit }
      });
      
      return {
        following: FollowUser.fromJsonArray(response.data.items || response.data),
        pagination: response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.data.length || 0,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user following!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get components created by a user
   * @param {string} userId - The ID of the user
   * @param {number} page - Page number for pagination (optional)
   * @param {number} limit - Number of items per page (optional)
   * @returns {Promise<Object>} - Components data with pagination
   */
  async getUserComponents(userId, page = 1, limit = 9) {
    try {
      const response = await apiClient.get(`/User/${userId}/components`, {
        params: { page, limit }
      });
      
      return {
        components: response.data.items || response.data,
        pagination: response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.data.length || 0,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if current user is following another user
   * @param {string} userId - The ID of the user to check
   * @returns {Promise<boolean>} - Whether the current user follows the specified user
   */
  async isFollowingUser(userId) {
    try {
      // Use the profile API instead of a separate API for checking follow status
      const response = await apiClient.get(`/User/${userId}/profile`);
      return response.data.isFollowedByCurrentUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to check follow status!";
      console.error("Error checking follow status:", errorMessage);
      return false; // Default to not following if there's an error
    }
  }

  /**
   * Check the email verification status for the current user
   * @returns {Promise<Object>} - Email verification status
   */
  async getEmailStatus() {
    try {
      const response = await apiClient.get('/User/me/email-status');
      console.log('API response for email status:', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to check email status!";
      console.error("Error checking email status:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Send a confirmation email to the current user
   * @returns {Promise<Object>} - Response data
   */
  async sendConfirmationEmail() {
    try {
      const response = await apiClient.post('/User/me/send-confirmation-email');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send confirmation email!";
      console.error("Error sending confirmation email:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Confirm user email using userId and token
   * @param {string} userId - The ID of the user
   * @param {string} token - Confirmation token
   * @returns {Promise<Object>} - Response data
   */
  async confirmEmail(userId, token) {
    try {
      const response = await apiClient.get('/User/confirm-email', {
        params: { userId, token }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to confirm email!";
      console.error("Error confirming email:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default new UserManagerService(); 