import apiClient from "../config/axios";

class UIComponentsService {
  static async fetchUIComponentsAll() {
    try {
      const response = await apiClient.get("/UIComponent");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UI components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async fetchUIComponents(categoryName) {
    try {
      const endpoint = categoryName
        ? `/UIComponent/by-category/${categoryName}`
        : "/UIComponent";
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UI components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async saveUIComponent(data) {
    try {
      const response = await apiClient.post("/UIComponent", data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save UI component!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Method để kiểm tra sản phẩm có free hay không
  static isFreeProduct(price) {
    // Chuyển đổi price sang number
    const numPrice = Number(price);
    
    // Log để debug
    console.log('Checking price:', price, 'Converted:', numPrice, 'Is Free:', numPrice === 0);
    
    // Chỉ return true khi price chính xác bằng 0
    return numPrice === 0;
  }
  
  
}

// Export các function riêng để các component có thể import trực tiếp
export const fetchUIComponents = UIComponentsService.fetchUIComponents;
export const fetchUIComponentsAll = UIComponentsService.fetchUIComponentsAll;
export const saveUIComponent = UIComponentsService.saveUIComponent;
export const isFreeProduct = UIComponentsService.isFreeProduct;

// Export default class
export default UIComponentsService;
