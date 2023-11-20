import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setCalculator: (state, { payload }) => {
      const { calculator } = payload;
      return { ...state, calculator };
    },
    addSeed: (state, { payload }) => {
      const { seed } = payload;
      return { ...state, seedsSelected: [...state.seedsSelected, seed] };
    },
    // removeSeed: (state, { payload }) => {
    //   const { seedName } = payload;

    // },
  },
});

export const { setCalculator, addSeed } = calculatorSlice.actions;

export default calculatorSlice;
