import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDispatch, useSelector } from 'react-redux';
import {
  PSATooltip, PSAFigmaButton,
} from 'shared-react-components/src';
import { Typography } from '@mui/material';
import { calculatorList } from '../../shared/data/dropdown';
import { resetCalculator } from '../../features/calculatorSlice';
import {
  setHistoryStateRedux, setMaxAvailableStepRedux, setSelectedHistoryRedux,
} from '../../features/userSlice/actions';
import { historyStates } from '../../features/userSlice/state';
import stepCaptions from '../../shared/data/stepCaption';

const NavButtons = ({
  activeStep, setActiveStep, availableSteps, setSiteConditionStep, placement = 'top',
}) => {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const { maxAvailableStep } = useSelector((state) => state.user);

  const handleRestart = () => {
    setActiveStep(0);
    setSiteConditionStep(1);
    dispatch(setMaxAvailableStepRedux(-1));
    dispatch(resetCalculator());
    dispatch(setHistoryStateRedux(historyStates.none));
    dispatch(setSelectedHistoryRedux(null));
  };
  const handleNext = () => {
    if (activeStep === calculatorList.length) handleRestart();
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      dispatch(setMaxAvailableStepRedux(activeStep > maxAvailableStep ? activeStep : maxAvailableStep));
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const tooltipTitle = () => {
    if (activeStep === 0 && !availableSteps[0]) {
      return 'Please enter the necessary info below.';
    }
    if (activeStep === 1 && !availableSteps[1]) {
      return 'Please select at least 1 plant.';
    }
    if (activeStep === 5 && !availableSteps[5]) {
      return 'Please make a selection.';
    }
    return '';
  };

  useEffect(() => {
    const displayToolTip = () => {
      if (activeStep === 0 && !availableSteps[0]) {
        return true;
      }
      if (activeStep === 1 && !availableSteps[1] && hovering) {
        return true;
      }
      if (activeStep === 5 && !availableSteps[5]) {
        return true;
      }
      return false;
    };

    setVisible(displayToolTip());
  }, [activeStep, availableSteps, hovering]);

  return (
    <Box
      id="step-button"
      sx={{
        display: 'flex',
        width: '100%',
        p: '10px 20px',
        color: 'white',
        backgroundColor: 'primary.main',
        alignItems: 'center',
        borderRadius: placement === 'bottom' ? '0 0 25px 25px' : 'none',
      }}
    >

      <span>
        <PSAFigmaButton
          text="Back"
          icon={<ArrowBackIcon />}
          leftIcon
          disabled={activeStep === 0}
          onClick={handleBack}
          data-test="back_button"
        />
      </span>

      <Box sx={{ flex: '1 1 auto', minHeight: '3rem', display: 'flex' }}>
        { placement === 'top' && (
          <Typography variant="stepCaption" sx={{ margin: 'auto' }}>
            {stepCaptions[activeStep]}
          </Typography>
        )}
        { placement === 'bottom' && (
          <Box sx={{ margin: 'auto' }}>
            <PSAFigmaButton
              variant="text"
              text="Want to start over? Click here."
              onClick={handleRestart}
              buttonSx={{
                '& .MuiTypography-root': {
                  color: 'white',
                },
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <PSATooltip
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        arrow
        open={visible}
        title={tooltipTitle()}
        tooltipContent={(
          <span>
            <PSAFigmaButton
              text={activeStep === calculatorList.length ? 'Restart' : 'Next'}
              icon={activeStep === calculatorList.length ? <RestartAltIcon /> : <ArrowForwardIcon />}
              rightIcon
              disabled={availableSteps[activeStep] !== true}
              onClick={handleNext}
              data-test={activeStep === calculatorList.length ? 'restart_button' : 'next_button'}
            />
          </span>
              )}
      />

    </Box>
  );
};
export default NavButtons;
