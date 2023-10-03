import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Map } from "@psa/dst.ui.map";
import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useDispatch } from "react-redux";
import {
  getZoneData,
  getSSURGOData,
} from "../../../../../features/stepSlice/api";

import "../siteCondition.css";

const MapComponent = ({
  handleSteps,
  step,
  selectedToEditSite,
  setSelectedToEditSite,
  siteCondition,
  handleUpdateSteps,
  counties,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { latitude, longitude, address, zipCode, county } =
      selectedToEditSite;

    if (
      latitude === siteCondition.latitude &&
      longitude === siteCondition.longitude
    ) {
      return;
    }

    if (Object.keys(selectedToEditSite).length > 0) {
      if (siteCondition.council === "MCCC") {
        const filteredCounty = counties.filter((c) =>
          county.toLowerCase().includes(c.label.toLowerCase())
        );
        if (filteredCounty.length > 0) {
          console.log("filtered county", filteredCounty, county);
          handleUpdateSteps("county", "siteCondition", filteredCounty[0].label);
        }
      }
      handleUpdateSteps("latitude", "siteCondition", latitude);
      handleUpdateSteps("longitude", "siteCondition", longitude);
      handleUpdateSteps("address", "siteCondition", address);
      handleUpdateSteps("zipCode", "siteCondition", zipCode);
      dispatch(getZoneData({ zip: zipCode }));
      dispatch(
        getSSURGOData({
          lat: latitude,
          lon: longitude,
        })
      );
    }
  }, [selectedToEditSite]);

  return (
    <Grid xs={12} container className="map-container">
      <Grid xs={5} item>
        {step !== 1 && (
          <Button
            className="location-back-button"
            variant="contained"
            onClick={() => handleSteps("back")}
          >
            <PlaceIcon /> Select State
          </Button>
        )}
      </Grid>

      <Grid xs={12} md={12} item>
        <Map
          setAddress={setSelectedToEditSite}
          initWidth="100%"
          padding="20px"
          initHeight="360px"
          initLat={siteCondition.latitude}
          initLon={siteCondition.longitude}
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
