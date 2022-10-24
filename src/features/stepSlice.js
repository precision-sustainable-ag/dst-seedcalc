import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
const initialState = {
  loading: false,
  error: false,
  errorMessage: "",
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
      diversitySelected: [],
      seedsSelected: [],
    },
    mixRatios: {
      poundsOfSeed: 0,
      plantsPerAcre: 0,
    },
    mixSeedingRate: {},
    seedTagInfo: {},
    reviewMix: {},
    confirmPlan: {},
    crops: [],
  },
  etc: {},
};

export const getCrops = createAsyncThunk(
  //action type string
  "steps/getCrops",
  // callback function
  async (thunkAPI) => {
    const res = await fetch("https://develop.covercrop-data.org/crops").then(
      (data) => data.json()
    );
    return res;
  }
);

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
  extraReducers: {
    [getCrops.pending]: (state) => {
      state.loading = true;
    },
    [getCrops.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.value.crops = payload.data;
    },
    [getCrops.rejected]: (state) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = "";
    },
  },
});

export const { updateSteps } = stepSlice.actions;
export default stepSlice.reducer;
