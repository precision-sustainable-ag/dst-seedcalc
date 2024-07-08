/* eslint-disable no-nested-ternary */
import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';

import { seedsLabel } from '../../../../shared/data/species';
import '../steps.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Diversity = ({ diversitySelected }) => {
  const calculateSize = () => (diversitySelected.length === 1
    ? 12
    : diversitySelected.length === 2
      ? 6
      : diversitySelected.length >= 2 && diversitySelected.length < 4
        ? 4
        : 3);

  return (
    <Grid container sx={{ height: '80px' }}>
      <Typography pt="1rem" fontWeight={600}>
        Mix Diversity
      </Typography>
      <Box sx={{ width: '100%', p: '5px 0' }}>
        <Grid
          container
          sx={{
            height: '10px',
            border: '#e5e5e5 1px solid',
            borderRadius: '0.6875rem',
          }}
        >
          {diversitySelected.length > 0
            && diversitySelected.map((d, i) => (
              <Grid
                item
                xs={calculateSize()}
                bgcolor={COLORS[i]}
                borderRadius="0.6875rem"
                key={i}
              />
            ))}
        </Grid>
      </Box>

      {diversitySelected.length === 0 && (
        <Grid item xs={12}>
          <Typography fontSize="0.75rem">Select a species</Typography>
        </Grid>
      )}
      {diversitySelected.length > 0
        && diversitySelected.map((d, i) => (
          <Grid item xs={calculateSize()} key={i}>
            <Typography fontSize="0.75rem">{seedsLabel[d]}</Typography>
          </Grid>
        ))}
    </Grid>
  );
};

export default Diversity;
