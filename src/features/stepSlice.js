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
      stateId: "",
      county: "",
      countyId: "",
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
    NRCS: {
      enabled: false,
      results: {
        seedingRate: {
          value: true,
          seeds: [],
        },
        plantingDate: {
          value: true,
          seeds: [],
        },
        ratio: {
          value: true,
          seeds: [],
        },
        soilDrainage: {
          value: true,
          seeds: [],
        },
        expectedWinterSurvival: {
          value: 0,
          seeds: [],
        },
      },
    },
    mixSeedingRate: {},
    seedTagInfo: {},
    seedingMethod: {
      managementImpactOnMix: 0.5,
      min: 0,
      max: 0,
      seedingRateAverage: 0,
      seedingRateCoefficient: 0,
      type: "Drilled",
    },
    reviewMix: {},
    confirmPlan: {},
    states: [],
    counties: [],
    crops: [],
  },
  etc: {},
};

export const getCrops = createAsyncThunk(
  "steps/getCrops",
  async ({ regionId }, thunkAPI) => {
    const res = await fetch(
      `https://developapi.covercrop-selector.org/v2/crops/?regions=${regionId}&context=seed_calc`
    ).then((data) => data.json());
    return res;
  }
);

export const getCropsById = createAsyncThunk(
  "steps/getCropsById",
  async ({ cropId, regionId, countyId }, thunkAPI) => {
    const url = `https://developapi.covercrop-selector.org/v2/crops/${cropId}?regions=${regionId}&context=seed_calc&regions=${countyId}`;
    const res = await fetch(url).then((data) => data.json());
    return res;
  }
);

export const getLocality = createAsyncThunk(
  "steps/getLocality",
  async ({ type }, thunkAPI) => {
    const url = `https://developapi.covercrop-selector.org/v2/regions?locality=state&context=seed_calc&council=${type}`;
    const res = await fetch(url).then((data) => data.json());
    return res.data.filter((x) => x.parents[0].shorthand === type);
  }
);

export const getRegion = createAsyncThunk(
  "steps/getRegion",
  async ({ regionId }, thunkAPI) => {
    const url = `https://developapi.covercrop-selector.org/v2/regions/${regionId}`;
    const res = await fetch(url).then((data) => data.json());
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
      state.loading = false;
    },
    [getCrops.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.value.crops = payload.data;
      console.log("getCrops V2 fulfilled: ", payload.data);
    },
    [getCrops.rejected]: (state) => {
      state.loading = false;
      state.error = true;
    },
    [getCropsById.pending]: (state) => {
      state.loading = true;
    },
    [getCropsById.fulfilled]: (state, { payload }) => {
      state.loading = false;
      console.log("Get Crops By Id fulfilled: ", payload.data);
    },
    [getCropsById.rejected]: (state) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = "";
    },

    [getLocality.pending]: (state) => {
      state.loading = true;
    },
    [getLocality.fulfilled]: (state, { payload }) => {
      state.value.states = payload;
      console.log("fulfilled locality", payload.data);
    },
    [getLocality.rejected]: (state) => {
      state.loading = false;
    },
    [getRegion.pending]: (state) => {
      state.loading = true;
    },
    [getRegion.fulfilled]: (state, { payload }) => {
      state.value.counties =
        payload.data.kids.Zones !== undefined
          ? payload.data.kids.Zones
          : payload.data.kids.Counties !== undefined
          ? payload.data.kids.Counties
          : [];
      console.log("fulfilled counties", payload.data.kids.Zones);
    },
    [getRegion.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { updateModal, clearModal, updateSteps, updateAllSteps } =
  stepSlice.actions;
export default stepSlice.reducer;
