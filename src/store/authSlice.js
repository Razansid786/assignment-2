import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('user');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isLoggedIn: savedUser ? true : false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser(state, action) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const exists = users.find((u) => u.email === action.payload.email);
      if (exists) {
        state.error = 'Email already registered';
        return;
      }
      users.push(action.payload);
      localStorage.setItem('users', JSON.stringify(users));
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginUser(state, action) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(
        (u) => u.email === action.payload.email && u.password === action.payload.password
      );
      if (!found) {
        state.error = 'Invalid email or password';
        return;
      }
      state.user = found;
      state.isLoggedIn = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(found));
    },
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
