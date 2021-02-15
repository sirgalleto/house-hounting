import { configureStore } from '@reduxjs/toolkit';
import housesReducer from '../features/houses/housesSlice';

export default configureStore({
  reducer: {
    houses: housesReducer,
  },
});
