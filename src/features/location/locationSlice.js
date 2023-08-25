import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  value: {
    longitude: 0,
    latitude: 0,
    county: "",
    council: "",
  },
};
