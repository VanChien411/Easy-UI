export default class Comment {
  constructor(
    id,
    componentId,
    userId = null,
    content,
    createdAt,
    updatedAt,
    updatedBy = null,
    isActive = true
  ) {
    this.id = id;
    this.componentId = componentId;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }

  static fromJson(json) {
    return new Comment(
      json.id,
      json.componentId,
      json.userId,
      json.content,
      json.createdAt,
      json.updatedAt,
      json.updatedBy,
      json.isActive
    );
  }

  static fromPartialJson(json) {
    return new Comment(
      json.id,
      json.componentId,
      json.userId,
      json.content,
      null, // createdAt
      null, // updatedAt
      json.updatedBy,
      true // isActive
    );
  }
}
