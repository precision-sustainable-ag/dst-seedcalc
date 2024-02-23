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
  const [showAlert, setShowAlert] = useState(false);

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
          />
        );
      case 'Seeding Method':
        return (
          <SeedingMethod />
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
    return undefined;
  };

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
    if (siteConditionError || calculatorError) setShowAlert(true);
  }, [siteConditionError, calculatorError]);

  return (
    <Grid container justifyContent="center">
      <Grid item style={{ position: 'fixed', top: '0px', zIndex: 1000 }}>
        {showAlert
          && (
          <FadeAlert
            showAlert={showAlert}
            action={(
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
            message="Network Error - Try again later or refresh the page!"
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
