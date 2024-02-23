import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Map as MapComponent } from '@psa/dst.ui.map';

import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { soilDrainageValues } from '../../../../shared/data/dropdown';
import {
  setCountyRedux, setSoilDrainageRedux, updateLatlonRedux, updateTileDrainageRedux,
} from '../../../../features/siteConditionSlice/actions';
import { getZoneData, getSSURGOData } from '../../../../features/siteConditionSlice/api';

import '../steps.scss';

const Map = ({
  setStep,
}) => {
  // const [isImported, setIsImported] = useState(false);
  const [selectedToEditSite, setSelectedToEditSite] = useState({});

  const siteCondition = useSelector((state) => state.siteCondition);
  const { counties } = siteCondition;

  const dispatch = useDispatch();

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
      <Grid xs={12} md={12} item>
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
        <Grid item xs={12} p="1rem">
          <Button variant="contained" onClick={() => setStep(1)} sx={{ margin: '1rem' }}>Back</Button>
          <Button variant="contained" onClick={() => setStep(3)} sx={{ margin: '1rem' }}>Edit Details</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Map;
