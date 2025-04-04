export default class CartModel {
  constructor(
    id,
    userId,
    uiComponentId,
    uiComponentName,
    price,
    quantity,
    createdAt,
    updatedAt,
    isActive
  ) {
    this.id = id;
    this.userId = userId;
    this.uiComponentId = uiComponentId;
    this.uiComponentName = uiComponentName;
    this.price = price;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }
}
