/*
  This file contains the Button with authorization functions.
  The authorization functions includes Login, SignUp and LogOut, you can also define custom onClick callbacks and use it like a normal MUI Button.
*/

import { Button, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const AuthButton = ({
  type, variant = 'text', onClickCallback = () => {},
}) => {
  const { logout, loginWithPopup } = useAuth0();

  const handleLogin = async () => {
    await loginWithPopup();
  };

  const handleSignUp = async () => {
    await loginWithPopup({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const handleClick = () => {
    switch (type) {
      case 'Login':
        return handleLogin();
      case 'Signup':
        return handleSignUp();
      case 'Logout':
        return handleLogout();
      default:
        return onClickCallback();
    }
  };

  const getColor = () => {
    switch (type) {
      case 'Login':
        return '#add08f';
      case 'Signup':
        return 'purple';
      case 'Logout':
        return 'salmon';
      default:
        return 'black';
    }
  };

  return (
    <Button variant={variant} onClick={handleClick}>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }} color={getColor()}>
        {type}
      </Typography>
    </Button>
  );
};

export default AuthButton;
