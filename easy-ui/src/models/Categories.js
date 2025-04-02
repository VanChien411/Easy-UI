export default class Category {
  constructor(
    id,
    name,
    description = null,
    createdBy = null,
    createdAt,
    updatedAt,
    updatedBy = null,
    isActive = true
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }

  static fromJson(json) {
    return new Category(
      json.id,
      json.name,
      json.description,
      json.createdBy,
      json.createdAt,
      json.updatedAt,
      json.updatedBy,
      json.isActive
    );
  }

  static fromPartialJson(json) {
    return new Category(
      json.id,
      json.name,
      json.description,
      json.createdBy,
      null, // createdAt
      null, // updatedAt
      json.updatedBy,
      true // isActive
    );
  }
}
