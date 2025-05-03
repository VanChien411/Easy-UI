import apiClient from "../config/axios";
import UserProfile from "../models/UserProfile";
import FollowUser from "../models/FollowUser";

/**
 * Service for managing user-related operations
 * Handles user profiles, following/unfollowing, and component retrieval
 */
class UserManagerService {
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
}

export default new UserManagerService(); 