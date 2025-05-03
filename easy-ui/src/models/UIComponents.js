export default class UIComponent {
  constructor(
    id,
    name,
    description = null,
    html,
    css = null,
    js = null,
    previewImage = null,
    type = null,
    framework = null,
    price = 0,
    createdBy = null,
    createdAt,
    updatedAt,
    updatedBy = null,
    isActive = true,
    views = 0,
    likesCount = 0,
    isLikedByCurrentUser = false
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.html = html;
    this.css = css;
    this.js = js;
    this.previewImage = previewImage;
    this.type = type;
    this.framework = framework;
    this.price = price;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    this.views = views;
    this.likesCount = likesCount;
    this.isLikedByCurrentUser = isLikedByCurrentUser;
  }

  static fromJson(json) {
    return new UIComponent(
      json.id,
      json.name,
      json.description,
      json.html,
      json.css,
      json.js,
      json.previewImage,
      json.type,
      json.framework,
      json.price,
      json.createdBy || json.creator,
      json.createdAt,
      json.updatedAt,
      json.updatedBy,
      json.isActive,
      json.views || 0,
      json.likesCount || 0,
      json.isLikedByCurrentUser || false
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
      json.previewImage,
      json.type,
      json.framework,
      json.price,
      json.createdBy || json.creator,
      null,
      null,
      json.updatedBy,
      true,
      json.views || 0,
      json.likesCount || 0,
      json.isLikedByCurrentUser || false
    );
  }
}
