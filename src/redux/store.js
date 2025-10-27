import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productSlice';

const PERSIST_KEY = 'elux_cart_v1';

const saveState = (state) => {
  try {
    const serialized = JSON.stringify({ cart: state.cart });
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERSIST_KEY, serialized);
    }
  } catch {}
};

const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const serialized = localStorage.getItem(PERSIST_KEY);
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized);
    return { cart: parsed.cart };
  } catch {
    return undefined;
  }
};

export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      products: productsReducer,
    },
    preloadedState: loadState(),
  });

export const store = makeStore();

store.subscribe(() => saveState(store.getState()));

export default store;
