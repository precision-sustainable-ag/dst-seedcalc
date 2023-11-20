import { configureStore } from '@reduxjs/toolkit';
import { filterSlice } from './features/filterSlice';
import { stepSlice } from './features/stepSlice/index';
import siteConditionSlice from './features/siteConditionSlice';

const store = configureStore({
  reducer: {
    filter: filterSlice.reducer,
    steps: stepSlice.reducer,
    siteCondition: siteConditionSlice.reducer,
  },
});

export default store;
