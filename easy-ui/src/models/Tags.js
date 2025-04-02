export default class Tag {
  constructor(
    id,
    name,
    createdBy = null,
    createdAt,
    updatedAt,
    updatedBy = null,
    isActive = true
  ) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }

  static fromJson(json) {
    return new Tag(
      json.id,
      json.name,
      json.createdBy,
      json.createdAt,
      json.updatedAt,
      json.updatedBy,
      json.isActive
    );
  }

  static fromPartialJson(json) {
    return new Tag(
      json.id,
      json.name,
      json.createdBy,
      null, // createdAt
      null, // updatedAt
      json.updatedBy,
      true // isActive
    );
  }
}
