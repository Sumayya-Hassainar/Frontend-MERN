// src/redux/slice/WishlistSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // array of products
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Add product if not in wishlist
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((p) => p._id === product._id);
      if (!exists) {
        state.items.push(product);
      }
    },

    // Remove product by id
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((p) => p._id !== productId);
    },

    // Toggle add/remove
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((p) => p._id === product._id);
      if (exists) {
        state.items = state.items.filter((p) => p._id !== product._id);
      } else {
        state.items.push(product);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

// ✅ export actions (including toggleWishlistItem)
export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

// ✅ export selector (optional but useful)
export const selectWishlistItems = (state) => state.wishlist.items;

// ✅ default reducer export
export default wishlistSlice.reducer;
