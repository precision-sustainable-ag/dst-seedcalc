import { createSlice } from "@reduxjs/toolkit";

import {
  getCrops,
  getCropsById,
  getLocality,
  getRegion,
  getSSURGOData,
  getZoneData,
} from "./api";
import { initialState } from "./state";
import { soilDrainage } from "../../shared/data/dropdown";

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
      state.loading = "getCrops";
      state.error = false;
    },
    [getCrops.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.value.crops = payload.data;
      state.error = false;
    },
    [getCrops.rejected]: (state) => {
      state.loading = false;
      state.error = true;
    },
    [getCropsById.pending]: (state) => {
      state.loading = true;
      state.error = false;
    },
    [getCropsById.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.error = false;
    },
    [getCropsById.rejected]: (state) => {
      state.loading = false;
      state.error = false;
    },
    [getSSURGOData.pending]: (state) => {
      state.loading = true;
      state.error = false;
    },
    [getSSURGOData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      const string = payload.Table[1][2] !== null ? payload.Table[1][2] : "";
      const checkSoilDrainage = soilDrainage.filter(
        (a) => a.label.toLowerCase() === string.toLowerCase()
      );
      const dropdownVal =
        string !== "" && checkSoilDrainage.length > 0
          ? checkSoilDrainage[0].label
          : "";
      state.value.siteCondition.soilDrainage = dropdownVal;
      state.error = false;
    },
    [getSSURGOData.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = true;
    },
    [getLocality.pending]: (state) => {
      state.loading = "getLocality";
      state.error = false;
    },
    [getLocality.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.value.states = payload;
      state.error = false;
    },
    [getLocality.rejected]: (state) => {
      state.loading = false;
      state.error = true;
    },
    [getRegion.pending]: (state) => {
      state.loading = true;
      state.error = false;
    },
    [getRegion.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.value.counties =
        payload.data.kids.Zones !== undefined
          ? payload.data.kids.Zones
          : payload.data.kids.Counties !== undefined
          ? payload.data.kids.Counties
          : [];
      state.error = false;
    },
    [getRegion.rejected]: (state) => {
      state.loading = false;
      state.error = true;
    },
    [getZoneData.pending]: (state) => {
      state.loading = true;
      state.error = false;
    },
    [getZoneData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // only set Zone if not MCCC state.
      if (state.value.siteCondition.state !== "Indiana") {
        state.value.siteCondition.county =
          "Zone " + payload.replace(/[^0-9]/g, "");
      }
      state.error = false;
    },
    [getZoneData.rejected]: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { updateModal, clearModal, updateSteps, updateAllSteps } =
  stepSlice.actions;
export default stepSlice.reducer;
