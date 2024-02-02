import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';

const SeedingRateChip = ({ label, value }) => (
  <>
    <Typography>{label}</Typography>
    <Box
      sx={{
        width: '50px',
        height: '50px',
        margin: '0 auto',
        backgroundColor: '#E5E7D5',
        border: '#C7C7C7 solid 1px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography>{twoDigit(value)}</Typography>
    </Box>
    <Typography>Lbs / Acre</Typography>
  </>
);

const SeedDataChip = ({ plant, seed }) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState({ plant, seed });

  const unit = useSelector((state) => state.calculator.unit);

  // eslint-disable-next-line no-nested-ternary
  const unitText = unit === 'acre' ? 'Acre' : unit === 'sqft' ? 'SqFt' : '';

  useEffect(() => {
    if (unit === 'sqft') {
      setDisplayValue({ plant: twoDigit(plant / 43560), seed: twoDigit(seed / 43560) });
    } else if (unit === 'acre') {
      setDisplayValue({ plant: twoDigit(plant), seed: twoDigit(seed) });
    }
  }, [plant, seed, unit]);

  return (
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
        <Typography>{displayValue.plant}</Typography>
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
        <Typography>{displayValue.seed}</Typography>
      </Box>
      <Typography>
        Seeds Per
        {' '}
        <span style={{ fontWeight: 'bold' }}>{unitText}</span>
      </Typography>

    </>
  );
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

const SeedingRateCard = ({
  seedingRateLabel, seedingRateValue, plantValue, seedValue,
}) => (
  <>
    <SeedingRateChip label={seedingRateLabel} value={seedingRateValue} />
    <SeedDataChip plant={plantValue} seed={seedValue} />
  </>
);

export { SeedingRateChip, SeedDataChip, UnitSelection };
export default SeedingRateCard;
