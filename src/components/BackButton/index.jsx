import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname !== '/') {
    return (
      <Button variant="contained" sx={{ margin: '16px 0' }} onClick={() => navigate('/')}>Back to Calculator</Button>
    );
  }
  return null;
};

export default BackButton;
