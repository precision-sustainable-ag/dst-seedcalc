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
      return {
        ...state, seedsSelected: [...state.seedsSelected, seed],
      };
    },
    removeSeed: (state, { payload }) => {
      const { seedName } = payload;
      return {
        ...state, seedsSelected: [...state.seedsSelected].filter((seed) => seed.label !== seedName),
      };
    },
    setOption: (state, { payload }) => {
      const { seedLabel, option } = payload;
      return { ...state, options: { ...state.options, [seedLabel]: option } };
    },
    removeOption: (state, { payload }) => {
      const { seedLabel } = payload;
      // restOptions is the options object without the removed seed's option
      const { [seedLabel]: removedOption, ...restOptions } = state.options;
      return { ...state, options: { ...restOptions } };
    },
  },
});

export const {
  setCalculator, addSeed, removeSeed, setOption, removeOption,
} = calculatorSlice.actions;

export default calculatorSlice;
