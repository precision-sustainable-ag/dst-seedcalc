import { configureStore } from '@reduxjs/toolkit';
import { filterSlice } from './features/filterSlice';
import { stepSlice } from './features/stepSlice/index';

const store = configureStore({
  reducer: {
    filter: filterSlice.reducer,
    steps: stepSlice.reducer,
  },
});

export default store;
