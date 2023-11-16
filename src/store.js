import { configureStore } from '@reduxjs/toolkit';
import { filterSlice } from './features/filterSlice';
import { stepSlice } from './features/stepSlice/index';

const store = configureStore({
  reducer: {
    filter: filterSlice,
    steps: stepSlice,
  },
});

export default store;
