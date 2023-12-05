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
import { getCrops, getLocality } from '../../../../features/stepSlice/api';
import { updateSteps } from '../../../../features/stepSlice/index';
import { isEmptyNull, validateForms } from '../../../../shared/utils/format';
import SiteConditionForm from './form';
import RegionSelector from './RegionSelector';
import MapComponent from './MapComponent';
import { setCountyIdRedux } from '../../../../features/siteConditionSlice/actions';
import '../steps.scss';
import { getCropsNew } from '../../../../features/calculatorSlice/api';
import { getLocalityNew } from '../../../../features/siteConditionSlice/api';

const SiteCondition = ({ completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const { siteCondition } = data.value;
  // TODO: new redux state here
  const newSiteCondition = useSelector((state) => state.siteCondition);

  // Location state
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(1);
  const stateList = useSelector((state) => state.siteCondition.states);
  const { counties } = useSelector((state) => state.siteCondition);

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  // update redux value
  const handleUpdateSteps = (key, type, val) => {
    const newData = {
      type,
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

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
    dispatch(getLocality());
    dispatch(getLocalityNew());
  }, []);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (newSiteCondition.county !== '' && counties.length > 0) {
      const countyId = counties.filter(
        (c) => c.label === siteCondition.county,
      )[0].id;
      handleUpdateSteps('countyId', 'siteCondition', countyId);
      // TODO: new site redux here
      dispatch(setCountyIdRedux(countyId));
    }
  }, [newSiteCondition.county, counties]);

  // set favicon based on redux council value
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (newSiteCondition.council === 'MCCC') {
      favicon.href = 'favicons/mccc-favicon.ico';
    } else if (newSiteCondition.council === 'NECCC') {
      favicon.href = 'favicons/neccc-favicon.ico';
    } else if (newSiteCondition.council === '') {
      favicon.href = 'PSALogo.png';
    }
  }, [newSiteCondition.council]);

  // validate all information on this page is selected, then call getCrops api
  useEffect(() => {
    const checkNextStep = !isEmptyNull(newSiteCondition.state)
      && !isEmptyNull(newSiteCondition.soilDrainage)
      && !isEmptyNull(newSiteCondition.acres)
      && newSiteCondition.acres > 0
      && !isEmptyNull(newSiteCondition.county);
    validateForms(checkNextStep, 0, completedStep, setCompletedStep);
    // call getCrops api to get all crops from countyId
    if (checkNextStep) {
      dispatch(getCrops({ regionId: newSiteCondition.countyId }));
      dispatch(getCropsNew({ regionId: newSiteCondition.countyId }));
    }
  }, [newSiteCondition]);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2">Tell us about your planting site</Typography>
      </Grid>
      {/* FIXME: this should be updated with new redux */}
      {data.loading === 'getLocality' ? (
        <Spinner />
      ) : (
        <Grid xs={12} lg={8} item>
          {step === 1 ? (
            <RegionSelector
              stateList={stateList}
              handleSteps={handleSteps}
              handleUpdateSteps={handleUpdateSteps}
            />
          ) : step === 2 ? (
            <MapComponent
              handleSteps={handleSteps}
              selectedToEditSite={selectedToEditSite}
              setSelectedToEditSite={setSelectedToEditSite}
              siteCondition={siteCondition}
              handleUpdateSteps={handleUpdateSteps}
              counties={counties}
            />
          ) : (
            null
          )}
        </Grid>
      )}

      <SiteConditionForm
        handleUpdateSteps={handleUpdateSteps}
        council={newSiteCondition.council}
        counties={counties}
      />
    </Grid>
  );
};
export default SiteCondition;
