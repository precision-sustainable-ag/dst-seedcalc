import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { twoDigit } from '../../shared/utils/calculator';

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
  const [perAcre, setperAcre] = useState(true);

  useEffect(() => {
    setDisplayValue({ plant: twoDigit(plant), seed: twoDigit(seed) });
  }, [plant, seed]);

  const handleClickSqft = () => {
    setperAcre(false);
    setDisplayValue({ plant: twoDigit(plant / 43560), seed: twoDigit(seed / 43560) });
  };

  const handleClickAcre = () => {
    setperAcre(true);
    setDisplayValue({ plant: twoDigit(plant), seed: twoDigit(seed) });
  };

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
      <Typography>Approx Plants Per</Typography>

      <Button
        variant={perAcre ? 'outlined' : 'contained'}
        onClick={handleClickSqft}
      >
        Sqft
      </Button>
      {'   '}
      <Button
        variant={perAcre ? 'contained' : 'outlined'}
        onClick={handleClickAcre}
      >
        Acres
      </Button>

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
      <Typography>Seeds Per</Typography>

      <Button
        variant={perAcre ? 'outlined' : 'contained'}
        onClick={handleClickSqft}
      >
        Sqft
      </Button>
      {'   '}
      <Button
        variant={perAcre ? 'contained' : 'outlined'}
        onClick={handleClickAcre}
      >
        Acres
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

export { SeedingRateChip, SeedDataChip };
export default SeedingRateCard;
