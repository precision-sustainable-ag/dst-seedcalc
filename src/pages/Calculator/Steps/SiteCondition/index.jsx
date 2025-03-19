/* eslint-disable no-nested-ternary */
/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PSAButton, RegionSelectorMap, PSALoadingSpinner } from 'shared-react-components/src';
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
import { setCalculatorRedux } from '../../../../features/calculatorSlice/actions';
import initialCalculatorState from '../../../../features/calculatorSlice/state';
import initialState from '../../../../features/siteConditionSlice/state';
import '../steps.scss';
import { historyStates } from '../../../../features/userSlice/state';
import { setHistoryDialogStateRedux, setMaxAvailableStepRedux } from '../../../../features/userSlice/actions';
import pirschAnalytics from '../../../../shared/utils/analytics';
import { mapboxToken } from '../../../../shared/data/keys';

const SiteCondition = ({
  siteConditionStep, setSiteConditionStep, completedStep, setCompletedStep,
}) => {
  // Location state
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState({});
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);

  const dispatch = useDispatch();
  const siteCondition = useSelector((state) => state.siteCondition);
  const { historyState, maxAvailableStep } = useSelector((state) => state.user);

  // function to get all regions(counties/zones) of a state
  const getRegions = async (state) => {
    const council = state.parents[0].shorthand;
    const res = await dispatch(getRegion({ stateId: state.id }));
    const { kids } = res.payload.data;
    if (council === 'NECCC' || council === 'SCCC') return kids.Zones;
    if (council === 'MCCC') return kids.Counties;
    return [];
  };

  // update redux based on state change
  const updateStateRedux = (state) => {
    if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
    // set all siteCondition redux value to default
    // FIXME: this also set loading and error to false, need to make changes to redux apis
    // maybe move them to user api
    dispatch(setSiteConditionRedux(initialState));

    // TODO: if back to prev step is enabled, then also need to initiate calculator redux

    // Update state in siteCondition
    const { label } = state;

    // reset all redux values when state changes
    dispatch(setCalculatorRedux(initialCalculatorState));

    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, state.id));
    dispatch(setCouncilRedux(state.parents[0].shorthand));
  };

  const mapStateChange = (state) => {
    setMapState(state);
    if (Object.keys(state).length !== 0) {
      const st = states.filter(
        (s) => s.label === state.properties.STATE_NAME,
      );
      if (st.length > 0) {
        setSelectedState(st[0]);
      }
    }
  };

  const handleSiteConditionSelection = (selection) => {
    if (selection === 'use map') setSiteConditionStep(2);
    if (selection === 'manually enter') setSiteConditionStep(3);
    pirschAnalytics('Site Condition', {
      meta: {
        selection: `${selection}`,
      },
    });
  };

  // initially get states data
  useEffect(() => {
    const getStates = async () => {
      const res = await dispatch(getLocality());
      setStates([...states, ...res.payload]);
    };
    if (states.length === 0) getStates();
  }, []);

  useEffect(() => {
    if (states.length) {
      const state = states.filter((s) => s.label === siteCondition.state);
      if (state.length > 0) {
        setSelectedState(state[0]);
      } else setSelectedState({});
    }
  }, [siteCondition.state, states]);

  useEffect(() => {
    const fetchRegions = async () => {
      const res = await getRegions(selectedState);
      setRegions(res);
    };

    if (Object.keys(selectedState).length !== 0) {
      if (historyState === historyStates.imported && selectedState.label !== siteCondition.state) {
        // open history dialog
        dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
        // reset state to previous state in redux
        const state = states.filter((s) => s.label === siteCondition.state);
        if (state.length > 0) {
          setSelectedState(state[0]);
        } else setSelectedState({});
        return;
      }
      // update regions everytime there's a state change FROM MAP
      fetchRegions();
      // if select a new state (st[0].label different from redux state), update all related redux values
      if (selectedState.label !== siteCondition.state) updateStateRedux(selectedState);
    }
  }, [selectedState]);

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
          <Grid
            item
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100px',
            }}
          >
            <PSALoadingSpinner />
          </Grid>
        ) : (
          siteConditionStep === 1 ? (
            <>
              <RegionSelectorMap
                selectorFunction={mapStateChange}
                selectedState={selectedState.label || ''}
                availableStates={states.map((s) => s.label)}
                initWidth="100%"
                initHeight="360px"
                initLon={-90}
                initLat={39}
                initStartZoom={3}
                mapboxToken={mapboxToken}
              />
              {
                Object.keys(mapState).length > 0
                  ? (
                    <Grid item xs={12} p="1rem">
                      <Typography>
                        Would you like to manually enter your site conditions
                        or use your location to prepopulate them?
                      </Typography>
                      <PSAButton
                        buttonType=""
                        variant="contained"
                        onClick={() => handleSiteConditionSelection('use map')}
                        sx={{ margin: '1rem' }}
                        data-test="option_map"
                        title="Map"
                      />
                      <PSAButton
                        buttonType=""
                        variant="contained"
                        onClick={() => handleSiteConditionSelection('manually enter')}
                        sx={{ margin: '1rem' }}
                        data-test="option_manually"
                        title="Manually Enter"
                      />
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
              <DSTImport />

            </>
          ) : siteConditionStep === 2 ? (
            <Map
              setStep={setSiteConditionStep}
              regions={regions}
            />
          ) : siteConditionStep === 3 ? (
            <SiteConditionForm
              stateList={states}
              setStep={setSiteConditionStep}
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
