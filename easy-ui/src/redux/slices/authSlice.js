import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 