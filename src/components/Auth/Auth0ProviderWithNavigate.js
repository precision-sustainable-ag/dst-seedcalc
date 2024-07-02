import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth0Domain, auth0ClientId, auth0Audience } from '../../shared/data/keys';

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(auth0Domain && auth0ClientId && auth0Audience)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        audience: auth0Audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens
      // solve the problem that Firefox is not auto login
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
