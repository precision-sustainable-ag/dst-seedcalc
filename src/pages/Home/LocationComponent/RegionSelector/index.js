import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { RegionSelectorMap } from "@psa/dst.ui.region-selector-map";
import { Typography } from "@mui/material/styles/createTypography";

import { availableStates } from "../../../../shared/data/dropdown";
import { Dropdown } from "../../../../components/Dropdown";

const RegionSelector = ({
  currentStep,
  setSelectedRegion,
  setMapState,
  handleNext,
  value,
  states,
}) => {
  return (
    <Grid xs={12} container>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Dropdown
          value={value}
          label={"State: "}
          handleChange={(e) => setMapState(e.target.value)}
          size={12}
          items={states}
        />
      </Grid>
      <Grid xs={1} item></Grid>
      <Grid xs={10} item>
        <RegionSelectorMap
          selectorFunction={(e) => {
            console.log("setMapState", e.properties.STATE_NAME, states);
            setMapState(e.properties.STATE_NAME);
          }}
          selectedState={value}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="400px"
          initLon={-95}
          initLat={43}
          initStartZoom={2}
        />
      </Grid>
      <Grid xs={1} item></Grid>
      <Grid xs={2} item></Grid>
      <Grid xs={8} item></Grid>
      <Grid xs={2} item>
        <Button onClick={() => handleNext("next", false)}>Next</Button>
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
