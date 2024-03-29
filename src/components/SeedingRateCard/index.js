import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Grid, Card, CardContent, CardMedia, Slider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';
import { seedDataUnits } from '../../shared/data/units';

const roundToMillionth = (num) => {
  const million = 10 ** 6;
  return Math.round(num * million) / (million / 1000);
};

const formatToHundredth = (num) => {
  if (num < 100) return num;
  const res = Math.round((num / 100)) * 100;
  return res.toLocaleString();
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
        {seedDataUnits.sqft}
      </Button>
      {'  '}
      <Button
        variant={unit === 'acre' ? 'contained' : 'outlined'}
        onClick={() => dispatch(selectUnitRedux('acre'))}
      >
        {seedDataUnits.acre}
      </Button>
    </>
  );
};

const SeedInfo = ({
  seed, seedData, calculatorResult, handleFormValueChange, council, options,
}) => {
  const [singleSpeciesRate, setSingleSpeciesRate] = useState(0);
  const [survival, setSurvival] = useState(0);
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
  const { soilFertilityModifier } = calculatorResult[seed.label].step1;
  // eslint-disable-next-line no-nested-ternary
  const unitText = unit === 'acre' ? seedDataUnits.acre : unit === 'sqft' ? seedDataUnits.sqft : '';

  useEffect(() => {
    if (unit === 'sqft') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate: roundToMillionth(calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS / 43560),
        plantValue: Math.round(seedData[seed.label].defaultPlant / 43560),
        seedValue: Math.round(seedData[seed.label].defaultSeed / 43560),
      }));
      setMixData({
        seedingRate: roundToMillionth(calculatorResult[seed.label].step1.seedingRate / 43560),
        plantValue: Math.round(seedData[seed.label].adjustedPlant / 43560),
        seedValue: Math.round(seedData[seed.label].adjustedSeed / 43560),
      });
    } else if (unit === 'acre') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate: calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS,
        plantValue: Math.round(seedData[seed.label].defaultPlant),
        seedValue: Math.round(seedData[seed.label].defaultSeed),
      }));
      setMixData({
        seedingRate: calculatorResult[seed.label].step1.seedingRate,
        plantValue: Math.round(seedData[seed.label].adjustedPlant),
        seedValue: Math.round(seedData[seed.label].adjustedSeed),
      });
    }
    setSurvival(Math.round(twoDigit(calculatorResult[seed.label].step3.percentSurvival) * 100));
    if (council === 'NECCC') {
      if (options.percentOfRate) setSingleSpeciesRate(Math.round((options.percentOfRate / soilFertilityModifier) * 100));
      else setSingleSpeciesRate(Math.round((1 / calculatorResult[seed.label].step1.sumGroupInMix) * 100));
    } else {
      setSingleSpeciesRate(Math.round(calculatorResult[seed.label].step1.percentOfRate * 100));
    }
  }, [seedData, calculatorResult, unit]);

  return (
    <Grid container p="0 5%">
      <Grid item xs={12} md={4} justifyContent="center" display="flex">
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
      <Grid item xs={12} md={8} pt="1rem">
        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip value={singleData.seedingRate} />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip value={formatToHundredth(singleData.plantValue)} />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip value={formatToHundredth(singleData.seedValue)} />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={`${seedDataUnits.defaultSingelSpeciesSeedingRatePLS} per `}
              unit={unit === 'sqft' ? seedDataUnits.tsqft : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={seedDataUnits.approxPlantsper}
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={seedDataUnits.seedsper}
              unit={unitText}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip value={mixData.seedingRate} />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip value={formatToHundredth(mixData.plantValue)} />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip value={formatToHundredth(mixData.seedValue)} />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={`${seedDataUnits.seedingRateinMix} per `}
              unit={unit === 'sqft' ? seedDataUnits.tsqft : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={seedDataUnits.approxPlantsper}
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={seedDataUnits.seedsper}
              unit={unitText}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} pt="1rem">
          <Typography>
            {`% of Single Species Rate: ${singleSpeciesRate}%`}
          </Typography>
          <Slider
            min={0}
            max={100}
            value={singleSpeciesRate}
            valueLabelDisplay="auto"
            onChange={(e) => setSingleSpeciesRate(e.target.value)}
            onChangeCommitted={() => {
              if (council === 'NECCC') {
                // if council is neccc, the percent of rate need to multiply by soil fertility modifier
                handleFormValueChange(seed, 'percentOfRate', (soilFertilityModifier * parseFloat(singleSpeciesRate)) / 100);
              } else {
                handleFormValueChange(seed, 'percentOfRate', parseFloat(singleSpeciesRate) / 100);
              }
            }}
          />
        </Grid>

        {council === 'MCCC'
        && (
          <Grid item xs={12}>
            <Typography>
              {`% Survival: ${survival}%`}
            </Typography>
            <Slider
              min={0}
              max={100}
              value={survival}
              valueLabelDisplay="auto"
              onChange={(e) => setSurvival(e.target.value)}
              onChangeCommitted={() => handleFormValueChange(seed, 'percentSurvival', parseFloat(survival) / 100)}
            />
          </Grid>
        )}

      </Grid>
    </Grid>
  );
};

const SeedingRateChip = ({ value }) => (
  <Box
    sx={{
      width: '100px',
      padding: '0.5rem',
      margin: '0 auto',
      backgroundColor: '#E5E7D5',
      border: '#C7C7C7 solid 1px',
      borderRadius: '16px',
    }}
  >
    <Typography>{value}</Typography>
  </Box>
);

const SeedLabel = ({ label, unit }) => (
  <Typography lineHeight="1rem" fontSize="0.8rem" padding="0.5rem 0">
    {label}
    <span style={{ fontWeight: 'bold' }}>{unit}</span>
  </Typography>
);

const SeedingRateCard = ({
  seedingRateLabel, seedingRateValue, plantValue, seedValue,
}) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState({ plantValue, seedValue, seedingRateValue });

  const unit = useSelector((state) => state.calculator.unit);

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
      <Typography display="flex" alignItems="center" justifyContent="center" pb="0.5rem" fontWeight="bold">
        {seedingRateLabel}
      </Typography>

      <SeedLabel
        label="Seeding Rate "
        unit={seedDataUnits.lbsper + (unit === 'acre' ? seedDataUnits.acre : seedDataUnits.tsqft)}
      />
      <SeedingRateChip value={displayValue.seedingRateValue} />

      <SeedLabel
        label={seedDataUnits.approxPlantsper}
        unit={unit === 'acre' ? seedDataUnits.acre : seedDataUnits.sqft}
      />
      <SeedingRateChip value={formatToHundredth(twoDigit(displayValue.plantValue))} />

      <SeedLabel
        label={seedDataUnits.seedsper}
        unit={unit === 'acre' ? seedDataUnits.acre : seedDataUnits.sqft}
      />
      <SeedingRateChip value={formatToHundredth(twoDigit(displayValue.seedValue))} />

    </>
  );
};

export { UnitSelection, SeedInfo };
export default SeedingRateCard;
