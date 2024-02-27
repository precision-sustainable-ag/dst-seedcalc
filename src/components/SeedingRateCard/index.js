import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Grid, Card, CardContent, CardMedia,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';

// const tooltipMCCC = {
//   mixSeedingRate: 'Seeding Rate in Mix = Default Single Species Seeding Rate PLS * Percent of Rate',
// };

// const tooltipNECCC = {
//   mixSeedingRate: 'Seeding Rate in Mix = Default Single Species Seeding Rate PLS *  Soil Fertility Modifier / Sum Species Of Group in Mix',
// };

const roundToMillionth = (num) => {
  const million = 10 ** 6;
  return Math.round(num * million) / million;
};

const UnitSelection = () => {
  const unit = useSelector((state) => state.calculator.unit);
  const dispatch = useDispatch();
  return (
    <>
      <Typography>
        Select data unit:
      </Typography>
      <Button
        variant={unit === 'acre' ? 'outlined' : 'contained'}
        onClick={() => dispatch(selectUnitRedux('sqft'))}
      >
        Sqft
      </Button>
      {'  '}
      <Button
        variant={unit === 'acre' ? 'contained' : 'outlined'}
        onClick={() => dispatch(selectUnitRedux('acre'))}
      >
        Acre
      </Button>
    </>
  );
};

const SeedInfo = ({
  seed, seedData, calculatorResult,
}) => {
  const [singleData, setSingleData] = useState({
    seedingRate: calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS,
    plantValue: seedData[seed.label].defaultPlant,
    seedValue: seedData[seed.label].defaultSeed,
  });
  const [mixData, setMixData] = useState({
    seedingRate: calculatorResult[seed.label].step1.seedingRate,
    plantValue: seedData[seed.label].adjustedPlant,
    seedValue: seedData[seed.label].adjustedSeed,
  });

  const { unit } = useSelector((state) => state.calculator);

  // eslint-disable-next-line no-nested-ternary
  const unitText = unit === 'acre' ? 'Acre' : unit === 'sqft' ? 'SqFt' : '';

  useEffect(() => {
    if (unit === 'sqft') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate: roundToMillionth(calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS / 43560),
        plantValue: twoDigit(seedData[seed.label].defaultPlant / 43560),
        seedValue: twoDigit(seedData[seed.label].defaultSeed / 43560),
      }));
      setMixData({
        seedingRate: roundToMillionth(calculatorResult[seed.label].step1.seedingRate / 43560),
        plantValue: twoDigit(seedData[seed.label].adjustedPlant / 43560),
        seedValue: twoDigit(seedData[seed.label].adjustedSeed / 43560),
      });
    } else if (unit === 'acre') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate: calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS,
        plantValue: seedData[seed.label].defaultPlant,
        seedValue: seedData[seed.label].defaultSeed,
      }));
      setMixData({
        seedingRate: calculatorResult[seed.label].step1.seedingRate,
        plantValue: seedData[seed.label].adjustedPlant,
        seedValue: seedData[seed.label].adjustedSeed,
      });
    }
  }, [seedData, calculatorResult, unit]);

  return (
    <Grid container p="0 5%">
      <Grid item xs={4}>
        <Card
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            width: '160px',
          }}
        >
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }}>
              {seed.label}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            height="160px"
            image={
                  seed.thumbnail
                  ?? 'https://placehold.it/250x150?text=Placeholder'
                }
            alt={seed.label}
            sx={{ border: '2px solid green', borderRadius: '1rem' }}
          />
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Default Single Species Seeding Rate PLS"
              value={singleData.seedingRate}
              unit={unit === 'acre' ? '1000Acres' : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Approx Plants"
              value={singleData.plantValue}
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Seeds"
              value={singleData.seedValue}
              unit={unitText}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Seeding Rate in Mix"
              value={mixData.seedingRate}
              unit={unit === 'acre' ? '1000Acres' : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Approx Plants"
              value={mixData.plantValue}
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              label="Seeds"
              value={mixData.seedValue}
              unit={unitText}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign="left">% of Single Species Rate</Typography>
          {/* <Slider /> */}
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign="left">% Survival</Typography>
          {/* <Slider /> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

const SeedingRateChip = ({ label, value, unit }) => (
  <>
    <Box
      sx={{
        width: '110px',
        height: '50px',
        padding: '11px',
        margin: '0 auto',
        backgroundColor: '#E5E7D5',
        border: '#C7C7C7 solid 1px',
        borderRadius: '16px',
      }}
    >
      <Typography>{value}</Typography>
    </Box>
    <Box sx={{ height: '2rem' }}>
      <Typography lineHeight="1rem" fontSize="0.8rem">
        {label}
        {` per ${unit}`}
      </Typography>
    </Box>

  </>
);

const SeedingRateCard = ({
  seedingRateLabel, seedingRateValue, plantValue, seedValue,
}) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState({ plantValue, seedValue, seedingRateValue });

  const unit = useSelector((state) => state.calculator.unit);

  // eslint-disable-next-line no-nested-ternary
  const unitText = unit === 'acre' ? 'Acre' : unit === 'sqft' ? 'SqFt' : '';

  useEffect(() => {
    if (unit === 'sqft') {
      setDisplayValue({
        plantValue: plantValue / 43560,
        seedValue: seedValue / 43560,
        seedingRateValue: roundToMillionth(seedingRateValue / 43560),
      });
    } else if (unit === 'acre') {
      setDisplayValue({ plantValue, seedValue, seedingRateValue });
    }
  }, [plantValue, seedValue, seedingRateValue, unit]);

  return (
    <>
      <Typography display="flex" alignItems="center" justifyContent="center">
        {seedingRateLabel}

      </Typography>
      <Box
        sx={{
          width: '110px',
          height: '50px',
          padding: '11px',
          margin: '0 auto',
          backgroundColor: '#E5E7D5',
          border: '#C7C7C7 solid 1px',
          borderRadius: '16px',
        }}
      >
        <Typography>{displayValue.seedingRateValue}</Typography>
      </Box>
      <Typography>
        Lbs /
        {' '}
        <span style={{ fontWeight: 'bold' }}>{unitText}</span>
      </Typography>

      <Box
        sx={{
          width: '110px',
          height: '50px',
          padding: '11px',
          margin: '0 auto',
          backgroundColor: '#E5E7D5',
          border: '#C7C7C7 solid 1px',
          borderRadius: '16px',
        }}
      >
        <Typography>{twoDigit(displayValue.plantValue)}</Typography>
      </Box>
      <Typography>
        Approx Plants Per
        {' '}
        <span style={{ fontWeight: 'bold' }}>{unitText}</span>
      </Typography>

      <Box
        sx={{
          width: '110px',
          height: '50px',
          padding: '11px',
          margin: '0 auto',
          backgroundColor: '#E5E7D5',
          border: '#C7C7C7 solid 1px',
          borderRadius: '16px',
        }}
      >
        <Typography>{twoDigit(displayValue.seedValue)}</Typography>
      </Box>
      <Typography>
        Seeds Per
        {' '}
        <span style={{ fontWeight: 'bold' }}>{unitText}</span>
      </Typography>
    </>
  );
};

export { UnitSelection, SeedInfo };
export default SeedingRateCard;
