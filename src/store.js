import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./features/filterSlice.js";
import siteConditionSlice from "./features/siteConditionSlice.js";
import stepSlice from "./features/stepSlice.js";

export const store = configureStore({
  reducer: {
    siteCondition: siteConditionSlice,
    filter: filterSlice,
    steps: stepSlice,
  },
});
