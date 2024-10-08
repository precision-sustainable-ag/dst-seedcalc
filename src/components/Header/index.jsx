import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const Header = () => {
  const navigate = useNavigate();
  const { council } = useSelector((state) => state.siteCondition);

  const headerLogo = () => {
    if (council === '') return './PSALogo.png';
    if (council === 'MCCC') return './mccc-logo.png';
    if (council === 'NECCC') return './neccc-logo.png';
    if (council === 'SCCC') return './sccc_logo.png';
    return undefined;
  };

  return (
    <Grid
      container
      paddingTop="0.625rem"
      height="85px"
      justifyContent="center"
    >
      <Grid
        item
        xs={9}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={() => navigate('/')}>
          <img
            alt={council}
            src={headerLogo()}
            height="75px"
            data-test="header_logo"
          />
        </Button>
        <Typography variant="dstHeader" pl="1rem" data-test="page_caption">
          Seeding Rate Calculator
        </Typography>
      </Grid>
      <Grid item xs={3} md={6}>
        <NavBar />
      </Grid>
    </Grid>

  );
};
export default Header;
