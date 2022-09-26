import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  value: {
    stateAndCounty: "",
    soilDrainage: "",
    plannedPlantingDate: "",
    Acres: 0,
    checkNRCSStandareds: false,
  },
  etc: {},
};
export const siteConditionSlice = createSlice({
  name: "siteCondition",
  initialState,
  reducers: {
    updateSiteCondition: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateSiteCondition } = siteConditionSlice.actions;
export default siteConditionSlice.reducer;
