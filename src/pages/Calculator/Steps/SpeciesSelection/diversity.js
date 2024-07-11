/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import { seedsLabel } from '../../../../shared/data/species';
import '../steps.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Diversity = () => {
  const { seedsSelected, diversitySelected } = useSelector((state) => state.calculator);

  const diversityGroupLength = diversitySelected.map(
    (diversity) => seedsSelected.filter((seed) => seed.group.label === diversity).length,
  );

  return (
    <Grid container sx={{ height: '80px' }}>
      <Typography pt="1rem" fontWeight={600}>
        Mix Diversity
      </Typography>
      <Box sx={{ width: '100%', p: '5px 0' }}>
        <Box
          sx={{
            height: '10px',
            border: '#e5e5e5 1px solid',
            borderRadius: '0.6875rem',
            display: 'flex',
          }}
        >
          {diversitySelected.length > 0
            && diversitySelected.map((d, i) => (
              <Box
                sx={{ bgcolor: `${COLORS[i]}`, flex: `${diversityGroupLength[i]}` }}
                borderRadius="0.6875rem"
                key={i}
              />
            ))}
        </Box>
      </Box>

      {diversitySelected.length === 0 && (
        <Grid item xs={12}>
          <Typography fontSize="0.75rem">Select a species</Typography>
        </Grid>
      )}

      {diversitySelected.length > 0
        && diversitySelected.map((d, i) => (
          <Box
            sx={{ flex: `${diversityGroupLength[i]}` }}
            key={i}
          >
            <Typography fontSize="0.75rem">{seedsLabel[d]}</Typography>
          </Box>
        ))}
    </Grid>
  );
};

export default Diversity;
