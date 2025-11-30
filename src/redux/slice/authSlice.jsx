// src/store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialRole = localStorage.getItem("role") || "guest";
const initialToken = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: initialRole,
    token: initialToken,
  },
  reducers: {
    loginSuccess(state, action) {
      const { role, token } = action.payload;
      state.role = role;
      state.token = token;
      if (role) localStorage.setItem("role", role);
      if (token) localStorage.setItem("token", token);
    },
    logout(state) {
      state.role = "guest";
      state.token = null;
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
    setRole(state, action) {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const { loginSuccess, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
