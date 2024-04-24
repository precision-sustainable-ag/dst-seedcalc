const {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_AUDIENCE,
  USER_HISTORY_API_URL,
  USER_HISTORY_SCHEMA,
} = process.env;

export const auth0Domain = REACT_APP_AUTH0_DOMAIN;
export const auth0ClientId = REACT_APP_AUTH0_CLIENT_ID;
export const auth0Audience = REACT_APP_AUTH0_AUDIENCE;
export const userHistoryApiUrl = USER_HISTORY_API_URL;
export const userHistorySchema = USER_HISTORY_SCHEMA;
