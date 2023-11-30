import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
// import { getZoneData } from './api';

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
      return { ...state, checkNRCS };
    },
    updateCouncil: (state, { payload }) => {
      const { council } = payload;
      return { ...state, council };
    },
    updateSoilFertility: (state, { payload }) => {
      const { soilFertility } = payload;
      return { ...state, soilFertility };
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase([getZoneData.pending], (state) => {
  //       state.loading = true;
  //       state.error = false;
  //     })
  //     .addCase([getZoneData.fulfilled], (state, { payload }) => {
  //       state.loading = false;
  //       // only set Zone if not MCCC state.
  //       if (state.value.siteCondition.state !== 'Indiana') {
  //         state.value.siteCondition.county = `Zone ${payload.replace(/[^0-9]/g, '')}`;
  //       }
  //       state.error = false;
  //     })
  //     .addCase([getZoneData.rejected], (state) => {
  //       state.loading = false;
  //       state.error = true;
  //     });
  // },
});

export const {
  updateState, updateCounty, updateCountyId, updateSoilDrainage,
  updatePlantingDate, updateAcres, checkNRCS, updateCouncil, updateSoilFertility,
} = siteConditionSlice.actions;

export default siteConditionSlice;
