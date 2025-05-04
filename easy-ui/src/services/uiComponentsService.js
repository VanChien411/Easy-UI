import apiClient from "../config/axios";

class UIComponentsService {
  static async fetchUIComponentsAll(pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get("/UIComponent", {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UI components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  static async fetchUIComponents(categoryName, pageNumber = 1, pageSize = 10) {
    try {
      const endpoint = categoryName
        ? `/UIComponent/by-category/${categoryName}`
        : "/UIComponent";
      const response = await apiClient.get(endpoint, {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UI components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Lấy trending components với sortBy (popular, views_desc, likes_desc)
  static async fetchTrendingUIComponents(sortBy = "popular", pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get("/UIComponent/trending", {
        params: { sortBy, pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch trending UI components!";
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
  
  // Method để lấy chi tiết sản phẩm theo ID
  static async fetchUIComponentById(id) {
    try {
      const response = await apiClient.get(`/UIComponent/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch UI component details!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Lấy số lượng like của một component
  static async getComponentLikes(componentId) {
    try {
      const response = await apiClient.get(`/UIComponent/${componentId}/likes`);
      console.log('Likes API response:', response);
      
      // Check different response structures - sometimes the API might return an object with a count property
      // or just the number directly
      if (response.data !== null && response.data !== undefined) {
        if (typeof response.data === 'object' && response.data.count !== undefined) {
          return response.data.count;
        } else if (typeof response.data === 'number') {
          return response.data;
        } else if (Array.isArray(response.data)) {
          return response.data.length;
        }
      }
      
      return 0; // Default to 0 if no valid data format is found
    } catch (error) {
      console.error("Error fetching likes:", error);
      return 0; // Return 0 if there's an error
    }
  }

  // Kiểm tra xem user hiện tại đã like component này chưa
  static async checkIfUserLiked(componentId) {
    try {
      // Lấy danh sách các component đã được like bởi user hiện tại
      const response = await apiClient.get(`/UIComponent/liked`);
      // Kiểm tra xem componentId có trong danh sách không
      return response.data.some(item => item.id === componentId);
    } catch (error) {
      console.error("Error checking if user liked component:", error);
      return false; // Return false if there's an error
    }
  }

  // Like một component
  static async likeComponent(componentId) {
    try {
      const response = await apiClient.post(`/UIComponent/${componentId}/like`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error liking component:", error);
      return { success: false, error: error.message };
    }
  }

  // Unlike một component
  static async unlikeComponent(componentId) {
    try {
      const response = await apiClient.post(`/UIComponent/${componentId}/unlike`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error unliking component:", error);
      return { success: false, error: error.message };
    }
  }

  // Method to search for UI components
  static async searchUIComponents(keyword, pageNumber = 1, pageSize = 16) {
    try {
      // Based on Swagger, the endpoint is /api/UIComponent/search
      const response = await apiClient.post("/UIComponent/search", {
        keyword,
        pageNumber,
        pageSize
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to search UI components!";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Export các function riêng để các component có thể import trực tiếp
export const fetchUIComponents = UIComponentsService.fetchUIComponents;
export const fetchUIComponentsAll = UIComponentsService.fetchUIComponentsAll;
export const fetchTrendingUIComponents = UIComponentsService.fetchTrendingUIComponents;
export const saveUIComponent = UIComponentsService.saveUIComponent;
export const isFreeProduct = UIComponentsService.isFreeProduct;
export const fetchUIComponentById = UIComponentsService.fetchUIComponentById;
export const getComponentLikes = UIComponentsService.getComponentLikes;
export const checkIfUserLiked = UIComponentsService.checkIfUserLiked;
export const likeComponent = UIComponentsService.likeComponent;
export const unlikeComponent = UIComponentsService.unlikeComponent;
export const searchUIComponents = UIComponentsService.searchUIComponents;

// Export default class
export default UIComponentsService;
