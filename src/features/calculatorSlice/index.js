import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import { getCrops } from './api';

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
    setMixRatioOption: (state, { payload }) => {
      const { seedLabel, option } = payload;
      return { ...state, mixRatioOptions: { ...state.mixRatioOptions, [seedLabel]: option } };
    },
    removeOption: (state, { payload }) => {
      const { seedLabel } = payload;
      // restOptions is the options object without the removed seed's option
      const { [seedLabel]: removedOption, ...restOptions } = state.options;
      return { ...state, options: { ...restOptions } };
    },
    removeMixRatioOption: (state, { payload }) => {
      const { seedLabel } = payload;
      const { [seedLabel]: removedOption, ...restOptions } = state.mixRatioOptions;
      return { ...state, mixRatioOptions: { ...restOptions } };
    },
    updateDiversity: (state, { payload }) => {
      const { diversity } = payload;
      return { ...state, diversitySelected: diversity };
    },
    clearSeeds: (state) => ({ ...state, seedsSelected: [] }),
    clearOptions: (state) => ({ ...state, options: {} }),
    selectSidebarSeed: (state, { payload }) => {
      const { seed } = payload;
      return { ...state, sideBarSelection: seed };
    },
    setMixSeedingRate: (state, { payload }) => {
      const { mixSeedingRate } = payload;
      return { ...state, mixSeedingRate };
    },
    setAdjustedMixSeedingRate: (state, { payload }) => {
      const { adjustedMixSeedingRate } = payload;
      return { ...state, adjustedMixSeedingRate };
    },
    setBulkSeedingRate: (state, { payload }) => {
      const { bulkSeedingRate } = payload;
      return { ...state, bulkSeedingRate };
    },
    importFromCSV: (state, { payload }) => {
      const { csvData } = payload;
      return { ...csvData };
    },
    selectUnit: (state, { payload }) => {
      const { unit } = payload;
      return { ...state, unit };
    },
    resetCalculator: () => initialState,
    setSeedingMethods: (state, { payload }) => {
      const { seedingMethods } = payload;
      return { ...state, seedingMethods };
    },
    setCalculator: (state, { payload }) => {
      const { calculator } = payload;
      return { ...state, ...calculator };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCrops.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getCrops.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.crops = payload.data;
        state.error = false;
      })
      .addCase(getCrops.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  addSeed, removeSeed, setOption, setMixRatioOption, removeOption, removeMixRatioOption, updateDiversity,
  clearSeeds, clearOptions, selectSidebarSeed, setMixSeedingRate,
  setBulkSeedingRate, setAdjustedMixSeedingRate, importFromCSV,
  selectUnit, resetCalculator, setSeedingMethods, setCalculator,
} = calculatorSlice.actions;

export default calculatorSlice;
