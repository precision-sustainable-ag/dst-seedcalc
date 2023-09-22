import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Map } from "@psa/dst.ui.map";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PlaceIcon from "@mui/icons-material/Place";

import "./mapComponent.css";
import { Dropdown } from "../../../../../../components/Dropdown";

const MapComponent = ({
  handleLocation,
  lat,
  lng,
  handleSteps,
  step,
  selectedState,
  states,
}) => {
  return (
    <Grid xs={12} container className="map-container">
      <Grid xs={5} item>
        {step !== 1 && (
          <Button
            className="location-back-button"
            variant="contained"
            onClick={() => handleSteps("back", false)}
          >
            <PlaceIcon /> Select State
          </Button>
        )}
      </Grid>

      <Grid xs={12} md={12} item>
        <Map
          setAddress={handleLocation}
          initWidth="100%"
          padding="20px"
          initHeight="360px"
          initLat={lat}
          initLon={lng}
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
