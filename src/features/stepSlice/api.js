import { createAsyncThunk } from "@reduxjs/toolkit";

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
  async (thunkAPI) => {
    const url = `https://developapi.covercrop-selector.org/v2/regions?locality=state&context=seed_calc`;
    const res = await fetch(url).then((data) => data.json());
    return res.data;
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
