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
    
    // Ensure workHistory has the correct format
    this.workHistory = workHistory.map(job => ({
      title: job.title || '',
      company: job.company || '',
      yearStart: job.yearStart || '',
      yearEnd: job.yearEnd || '',
      description: job.description || ''
    }));
    
    // Ensure education has the correct format
    this.education = education.map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startYear: edu.startYear || '',
      endYear: edu.endYear || '',
      description: edu.description || ''
    }));
    
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

    // Format workHistory and education arrays to match expected structure
    const formattedWorkHistory = Array.isArray(json.workHistory) ? json.workHistory.map(job => ({
      title: job.title || '',
      company: job.company || '',
      yearStart: job.yearStart || '',
      yearEnd: job.yearEnd || '',
      description: job.description || ''
    })) : [];

    const formattedEducation = Array.isArray(json.education) ? json.education.map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startYear: edu.startYear || '',
      endYear: edu.endYear || '',
      description: edu.description || ''
    })) : [];

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
      workHistory: formattedWorkHistory,
      education: formattedEducation,
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