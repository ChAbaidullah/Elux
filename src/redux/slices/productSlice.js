import { createSlice } from '@reduxjs/toolkit';
import productsData from '@/data/products';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    all: productsData,
    query: '',
    category: 'All',
  },
  reducers: {
    setQuery: (state, { payload }) => { state.query = payload; },
    setCategory: (state, { payload }) => { state.category = payload; },
  },
});

export const { setQuery, setCategory } = productSlice.actions;
export default productSlice.reducer;
