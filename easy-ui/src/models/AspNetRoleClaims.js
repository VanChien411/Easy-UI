export default class AspNetRoleClaim {
  constructor(id, roleId, claimType, claimValue) {
    this.id = id;
    this.roleId = roleId;
    this.claimType = claimType;
    this.claimValue = claimValue;
  }

  static fromJson(json) {
    return new AspNetRoleClaim(
      json.id,
      json.roleId,
      json.claimType,
      json.claimValue
    );
  }

  static fromPartialJson(json) {
    return new AspNetRoleClaim(
      json.id,
      json.roleId,
      json.claimType,
      json.claimValue
    );
  }
}
