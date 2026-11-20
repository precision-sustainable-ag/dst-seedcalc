import { createAsyncThunk } from '@reduxjs/toolkit';
import apiBaseURL from '../../shared/utils/apiBaseURL';

// api to get all states
export const getLocality = createAsyncThunk(
  'siteCondition/getLocality',
  async () => {
    const url = `${apiBaseURL}/v3/states?context=seed_calc`;
    const res = await fetch(url).then((data) => data.json());
    return res.data;
  },
);

// api to get all regions(counties/zones) of a state
export const getRegion = createAsyncThunk(
  'siteCondition/getRegion',
  async ({ stateId }) => {
    const url = `${apiBaseURL}/v3/regions/${stateId}`;
    const res = await fetch(url).then((data) => data.json());
    return res;
  },
);

export const getDrainageClass = createAsyncThunk(
  'siteCondition/getDrainageClass',
  async ({ lat, lon }) => {
    const url = `https://ssurgo.covercrop-data.org/?lat=${lat}&lon=${lon}&categories=clear,+muaggatt&output=json`;
    const res = await fetch(url).then((data) => data.json());
    const row = Array.isArray(res) ? res[0] : res;
    return row?.drclassdcd ?? '';
  },
);

export const getZoneData = createAsyncThunk(
  'siteCondition/getZoneData',
  async ({ latitude, longitude }) => {
    const url = `https://weather.covercrop-data.org/hardinesszone?lat=${latitude}&lon=${longitude}`;
    const res = await fetch(url).then((data) => data.json());
    return res.zone;
  },
);
