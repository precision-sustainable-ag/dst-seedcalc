/* eslint-disable no-nested-ternary */
import React from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { PSAStepper } from 'shared-react-components/src';
import { useTheme } from '@mui/material';
import { calculatorList } from '../../shared/data/dropdown';

import useIsMobile from '../../shared/hooks/useIsMobile';
import NavButtons from '../NavButtons/NavButtons';

const StepsList = ({
  activeStep, setActiveStep, availableSteps, setSiteConditionStep,
}) => {
  const theme = useTheme();

  const isMobile = useIsMobile('md');
  const isUnderLg = useIsMobile('lg');

  const { maxAvailableStep } = useSelector((state) => state.user);
  /// ///////////////////////////////////////////////////////
  //                      State Logic                     //
  /// ///////////////////////////////////////////////////////

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <>
      <Box
        sx={{
          padding: isMobile ? 0 : '15px 0',
          backgroundColor: 'additional.background2',
          borderRadius: isUnderLg ? 0 : '25px 25px 0 0 ',
        }}
      >
        <PSAStepper
          steps={calculatorList}
          strokeColor={`${theme.palette.additional.background2}`}
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
      </Box>

      {!isMobile && (
        <NavButtons
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          availableSteps={availableSteps}
          setSiteConditionStep={setSiteConditionStep}
          placement="top"
        />
      )}

    </>
  );
};

export default StepsList;
