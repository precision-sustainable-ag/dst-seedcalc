import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Map as MapComponent } from '@psa/dst.ui.map';

import { Button } from '@mui/material';
import { RegionSelectorMap } from '@psa/dst.ui.region-selector-map';
import PlaceIcon from '@mui/icons-material/Place';
import { useDispatch, useSelector } from 'react-redux';
import statesLatLongDict from '../../../../shared/data/statesLatLongDict';
import { availableStates, soilDrainageValues } from '../../../../shared/data/dropdown';
import {
  checkNRCSRedux, setCouncilRedux, setCountyIdRedux, setCountyRedux,
  setSoilDrainageRedux, setSoilFertilityRedux, setStateRedux, updateLatlonRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import { updateDiversityRedux } from '../../../../features/calculatorSlice/actions';
import { clearOptions, clearSeeds } from '../../../../features/calculatorSlice';
import { getRegionNew, getZoneData, getSSURGOData } from '../../../../features/siteConditionSlice/api';

import '../steps.scss';

const maps = {
  region: 'region',
  map: 'map',
};

const Map = ({
  stateList,
  setStep,
}) => {
  const [currentMap, setCurrentMap] = useState(maps.region);
  const [isImported, setIsImported] = useState(false);
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState({});
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const siteCondition = useSelector((state) => state.siteCondition);

  const { counties } = siteCondition;

  const dispatch = useDispatch();

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
    dispatch(updateTileDrainageRedux(false));
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
      && selectedState.label !== siteCondition.state
    ) {
      updateStateRedux();
    }
  }, [selectedState]);

  useEffect(() => {
    const {
      latitude, longitude, zipCode, county,
    } = selectedToEditSite;

    if (Object.keys(selectedToEditSite).length > 0) {
      if (siteCondition.council === 'MCCC') {
        const filteredCounty = counties.filter((c) => county.toLowerCase().includes(c.label.toLowerCase()));
        if (filteredCounty.length > 0) {
          dispatch(setCountyRedux(filteredCounty[0].label));
        }
      }
      dispatch(updateLatlonRedux([latitude, longitude]));
      dispatch(getZoneData({ zip: zipCode })).then((res) => {
        // update zone data for NECCC
        if (siteCondition.council === 'NECCC') {
          dispatch(setCountyRedux(`Zone ${res.payload.replace(/[^0-9]/g, '')}`));
        }
      });
      dispatch(
        getSSURGOData({
          lat: latitude,
          lon: longitude,
        }),
      ).then((res) => {
        // update soil drainage redux
        const value = res.payload.Table[1][2] ?? '';
        const soilDrainageValue = soilDrainageValues.filter(
          (slice) => slice.label.toLowerCase() === value.toLowerCase(),
        )[0]?.label ?? '';
        dispatch(setSoilDrainageRedux(soilDrainageValue));
        dispatch(updateTileDrainageRedux(false));
      });
    }
  }, [selectedToEditSite]);

  return (
    <Grid container>
      <Grid xs={12} item margin="1rem">
        <Button variant="contained" onClick={() => { setStep(1); }}>Back</Button>
        <Button
          disabled={
            !(siteCondition.state)
          }
          variant="contained"
          onClick={() => { setCurrentMap(currentMap === maps.region ? maps.map : maps.region); }}
        >
          {currentMap === maps.region ? 'Mark Location' : 'Select State'}
          <PlaceIcon />
        </Button>
      </Grid>
      <Grid xs={12} md={12} item>
        {currentMap === maps.region
          ? (
            <RegionSelectorMap
              selectorFunction={setMapState}
              selectedState={siteCondition.state || ''}
              availableStates={availableStates}
              initWidth="100%"
              initHeight="360px"
              initLon={-78}
              initLat={43}
              initStartZoom={4}
            />
          )
          : (
            <>
              <MapComponent
                setAddress={setSelectedToEditSite}
                initWidth="100%"
                padding="20px"
                initHeight="360px"
                initLat={siteCondition.latlon[0]}
                initLon={siteCondition.latlon[1]}
                initStartZoom={12}
                initMinZoom={4}
                initMaxZoom={18}
                hasSearchBar
                hasMarker
                hasNavigation
                hasCoordBar
                hasDrawing
                hasGeolocate
                hasFullScreen
                hasMarkerPopup
                hasMarkerMovable
              />
              <Button variant="contained" onClick={() => setStep(3)}>Edit Details</Button>
            </>
          )}
      </Grid>
    </Grid>
  );
};

export default Map;
