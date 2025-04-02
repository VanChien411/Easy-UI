export default class AspNetUserRole {
  constructor(userId, roleId) {
    this.userId = userId;
    this.roleId = roleId;
  }

  static fromJson(json) {
    return new AspNetUserRole(json.userId, json.roleId);
  }

  static fromPartialJson(json) {
    return new AspNetUserRole(json.userId, json.roleId);
  }
}
