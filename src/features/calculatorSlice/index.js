import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    addSeed: (state, { payload }) => {
      const { seed } = payload;
      return { ...state, seedsSelected: [...state.seedsSelected, seed] };
    },
    // removeSeed: (state, { payload }) => {
    //   const { seedName } = payload;

    // },
  },
});

export default calculatorSlice;
