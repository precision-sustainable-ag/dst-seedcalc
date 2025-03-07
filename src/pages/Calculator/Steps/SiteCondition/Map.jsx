import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
// import { Map as MapComponent } from '@psa/dst.ui.map';
import MapComponent from 'redux-map';
// import { PSAButton, Map as MapComponent } from 'shared-react-components/src';
import { PSAButton } from 'shared-react-components/src';
import { useDispatch, useSelector } from 'react-redux';
import { soilDrainageValues } from '../../../../shared/data/dropdown';
import {
  setCountyRedux, setSoilDrainageRedux, updateLatlonRedux, updateTileDrainageRedux,
  setCountyIdRedux,
} from '../../../../features/siteConditionSlice/actions';
import { setHistoryDialogStateRedux, setMaxAvailableStepRedux } from '../../../../features/userSlice/actions';
import { getZoneData, getSSURGOData } from '../../../../features/siteConditionSlice/api';
import { historyStates } from '../../../../features/userSlice/state';
import pirschAnalytics from '../../../../shared/utils/analytics';
import '../steps.scss';

const Map = ({
  setStep, regions,
}) => {
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [mapFeatures, setMapFeatures] = useState([]);

  const { state: stateName, council, latlon } = useSelector((state) => state.siteCondition);
  const { historyState, maxAvailableStep } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (historyState !== historyStates.imported) {
      pirschAnalytics('Site Condition', {
        meta: { state: stateName },
      });
    }
  }, []);

  // update county/zone, latlon, soil drainage based on address
  useEffect(() => {
    const latitude = selectedToEditSite.lat;
    const longitude = selectedToEditSite.lon;
    const zipCode = selectedToEditSite?.address?.zipCode;
    const county = selectedToEditSite?.address?.county;

    // console.log({
    //   latitude,
    //   longitude,
    //   zipCode,
    //   county,
    // });

    if (Object.keys(selectedToEditSite).length > 0) {
      if (latitude === latlon[0] && longitude === latlon[1]) return;
      if (maxAvailableStep > -1) dispatch(setMaxAvailableStepRedux(-1));
      if (historyState === historyStates.imported) {
        dispatch(setHistoryDialogStateRedux({ open: true, type: 'update' }));
        // reset map location to history redux
        setMapFeatures([{
          type: 'Feature',
          geometry: {
            coordinates: [latlon[1], latlon[0]],
            type: 'Point',
          },
        }]);
        return;
      }
      // update county/zone for MCCC/NECCC
      if (council === 'MCCC') {
        const filteredCounty = regions.filter((c) => county.toLowerCase().includes(c.label.toLowerCase()));
        if (filteredCounty.length > 0) {
          dispatch(setCountyRedux(filteredCounty[0].label));
          dispatch(setCountyIdRedux(filteredCounty[0].id));
        }
      } else if (council === 'NECCC' || council === 'SCCC') {
        dispatch(getZoneData({ zip: zipCode })).then((res) => {
          const countyName = `Zone ${res.payload.replace(/[^0-9]/g, '')}`;
          // FIXME: temporary workaround for NECCC areas in zone 8(MD, DE and NJ), will update in the future
          if (council === 'NECCC' && countyName === 'Zone 8') {
            dispatch(setCountyRedux('Zone 7'));
            dispatch(setCountyIdRedux(4));
          } else {
            dispatch(setCountyRedux(countyName));
            const countyId = regions.filter(
              (c) => c.label === countyName,
            )[0].id;
            dispatch(setCountyIdRedux(countyId));
          }
        });
      }
      // update latlon
      dispatch(updateLatlonRedux([latitude, longitude]));
      // update soil drainage
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
        dispatch(updateTileDrainageRedux('', false));
      });
    }
  }, [selectedToEditSite]);

  return (
    <Grid container>
      <Grid xs={12} md={12} item>
        <MapComponent
          setProperties={(map) => setSelectedToEditSite(map)}
          initWidth="100%"
          padding="20px"
          initHeight="360px"
          initLat={latlon[0]}
          initLon={latlon[1]}
          initFeatures={mapFeatures}
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
          hasElevation
          hasFreehand
          hasHelp
        />
        <Grid item xs={12} p="1rem">
          <PSAButton buttonType="" variant="contained" onClick={() => setStep(1)} sx={{ margin: '1rem' }} title="Back" />
          <PSAButton buttonType="" variant="contained" onClick={() => setStep(3)} sx={{ margin: '1rem' }} title="Edit Details" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Map;
