/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { StepButton, Tooltip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDispatch, useSelector } from 'react-redux';
import { PSAButton } from 'shared-react-components/src';
import { calculatorList } from '../../shared/data/dropdown';
import { resetCalculator } from '../../features/calculatorSlice';
import {
  setHistoryStateRedux, setMaxAvailableStepRedux, setSelectedHistoryRedux,
} from '../../features/userSlice/actions';
import { historyStates } from '../../features/userSlice/state';

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

const StepsList = ({
  activeStep, setActiveStep, availableSteps, setSiteConditionStep,
}) => {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const dispatch = useDispatch();

  const { maxAvailableStep } = useSelector((state) => state.user);

  /// ///////////////////////////////////////////////////////
  //                      State Logic                     //
  /// ///////////////////////////////////////////////////////

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    dispatch(setMaxAvailableStepRedux(activeStep > maxAvailableStep ? activeStep : maxAvailableStep));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRestart = () => {
    setActiveStep(0);
    setSiteConditionStep(1);
    dispatch(setMaxAvailableStepRedux(-1));
    dispatch(resetCalculator());
    dispatch(setHistoryStateRedux(historyStates.none));
    dispatch(setSelectedHistoryRedux(null));
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
    <Box sx={{ color: 'primary.text' }}>
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {calculatorList.map((label, index) => (
          <Step
            key={label}
            disabled={maxAvailableStep + 1 < index}
            sx={{
              '& .MuiSvgIcon-root': {
                color: maxAvailableStep + 1 < index ? '' : '#4f5f30',
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
            <StepButton onClick={() => setActiveStep(index)} data-test={`step-${index}`}>
              {matches && label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>

        {activeStep !== 0 && (
          activeStep === calculatorList.length ? (
            <PSAButton
              buttonType=""
              variant="stepper"
              onClick={handleRestart}
              data-test="restart_button"
              title={(
                <>
                  <RestartAltIcon />
                  Restart
                </>
)}
            />
          )
            : (
              <PSAButton
                buttonType=""
                variant="stepper"
                onClick={handleBack}
                data-test="back_button"
                title={(
                  <>
                    <ArrowBackIosNewIcon />
                    {' '}
                    BACK
                  </>
)}
              />
            )
        )}

        <Box sx={{ flex: '1 1 auto' }} />

        {activeStep !== calculatorList.length
        && (
        <Tooltip
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          arrow
          open={visible}
          title={tooltipTitle()}
        >
          <span>
            <PSAButton
              buttonType=""
              variant="stepper"
              disabled={availableSteps[activeStep] !== true}
              onClick={handleNext}
              data-test="next_button"
              title={(
                <>
                  {activeStep === calculatorList.length - 1
                    ? 'Finish'
                    : calculatorList[activeStep + 1]}
                  {' '}
                  <ArrowForwardIosIcon />
                </>
)}
            />
          </span>
        </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default StepsList;
