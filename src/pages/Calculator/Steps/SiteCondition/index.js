/* eslint-disable no-nested-ternary */
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
import { getCrops } from '../../../../features/calculatorSlice/api';
import { getLocality, getRegion } from '../../../../features/siteConditionSlice/api';
import {
  setCouncilRedux, setSiteConditionRedux, setStateRedux, updateLatlonRedux,
} from '../../../../features/siteConditionSlice/actions';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';
import DSTImport from '../../../../components/DSTImport';
import SiteConditionForm from './form';
import Map from './Map';
import HistoryDialog, { historyDialogFromEnums } from '../../../../components/HistoryDialog';
import initialState from '../../../../features/siteConditionSlice/state';
import '../steps.scss';

const SiteCondition = ({ completedStep, setCompletedStep, token }) => {
  // Location state
  const [step, setStep] = useState(1);
  const [mapState, setMapState] = useState({});
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);

  const dispatch = useDispatch();
  const siteCondition = useSelector((state) => state.siteCondition);

  // function to get all regions(counties/zones) of a state
  const getRegions = async (selectedState) => {
    const council = selectedState.parents[0].shorthand;
    const res = await dispatch(getRegion({ stateId: selectedState.id }));
    const { kids } = res.payload.data;
    if (council === 'NECCC' || council === 'SCCC') return kids.Zones;
    if (council === 'MCCC') return kids.Counties;
    return [];
  };

  // update redux based on state change
  const updateStateRedux = (selectedState) => {
    // set all siteCondition redux value to default
    // FIXME: this also set loading and error to false, need to make changes to redux apis
    // maybe move them to user api
    dispatch(setSiteConditionRedux(initialState));

    // TODO: if back to prev step is enabled, then also need to initiate calculator redux

    // Update state in siteCondition
    const { label } = selectedState;
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  const mapStateChange = async (state) => {
    setMapState(state);
    if (Object.keys(state).length !== 0) {
      const st = states.filter(
        (s) => s.label === state.properties.STATE_NAME,
      );
      if (st.length > 0) {
        // update regions everytime there's a state change FROM MAP
        const res = await getRegions(st[0]);
        setRegions(res);
        // if select a new state (st[0].label different from redux state), update all related redux values
        if (st[0].label !== siteCondition.state) updateStateRedux(st[0]);
      }
    }
  };

  // initially get states data
  useEffect(() => {
    const getStates = async () => {
      const res = await dispatch(getLocality());
      setStates([...states, ...res.payload]);
    };
    if (states.length === 0) getStates();
  }, []);

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
      dispatch(getCrops({ regionId: siteCondition.countyId }));
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
                selectorFunction={mapStateChange}
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
              <DSTImport token={token} />
              <HistoryDialog
                buttonLabel="create new calculation"
                from={historyDialogFromEnums.siteCondition}
                token={token}
              />
            </>
          ) : step === 2 ? (
            <Map
              setStep={setStep}
              regions={regions}
            />
          ) : step === 3 ? (
            <SiteConditionForm
              stateList={states}
              setStep={setStep}
              regions={regions}
              setRegions={setRegions}
              getRegions={getRegions}
              updateStateRedux={updateStateRedux}
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
