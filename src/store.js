import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./features/filterSlice.js";
import stepSlice from "./features/stepSlice/index.js";
import locationSlice from "./features/location/locationSlice";
export const store = configureStore({
  reducer: {
    filter: filterSlice,
    steps: stepSlice,
  },
});
