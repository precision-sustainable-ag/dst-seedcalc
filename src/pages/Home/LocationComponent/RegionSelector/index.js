import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { RegionSelectorMap } from "@psa/dst.ui.region-selector-map";

import { availableStates } from "../../../../shared/data/dropdown";
import { Dropdown } from "../../../../components/Dropdown";

const RegionSelector = ({
  setMapState,
  setSelectedState,
  handleNext,
  states,
  selectorFunction,
  selectedState,
}) => {
  return (
    <Grid xs={12} container>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Dropdown
          value={selectedState.label || ""}
          label={"State: "}
          handleChange={(e) => setSelectedState(e.target.value)}
          size={12}
          items={states}
        />
      </Grid>
      <Grid xs={1} item></Grid>
      <Grid xs={10} item>
        <RegionSelectorMap
          selectorFunction={setMapState}
          selectedState={selectedState.label}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="400px"
          initLon={-80}
          initLat={40}
          initStartZoom={4}
        />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
