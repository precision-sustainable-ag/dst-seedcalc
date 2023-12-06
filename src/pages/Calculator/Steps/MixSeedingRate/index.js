/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import {
  Typography, Slider, Stack, SliderThumb,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { MenuRounded } from '@mui/icons-material';

import { setMixSeedingRateRedux, setOptionRedux } from '../../../../features/calculatorSlice/actions';
import '../steps.scss';

const CustomThumb = (props) => {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <MenuRounded />
    </SliderThumb>
  );
};

const MixSeedingSlider = styled(Slider)(({
  theme,
}) => ({
  '&.MuiSlider-root': {
    zIndex: 0,
    position: 'relative',
    padding: '0 13px',
  },
  '& .MuiSlider-thumb': {
    zIndex: 2,
    height: 30,
    width: 30,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
  },
  '& .MuiSlider-valueLabelOpen': {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    paddingRight: '0.5rem',
  },
  '& .MuiSlider-mark': {
    width: '0',
    height: '0',
    pointerEvents: 'none',
    '&::after': {
      position: 'absolute',
      content: '""',
      width: '6rem',
      color: theme.palette.primary.text,
      borderTop: '2px dotted',
    },
    '&Label': {
      pointerEvents: 'none',
      left: '6rem',
      color: theme.palette.primary.text,
      border: '2px solid',
      borderRadius: '1rem',
      padding: '0.5rem',
      backgroundColor: 'white',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'flex',
      whiteSpace: 'normal',
      width: '5rem',
    },
  },
  '& .MuiSlider-rail': {
    zIndex: 1,
    opacity: 1,
    color: theme.palette.primary.dark,
    width: '1rem',
  },
  '& .MuiSlider-track': {
    color: theme.palette.primary.text,
    zIndex: 2,
    position: 'absolute',
    width: ' 1rem',
  },
}));

const MixSeedingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.text,
  fontSize: '0.75rem',
  fontWeight: '600',
  lineHeight: '0.9375rem',
  border: '2px solid #4f5f30',
  padding: '0.5rem',
  borderRadius: '1rem',
}));

const MixSeedingRate = ({ calculator }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [adjustedMixSeedingRate, setAdjustedMixSeedingRate] = useState(0);
  const [marks, setMarks] = useState([]);

  const { seedsSelected, options, mixSeedingRate } = useSelector((state) => state.calculator);

  /// ///////////////////////////////////////////////////////
  //                    State Logic                       //
  /// ///////////////////////////////////////////////////////

  const updateManagementImpactOnMix = () => {
    const managementImpactOnMix = parseFloat((adjustedMixSeedingRate / mixSeedingRate - 1).toFixed(2));
    // TODO: new calculator redux here, but the calculation method should be investigated
    seedsSelected.forEach((seed) => {
      const prevOptions = options[seed.label];
      dispatch(setOptionRedux(seed.label, { ...prevOptions, managementImpactOnMix }));
    });
  };

  /// ///////////////////////////////////////////////////////
  //                    useEffect                         //
  /// ///////////////////////////////////////////////////////

  // FIXME: need verification for calaulating these
  useEffect(() => {
    let sum = mixSeedingRate;
    // if first time visit this page, calculate initial mix seeding rate
    if (!mixSeedingRate) {
      seedsSelected.forEach((seed) => {
        sum += calculator.seedingRate(seed, options[seed.label]);
      });
      dispatch(setMixSeedingRateRedux(Math.round(sum)));
    }

    const minimum = Math.round(sum - sum / 2);
    const maximum = Math.round(sum + sum / 2);
    const adjustedRate = Math.round(sum);
    setMin(minimum);
    setMax(maximum);
    setAdjustedMixSeedingRate(adjustedRate);
    setMarks([
      {
        value: minimum,
        label: 'Low Limit',
      },
      {
        value: adjustedRate,
        label: 'Calculated',
      },
      {
        value: maximum,
        label: 'High Limit',
      },
    ]);
    // initially set management impact to 0
    // if this value has been set before, do not set again
    if (options[seedsSelected[0].label].managementImpactOnMix) return;
    updateManagementImpactOnMix();
  }, []);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Adjust Seeding Rate of Mix</Typography>
      </Grid>
      <Grid container sx={{ padding: '3% 3%' }}>
        <Grid
          container
          item
          xs={4}
          sm={5}
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <MixSeedingTypography>
            Factors that may raise Seeding Rate:
            <br />
            - Erosion Control
            <br />
            - Weed Supression
            <br />
            - Grazing
          </MixSeedingTypography>

          <MixSeedingTypography>
            Factors that lower Seeding Rate:
            <br />
            - Cost Saving
            <br />
            - Low Biomass
            <br />
            - Planting Green
          </MixSeedingTypography>
        </Grid>
        <Grid
          container
          item
          xs={8}
          sm={7}
          justifyContent="flex-start"
          alignItems="center"
          minHeight="28rem"
          pl="3rem"
        >
          <Stack sx={{ height: '100%' }}>
            <Typography
              width="30px"
              fontWeight="bold"
              fontSize="1.25rem"
            >
              {max}
            </Typography>
            <MixSeedingSlider
              orientation="vertical"
              min={min}
              max={max}
              value={adjustedMixSeedingRate}
              valueLabelDisplay="on"
              onChange={(e) => setAdjustedMixSeedingRate(e.target.value)}
              onChangeCommitted={updateManagementImpactOnMix}
              marks={marks}
              theme={theme}
              slots={{ thumb: CustomThumb }}
            />
            <Typography
              width="30px"
              fontWeight="bold"
              fontSize="1.25rem"
            >
              {min}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixSeedingRate;
