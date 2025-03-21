import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PSAButton, PSASlider } from 'shared-react-components/src';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';
import { seedDataUnits } from '../../shared/data/units';

const roundToMillionth = (num) => {
  const million = 10 ** 6;
  return Math.round(num * million) / (million / 1000);
};

const formatToHundredth = (num) => {
  if (num < 100) return num;
  const res = Math.round(num / 100) * 100;
  return res.toLocaleString();
};

const UnitSelection = () => {
  const unit = useSelector((state) => state.calculator.unit);
  const dispatch = useDispatch();
  return (
    <>
      <Typography>Select data unit:</Typography>
      <PSAButton
        sx={{ borderRadius: '1rem' }}
        variant={unit === 'acre' ? 'outlined' : 'contained'}
        onClick={() => dispatch(selectUnitRedux('sqft'))}
        data-test="unit_sqft"
        title={seedDataUnits.sqft}
        buttonType=""
      />
      {'  '}
      <PSAButton
        sx={{ borderRadius: '1rem' }}
        variant={unit === 'acre' ? 'contained' : 'outlined'}
        onClick={() => dispatch(selectUnitRedux('acre'))}
        data-test="unit_acre"
        title={seedDataUnits.acre}
        buttonType=""
      />
    </>
  );
};

const SeedInfo = ({
  seed,
  seedData,
  calculatorResult,
  handleFormValueChange,
  council,
  options,
}) => {
  // TODO: the scrollable seeding rate only works for SCCC for now
  const baseSeedingRate = council === 'SCCC'
    ? seed.attributes.Planting['Base Seeding Rate'].values[0]
    : 0;
  const [singleSpeciesSeedingRate, setSingleSpeciesSeedingRate] = useState(
    parseFloat(baseSeedingRate),
  );
  const [percentOfRate, setPercentOfRate] = useState(0);
  const [singleData, setSingleData] = useState({
    seedingRate:
      calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS,
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
  const unitText = unit === 'acre'
    ? seedDataUnits.acre
    : unit === 'sqft'
      ? seedDataUnits.sqft
      : '';

  useEffect(() => {
    if (unit === 'sqft') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate: roundToMillionth(
          calculatorResult[seed.label].step1
            .defaultSingleSpeciesSeedingRatePLS / 43560,
        ),
        plantValue: Math.round(seedData[seed.label].defaultPlant / 43560),
        seedValue: Math.round(seedData[seed.label].defaultSeed / 43560),
      }));
      setMixData({
        seedingRate: roundToMillionth(
          calculatorResult[seed.label].step1.seedingRate / 43560,
        ),
        plantValue: Math.round(seedData[seed.label].adjustedPlant / 43560),
        seedValue: Math.round(seedData[seed.label].adjustedSeed / 43560),
      });
    } else if (unit === 'acre') {
      setSingleData((prev) => ({
        ...prev,
        seedingRate:
          calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS,
        plantValue: Math.round(seedData[seed.label].defaultPlant),
        seedValue: Math.round(seedData[seed.label].defaultSeed),
      }));
      setMixData({
        seedingRate: calculatorResult[seed.label].step1.seedingRate,
        plantValue: Math.round(seedData[seed.label].adjustedPlant),
        seedValue: Math.round(seedData[seed.label].adjustedSeed),
      });
    }
    if (council === 'NECCC') {
      if (options.percentOfRate) {
        setPercentOfRate(
          Math.round((options.percentOfRate / soilFertilityModifier) * 100),
        );
      } else {
        setPercentOfRate(
          Math.round(
            (1 / calculatorResult[seed.label].step1.sumGroupInMix) * 100,
          ),
        );
      }
    } else {
      setPercentOfRate(
        Math.round(calculatorResult[seed.label].step1.percentOfRate * 100),
      );
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
            <Typography sx={{ fontWeight: 'bold' }}>{seed.label}</Typography>
          </CardContent>
          <CardMedia
            component="img"
            height="160px"
            image={
              seed.thumbnail ?? 'https://placehold.it/250x150?text=Placeholder'
            }
            alt={seed.label}
            sx={{ border: '2px solid green', borderRadius: '1rem' }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={8} pt="1rem">
        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip
              value={singleData.seedingRate}
              testId={`${seed.label}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-value`}
              ariaLabel={`${seedDataUnits.defaultSingelSpeciesSeedingRatePLS} per ${unitText} value: ${singleData.seedingRate}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              value={formatToHundredth(singleData.plantValue)}
              testId={`${seed.label}-${seedDataUnits.approxPlantsper}-value`}
              ariaLabel={`${seedDataUnits.approxPlantsper} ${unitText} value: ${singleData.seedingRate}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              value={formatToHundredth(singleData.seedValue)}
              ariaLabel={`${seedDataUnits.seedsper} ${unitText} value: ${singleData.seedValue}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={`${seedDataUnits.defaultSingelSpeciesSeedingRatePLS} per `}
              unit={unit === 'sqft' ? seedDataUnits.tsqft : unitText}
              testId={`${seed.label}-${seedDataUnits.defaultSingelSpeciesSeedingRatePLS}-label`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel label={seedDataUnits.approxPlantsper} unit={unitText} />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel label={seedDataUnits.seedsper} unit={unitText} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={4}>
            <SeedingRateChip
              value={mixData.seedingRate}
              testId={`${seed.label}-${seedDataUnits.seedingRateinMix}-value`}
              ariaLabel={`${seedDataUnits.seedingRateinMix} per ${unitText} value: ${mixData.seedingRate}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              value={formatToHundredth(mixData.plantValue)}
              ariaLabel={`${seedDataUnits.approxPlantsper} ${unitText} value: ${mixData.seedingRate}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedingRateChip
              value={formatToHundredth(mixData.seedValue)}
              ariaLabel={`${seedDataUnits.seedsper} ${unitText} value: ${mixData.seedValue}`}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel
              label={`${seedDataUnits.seedingRateinMix} per `}
              unit={unit === 'sqft' ? seedDataUnits.tsqft : unitText}
            />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel label={seedDataUnits.approxPlantsper} unit={unitText} />
          </Grid>
          <Grid item xs={4}>
            <SeedLabel label={seedDataUnits.seedsper} unit={unitText} />
          </Grid>
        </Grid>

        {council === 'SCCC' && (
          <Grid item xs={12}>
            <Typography>
              {`Single Species Seeding Rate PLS: ${singleSpeciesSeedingRate} Lbs per Acre`}
            </Typography>
            <PSASlider
              min={baseSeedingRate * 0.5}
              max={baseSeedingRate * 1.5}
              step={0.1}
              value={singleSpeciesSeedingRate}
              valueLabelDisplay="auto"
              onChange={(e) => setSingleSpeciesSeedingRate(e.target.value)}
              onChangeCommitted={(_, value) => handleFormValueChange(
                seed,
                'singleSpeciesSeedingRate',
                value,
              )}
              data-test={`${seed.label}-slider_single_species_seeding_rate`}
            />
          </Grid>
        )}

        <Grid item xs={12} pt="1rem">
          <Typography>
            {`% of Single Species Rate: ${percentOfRate}%`}
          </Typography>
          <PSASlider
            min={0}
            max={100}
            value={percentOfRate}
            valueLabelDisplay="auto"
            onChange={(e, value) => {
              if (value !== undefined) setPercentOfRate(value);
              else setPercentOfRate(e.target.value);
            }}
            onChangeCommitted={(_, value) => {
              if (council === 'NECCC') {
                // TODO: NOTE: if council is NECCC, the percentOfRate need to multiply by soilFertilityModifier
                handleFormValueChange(
                  seed,
                  'percentOfRate',
                  (soilFertilityModifier * parseFloat(value)) / 100,
                );
              } else {
                handleFormValueChange(
                  seed,
                  'percentOfRate',
                  parseFloat(value) / 100,
                );
              }
            }}
            data-test={`${seed.label}-slider_percent_of_rate`}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const SeedingRateChip = ({ value, testId, ariaLabel }) => (
  <Box
    sx={{
      width: '100px',
      padding: '0.5rem',
      margin: '0 auto',
      border: '#D3D3D3 solid 2px',
      opacity: '0.85',
    }}
    data-test={testId}
    aria-label={ariaLabel}
  >
    <Typography aria-hidden="true">{value}</Typography>
  </Box>
);

const SeedLabel = ({ label, unit, testId }) => (
  <Typography
    lineHeight="1rem"
    fontSize="0.8rem"
    padding="0.5rem 0"
    data-test={testId}
    aria-hidden="true"
  >
    {label}
    <span style={{ fontWeight: 'bold' }}>{unit}</span>
  </Typography>
);

const SeedingRateCard = ({
  seedingRateLabel,
  seedingRateValue,
  plantValue,
  seedValue,
}) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState({
    plantValue,
    seedValue,
    seedingRateValue,
  });

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
      <Typography
        display="flex"
        alignItems="center"
        justifyContent="center"
        pb="0.5rem"
        fontWeight="bold"
      >
        {seedingRateLabel}
      </Typography>

      <SeedLabel
        label={seedDataUnits.seedingRate}
        unit={
          seedDataUnits.lbsper
          + (unit === 'acre' ? seedDataUnits.acre : seedDataUnits.tsqft)
        }
        testId={`${seedingRateLabel}-${seedDataUnits.seedingRate}-label`}
      />
      <SeedingRateChip
        value={displayValue.seedingRateValue}
        testId={`${seedingRateLabel}-${seedDataUnits.seedingRate}-value`}
        ariaLabel={`${seedDataUnits.seedingRate} per ${unit} value: ${displayValue.seedingRateValue}`}
      />

      <SeedLabel
        label={seedDataUnits.approxPlantsper}
        unit={unit === 'acre' ? seedDataUnits.acre : seedDataUnits.sqft}
      />
      <SeedingRateChip
        value={formatToHundredth(twoDigit(displayValue.plantValue))}
        ariaLabel={`${seedDataUnits.approxPlantsper}${unit} value: ${displayValue.plantValue}`}
      />

      <SeedLabel
        label={seedDataUnits.seedsper}
        unit={unit === 'acre' ? seedDataUnits.acre : seedDataUnits.sqft}
      />
      <SeedingRateChip
        value={formatToHundredth(twoDigit(displayValue.seedValue))}
        ariaLabel={`${seedDataUnits.seedsper}${unit} value: ${displayValue.seedValue}`}
      />
    </>
  );
};

export { UnitSelection, SeedInfo };
export default SeedingRateCard;
