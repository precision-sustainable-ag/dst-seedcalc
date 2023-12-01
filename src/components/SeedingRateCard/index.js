import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { twoDigit } from '../../shared/utils/calculate';

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

const SeedDataChip = ({ label, value }) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState(value);
  const [perAcre, setperAcre] = useState(true);

  useEffect(() => {
    setDisplayValue(twoDigit(value));
  }, [value]);

  const handleClickSqft = () => {
    setperAcre(false);
    setDisplayValue(parseFloat((value / 43560).toFixed(2)));
  };

  const handleClickAcre = () => {
    setperAcre(true);
    setDisplayValue(value);
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
        <Typography>{displayValue}</Typography>
      </Box>
      <Typography>{label}</Typography>

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

export { SeedingRateChip, SeedDataChip };
