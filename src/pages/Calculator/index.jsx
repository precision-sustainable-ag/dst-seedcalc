/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FadeAlert } from 'shared-react-components/src';
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
import { setAlertStateRedux } from '../../features/userSlice/actions';
import HistoryDialog from '../../components/HistoryDialog';
import useUserHistory from '../../shared/hooks/useUserHistory';
import { historyStates } from '../../features/userSlice/state';
import pirschAnalytics from '../../shared/utils/analytics';
import { setAuthToken } from '../../shared/utils/authToken';

const Calculator = () => {
  // initially set calculator here
  const [calculator, setCalculator] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [siteConditionStep, setSiteConditionStep] = useState(1);
  // this completedStep is to determine whether the next button is clickable on each page
  const [completedStep, setCompletedStep] = useState([...completedList]);
  const [showHeaderLogo, setShowHeaderLogo] = useState(true);

  const siteCondition = useSelector((state) => state.siteCondition);
  const { error: siteConditionError } = siteCondition;
  const { error: calculatorError } = useSelector((state) => state.calculator);
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
      saveHistory(id, label);
    }
    if (activeStep !== calculatorList.length) {
      pirschAnalytics('visit step', {
        meta: {
          step: calculatorList[activeStep],
        },
      });
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
      setAuthToken(t);
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
            <SeedsSelectedList activeStep={activeStep} />
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
  );
};
export default Calculator;
