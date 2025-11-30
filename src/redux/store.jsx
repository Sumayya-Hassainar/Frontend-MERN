// src/redux/store.jsx
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/CartSlice";
import wishlistReducer from "./slice/WishlistSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});

// if you want default also, you can keep this:
export default store;
