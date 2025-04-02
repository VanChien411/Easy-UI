export default class SavedComponent {
  constructor(userId, componentId, createdAt) {
    this.userId = userId;
    this.componentId = componentId;
    this.createdAt = createdAt;
  }

  static fromJson(json) {
    return new SavedComponent(json.userId, json.componentId, json.createdAt);
  }

  static fromPartialJson(json) {
    return new SavedComponent(
      json.userId,
      json.componentId,
      null // createdAt
    );
  }
}
