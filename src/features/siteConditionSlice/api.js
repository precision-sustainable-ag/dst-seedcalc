import { createAsyncThunk } from '@reduxjs/toolkit';
import apiBaseURL from '../../shared/utils/apiBaseURL';

// api to get all states
export const getLocality = createAsyncThunk(
  'siteCondition/getLocality',
  async () => {
    const url = `${apiBaseURL}/v2/regions?locality=state&context=seed_calc`;
    const res = await fetch(url).then((data) => data.json());
    return res.data;
  },
);

// api to get all regions(counties/zones) of a state
export const getRegion = createAsyncThunk(
  'siteCondition/getRegion',
  async ({ stateId }) => {
    const url = `${apiBaseURL}/v2/regions/${stateId}`;
    const res = await fetch(url).then((data) => data.json());
    return res;
  },
);

export const getSSURGOData = createAsyncThunk(
  'siteCondition/getSSURGOData',
  async ({ lat, lon }) => {
    // eslint-disable-next-line max-len
    const soilDataQuery = `SELECT mu.mukey AS MUKEY, mu.muname AS mapUnitName, muag.drclassdcd AS drainageClass, muag.flodfreqdcd AS floodingFrequency, mp.mupolygonkey as MPKEY
    FROM mapunit AS mu 
    INNER JOIN muaggatt AS muag ON muag.mukey = mu.mukey
    INNER JOIN mupolygon AS mp ON mp.mukey = mu.mukey
    WHERE mu.mukey IN (SELECT * from SDA_Get_Mukey_from_intersection_with_WktWgs84('point (${lon} ${lat})'))
    AND
    mp.mupolygonkey IN  (SELECT * from SDA_Get_Mupolygonkey_from_intersection_with_WktWgs84('point (${lon} ${lat})'))`;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('query', soilDataQuery);
    urlencoded.append('format', 'json+columnname');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    const url = 'https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest';
    const res = await fetch(url, requestOptions).then((data) => data.json());

    return res;
  },
);

export const getZoneData = createAsyncThunk(
  'siteCondition/getZoneData',
  async ({ zip }) => {
    const url = `https://phzmapi.org/${zip}.json`;
    const res = await fetch(url).then((data) => data.json());
    return res.zone;
  },
);
