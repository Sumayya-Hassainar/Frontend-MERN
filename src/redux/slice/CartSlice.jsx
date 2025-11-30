// src/redux/slice/CartSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],       // [{ product, quantity }]
  savedItems: [],  // [{ product, quantity }]
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(
        (item) => item.product._id === product._id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },

    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product._id !== productId
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.product._id === productId
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },

    moveToSaveLater: (state, action) => {
      const productId = action.payload;
      const index = state.items.findIndex(
        (i) => i.product._id === productId
      );
      if (index !== -1) {
        const [item] = state.items.splice(index, 1);
        state.savedItems.push(item);
      }
    },

    moveToCartFromSaved: (state, action) => {
      const productId = action.payload;
      const index = state.savedItems.findIndex(
        (i) => i.product._id === productId
      );
      if (index !== -1) {
        const [item] = state.savedItems.splice(index, 1);
        const existing = state.items.find(
          (i) => i.product._id === productId
        );
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          state.items.push(item);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.savedItems = [];
    },
  },
});

// ✅ actions
export const {
  addItem,
  removeItem,
  updateQuantity,
  moveToSaveLater,
  moveToCartFromSaved,
  clearCart,
} = cartSlice.actions;

// ✅ selectors
export const selectCartItems = (state) => state.cart.items;
export const selectSavedItems = (state) => state.cart.savedItems;

export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => {
    const p = item.product;
    const price = p?.discountPrice || p?.price || 0;
    return sum + price * item.quantity;
  }, 0);

export const selectTotalItems = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

// ✅ default reducer
export default cartSlice.reducer;
