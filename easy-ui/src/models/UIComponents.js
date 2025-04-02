export default class UIComponent {
  constructor(
    id,
    name,
    description = null,
    html,
    css = null,
    js = null,
    previewUrl = null,
    type = null,
    framework = null,
    createdBy = null,
    createdAt,
    updatedAt,
    updatedBy = null,
    isActive = true
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.html = html;
    this.css = css;
    this.js = js;
    this.previewUrl = previewUrl;
    this.type = type;
    this.framework = framework;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }

  static fromJson(json) {
    return new UIComponent(
      json.id,
      json.name,
      json.description,
      json.html,
      json.css,
      json.js,
      json.previewUrl,
      json.type,
      json.framework,
      json.createdBy,
      json.createdAt,
      json.updatedAt,
      json.updatedBy,
      json.isActive
    );
  }

  static fromPartialJson(json) {
    return new UIComponent(
      json.id,
      json.name,
      json.description,
      json.html,
      json.css,
      json.js,
      json.previewUrl,
      json.type,
      json.framework,
      json.createdBy,
      null, // createdAt
      null, // updatedAt
      json.updatedBy,
      true // isActive
    );
  }
}
