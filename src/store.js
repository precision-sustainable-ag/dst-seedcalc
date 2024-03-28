import { configureStore } from '@reduxjs/toolkit';
import siteConditionSlice from './features/siteConditionSlice';
import calculatorSlice from './features/calculatorSlice';
import userSlice from './features/userSlice';

const store = configureStore({
  reducer: {
    siteCondition: siteConditionSlice.reducer,
    calculator: calculatorSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
