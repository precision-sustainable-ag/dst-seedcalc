const {
  VITE_API_AUTH0_DOMAIN,
  VITE_API_AUTH0_CLIENT_ID,
  VITE_API_AUTH0_AUDIENCE,
  VITE_API_USER_HISTORY_API_URL,
  VITE_API_USER_HISTORY_SCHEMA,
  VITE_API_RELEASE_NOTES_URL,
  VITE_API_MAPBOX_TOKEN,
} = import.meta.env;

export const auth0Domain = VITE_API_AUTH0_DOMAIN;
export const auth0ClientId = VITE_API_AUTH0_CLIENT_ID;
export const auth0Audience = VITE_API_AUTH0_AUDIENCE;
export const userHistoryApiUrl = VITE_API_USER_HISTORY_API_URL;
export const userHistorySchema = VITE_API_USER_HISTORY_SCHEMA;
export const releaseNotesUrl = VITE_API_RELEASE_NOTES_URL;
export const mapboxToken = VITE_API_MAPBOX_TOKEN;
