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
  async ({ stateId }, thunkAPI) => {
    const url = `https://developapi.covercrop-selector.org/v2/regions/${stateId}`;
    const res = await fetch(url).then((data) => data.json());
    return res;
  }
);

export const getSSURGOData = createAsyncThunk(
  "steps/getSSURGOData",
  async ({ lat, lon }, thunkAPI) => {
    const soilDataQuery = `SELECT mu.mukey AS MUKEY, mu.muname AS mapUnitName, muag.drclassdcd AS drainageClass, muag.flodfreqdcd AS floodingFrequency, mp.mupolygonkey as MPKEY
    FROM mapunit AS mu 
    INNER JOIN muaggatt AS muag ON muag.mukey = mu.mukey
    INNER JOIN mupolygon AS mp ON mp.mukey = mu.mukey
    WHERE mu.mukey IN (SELECT * from SDA_Get_Mukey_from_intersection_with_WktWgs84('point (${lon} ${lat})'))
    AND
    mp.mupolygonkey IN  (SELECT * from SDA_Get_Mupolygonkey_from_intersection_with_WktWgs84('point (${lon} ${lat})'))`;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("query", soilDataQuery);
    urlencoded.append("format", "json+columnname");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    const url = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest";
    const res = await fetch(url, requestOptions).then((data) => data.json());

    return res;
  }
);

export const getZoneData = createAsyncThunk(
  "steps/getZoneData",
  async ({ zip }, thunkAPI) => {
    const url = `https://phzmapi.org/${zip}.json`;
    const res = await fetch(url).then((data) => data.json());
    return res.zone;
  }
);
