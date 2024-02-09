import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import { getLocalityNew, getRegionNew } from './api';

const siteConditionSlice = createSlice({
  name: 'siteCondition',
  initialState,
  reducers: {
    updateState: (state, { payload }) => {
      const { state: stateName, stateId } = payload;
      return { ...state, state: stateName, stateId };
    },
    updateCounty: (state, { payload }) => {
      const { county } = payload;
      return { ...state, county };
    },
    updateCountyId: (state, { payload }) => {
      const { countyId } = payload;
      return { ...state, countyId };
    },
    updateSoilDrainage: (state, { payload }) => {
      const { soilDrainage } = payload;
      return { ...state, soilDrainage };
    },
    updatePlantingDate: (state, { payload }) => {
      const { plantingDate } = payload;
      return { ...state, plantingDate };
    },
    updateAcres: (state, { payload }) => {
      const { acres } = payload;
      return { ...state, acres };
    },
    checkNRCS: (state, { payload }) => {
      const { checkNRCS } = payload;
      return { ...state, checkNRCSStandards: checkNRCS };
    },
    updateCouncil: (state, { payload }) => {
      const { council } = payload;
      return { ...state, council };
    },
    updateSoilFertility: (state, { payload }) => {
      const { soilFertility } = payload;
      return { ...state, soilFertility };
    },
    updateLatlon: (state, { payload }) => {
      const { latlon } = payload;
      return { ...state, latlon };
    },
    importFromCSV: (state, { payload }) => {
      const { csvData } = payload;
      return { ...csvData };
    },
    updateTileDrainage: (state, { payload }) => {
      const { tileDrainage } = payload;
      return { ...state, tileDrainage };
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocalityNew.pending, (state) => {
        state.loading = 'getLocality';
        state.error = false;
      })
      .addCase(getLocalityNew.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.states = payload;
        state.error = false;
      })
      .addCase(getLocalityNew.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(getRegionNew.pending, (state) => {
        state.loading = 'getRegion';
        state.error = false;
      })
      .addCase(getRegionNew.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.counties = payload.data.kids.Zones ?? payload.data.kids.Counties ?? [];
        state.error = false;
      })
      .addCase(getRegionNew.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  updateState, updateCounty, updateCountyId, updateSoilDrainage,
  updatePlantingDate, updateAcres, checkNRCS, updateCouncil, updateSoilFertility,
  updateLatlon, importFromCSV, updateTileDrainage,
} = siteConditionSlice.actions;

export default siteConditionSlice;
