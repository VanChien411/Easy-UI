import apiClient from "../config/axios";

class OrderService {
  static async createOrder(paymentMethod) {
    try {
      const response = await apiClient.post('/Order', {
        paymentMethod: paymentMethod
      });
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid order response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error(error.response?.data?.message || error.message || "Không thể tạo đơn hàng");
    }
  }

  static async getOrders() {
    try {
      const response = await apiClient.get('/Order');
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const response = await apiClient.get(`/Order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
}

export default OrderService; 