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

const SeedingRateCard = ({
  seedingRateLabel, seedingRateValue, plantValue, seedValue, showTooltip = false,
}) => {
  // default value is always seeds/palnts per acre
  const [displayValue, setDisplayValue] = useState({ plantValue, seedValue, seedingRateValue });

  const council = useSelector((state) => state.siteCondition.council);
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
        {showTooltip !== false && (
        <Tooltip
          title={(
            <>
              <Typography>
                How is this calculated?
              </Typography>
              <Typography>
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

export { UnitSelection };
export default SeedingRateCard;
