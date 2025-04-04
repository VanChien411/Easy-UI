import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload; // Ensure payload is an array of plain objects
      const totalQuantity = action.payload.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      state.totalQuantity = totalQuantity > 99 ? "99+" : totalQuantity;
    },
    addItem(state, action) {
      const existingItem = state.items.find(
        (item) => item.uiComponentId === action.payload.uiComponentId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      const totalQuantity = state.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      state.totalQuantity = totalQuantity > 99 ? "99+" : totalQuantity;
    },
  },
});

export const { setCart, addItem } = cartSlice.actions;
export default cartSlice.reducer;
