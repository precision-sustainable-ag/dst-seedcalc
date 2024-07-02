/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FadeAlert } from '@psa/dst.ui.fade-alert';
import { useAuth0 } from '@auth0/auth0-react';
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
import NavBar from '../../components/NavBar';
import { setAlertStateRedux } from '../../features/userSlice/actions';
import HistoryDialog from '../../components/HistoryDialog';
import useUserHistory from '../../shared/hooks/useUserHistory';
import { historyStates } from '../../features/userSlice/state';

const Calculator = () => {
  // initially set calculator here
  const [calculator, setCalculator] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [siteConditionStep, setSiteConditionStep] = useState(1);
  // this completedStep is to determine whether the next button is clickable on each page
  const [completedStep, setCompletedStep] = useState([...completedList]);
  const [token, setToken] = useState(null);
  const [showHeaderLogo, setShowHeaderLogo] = useState(true);

  const siteCondition = useSelector((state) => state.siteCondition);
  const { error: siteConditionError } = siteCondition;
  const { error: calculatorError, seedsSelected } = useSelector((state) => state.calculator);
  const { alertState, historyState, selectedHistory } = useSelector((state) => state.user);

  const stepperRef = useRef();

  const dispatch = useDispatch();

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const { saveHistory } = useUserHistory();

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  const renderCalculator = (step) => {
    switch (step) {
      case 'Site Conditions':
        return (
          <SiteCondition
            siteConditionStep={siteConditionStep}
            setSiteConditionStep={setSiteConditionStep}
            completedStep={completedStep}
            setCompletedStep={setCompletedStep}
            token={token}
          />
        );
      case 'Species Selection':
        return (
          <SpeciesSelection
            setSiteConditionStep={setSiteConditionStep}
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
          />
        );
      case 'Seeding Method':
        return (
          <SeedingMethod
            alertState={alertState}
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

  // close alert and save user history
  useEffect(() => {
    dispatch(setAlertStateRedux({ ...alertState, open: false }));
    if (historyState === historyStates.new || historyState === historyStates.updated) {
      const { label, id } = selectedHistory;
      saveHistory(token, id, label);
    }
  }, [activeStep]);

  useEffect(() => {
    if (siteConditionError || calculatorError) {
      dispatch(setAlertStateRedux({
        ...alertState,
        open: true,
        type: 'error',
        message: 'Network Error - Try again later or refresh the page!',
      }));
    }
  }, [siteConditionError, calculatorError]);

  // initially get token
  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessTokenSilently();
      setToken(t);
    };
    if (isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated]);

  // auto close alert after setting time
  useEffect(() => {
    const closeAlertTimeout = 5000;
    if (alertState.open) {
      setTimeout(() => {
        dispatch(setAlertStateRedux({ open: false, type: 'success', message: '' }));
      }, closeAlertTimeout);
    }
  }, [alertState.open]);

  return (
    <Grid container justifyContent="center">
      <Grid item style={{ position: 'fixed', bottom: '0px', zIndex: 1000 }}>
        {alertState.open
          && (
          <FadeAlert
            showAlert={alertState.open}
            severity={alertState.type}
            variant="filled"
            action={(
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => dispatch(setAlertStateRedux({ ...alert, open: false }))}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
            message={alertState.message}
          />
          )}
      </Grid>

      <Grid item md={0} lg={2} />

      <Grid item xs={12} lg={8}>
        {/* header logo & nav */}
        <Grid
          container
          paddingTop="0.625rem"
          height="85px"
        >
          <Grid
            item
            xs={9}
            md={6}
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
          <Grid item xs={3} md={6}>
            <NavBar />
          </Grid>
        </Grid>

        {/* steps list */}
        <Grid
          item
          xs={12}
          sx={
          matchesSm && !showHeaderLogo
            ? {
              position: 'fixed',
              width: '100%',
              paddingTop: '20px',
              backgroundColor: 'primary.light',
              height: '90px',
              zIndex: '101',
              top: '0',
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
            setSiteConditionStep={setSiteConditionStep}
          />
        </Grid>

        <Grid container>
          {/* seeds selected list */}
          {activeStep > 0 && activeStep < 8 && (
          <Grid
            item
            xs={12}
            md={1}
            lg={2}
            sx={
            matchesSm && !showHeaderLogo
              ? {
                position: 'fixed',
                width: '100%',
                paddingTop: '90px',
                zIndex: '100',
                top: '0',
              }
              : {}
          }
          >
            <SeedsSelectedList list={seedsSelected} activeStep={activeStep} />
          </Grid>
          )}

          {/* main calculator */}
          <Grid
            item
            xs={12}
            // FIXME: except last step which does not have the crop bar
            lg={activeStep === 0 ? 12 : 10}
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

          <HistoryDialog setStep={setActiveStep} setSiteConditionStep={setSiteConditionStep} />
        </Grid>

      </Grid>

      <Grid item md={0} lg={2} />
    </Grid>
  );
};
export default Calculator;
