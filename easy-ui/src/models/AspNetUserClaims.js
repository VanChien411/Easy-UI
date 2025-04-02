export default class AspNetUserClaim {
  constructor(id, userId, claimType, claimValue) {
    this.id = id;
    this.userId = userId;
    this.claimType = claimType;
    this.claimValue = claimValue;
  }

  static fromJson(json) {
    return new AspNetUserClaim(
      json.id,
      json.userId,
      json.claimType,
      json.claimValue
    );
  }

  static fromPartialJson(json) {
    return new AspNetUserClaim(
      json.id,
      json.userId,
      json.claimType,
      json.claimValue
    );
  }
}
