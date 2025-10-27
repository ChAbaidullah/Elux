import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // {id, name, price, image, qty}
  totalQty: 0,
  totalAmount: 0,
};

const calcTotals = (state) => {
  state.totalQty = state.items.reduce((s, i) => s + i.qty, 0);
  state.totalAmount = state.items.reduce((s, i) => s + i.price * i.qty, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find((i) => i.id === payload.id);
      if (existing) existing.qty += payload.qty || 1;
      else state.items.push({ ...payload, qty: payload.qty || 1 });
      calcTotals(state);
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
      calcTotals(state);
    },
    incrementQty: (state, { payload }) => {
      const item = state.items.find((i) => i.id === payload);
      if (item) item.qty += 1;
      calcTotals(state);
    },
    decrementQty: (state, { payload }) => {
      const item = state.items.find((i) => i.id === payload);
      if (item && item.qty > 1) item.qty -= 1;
      calcTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      calcTotals(state);
    },
  },
});

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
