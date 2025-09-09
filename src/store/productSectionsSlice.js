import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../services/apiService';

const initialPagedState = { items: [], status: 'idle', error: null, page: 1, limit: 8, hasMore: true };

export const fetchFeaturedProducts = createAsyncThunk(
  'productSections/fetchFeatured',
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const res = await productService.getFeaturedProducts({ page, limit });
      const products = res?.products ?? res?.data ?? res?.items ?? res ?? [];
      const hasMore = !!(res?.hasMore ?? (Array.isArray(products) && products.length === limit));
      return { products, page, limit, hasMore };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchPromoProducts = createAsyncThunk(
  'productSections/fetchPromo',
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const res = await productService.getPromoProducts({ page, limit });
      const products = res?.products ?? res?.data ?? res?.items ?? res ?? [];
      const hasMore = !!(res?.hasMore ?? (Array.isArray(products) && products.length === limit));
      return { products, page, limit, hasMore };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch promo products');
    }
  }
);

export const fetchBestSellingProducts = createAsyncThunk(
  'productSections/fetchBestSelling',
  async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
    try {
      const res = await productService.getBestSellingProducts({ page, limit });
      const products = res?.products ?? res?.data ?? res?.items ?? res ?? [];
      const hasMore = !!(res?.hasMore ?? (Array.isArray(products) && products.length === limit));
      return { products, page, limit, hasMore };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch best-selling products');
    }
  }
);

const productSectionsSlice = createSlice({
  name: 'productSections',
  initialState: {
    featured: { ...initialPagedState },
    promo: { ...initialPagedState },
    bestSelling: { ...initialPagedState },
  },
  reducers: {
    resetSections: (state) => {
      state.featured = { ...initialPagedState };
      state.promo = { ...initialPagedState };
      state.bestSelling = { ...initialPagedState };
    },
  },
  extraReducers: (builder) => {
    const handleCases = (thunk, key) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[key].status = 'loading';
          state[key].error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          const { products, page, limit, hasMore } = action.payload;
          state[key].status = 'succeeded';
          state[key].page = page;
          state[key].limit = limit;
          state[key].hasMore = hasMore;
          state[key].items = page === 1 ? products : [...state[key].items, ...products];
        })
        .addCase(thunk.rejected, (state, action) => {
          state[key].status = 'failed';
          state[key].error = action.payload || action.error?.message || 'Request failed';
        });
    };

    handleCases(fetchFeaturedProducts, 'featured');
    handleCases(fetchPromoProducts, 'promo');
    handleCases(fetchBestSellingProducts, 'bestSelling');
  },
});

export const { resetSections } = productSectionsSlice.actions;

export const selectFeatured = (state) => state.productSections.featured;
export const selectPromo = (state) => state.productSections.promo;
export const selectBestSelling = (state) => state.productSections.bestSelling;

export default productSectionsSlice.reducer;
