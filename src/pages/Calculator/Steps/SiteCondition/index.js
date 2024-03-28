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
import { RegionSelectorMap } from '@psa/dst.ui.region-selector-map';
import { isEmptyNull, validateForms } from '../../../../shared/utils/format';
import { getCropsNew } from '../../../../features/calculatorSlice/api';
import { getLocality, getRegion } from '../../../../features/siteConditionSlice/api';
import {
  checkNRCSRedux, setAcresRedux, setCouncilRedux, setCountyIdRedux, setCountyRedux,
  setSoilDrainageRedux, setSoilFertilityRedux, setStateRedux, updateLatlonRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';

import '../steps.scss';
import DSTImport from '../../../../components/DSTImport';
import SiteConditionForm from './form';
import Map from './Map';
import HistoryDialog from '../../../../components/HistoryDialog';
import { postHistory } from '../../../../shared/utils/api';

const SiteCondition = ({ completedStep, setCompletedStep, token }) => {
  // Location state
  const [step, setStep] = useState(1);
  const [mapState, setMapState] = useState({});
  const [isImported, setIsImported] = useState(false);
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);

  const dispatch = useDispatch();
  const siteCondition = useSelector((state) => state.siteCondition);

  // function to get all regions(counties/zones) of a state
  const getRegions = async (selectedState) => {
    const council = selectedState.parents[0].shorthand;
    const res = await dispatch(getRegion({ stateId: selectedState.id }));
    const { kids } = res.payload.data;
    if (council === 'NECCC' || council === 'SCCC') setRegions(kids.Zones);
    if (council === 'MCCC') setRegions(kids.Counties);
  };

  // update redux based on selectedState change
  const updateStateRedux = (selectedState) => {
    // if the state data comes from csv import do not do this to refresh the state
    if (isImported) return;
    setIsImported(false);
    // Retrieve region/counties
    getRegions(selectedState);

    // // Clear all the rest forms value
    dispatch(setCountyRedux(''));
    dispatch(setCountyIdRedux(''));
    dispatch(setSoilDrainageRedux(''));
    dispatch(updateTileDrainageRedux(false));
    dispatch(setAcresRedux(0));
    dispatch(setSoilFertilityRedux(''));
    dispatch(checkNRCSRedux(false));

    // Update siteCondition Redux
    const { label } = selectedState;
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  const updateHistory = async () => {
    const name = 'test1';
    const state = 'North Carolina';
    const stateId = 123;
    const data = {
      name, state, stateId,
    };
    const res = await postHistory(token, data);
    console.log(res);
  };

  // initially get states data
  useEffect(() => {
    const getStates = async () => {
      const res = await dispatch(getLocality());
      setStates([...states, ...res.payload]);
    };
    if (states.length === 0) getStates();
  }, []);

  // update state redux based on map state change
  useEffect(() => {
    if (Object.keys(mapState).length !== 0) {
      const st = states.filter(
        (s) => s.label === mapState.properties.STATE_NAME,
      );
      if (st.length > 0 && st[0].label !== siteCondition.state) {
        updateStateRedux(st[0]);
      }
    }
  }, [mapState]);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== '' && regions.length > 0) {
      // FIXME: temporary workaround for NECCC areas in zone 8(MD, DE and NJ), will update in the future
      if (siteCondition.council === 'NECCC' && siteCondition.county === 'Zone 8') {
        dispatch(setCountyRedux('Zone 7'));
        dispatch(setCountyIdRedux(4));
      } else {
        const countyId = regions.filter(
          (c) => c.label === siteCondition.county,
        )[0].id;
        dispatch(setCountyIdRedux(countyId));
      }
    }
  }, [siteCondition.county, regions]);

  // validate all information on this page is selected, then call getCrops api
  useEffect(() => {
    let checkNextStep = !isEmptyNull(siteCondition.state)
      && !isEmptyNull(siteCondition.soilDrainage)
      && !isEmptyNull(siteCondition.acres)
      && siteCondition.acres > 0
      && !isEmptyNull(siteCondition.county);
    if (siteCondition.council === 'NECCC') checkNextStep &&= siteCondition.soilFertility !== '';
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
      <Grid xs={12} item>
        {siteCondition.loading === 'getLocality' ? (
          <Spinner />
        ) : (
          step === 1 ? (
            <>
              <RegionSelectorMap
                selectorFunction={setMapState}
                selectedState={siteCondition.state || ''}
                availableStates={states.map((s) => s.label)}
                initWidth="100%"
                initHeight="360px"
                initLon={-90}
                initLat={39}
                initStartZoom={3}
              />
              {
                Object.keys(mapState).length > 0
                  ? (
                    <Grid item xs={12} p="1rem">
                      <Typography>
                        Would you like to manually enter your site conditions
                        or use your location to prepopulate them?
                      </Typography>
                      <Button variant="contained" onClick={() => setStep(2)} sx={{ margin: '1rem' }}>Map</Button>
                      <Button variant="contained" onClick={() => setStep(3)} sx={{ margin: '1rem' }}>Manually Enter</Button>
                    </Grid>
                  )
                  : (
                    <Grid item xs={12} p="1rem">
                      <Typography fontWeight="bold">
                        Please select your state above.
                      </Typography>
                    </Grid>
                  )
              }
              <DSTImport setIsImported={setIsImported} />
              <HistoryDialog />
            </>
          ) : step === 2 ? (
            <Map
              setStep={setStep}
              counties={regions}
            />
          ) : step === 3 ? (
            <SiteConditionForm
              council={siteCondition.council}
              stateList={states}
              setStep={setStep}
              regions={regions}
              setRegions={setRegions}
            />
          ) : (
            null
          )
        )}
      </Grid>
      <Button onClick={updateHistory}>save</Button>
    </Grid>
  );
};
export default SiteCondition;
