/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useDispatch, useSelector } from 'react-redux';
import { PSAButton, PSATooltip, PSAStepper } from 'shared-react-components/src';
import { calculatorList } from '../../shared/data/dropdown';
import { resetCalculator } from '../../features/calculatorSlice';
import {
  setHistoryStateRedux, setMaxAvailableStepRedux, setSelectedHistoryRedux,
} from '../../features/userSlice/actions';
import { historyStates } from '../../features/userSlice/state';
import useIsMobile from '../../shared/hooks/useIsMobile';

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

  const dispatch = useDispatch();

  const isMobile = useIsMobile('md');

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

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <Box sx={{ paddingTop: isMobile ? 0 : '1rem' }}>
      <PSAStepper
        steps={calculatorList}
        strokeColor="#fffff2"
        maxAvailableStep={maxAvailableStep + 1}
        onStepClick={(index) => handleStepClick(index)}
        stepperProps={{ activeStep }}
        stepButtonProps={{
          styles: {
            '.MuiStepLabel-label': {
              '&.Mui-active,&.Mui-completed': {
                color: 'primary.text',
              },
            },
          },
        }}
        mobile={isMobile}
        nextButtonDisabled={availableSteps[activeStep] !== true}
      />

      {!isMobile && (
        <Box id="step-button" sx={{ display: 'flex', pt: '0.5rem', color: 'primary.text' }}>
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
            ) : (
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

          {activeStep !== calculatorList.length && (
          <PSATooltip
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            arrow
            open={visible}
            title={tooltipTitle()}
            tooltipContent={(
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
              )}
          />
          )}
        </Box>
      )}
    </Box>
  );
};

export default StepsList;
