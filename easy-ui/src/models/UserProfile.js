/**
 * User Profile Model
 * Represents a user profile with details and social information
 */
export default class UserProfile {
  constructor(
    id,
    userName,
    email,
    fullName = null,
    bio = null,
    avatarUrl = null,
    coverImageUrl = null,
    website = null,
    location = null,
    joinDate = null,
    followersCount = 0,
    followingCount = 0,
    componentsCount = 0,
    isFollowing = false
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.fullName = fullName;
    this.bio = bio;
    this.avatarUrl = avatarUrl;
    this.coverImageUrl = coverImageUrl;
    this.website = website;
    this.location = location;
    this.joinDate = joinDate ? new Date(joinDate) : null;
    this.followersCount = followersCount;
    this.followingCount = followingCount;
    this.componentsCount = componentsCount;
    this.isFollowing = isFollowing;
  }

  /**
   * Create a UserProfile from a JSON object
   * @param {Object} json - JSON object containing user profile data
   * @returns {UserProfile} A new UserProfile instance
   */
  static fromJson(json) {
    // Xử lý trường hợp isFollowing có thể nằm trong isFollowedByCurrentUser
    const isFollowing = json.isFollowing !== undefined 
      ? json.isFollowing 
      : (json.isFollowedByCurrentUser !== undefined 
        ? json.isFollowedByCurrentUser 
        : false);
    
    return new UserProfile(
      json.id,
      json.userName,
      json.email,
      json.fullName,
      json.bio,
      json.avatarUrl,
      json.coverImageUrl,
      json.website,
      json.location,
      json.joinDate,
      json.followersCount,
      json.followingCount,
      json.componentsCount,
      isFollowing
    );
  }

  /**
   * Create a partial UserProfile from a JSON object
   * @param {Object} json - JSON object containing partial user profile data
   * @returns {UserProfile} A new UserProfile instance with partial data
   */
  static fromPartialJson(json) {
    // Xử lý trường hợp isFollowing có thể nằm trong isFollowedByCurrentUser
    const isFollowing = json.isFollowing !== undefined 
      ? json.isFollowing 
      : (json.isFollowedByCurrentUser !== undefined 
        ? json.isFollowedByCurrentUser 
        : false);
    
    return new UserProfile(
      json.id,
      json.userName, 
      json.email,
      json.fullName || null,
      json.bio || null,
      json.avatarUrl || null,
      json.coverImageUrl || null,
      json.website || null,
      json.location || null,
      json.joinDate || null,
      json.followersCount || 0,
      json.followingCount || 0,
      json.componentsCount || 0,
      isFollowing
    );
  }
} 