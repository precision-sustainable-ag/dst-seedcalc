import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { RegionSelectorMap } from "@psa/dst.ui.region-selector-map";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlaceIcon from "@mui/icons-material/Place";

import { availableStates } from "../../../../../../shared/data/dropdown";
import { Dropdown } from "../../../../../../components/Dropdown";
import "./../MapComponent/mapComponent.css";

const RegionSelector = ({
  setMapState,
  selectedState,
  handleStateDropdown,
  states,
  handleSteps,
  step,
}) => {
  return (
    <Grid xs={12} container>
      <Grid item xs={7} md={10} className="site-condition-container">
        <Dropdown
          value={selectedState?.label || ""}
          label={"State: "}
          handleChange={(e) => handleStateDropdown(e.target.value)}
          size={12}
          items={states}
        />
      </Grid>
      <Grid xs={5} md={2} item>
        <Button
          className="mark-location-button"
          disabled={
            Object.keys(selectedState).length !== 0 && step !== 2 ? false : true
          }
          variant={"contained"}
          onClick={() => handleSteps("next", step === 2 ? true : false)}
        >
          Mark Location <PlaceIcon />
        </Button>
      </Grid>
      <Grid xs={12} md={12} item>
        <RegionSelectorMap
          selectorFunction={setMapState}
          selectedState={selectedState.label}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="360px"
          initLon={-78}
          initLat={43}
          initStartZoom={4}
        />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
