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

export const postHistory = async (accessToken = null, historyData = null) => {
  const schemaId = userHistorySchema;
  const url = `${historyApiUrl}/history`;
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      json: historyData,
      schemaId,
    }),
  };
  return (
    fetch(url, config)
      .then((res) => res.json())
      // TODO: add err msg to alert
      .catch((err) => console.log(err))
  );
};

// export const updateHistory = async (accessToken = null, historyData = null) => {

// }

export const getHistories = async (accessToken = null) => {
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
