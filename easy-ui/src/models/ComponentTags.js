export default class ComponentTag {
  constructor(componentId, tagId) {
    this.componentId = componentId;
    this.tagId = tagId;
  }

  static fromJson(json) {
    return new ComponentTag(json.componentId, json.tagId);
  }
}
