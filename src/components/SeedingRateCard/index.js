import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import HelpIcon from '@mui/icons-material/Help';
import { twoDigit } from '../../shared/utils/calculator';
import { selectUnitRedux } from '../../features/calculatorSlice/actions';

const tooltipMCCC = {
  mixSeedingRate: 'Seeding Rate in Mix = Default Single Species Seeding Rate PLS * Percent of Rate',
};

const tooltipNECCC = {
  mixSeedingRate: 'Seeding Rate in Mix = Default Single Species Seeding Rate PLS *  Soil Fertility Modifier / Sum Species Of Group in Mix',
};

const SeedingRateChip = ({ label, value, showTooltip }) => {
  const council = useSelector((state) => state.siteCondition.council);
  return (
    <>
      <Typography display="flex" alignItems="center" justifyContent="center">
        {label}
        {showTooltip !== false && (
        <Tooltip
          title={(
            <>
              <Typography style={{ color: '#FFFFF2' }}>
                How is this calculated?
              </Typography>
              <Typography style={{ color: '#FFFFF2' }}>
                {council === 'MCCC' ? tooltipMCCC[showTooltip] : tooltipNECCC[showTooltip]}
              </Typography>
            </>
        )}
          arrow
          enterTouchDelay={0}
        >
          <HelpIcon />
        </Tooltip>
        )}

      </Typography>
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
};

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
  seedingRateLabel, seedingRateValue, plantValue, seedValue, showTooltip = false,
}) => (
  <>
    <SeedingRateChip label={seedingRateLabel} value={seedingRateValue} showTooltip={showTooltip} />
    <SeedDataChip plant={plantValue} seed={seedValue} />
  </>
);

export { SeedingRateChip, SeedDataChip, UnitSelection };
export default SeedingRateCard;
