import { fabClasses } from "@mui/material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  value: {
    modal: {
      loading: false,
      error: false,
      success: false,
      errorTitle: "",
      errorMessage: "",
      successTitle: "",
      successMessage: "",
      isOpen: false,
    },
    siteCondition: {
      state: "",
      county: "",
      soilDrainage: "",
      plannedPlantingDate: dayjs(new Date()),
      acres: 0,
      checkNRCSStandards: false,
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
    seedingMethod: { seedingRate: 11 },
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
/* 

Reducer Documentation: 

{
    name: updateSteps
    description: Update individual values in a step.
    params: {
        type: Specified step page to update (ex: speciesSelection)
        key: key value of the specific step object (ex: "d")
        value: new value for the key (ex: [{}]])
    }
}
*/
export const stepSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    updateSteps: (state, { payload }) => {
      // Update individual steps of specific seeds.
      // Payload format: {type, key, value}
      // ExistingState is a clone of the state, which you change the value and return as updated state
      const existingState = JSON.parse(JSON.stringify(state));
      existingState.value[payload.type][payload.key] = payload.value;
      return { ...existingState };
    },
    updateAllSteps: (state, { payload }) => {
      // Update ALL reducer values.
      // Only current scenario for this is when importing previous calculation
      // Payload format: {data}
      const existingState = JSON.parse(JSON.stringify(state));
      existingState.value = payload.value;
      return { ...existingState };
    },
    updateModal: (state, { payload }) => {
      const existingState = JSON.parse(JSON.stringify(state));
      existingState.value.modal = payload.value;
      console.log("pval", payload.value);
      console.log("existstate", existingState.value.modal);
      return { ...existingState };
    },
    clearModal: (state) => {
      const existingState = JSON.parse(JSON.stringify(state));
      existingState.value.modal = {
        loading: false,
        error: false,
        success: false,
        errorTitle: "",
        errorMessage: "",
        successTitle: "",
        successMessage: "",
        isOpen: false,
      };
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

export const { updateModal, clearModal, updateSteps, updateAllSteps } =
  stepSlice.actions;
export default stepSlice.reducer;
