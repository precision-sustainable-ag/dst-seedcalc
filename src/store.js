import { configureStore } from '@reduxjs/toolkit';
import { filterSlice } from './features/filterSlice';
import { stepSlice } from './features/stepSlice/index';
import siteConditionSlice from './features/siteConditionSlice';
import calculatorSlice from './features/calculatorSlice';

const store = configureStore({
  reducer: {
    filter: filterSlice.reducer,
    steps: stepSlice.reducer,
    siteCondition: siteConditionSlice.reducer,
    calculator: calculatorSlice.reducer,
  },
});

export default store;
