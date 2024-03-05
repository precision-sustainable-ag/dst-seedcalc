import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Grid, Card, CardContent, CardMedia, Slider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';

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
  seed, seedData, calculatorResult, handleFormValueChange, council,
}) => {
  const [singleSpeciesRate, setSingleSpeciesRate] = useState(0);
  const [survival, setSurvival] = useState(0);
  const [singleSpeciesSeedingRate, setSingleSpeciesSeedingRate] = useState(0);
  const [range, setRange] = useState([0, 0]);
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
    const singleSpeciesSeedingRateVal = parseFloat(seed.attributes.Coefficients['Single Species Seeding Rate'].values[0]);
    setSingleSpeciesSeedingRate(singleSpeciesSeedingRateVal);
    setRange([Math.round(singleSpeciesSeedingRateVal * 0.5), Math.round(singleSpeciesSeedingRateVal * 1.5)]);
  }, []);

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
    setSingleSpeciesRate(Math.round(calculatorResult[seed.label].step1.percentOfRate * 100));
    setSurvival(Math.round(twoDigit(calculatorResult[seed.label].step3.percentSurvival) * 100));
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
              label="Default Single Species Seeding Rate PLS"
              unit={unit === 'sqft' ? '1000SqFt' : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label="Approx Plants"
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label="Seeds"
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
              label="Seeding Rate in Mix"
              unit={unit === 'sqft' ? '1000SqFt' : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label="Approx Plants"
              unit={unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label="Seeds"
              unit={unitText}
            />
          </Grid>
        </Grid>

        {council === 'MCCC'
        && (
        <>
          <Grid item xs={12} pt="1rem">
            <Typography textAlign="left">
              {`% of Single Species Rate: ${singleSpeciesRate}%`}
            </Typography>
            <Slider
              min={0}
              max={100}
              value={singleSpeciesRate}
              valueLabelDisplay="auto"
              onChange={(e) => setSingleSpeciesRate(e.target.value)}
              onChangeCommitted={() => handleFormValueChange(seed, 'percentOfRate', parseFloat(singleSpeciesRate) / 100)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign="left">
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
        </>
        )}

        {council === 'NECCC' && (
        <Grid item xs={12} pt="1rem">
          <Typography textAlign="left">
            {`Single Species Seeding Rate PLS: ${singleSpeciesSeedingRate} Lbs per Acre`}
          </Typography>
          <Slider
            min={range[0]}
            max={range[1]}
            value={singleSpeciesSeedingRate}
            valueLabelDisplay="auto"
            onChange={(e) => setSingleSpeciesSeedingRate(e.target.value)}
            onChangeCommitted={() => handleFormValueChange(seed, 'singleSpeciesSeedingRate', parseFloat(singleSpeciesSeedingRate))}
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
    {' per '}
    <span style={{ fontWeight: 'bold' }}>{unit}</span>
  </Typography>
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
        <Typography>{formatToHundredth(twoDigit(displayValue.plantValue))}</Typography>
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
        <Typography>{formatToHundredth(twoDigit(displayValue.seedValue))}</Typography>
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
