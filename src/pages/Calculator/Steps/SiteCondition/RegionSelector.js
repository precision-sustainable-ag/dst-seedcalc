import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { RegionSelectorMap } from "@psa/dst.ui.region-selector-map";
import PlaceIcon from "@mui/icons-material/Place";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getRegion } from "../../../../features/stepSlice/api";
import statesLatLongDict from "../../../../shared/data/statesLatLongDict";
import { availableStates } from "../../../../shared/data/dropdown";
import { Dropdown } from "../../../../components/Dropdown";
import DSTImport from "../../../../components/DSTImport";
import "./../steps.scss";

const RegionSelector = ({
  stateList,
  handleSteps,
  siteCondition,
  handleUpdateSteps,
  step,
}) => {
  const [isImported, setIsImported] = useState(false);
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState({});

  const dispatch = useDispatch();

  //////////////////////////////////////////////////////////
  //                      State Logic                     //
  //////////////////////////////////////////////////////////

  const handleStateDropdown = (val) => {
    const stateSelected = stateList.filter((s, i) => s.label === val)[0];
    setSelectedState(stateSelected);
  };

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  // update redux based on selectedState change
  const updateStateRedux = (selectedState) => {
    // if the state data comes from csv import do not do this to refresh the state
    if (isImported) return;
    setIsImported(false);
    // Retrieve region
    dispatch(getRegion({ stateId: selectedState.id })).then((res) => {});

    // Clear all the rest forms value
    handleUpdateSteps("county", "siteCondition", "");
    handleUpdateSteps("countyId", "siteCondition", "");
    handleUpdateSteps("soilDrainage", "siteCondition", "");
    // Clear out all seeds selected in Redux
    handleUpdateSteps("seedsSelected", "speciesSelection", []);
    handleUpdateSteps("diversitySelected", "speciesSelection", []);

    // Update siteCondition Redux
    const { label } = selectedState;
    handleUpdateSteps("latitude", "siteCondition", statesLatLongDict[label][0]);
    handleUpdateSteps(
      "longitude",
      "siteCondition",
      statesLatLongDict[label][1]
    );
    handleUpdateSteps("state", "siteCondition", label);
    handleUpdateSteps("stateId", "siteCondition", selectedState.id);
    handleUpdateSteps(
      "council",
      "siteCondition",
      selectedState.parents[0].shorthand
    );
    handleUpdateSteps("stateSelected", "siteCondition", selectedState);
  };

  //////////////////////////////////////////////////////////
  //                      useEffect                       //
  //////////////////////////////////////////////////////////

  // update selectedState based on map state selection
  useEffect(() => {
    if (Object.keys(mapState).length !== 0) {
      const st = stateList.filter(
        (s) => s.label === mapState.properties.STATE_NAME
      );
      if (st.length > 0) {
        setSelectedState(st[0]);
      }
    }
  }, [mapState]);

  // handle selectedState change based on dropdown selection or map selection
  useEffect(() => {
    if (
      Object.keys(selectedState).length !== 0 &&
      selectedState.label !== siteCondition.state
    ) {
      updateStateRedux(selectedState);
    }
  }, [selectedState]);

  return (
    <Grid container>
      <Grid item xs={8} md={10} p={"10px"}>
        <Dropdown
          value={selectedState.label || ""}
          label={"State: "}
          handleChange={(e) => handleStateDropdown(e.target.value)}
          size={12}
          items={stateList}
        />
      </Grid>
      <Grid
        xs={4}
        md={2}
        item
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          disabled={
            Object.keys(selectedState).length !== 0 && step !== 2 ? false : true
          }
          variant={"contained"}
          onClick={() => handleSteps("next")}
        >
          Mark Location <PlaceIcon />
        </Button>
      </Grid>
      <Grid xs={12} md={12} item>
        <RegionSelectorMap
          selectorFunction={setMapState}
          selectedState={siteCondition.stateSelected.label || ""}
          availableStates={availableStates}
          initWidth="100%"
          initHeight="360px"
          initLon={-78}
          initLat={43}
          initStartZoom={4}
        />
        <DSTImport setIsImported={setIsImported} />
      </Grid>
    </Grid>
  );
};

export default RegionSelector;
