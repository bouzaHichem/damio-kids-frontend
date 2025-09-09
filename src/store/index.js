import { configureStore } from '@reduxjs/toolkit';
import productSectionsReducer from './productSectionsSlice';

const store = configureStore({
  reducer: {
    productSections: productSectionsReducer,
  },
});

export default store;
