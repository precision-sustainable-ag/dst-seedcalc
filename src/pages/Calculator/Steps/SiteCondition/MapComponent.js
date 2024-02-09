import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Map } from '@psa/dst.ui.map';
import { Button } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useDispatch, useSelector } from 'react-redux';
import { getZoneData, getSSURGOData } from '../../../../features/siteConditionSlice/api';
import {
  setCountyRedux, setSoilDrainageRedux, updateLatlonRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import '../steps.scss';
import { soilDrainageValues } from '../../../../shared/data/dropdown';

const MapComponent = ({
  handleSteps,
  selectedToEditSite,
  setSelectedToEditSite,
  counties,
}) => {
  const dispatch = useDispatch();
  const siteCondition = useSelector((state) => state.siteCondition);

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
      <Grid xs={2} item p="10px">
        <Button variant="contained" onClick={() => handleSteps('back')}>
          <PlaceIcon />
          {' '}
          Select State
        </Button>
      </Grid>

      <Grid xs={12} md={12} item>
        <Map
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
      </Grid>
    </Grid>
  );
};

export default MapComponent;
