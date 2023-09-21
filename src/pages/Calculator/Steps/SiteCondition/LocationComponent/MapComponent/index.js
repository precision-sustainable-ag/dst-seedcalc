import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Map } from "@psa/dst.ui.map";
import { Button } from "@mui/material";

import "./mapComponent.css";
import { Dropdown } from "../../../../../../components/Dropdown";

const MapComponent = ({ handleLocation, lat, lng }) => {
  return (
    <Grid xs={12} container className="map-container">
      {/* <Grid item xs={1}></Grid>
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
      <Grid item xs={1}></Grid> */}
      <Grid xs={12} md={12} item>
        <Map
          setAddress={handleLocation}
          initWidth="100%"
          padding="20px"
          initHeight="380px"
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
