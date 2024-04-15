/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { Typography, useMediaQuery } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FadeAlert } from '@psa/dst.ui.fade-alert';
import {
  SiteCondition,
  SpeciesSelection,
  MixRatio,
  MixSeedingRate,
  SeedTagInfo,
  ReviewMix,
  ConfirmPlan,
  SeedingMethod,
  CompletedPage,
} from './Steps';
import SeedsSelectedList from '../../components/SeedsSelectedList';

import { calculatorList, completedList } from '../../shared/data/dropdown';
import StepsList from '../../components/StepsList';

const defaultAlert = {
  open: false,
  severity: 'error',
  message: 'Network Error - Try again later or refresh the page!',
};

const Calculator = () => {
  const siteCondition = useSelector((state) => state.siteCondition);
  const { error: siteConditionError } = siteCondition;
  const calculatorError = useSelector((state) => state.calculator.error);

  const { seedsSelected } = useSelector((state) => state.calculator);
  // initially set calculator here
  const [calculator, setCalculator] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  // this completedStep is to determine whether the next button is clickable on each page
  const [completedStep, setCompletedStep] = useState([...completedList]);
  const [showHeaderLogo, setShowHeaderLogo] = useState(true);

  const stepperRef = useRef();

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [alertState, setAlertState] = useState(defaultAlert);

  console.log('alertState', alertState);

  // close alert eveytime switch steps
  useEffect(() => {
    setAlertState({ ...alertState, open: false });
  }, [activeStep]);
  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  const renderCalculator = (step) => {
    switch (step) {
      case 'Site Conditions':
        return (
          <SiteCondition
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case 'Species Selection':
        return (
          <SpeciesSelection
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
          />
        );
      case 'Mix Ratios':
        return (
          <MixRatio
            calculator={calculator}
            setCalculator={setCalculator}
            alertState={alertState}
            setAlertState={setAlertState}
          />
        );
      case 'Seeding Method':
        return (
          <SeedingMethod
            alertState={alertState}
            setAlertState={setAlertState}
          />
        );
      case 'Mix Seeding Rate':
        return (
          <MixSeedingRate calculator={calculator} />
        );
      case 'Seed Tag Info':
        return (
          <SeedTagInfo
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
            alertState={alertState}
            setAlertState={setAlertState}
          />
        );
      case 'Review Mix':
        return (
          <ReviewMix calculator={calculator} />
        );
      case 'Confirm Plan':
        return (
          <ConfirmPlan calculator={calculator} />
        );
      case 'Finish':
        return (
          <CompletedPage />
        );
      default:
        return null;
    }
  };

  const headerLogo = () => {
    if (siteCondition.council === '') return './PSALogo.png';
    if (siteCondition.council === 'MCCC') return './mccc-logo.png';
    if (siteCondition.council === 'NECCC') return './neccc-logo.png';
    if (siteCondition.council === 'SCCC') return './sccc_logo.png';
    return undefined;
  };

  // set favicon based on redux council value
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (siteCondition.council === 'MCCC') {
      favicon.href = 'favicons/mccc-favicon.ico';
    } else if (siteCondition.council === 'NECCC') {
      favicon.href = 'favicons/neccc-favicon.ico';
    } else if (siteCondition.council === 'SCCC') {
      favicon.href = 'favicons/sccc-favicon.ico';
    } else if (siteCondition.council === '') {
      favicon.href = 'PSALogo.png';
    }
  }, [siteCondition.council]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        // Adjust the scroll threshold as needed
        setShowHeaderLogo(false);
      } else {
        setShowHeaderLogo(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (siteConditionError || calculatorError) setAlertState({ ...alert, open: true });
  }, [siteConditionError, calculatorError]);

  return (
    <Grid container justifyContent="center">
      <Grid item style={{ position: 'fixed', bottom: '0px', zIndex: 1000 }}>
        {alertState.open
          && (
          <FadeAlert
            showAlert={alertState.open}
            severity={alertState.severity}
            variant="filled"
            action={(
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlertState({ ...alert, open: false })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
            message={alertState.message}
          />
          )}
      </Grid>
      <Grid
        item
        xs={12}
        paddingTop="0.625rem"
        height="85px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <img
          alt={siteCondition.council}
          src={headerLogo()}
          height="75px"
        />
        <Typography variant="dstHeader" pl="1rem">
          Seeding Rate Calculator
        </Typography>
      </Grid>

      <Grid item md={0} lg={2} />
      <Grid
        item
        xs={12}
        lg={8}
        sx={
          matchesSm && !showHeaderLogo
            ? {
              position: 'fixed',
              width: '100%',
              paddingTop: '20px',
              backgroundColor: 'primary.light',
              height: '90px',
              zIndex: '101',
            }
            : { paddingTop: '20px' }
        }
        // height={"100px"}
        ref={stepperRef}
      >
        <StepsList
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          availableSteps={completedStep}
        />
      </Grid>
      <Grid item md={0} lg={2} />

      <Grid item md={0} lg={2} />

      {activeStep > 0 && activeStep < 8 && (
        <Grid
          item
          xs={12}
          md={1}
          sx={
            matchesSm && !showHeaderLogo
              ? {
                position: 'fixed',
                width: '100%',
                paddingTop: '90px',
                zIndex: '100',
              }
              : {}
          }
        >
          <SeedsSelectedList list={seedsSelected} />
        </Grid>
      )}

      <Grid
        item
        xs={12}
        lg={activeStep === 0 ? 8 : 7}
        md={activeStep > 0 ? 11 : 12}
        sx={
          // eslint-disable-next-line no-nested-ternary
          matchesSm && !showHeaderLogo
            ? activeStep === 0
              ? { paddingTop: '90px' }
              : { paddingTop: '190px' }
            : {}
        }
      >
        {renderCalculator(
          activeStep === calculatorList.length
            ? 'Finish'
            : calculatorList[activeStep],
        )}
      </Grid>

      <Grid item md={0} lg={2} />
    </Grid>
  );
};
export default Calculator;
