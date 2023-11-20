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
import { setCountyIdRedux, setSoilDrainageRedux } from '../../../../features/siteConditionSlice/actions';
import '../steps.scss';

const SiteCondition = ({ council, completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const { siteCondition } = data.value;
  const { counties } = data.value;
  const { NRCS } = data.value;

  // Location state
  const stateList = data.value.states;
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(siteCondition.locationStep);

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
    if (data.value.states.length === 0) {
      dispatch(getLocality());
    }
  }, []);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== '') {
      const countyId = counties.filter(
        (c) => c.label === siteCondition.county,
      )[0].id;
      handleUpdateSteps('countyId', 'siteCondition', countyId);
      // TODO: new site redux here
      dispatch(setCountyIdRedux(countyId));
    }
  }, [siteCondition.county]);

  // TODO: temporary solution to update new soilD redux
  useEffect(() => {
    dispatch(setSoilDrainageRedux(siteCondition.soilDrainage));
  }, [siteCondition.soilDrainage]);

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
      dispatch(getCrops({ regionId: siteCondition.countyId }));
    }
  }, [siteCondition]);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2">Tell us about your planting site</Typography>
      </Grid>
      {/* <Grid item xs={12} sx={{ height: "1000px" }}></Grid> */}
      {data.loading === 'getLocality' ? (
        <Spinner />
      ) : (
        <Grid xs={12} lg={8} item>
          {step === 1 ? (
            <RegionSelector
              stateList={stateList}
              handleSteps={handleSteps}
              siteCondition={siteCondition}
              handleUpdateSteps={handleUpdateSteps}
              step={step}
            />
          ) : step === 2 ? (
            <MapComponent
              step={step}
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

      <Grid container>
        <SiteConditionForm
          siteCondition={siteCondition}
          handleSteps={handleSteps}
          step={step}
          handleUpdateSteps={handleUpdateSteps}
          council={council}
          counties={counties}
          NRCS={NRCS}
        />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
