export default class AspNetRole {
  constructor(id, name = null, normalizedName = null, concurrencyStamp = null) {
    this.id = id;
    this.name = name;
    this.normalizedName = normalizedName;
    this.concurrencyStamp = concurrencyStamp;
  }

  static fromJson(json) {
    return new AspNetRole(
      json.id,
      json.name,
      json.normalizedName,
      json.concurrencyStamp
    );
  }

  static fromPartialJson(json) {
    return new AspNetRole(
      json.id,
      json.name,
      json.normalizedName,
      json.concurrencyStamp
    );
  }
}
