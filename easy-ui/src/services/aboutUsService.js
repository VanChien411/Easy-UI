import apiClient from "../config/axios";

export const fetchAboutUs = async () => {
  try {
    const response = await apiClient.get("/AboutUs");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch about us information!";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
