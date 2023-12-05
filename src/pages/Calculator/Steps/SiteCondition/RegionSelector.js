import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { RegionSelectorMap } from '@psa/dst.ui.region-selector-map';
import PlaceIcon from '@mui/icons-material/Place';
import { useDispatch, useSelector } from 'react-redux';
import { getRegion } from '../../../../features/stepSlice/api';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';
import { availableStates } from '../../../../shared/data/dropdown';
import Dropdown from '../../../../components/Dropdown';
import DSTImport from '../../../../components/DSTImport';
import {
  checkNRCSRedux, setCouncilRedux, setCountyIdRedux, setCountyRedux,
  setSoilDrainageRedux, setSoilFertilityRedux, setStateRedux, updateLatlonRedux,
} from '../../../../features/siteConditionSlice/actions';
import '../steps.scss';

const RegionSelector = ({
  stateList,
  handleSteps,
  handleUpdateSteps,
  step,
  setCounties,
}) => {
  const [isImported, setIsImported] = useState(false);
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState({});

  const newSiteCondition = useSelector((state) => state.siteCondition);

  const dispatch = useDispatch();

  /// ///////////////////////////////////////////////////////
  //                      State Logic                     //
  /// ///////////////////////////////////////////////////////

  const handleStateDropdown = (val) => {
    const stateSelected = stateList.filter((s) => s.label === val)[0];
    setSelectedState(stateSelected);
  };

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  // update redux based on selectedState change
  const updateStateRedux = () => {
    // if the state data comes from csv import do not do this to refresh the state
    if (isImported) return;
    setIsImported(false);
    // Retrieve region
    dispatch(getRegion({ stateId: selectedState.id })).then((res) => {
      // set counties/regions
      const council = selectedState.parents[0].shorthand;
      if (council === 'MCCC') setCounties(res.payload.data.kids.Counties);
      else if (council === 'NECCC') setCounties(res.payload.data.kids.Zones);
    });

    // Clear all the rest forms value
    handleUpdateSteps('county', 'siteCondition', '');
    handleUpdateSteps('countyId', 'siteCondition', '');
    handleUpdateSteps('soilDrainage', 'siteCondition', '');
    // TODO: new site redux here
    dispatch(setCountyRedux(''));
    dispatch(setCountyIdRedux(''));
    dispatch(setSoilDrainageRedux(''));
    dispatch(setSoilFertilityRedux(''));
    dispatch(checkNRCSRedux(false));

    // Clear out all seeds selected in Redux
    handleUpdateSteps('seedsSelected', 'speciesSelection', []);
    handleUpdateSteps('diversitySelected', 'speciesSelection', []);

    // Update siteCondition Redux
    const { label } = selectedState;
    handleUpdateSteps('latitude', 'siteCondition', statesLatLongDict[label][0]);
    handleUpdateSteps(
      'longitude',
      'siteCondition',
      statesLatLongDict[label][1],
    );
    handleUpdateSteps('state', 'siteCondition', label);
    handleUpdateSteps('stateId', 'siteCondition', selectedState.id);
    handleUpdateSteps(
      'council',
      'siteCondition',
      selectedState.parents[0].shorthand,
    );
    handleUpdateSteps('stateSelected', 'siteCondition', selectedState);
    // TODO: new site redux here
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  /// ///////////////////////////////////////////////////////
  //                      useEffect                       //
  /// ///////////////////////////////////////////////////////

  // update selectedState based on map state selection
  useEffect(() => {
    if (Object.keys(mapState).length !== 0) {
      const st = stateList.filter(
        (s) => s.label === mapState.properties.STATE_NAME,
      );
      if (st.length > 0) {
        setSelectedState(st[0]);
      }
    }
  }, [mapState]);

  // handle selectedState change based on dropdown selection or map selection
  useEffect(() => {
    if (
      Object.keys(selectedState).length !== 0
      && selectedState.label !== newSiteCondition.state
    ) {
      updateStateRedux();
    }
  }, [selectedState]);

  return (
    <Grid container>
      <Grid item xs={8} md={10} p="10px">
        <Dropdown
          value={selectedState.label || ''}
          label="State: "
          handleChange={(e) => handleStateDropdown(e.target.value)}
          size={12}
          items={stateList}
        />
      </Grid>
      <Grid
        xs={4}
        md={2}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          disabled={
            !(Object.keys(selectedState).length !== 0 && step !== 2)
          }
          variant="contained"
          onClick={() => handleSteps('next')}
        >
          Mark Location
          {' '}
          <PlaceIcon />
        </Button>
      </Grid>
      <Grid xs={12} md={12} item>
        <RegionSelectorMap
          selectorFunction={setMapState}
          selectedState={newSiteCondition.state || ''}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="360px"
          initLon={-78}
          initLat={43}
          initStartZoom={4}
        />
        <DSTImport setIsImported={setIsImported} />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
