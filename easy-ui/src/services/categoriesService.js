import apiClient from "../config/axios";

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/Category");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch categories!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchComponentsByCategory = async (categoryId, pageNumber = 1, pageSize = 10) => {
  try {
    const response = await apiClient.get(`/Category/${categoryId}/components`, {
      params: {
        pageNumber,
        pageSize
      }
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch components for category ${categoryId}!`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`/Category/${categoryId}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch category ${categoryId}!`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
