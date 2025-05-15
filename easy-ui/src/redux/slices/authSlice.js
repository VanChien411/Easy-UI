import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Giải mã JWT token để lấy thông tin người dùng
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Kiểm tra token có hết hạn chưa
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Chuyển đổi sang giây
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Nếu có lỗi, coi như token đã hết hạn
  }
};

// Attempt to load user from localStorage on startup
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      // Kiểm tra xem token có hết hạn không
      if (isTokenExpired(token)) {
        console.log('Token has expired, will use refresh token if available');
        
        // Nếu token hết hạn nhưng không có refresh token, xóa thông tin người dùng
        if (!refreshToken) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          return {
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            tokenExpired: true
          };
        }
        
        // Trả về trạng thái với flag tokenExpired để component có thể refresh
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken,
          tokenExpired: true
        };
      }
      
      // Giải mã token để lấy thông tin người dùng
      const decodedUser = decodeToken(token);
      
      if (decodedUser) {
        // Lưu thông tin user từ token vào localStorage
        localStorage.setItem('userData', JSON.stringify(decodedUser));
        
        return {
          isAuthenticated: true,
          user: decodedUser,
          token,
          refreshToken,
          tokenExpired: false
        };
      }
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    tokenExpired: false
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    login: (state, action) => {
      const { token, refreshToken } = action.payload;
      
      // Giải mã token để lấy thông tin người dùng
      const decodedUser = decodeToken(token);
      
      state.isAuthenticated = true;
      state.user = decodedUser;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpired = false;
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(decodedUser));
      
      console.log('User data from token:', decodedUser);
    },
    updateToken: (state, action) => {
      const { token, refreshToken } = action.payload;
      
      // Giải mã token để lấy thông tin người dùng
      const decodedUser = decodeToken(token);
      
      state.isAuthenticated = true;
      state.user = decodedUser;
      state.token = token;
      state.tokenExpired = false;
      
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Lưu thông tin mới vào localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(decodedUser));
      
      console.log('Token refreshed, new user data:', decodedUser);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpired = false;
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    },
    setTokenExpired: (state, action) => {
      state.tokenExpired = action.payload;
      
      if (action.payload === true) {
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('authToken');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('userData', JSON.stringify(state.user));
    }
  }
});

export const { login, logout, updateUser, updateToken, setTokenExpired } = authSlice.actions;
export { isTokenExpired };
export default authSlice.reducer; 