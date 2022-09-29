import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./features/filterSlice.js";
import stepSlice from "./features/stepSlice.js";

export const store = configureStore({
  reducer: {
    filter: filterSlice,
    steps: stepSlice,
  },
});
