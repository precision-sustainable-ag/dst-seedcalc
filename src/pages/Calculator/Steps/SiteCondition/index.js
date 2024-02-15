/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Spinner } from '@psa/dst.ui.spinner';
import { isEmptyNull, validateForms } from '../../../../shared/utils/format';
import { setCountyIdRedux, setCountyRedux } from '../../../../features/siteConditionSlice/actions';
import { getCropsNew } from '../../../../features/calculatorSlice/api';
import { getLocalityNew } from '../../../../features/siteConditionSlice/api';
// import DSTImport from '../../../../components/DSTImport';

import '../steps.scss';
import SiteConditionForm from './form';
import Map from './Map';

const SiteCondition = ({ completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();

  // Location state
  const [step, setStep] = useState(1);
  // const [isImported, setIsImported] = useState(false);
  const siteCondition = useSelector((state) => state.siteCondition);
  const { states, counties, loading } = siteCondition;

  // initially get states data
  useEffect(() => {
    if (states.length === 0) dispatch(getLocalityNew());
  }, []);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== '' && counties.length > 0) {
      // FIXME: temporary workaround for areas in zone 8(MD, DE and NJ), will update in the future
      if (siteCondition.county === 'Zone 8') {
        dispatch(setCountyRedux('Zone 7'));
        dispatch(setCountyIdRedux(4));
      } else {
        const countyId = counties.filter(
          (c) => c.label === siteCondition.county,
        )[0].id;
        dispatch(setCountyIdRedux(countyId));
      }
    }
  }, [siteCondition.county, counties]);

  // set favicon based on redux council value
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (siteCondition.council === 'MCCC') {
      favicon.href = 'favicons/mccc-favicon.ico';
    } else if (siteCondition.council === 'NECCC') {
      favicon.href = 'favicons/neccc-favicon.ico';
    } else if (siteCondition.council === '') {
      favicon.href = 'PSALogo.png';
    }
  }, [siteCondition.council]);

  // validate all information on this page is selected, then call getCrops api
  useEffect(() => {
    const checkNextStep = !isEmptyNull(siteCondition.state)
      && !isEmptyNull(siteCondition.soilDrainage)
      && !isEmptyNull(siteCondition.acres)
      && siteCondition.acres > 0
      && !isEmptyNull(siteCondition.county);
    validateForms(checkNextStep, 0, completedStep, setCompletedStep);
    // call getCrops api to get all crops from countyId
    if (checkNextStep) {
      dispatch(getCropsNew({ regionId: siteCondition.countyId }));
    }
  }, [siteCondition]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2">Tell us about your planting site</Typography>
      </Grid>
      <Grid xs={12} lg={8} item>
        {loading === 'getLocality' ? (
          <Spinner />
        ) : (
          step === 1 ? (
            <>
              <Typography>
                Would you like to manually enter your site conditions
                or use your location to prepopulate them?
              </Typography>
              <Button variant="contained" onClick={() => setStep(2)}>Map</Button>
              <Button variant="contained" onClick={() => setStep(3)}>Manually Enter</Button>
              {/* <DSTImport setIsImported={setIsImported} /> */}
            </>
          ) : step === 2 ? (
            <Map
              stateList={states}
              setStep={setStep}
            />
          ) : step === 3 ? (
            <SiteConditionForm
              council={siteCondition.council}
              counties={counties}
              stateList={states}
              setStep={setStep}
            />
          ) : (
            null
          )

        )}
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
