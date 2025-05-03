/**
 * FollowUser Model
 * Represents a user follower or following relationship
 */
export default class FollowUser {
  constructor(
    id,
    userName,
    email = null,
    fullName = null,
    avatarUrl = null,
    bio = null,
    isFollowing = false,
    followDate = null
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
    this.isFollowing = isFollowing;
    this.followDate = followDate ? new Date(followDate) : null;
  }

  /**
   * Create a FollowUser from a JSON object
   * @param {Object} json - JSON object containing follower/following data
   * @returns {FollowUser} A new FollowUser instance
   */
  static fromJson(json) {
    return new FollowUser(
      json.id,
      json.userName,
      json.email,
      json.fullName,
      json.avatarUrl,
      json.bio,
      json.isFollowing,
      json.followDate
    );
  }

  /**
   * Create a list of FollowUser instances from a JSON array
   * @param {Array} jsonArray - Array of JSON objects containing follower/following data
   * @returns {Array<FollowUser>} An array of FollowUser instances
   */
  static fromJsonArray(jsonArray) {
    if (!Array.isArray(jsonArray)) {
      return [];
    }
    return jsonArray.map(json => FollowUser.fromJson(json));
  }
} 