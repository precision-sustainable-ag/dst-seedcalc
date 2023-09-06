import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Map } from "@psa/dst.ui.map";
import { Button } from "@mui/material";

import "./mapComponent.css";
import { Dropdown } from "../../../../components/Dropdown";

const MapComponent = ({
  council,
  currentStep,
  handleState,
  handleLocation,
  handleSteps,
  list,
  currentState,
  val,
  lat,
  lng,
}) => {
  return (
    <Grid xs={12} container>
      <Grid item xs={1}></Grid>
      <Grid item xs={3} className=" map-component-dropdown">
        <Dropdown
          value={currentState}
          label={"States: "}
          handleChange={(e) => {
            handleState(e.target.value);
          }}
          disabled={true}
          size={12}
          items={list}
        />
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={5} className="">
        <Typography className="map-council-text">
          <span className="map-council-text-bold">Council:</span> {council}
        </Typography>
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid xs={1} item></Grid>
      <Grid xs={10} item>
        <Map
          setAddress={handleLocation}
          initWidth="100%"
          padding="20px"
          initHeight="400px"
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
      <Grid xs={1} item></Grid>
      <Grid xs={2} item>
        <Button onClick={() => handleSteps("back", false)}>Back</Button>
      </Grid>
      <Grid xs={8} item></Grid>
      <Grid xs={2} item>
        <Button
          onClick={() => handleSteps("next", currentStep === 2 ? true : false)}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default MapComponent;
