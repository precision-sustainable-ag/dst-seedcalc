import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
const initialState = {
  loading: false,
  value: {
    siteCondition: {
      state: "",
      county: "",
      soilDrainage: "",
      plannedPlantingDate: dayjs(new Date()),
      acres: 0,
      checkNRCSStandareds: false,
    },
    speciesSelection: {
      queryString: "",
      queryResults: [],
    },
    mixRatios: {
      poundsOfSeed: 0,
      plantsPerAcre: 0,
    },
    mixSeedingRate: {},
    seedTagInfo: {},
    reviewMix: {},
    confirmPlan: {},
  },
  etc: {},
};
export const stepSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    updateSteps: (state, action) => {
      const payload = action.payload;
      const existingState = JSON.parse(JSON.stringify(state));
      existingState.value[payload.type][payload.key] = payload.value;
      return { ...existingState };
    },
  },
});

export const { updateSteps } = stepSlice.actions;
export default stepSlice.reducer;
