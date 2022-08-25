import { configureStore } from '@reduxjs/toolkit';
import filterSlice from "./features/filter/filterSlice.js";

export const store = configureStore({
    reducer: {
        filter: filterSlice
    },
});
