/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { StepLabel, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDispatch } from 'react-redux';
import { calculatorList } from '../../shared/data/dropdown';
import { resetCalculator } from '../../features/calculatorSlice';

/*
{
  name: StepsList,
  description: Re-usable Steps List component.
  params: {
    steps: An array of steps as str value
    activeStep: Current active step
    skipped: A set of steps  that are skipped
    handleNext: Function when user clicks "Next"
    handleBack: Function when user clicks "Back"
    handleSkip: Function when user clicks "Skip"
    handleReset: Function when user clicks "Reset"
  }
}
*/

const StepsList = ({ activeStep, setActiveStep, availableSteps }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const dispatch = useDispatch();

  // this completed step is to determine the latest completed step
  const [completedStep, setCompletedStep] = useState(-1);

  /// ///////////////////////////////////////////////////////
  //                      State Logic                     //
  /// ///////////////////////////////////////////////////////

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompletedStep(activeStep > completedStep ? activeStep : completedStep);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleRestart = () => {
    setActiveStep(0);
    setCompletedStep(-1);
    dispatch(resetCalculator());
  };

  return (
    <Box sx={{ color: 'primary.text' }}>
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {calculatorList.map((label, index) => (
          <Step
            key={label}
            sx={{
              '& .MuiSvgIcon-root': {
                color: completedStep + 1 < index ? '' : '#4f5f30',
                '&.Mui-active': {
                  color: '#77b400',
                },
              },
              '& .MuiStepLabel-label': {
                '&.Mui-active,&.Mui-completed': {
                  color: 'primary.text',
                },
              },
            }}
          >
            <StepLabel>
              {matches && label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
        {activeStep !== 0 && (
          <Button variant="stepper" onClick={handleRestart}>
            <RestartAltIcon />
            Restart
          </Button>
        )}

        <Box sx={{ flex: '1 1 auto' }} />

        {activeStep !== calculatorList.length
        && (
        <Tooltip
          arrow
          title={
              // eslint-disable-next-line no-nested-ternary
              activeStep === 0 && !availableSteps[0]
                ? 'Please enter the necessary info below.'
                : activeStep === 1 && !availableSteps[1]
                  ? 'Please select at least 2 plants.'
                  : activeStep === 5 && !availableSteps[5]
                    ? 'Please make a selection.'
                    : ''
            }
          open
        >
          <span>
            <Button
              variant="stepper"
              disabled={availableSteps[activeStep] !== true}
              onClick={handleNext}
            >
              {activeStep === calculatorList.length - 1
                ? 'Finish'
                : calculatorList[activeStep + 1]}
              {' '}
              <ArrowForwardIosIcon />
            </Button>
          </span>
        </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default StepsList;
