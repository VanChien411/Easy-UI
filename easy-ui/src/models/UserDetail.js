/**
 * UserDetail class represents the detailed information of a user
 * Corresponds to the UserDetailDto from the API
 */
class UserDetail {
  constructor({
    id = '',
    userName = '',
    email = '',
    fullName = '',
    avatar = '',
    location = '',
    bio = '',
    website = '',
    workDisplayEmail = '',
    phoneNumber = '',
    createdAt = null,
    workHistory = [],
    education = [],
    followersCount = 0,
    followingCount = 0,
    isFollowedByCurrentUser = false
  } = {}) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.fullName = fullName;
    this.avatar = avatar;
    this.location = location;
    this.bio = bio;
    this.website = website;
    this.workDisplayEmail = workDisplayEmail;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.workHistory = workHistory;
    this.education = education;
    this.followersCount = followersCount;
    this.followingCount = followingCount;
    this.isFollowedByCurrentUser = isFollowedByCurrentUser;
  }

  /**
   * Create a UserDetail instance from JSON data
   * @param {Object} json - JSON data from API
   * @returns {UserDetail} - UserDetail instance
   */
  static fromJson(json) {
    if (!json) return new UserDetail();

    return new UserDetail({
      id: json.id || '',
      userName: json.userName || '',
      email: json.email || '',
      fullName: json.fullName || '',
      avatar: json.avatar || '',
      location: json.location || '',
      bio: json.bio || '',
      website: json.website || '',
      workDisplayEmail: json.workDisplayEmail || '',
      phoneNumber: json.phoneNumber || '',
      createdAt: json.createdAt ? new Date(json.createdAt) : null,
      workHistory: json.workHistory || [],
      education: json.education || [],
      followersCount: json.followersCount || 0,
      followingCount: json.followingCount || 0,
      isFollowedByCurrentUser: json.isFollowedByCurrentUser || false
    });
  }

  /**
   * Convert an array of JSON objects to UserDetail instances
   * @param {Array} jsonArray - Array of JSON data
   * @returns {Array<UserDetail>} - Array of UserDetail instances
   */
  static fromJsonArray(jsonArray) {
    if (!jsonArray || !Array.isArray(jsonArray)) return [];
    
    return jsonArray.map(json => UserDetail.fromJson(json));
  }
}

export default UserDetail; 