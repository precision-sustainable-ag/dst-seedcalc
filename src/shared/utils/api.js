/* eslint-disable no-console */
import { userHistoryApiUrl, userHistorySchema } from '../data/keys';

const historyApiUrl = `${userHistoryApiUrl}/v1`;

// TODO: two ways to handle error when fetching, another way is move these apis to redux toolkit
const fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Fetch Status: ${res.status} ${res.statusText}`);
    }
    // TODO: NOTE: there might be more res structure like res.text()
    return await res.json();
  } catch (error) {
    console.error('Error when fetching: ', error.message);
    throw error;
  }
};

export const createHistory = async (accessToken, historyData, name) => {
  const schemaId = userHistorySchema;
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
  try {
    const data = await fetchData(url, config);
    return data;
  } catch (err) {
    console.error('Error creating history: ', err);
    throw err;
  }
};

export const updateHistory = async (accessToken, historyData, name, id) => {
  const schemaId = userHistorySchema;
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
  try {
    const data = await fetchData(url, config);
    return data;
  } catch (err) {
    console.error('Error updating history: ', err);
    throw err;
  }
};

export const getHistories = async (accessToken) => {
  const url = `${historyApiUrl}/histories?schema=${userHistorySchema}`;
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const data = await fetchData(url, config);
    return data;
  } catch (err) {
    console.error('Error trying fetch histories: ', err);
    throw err;
  }
};
