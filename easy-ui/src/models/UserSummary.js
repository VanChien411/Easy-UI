/**
 * UserSummary model that represents basic user information
 * Used in other models like Article to represent the author
 */
class UserSummary {
  /**
   * @param {Object} params - User summary parameters
   * @param {string} params.id - User ID
   * @param {string} params.userName - Username
   * @param {string} params.fullName - User's full name
   * @param {string} params.profilePictureUrl - URL to the user's profile picture
   */
  constructor({
    id = '',
    userName = '',
    fullName = '',
    profilePictureUrl = ''
  }) {
    this.id = id;
    this.userName = userName;
    this.fullName = fullName;
    this.profilePictureUrl = profilePictureUrl;
  }

  /**
   * Create a UserSummary from an API response
   * @param {Object} apiResponse - Response from the API
   * @returns {UserSummary} - UserSummary instance
   */
  static fromApiResponse(apiResponse) {
    return new UserSummary({
      id: apiResponse.id || '',
      userName: apiResponse.userName || '',
      fullName: apiResponse.fullName || '',
      profilePictureUrl: apiResponse.profilePictureUrl || ''
    });
  }

  /**
   * Get user's display name (full name if available, otherwise username)
   * @returns {string} - User's display name
   */
  getDisplayName() {
    return this.fullName || this.userName;
  }

  /**
   * Get user's profile URL
   * @returns {string} - Profile URL
   */
  getProfileUrl() {
    return `/profile/${this.userName}`;
  }

  /**
   * Get default profile picture if the user doesn't have one
   * @returns {string} - Profile picture URL
   */
  getProfilePicture() {
    return this.profilePictureUrl || '/assets/images/default-profile.png';
  }
}

export default UserSummary; 