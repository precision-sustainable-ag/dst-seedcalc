import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import { getCropsNew } from './api';

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
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
    updateDiversity: (state, { payload }) => {
      const { diversity } = payload;
      return { ...state, diversitySelected: diversity };
    },
    clearSeeds: (state) => ({ ...state, seedsSelected: [] }),
    clearOptions: (state) => ({ ...state, options: {} }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCropsNew.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCropsNew.fulfilled, (state, { payload }) => {
        state.loading = false;
        // console.log('getCrops', payload);
        state.crops = payload.data;
        state.error = false;
      })
      .addCase(getCropsNew.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  addSeed, removeSeed, setOption, removeOption, updateDiversity, clearSeeds, clearOptions,
} = calculatorSlice.actions;

export default calculatorSlice;
