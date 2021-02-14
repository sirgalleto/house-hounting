import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import housesReducer from '../features/houses/housesSlice';

export default configureStore({
  reducer: {
    houses: housesReducer,
    counter: counterReducer,
  },
});
