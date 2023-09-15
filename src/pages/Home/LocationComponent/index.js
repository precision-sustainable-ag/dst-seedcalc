import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import RegionSelector from "./RegionSelector";
import MapComponent from "./MapComponent";
import { updateSteps } from "../../../features/stepSlice";
import { getRegion, getSSURGOData } from "../../../features/stepSlice/api";
import statesLatLongDict from "../../../shared/data/statesLatLongDict";

const LocationComponent = ({ council }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const siteCondition = data.siteCondition;
  const stateList = data.states;

  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(1);
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState({});

  // update logic
  const handleUpdateSteps = (key, type, val) => {
    dispatch(
      updateSteps({
        type: type,
        key: key,
        value: val,
      })
    );
  };

  // RegionalSelector function to update Redux with the latitude/longitude based on state selected.
  const handleStateDropdown = (val) => {
    const stateSelected = stateList.filter((s, i) => s.label === val)[0];
    setSelectedState(stateSelected);
    handleUpdateSteps("state", "siteCondition", val);
    handleUpdateSteps("stateSelected", "siteCondition", stateSelected);
  };
  //
  const handleState = (val) => {
    // Update lat/lon state values
    const stateSelected = stateList.filter((s) => s.label === val)[0];
    setSelectedToEditSite({
      ...selectedToEditSite,
      latitude: statesLatLongDict[val][0],
      longitude: statesLatLongDict[val][1],
    });
    // Update Redux
    handleUpdateSteps("latitude", "siteCondition", statesLatLongDict[val][0]);
    handleUpdateSteps("longitude", "siteCondition", statesLatLongDict[val][1]);
    handleUpdateSteps(
      "council",
      "siteCondition",
      stateSelected.parents[0].shorthand
    );
    handleUpdateSteps("state", "siteCondition", val);
    handleUpdateSteps("stateId", "siteCondition", stateSelected.id);
    // Retrieve region and SSURGO data
    dispatch(getRegion({ regionId: stateSelected.id })).then((res) => {});
    dispatch(
      getSSURGOData({
        lat: statesLatLongDict[val][0],
        lon: statesLatLongDict[val][1],
      })
    );
  };

  const handleSteps = (type, complete) => {
    type === "next" ? setStep(step + 1) : setStep(step - 1);
    type === "back" && setSelectedToEditSite({});
    complete && handleCompleteLocation();
  };
  const handleCompleteLocation = () => {
    handleUpdateSteps("locationSelected", "siteCondition", true);
    dispatch(getRegion({ regionId: siteCondition.siteId })).then((res) => {});
  };

  // mapStateToEdit effect
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
      handleUpdateSteps("latitude", "siteCondition", latitude);
      handleUpdateSteps("longitude", "siteCondition", longitude);
      handleUpdateSteps("address", "siteCondition", address);
      handleUpdateSteps("zipCode", "siteCondition", zipCode);
      handleUpdateSteps("county", "siteCondition", county);
    }
  }, [selectedToEditSite]);

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

  // useEffect for selectedState

  useEffect(() => {
    if (Object.keys(selectedState).length !== 0) {
      handleState(selectedState.label);
      handleUpdateSteps("stateSelected", "siteCondition", selectedState);
    }
  }, [selectedState]);

  const renderMap = () => {
    return (
      <MapComponent
        council={siteCondition.council}
        currentStep={step}
        currentState={siteCondition.state}
        handleLocation={setSelectedToEditSite}
        handleSteps={handleSteps}
        list={stateList}
        handleState={handleState}
        val={""}
        lat={siteCondition.latitude}
        lng={siteCondition.longitude}
      />
    );
  };

  const renderRegionSelector = () => {
    return (
      <>
        <RegionSelector
          states={stateList}
          handleNext={handleSteps}
          // setMapState={handleState}
          setMapState={setMapState}
          setSelectedState={handleStateDropdown}
          selectedState={selectedState}
        />
      </>
    );
  };
  return (
    <Grid xs={12} container>
      <Grid xs={2} item>
        <Button onClick={() => handleSteps("back", false)}>
          <ArrowBackIosIcon />
          Back
        </Button>
      </Grid>
      <Grid xs={8} item></Grid>
      <Grid xs={2} item>
        <Button onClick={() => handleSteps("next", step === 2 ? true : false)}>
          Next
          <ArrowForwardIosIcon />
        </Button>
      </Grid>
      <Grid xs={12} item>
        {step === 1 && stateList.length !== 0 ? (
          renderRegionSelector()
        ) : step === 2 && stateList.length !== 0 ? (
          renderMap()
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};

export default LocationComponent;
