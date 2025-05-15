import axios from "axios";
import { refreshToken } from "../services/userService";
import { store } from "../redux/store";
import { updateToken, setTokenExpired, isTokenExpired } from "../redux/slices/authSlice";

const apiClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "https://easy-ui-backend.onrender.com/api" ,
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true // Enable credentials for CORS
});

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý các request đang đợi sau khi refresh token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Check if operation is for token refresh
    if (config.url.includes('/Auth/refresh-token')) {
      return config;
    }
    
    // Check all possible token storage locations
    const token = 
      localStorage.getItem("authToken") || 
      localStorage.getItem("auth_token") || 
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");
    
    if (token) {
      // Kiểm tra nếu token sắp hết hạn (còn 5 phút) thì tự động refresh
      try {
        if (isTokenExpired(token)) {
          console.log("Token expired, will try to refresh");
          store.dispatch(setTokenExpired(true));
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
      }
      
      console.log("Found auth token, adding to request headers");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No auth token found for request");
    }
    
    // Log the final request config for debugging
    console.log(`${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu là lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh token, đưa request hiện tại vào hàng đợi
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      
      // Đánh dấu đang refresh token
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Lấy refreshToken từ Redux store hoặc localStorage
        const state = store.getState().auth;
        const currentRefreshToken = state.refreshToken || localStorage.getItem('refreshToken');
        
        if (!currentRefreshToken) {
          // Không có refresh token, chuyển về trạng thái chưa đăng nhập
          store.dispatch(setTokenExpired(true));
          processQueue(new Error('No refresh token available'));
          return Promise.reject(error);
        }
        
        // Gọi API để refresh token
        const { token, refreshToken: newRefreshToken } = await refreshToken(currentRefreshToken);
        
        // Cập nhật token trong Redux store
        store.dispatch(updateToken({ token, refreshToken: newRefreshToken }));
        
        // Cập nhật header cho request hiện tại
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Xử lý các request đang đợi
        processQueue(null, token);
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        console.error("Token refresh failed:", refreshError);
        store.dispatch(setTokenExpired(true));
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Xử lý các lỗi khác
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
