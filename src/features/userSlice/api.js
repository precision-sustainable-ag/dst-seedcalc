import { createAsyncThunk } from '@reduxjs/toolkit';
import { userHistoryApiUrl, userHistorySchema } from '../../shared/data/keys';

const historyApiUrl = `${userHistoryApiUrl}/v1`;

const fetchData = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Fetch Status: ${res.status} ${res.statusText}`);
  }
  // TODO: NOTE: there might be more res structure like res.text()
  const data = await res.json();
  return data;
};

export const createHistory = createAsyncThunk(
  'user/createHistory',
  async (accessToken, historyData, name) => {
    const schemaId = parseInt(userHistorySchema, 10);
    const url = `${historyApiUrl}/history`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        label: name,
        // TODO: decide whether to keep name here
        json: { name, ...historyData },
        schemaId,
      }),
    };
    const data = await fetchData(url, config);
    return data;
  },
);

export const updateHistory = createAsyncThunk(
  'user/updateHistory',
  async (accessToken, historyData, name, id) => {
    const schemaId = parseInt(userHistorySchema, 10);
    const url = `${historyApiUrl}/history/${id}`;
    const config = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        label: name,
        // TODO: decide whether to keep name here
        json: { name, ...historyData },
        schemaId,
      }),
    };
    const data = await fetchData(url, config);
    return data;
  },
);

export const getHistories = createAsyncThunk(
  'user/getHistories',
  async (accessToken) => {
    const url = `${historyApiUrl}/histories?schema=${userHistorySchema}`;
    const config = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const data = await fetchData(url, config);
    return data;
  },
);
