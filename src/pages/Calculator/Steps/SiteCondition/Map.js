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
import { getRegion, getZoneData, getSSURGOData } from '../../../../features/siteConditionSlice/api';

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
  const [selectedToEditSite, setSelectedToEditSite] = useState({});

  const siteCondition = useSelector((state) => state.siteCondition);
  const { counties } = siteCondition;

  const dispatch = useDispatch();

  // update redux based on selectedState change
  const updateStateRedux = (selectedState) => {
    // if the state data comes from csv import do not do this to refresh the state
    if (isImported) return;
    setIsImported(false);
    // Retrieve region/counties
    dispatch(getRegion({ stateId: selectedState.id }));

    // // Clear all the rest forms value
    dispatch(setCountyRedux(''));
    dispatch(setCountyIdRedux(''));
    dispatch(setSoilDrainageRedux(''));
    dispatch(updateTileDrainageRedux(false));
    dispatch(setSoilFertilityRedux(''));
    dispatch(checkNRCSRedux(false));

    // Update siteCondition Redux
    const { label } = selectedState;
    dispatch(updateLatlonRedux(statesLatLongDict[label]));
    dispatch(setStateRedux(label, selectedState.id));
    dispatch(setCouncilRedux(selectedState.parents[0].shorthand));
  };

  // update state redux based on map state change
  useEffect(() => {
    if (Object.keys(mapState).length !== 0) {
      const st = stateList.filter(
        (s) => s.label === mapState.properties.STATE_NAME,
      );
      if (st.length > 0 && st[0].label !== siteCondition.state) {
        updateStateRedux(st[0]);
      }
    }
  }, [mapState]);

  // update county/zone, latlon, soil drainage based on address
  useEffect(() => {
    const {
      latitude, longitude, zipCode, county,
    } = selectedToEditSite;

    if (Object.keys(selectedToEditSite).length > 0) {
      // update county/zone for MCCC/NECCC
      if (siteCondition.council === 'MCCC') {
        const filteredCounty = counties.filter((c) => county.toLowerCase().includes(c.label.toLowerCase()));
        if (filteredCounty.length > 0) {
          dispatch(setCountyRedux(filteredCounty[0].label));
        }
      } else if (siteCondition.council === 'NECCC') {
        dispatch(getZoneData({ zip: zipCode })).then((res) => {
          dispatch(setCountyRedux(`Zone ${res.payload.replace(/[^0-9]/g, '')}`));
        });
      }
      dispatch(updateLatlonRedux([latitude, longitude]));
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
            <>
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
              <Grid item mxs={12} margin="1rem">
                <Button variant="contained" onClick={() => setStep(1)}>Back</Button>
              </Grid>
            </>
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
              <Grid item mxs={12} margin="1rem">
                <Button variant="contained" onClick={() => setStep(3)}>Edit Details</Button>
              </Grid>
            </>
          )}
      </Grid>
    </Grid>
  );
};

export default Map;
