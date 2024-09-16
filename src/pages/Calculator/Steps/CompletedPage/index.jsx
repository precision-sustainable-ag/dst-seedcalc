import React from 'react';
import {
  Typography, useMediaQuery, Grid,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Link } from 'react-router-dom';

const CompletedPage = () => {
  // themes
  const theme = useTheme();
  const matchesUpMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Grid container>
        <Grid xs={12} item sx={{ pt: '50px' }} justifyContent="center">
          <Typography>
            Thank you for trying out the Seeding Rate Calculator!
          </Typography>
        </Grid>

        <Grid xs={12} item sx={{ pt: '50px' }} justifyContent="center">
          <Typography sx={{ fontWeight: 600 }}>
            Questions or Comments?
          </Typography>
          <Link to="/feedback" data-test="link_to_feedback">
            <Typography style={{ textDecoration: 'underline' }}>
              Click here to leave feedback
            </Typography>
          </Link>
        </Grid>
      </Grid>

      <Grid container sx={{ pt: '150px' }}>
        <Grid xs={!matchesUpMd ? 6 : 3} item>
          <img
            alt="axilab"
            src="./axilab.png"
            width={!matchesUpMd ? '80%' : '50%'}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 6 : 3} item>
          <img
            alt="MCCC"
            src="./MCCCLogo.png"
            width={!matchesUpMd ? '80%' : '50%'}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 3 : 2} item>
          <img
            alt="PSA"
            src="./PSALogo.png"
            width={!matchesUpMd ? '80%' : '50%'}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 9 : 4} item>
          <img
            alt="NECCC"
            src="./NECCCWideLogo.png"
            width={!matchesUpMd ? '80%' : '50%'}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default CompletedPage;
