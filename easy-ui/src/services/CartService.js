import apiClient from "../config/axios";
import CartModel from "../models/CartModel"; // Ensure correct import

class CartService {
  static async getCartItems() {
    try {
      const response = await apiClient.get(`/Cart`);
      return response.data.map((item) => ({
        id: item.id || null,
        userId: item.userId || null,
        uiComponentId: item.uiComponentId || null,
        uiComponentName: item.uiComponentName || null,
        price: item.price || 0,
        quantity: item.quantity || 0,
        createdAt: item.createdAt || null,
        updatedAt: item.updatedAt || null,
        isActive: item.isActive !== undefined ? item.isActive : true,
        imageUrl: item.imageUrl || null,
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }

  static async addToCart(createCartRequest) {
    try {
      const response = await apiClient.post(`/Cart`, createCartRequest);
      return response.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  }

  static async updateCartItem(id, updateCartRequest) {
    try {
      await apiClient.put(`/Cart/${id}`, updateCartRequest);
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  static async removeCartItem(id) {
    try {
      await apiClient.delete(`/Cart/${id}`);
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  }
}

export default CartService;
