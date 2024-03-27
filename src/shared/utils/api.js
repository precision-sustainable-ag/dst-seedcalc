/* eslint-disable no-console */
const historyApiUrl = 'https://history.covercrop-data.org';

// get latest schema id
export const getSchemaId = async (accessToken = null) => {
  if (accessToken === null) return null;
  const url = `${historyApiUrl}/v1/services/2/schema`;
  const config = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  let schemaId = null;
  try {
    const data = await fetch(url, config).then((res) => res.json());
    schemaId = data.data.id;
  } catch (err) {
    console.log('error trying to get schema ID: ', err);
  }
  return schemaId;
};

export const postHistory = async (accessToken = null, historyData = null) => {
  const schemaId = await getSchemaId(accessToken);
  const url = `${historyApiUrl}/v1/history`;
  console.log(historyData);
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
  console.log('config', config);
  return (
    fetch(url, config)
      .then((res) => res.json())
      .catch((err) => console.log(err))
  );
};
