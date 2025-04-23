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

// Attempt to load user from localStorage on startup
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Giải mã token để lấy thông tin người dùng
      const decodedUser = decodeToken(token);
      
      if (decodedUser) {
        // Lưu thông tin user từ token vào localStorage
        localStorage.setItem('userData', JSON.stringify(decodedUser));
        
        return {
          isAuthenticated: true,
          user: decodedUser,
          token
        };
      }
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      
      // Giải mã token để lấy thông tin người dùng
      const decodedUser = decodeToken(token);
      
      state.isAuthenticated = true;
      state.user = decodedUser;
      state.token = token;
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(decodedUser));
      
      console.log('User data from token:', decodedUser);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('userData', JSON.stringify(state.user));
    }
  }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer; 