import { configureStore } from '@reduxjs/toolkit';
// import { stepSlice } from './features/stepSlice/index';
import siteConditionSlice from './features/siteConditionSlice';
import calculatorSlice from './features/calculatorSlice';

const store = configureStore({
  reducer: {
    // steps: stepSlice.reducer,
    siteCondition: siteConditionSlice.reducer,
    calculator: calculatorSlice.reducer,
  },
});

export default store;
