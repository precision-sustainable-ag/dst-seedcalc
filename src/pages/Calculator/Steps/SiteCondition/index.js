/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Spinner } from '@psa/dst.ui.spinner';
import { isEmptyNull, validateForms } from '../../../../shared/utils/format';
import SiteConditionForm from './form';
import RegionSelector from './RegionSelector';
import MapComponent from './MapComponent';
import { setCountyIdRedux } from '../../../../features/siteConditionSlice/actions';
import { getCropsNew } from '../../../../features/calculatorSlice/api';
import { getLocalityNew } from '../../../../features/siteConditionSlice/api';
import '../steps.scss';

const SiteCondition = ({ completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();

  // Location state
  const [step, setStep] = useState(1);
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const siteCondition = useSelector((state) => state.siteCondition);
  const { states, counties, loading } = siteCondition;

  /// ///////////////////////////////////////////////////////
  //                   State Logic                        //
  /// ///////////////////////////////////////////////////////

  // handle steps for the map
  const handleSteps = (type) => {
    type === 'next' ? setStep(step + 1) : setStep(step - 1);
    type === 'back' && setSelectedToEditSite({});
  };

  /// ///////////////////////////////////////////////////////
  //                     useEffect                        //
  /// ///////////////////////////////////////////////////////

  // initially get states data
  useEffect(() => {
    if (states.length === 0) dispatch(getLocalityNew());
  }, []);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== '' && counties.length > 0) {
      const countyId = counties.filter(
        (c) => c.label === siteCondition.county,
      )[0].id;
      dispatch(setCountyIdRedux(countyId));
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
      {loading === 'getLocality' ? (
        <Spinner />
      ) : (
        <Grid xs={12} lg={8} item>
          {step === 1 ? (
            <RegionSelector
              stateList={states}
              handleSteps={handleSteps}
            />
          ) : step === 2 ? (
            <MapComponent
              handleSteps={handleSteps}
              selectedToEditSite={selectedToEditSite}
              setSelectedToEditSite={setSelectedToEditSite}
              counties={counties}
            />
          ) : (
            null
          )}
        </Grid>
      )}

      <SiteConditionForm
        council={siteCondition.council}
        counties={counties}
      />
    </Grid>
  );
};
export default SiteCondition;
