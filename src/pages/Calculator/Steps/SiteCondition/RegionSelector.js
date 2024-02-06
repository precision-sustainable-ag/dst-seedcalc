import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { RegionSelectorMap } from '@psa/dst.ui.region-selector-map';
import PlaceIcon from '@mui/icons-material/Place';
import { useDispatch, useSelector } from 'react-redux';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';
import { availableStates } from '../../../../shared/data/dropdown';
import Dropdown from '../../../../components/Dropdown';
import DSTImport from '../../../../components/DSTImport';
import {
  checkNRCSRedux, setCouncilRedux, setCountyIdRedux, setCountyRedux,
  setSoilDrainageRedux, setSoilFertilityRedux, setStateRedux, updateLatlonRedux,
} from '../../../../features/siteConditionSlice/actions';
import { getRegionNew } from '../../../../features/siteConditionSlice/api';
import { updateDiversityRedux } from '../../../../features/calculatorSlice/actions';
import { clearOptions, clearSeeds } from '../../../../features/calculatorSlice';
import '../steps.scss';

const RegionSelector = ({
  stateList,
  handleSteps,
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
    dispatch(getRegionNew({ stateId: selectedState.id }));

    // Clear all the rest forms value
    dispatch(setCountyRedux(''));
    dispatch(setCountyIdRedux(''));
    dispatch(setSoilDrainageRedux(''));
    dispatch(setSoilFertilityRedux(''));
    dispatch(checkNRCSRedux(false));

    // Clear out all seeds selected in Redux
    dispatch(clearSeeds());
    dispatch(updateDiversityRedux([]));
    dispatch(clearOptions());

    // Update siteCondition Redux
    const { label } = selectedState;
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  /// ///////////////////////////////////////////////////////
  //                      useEffect                       //
  /// ///////////////////////////////////////////////////////

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
            !(newSiteCondition.state)
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
          initHeight="300px"
          initLon={-78}
          initLat={43}
          initStartZoom={3.5}
        />
        <DSTImport setIsImported={setIsImported} />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
