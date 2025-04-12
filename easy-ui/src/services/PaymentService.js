import apiClient from "../config/axios";

class PaymentService {
  static async createMomoPayment(orderId) {
    try {
      const returnUrl = `${window.location.origin}/payment/callback`;
      const response = await apiClient.post('/Payment/momo/create', {
        orderId: orderId,
        returnUrl: returnUrl
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Momo payment:", error);
      throw error;
    }
  }

  static async processMomoCallback(callbackData) {
    try {
      const response = await apiClient.post('/Payment/momo/ipn', callbackData);
      return response.data;
    } catch (error) {
      console.error("Error processing Momo callback:", error);
      throw error;
    }
  }

  static async getPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`/Payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  }
}

export default PaymentService; 