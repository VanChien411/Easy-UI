export default class ComponentCategory {
  constructor(componentId, categoryId) {
    this.componentId = componentId;
    this.categoryId = categoryId;
  }

  static fromJson(json) {
    return new ComponentCategory(json.componentId, json.categoryId);
  }
}
