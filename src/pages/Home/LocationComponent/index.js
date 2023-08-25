import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Map } from "@psa/dst.ui.map";
import { Button } from "@mui/material";

import { Dropdown } from "../../../components/Dropdown";
import RegionSelector from "./RegionSelector";
import MapComponent from "./MapComponent";
import { updateSteps } from "../../../features/stepSlice";
import statesLatLongDict from "../../../shared/data/statesLatLongDict";

const LocationComponent = ({ council }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const siteCondition = data.siteCondition;
  const stateList = data.states;

  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(1);

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
  const handleState = (val) => {
    setSelectedToEditSite({
      ...selectedToEditSite,
      latitude: statesLatLongDict[val][0],
      longitude: statesLatLongDict[val][1],
    });
    const stateSelected = stateList.filter((s, i) => s.label === val)[0];
    handleUpdateSteps("latitude", "siteCondition", statesLatLongDict[val][0]);
    handleUpdateSteps("longitude", "siteCondition", statesLatLongDict[val][1]);

    handleUpdateSteps(
      "council",
      "siteCondition",
      stateSelected.parents[0].shorthand
    );
    handleUpdateSteps("state", "siteCondition", val);
    handleUpdateSteps("stateId", "siteCondition", stateSelected.id);
  };
  const handleSteps = (type, complete) => {
    type === "next" ? setStep(step + 1) : setStep(step - 1);
    type === "back" && setSelectedToEditSite({});
    complete && handleUpdateSteps("locationSelected", "siteCondition", true);
  };

  useEffect(() => {
    const { latitude, longitude, address, zipCode, county } =
      selectedToEditSite;

    if (
      latitude === siteCondition.latitude &&
      longitude === siteCondition.longitude
    ) {
      return;
    }
    console.log(
      "use effect",
      selectedToEditSite,
      latitude,
      longitude,
      address,
      zipCode,
      county
    );
    if (Object.keys(selectedToEditSite).length > 0) {
      handleUpdateSteps("latitude", "siteCondition", latitude);
      handleUpdateSteps("longitude", "siteCondition", longitude);
      handleUpdateSteps("address", "siteCondition", address);
      handleUpdateSteps("zipCode", "siteCondition", zipCode);
      handleUpdateSteps("county", "siteCondition", county);
    }
  }, [selectedToEditSite]);

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
          value={siteCondition.state}
          handleNext={handleSteps}
          setMapState={handleState}
        />
      </>
    );
  };
  return (
    <Grid>
      {step === 1 && stateList.length !== 0 ? (
        renderRegionSelector()
      ) : step === 2 && stateList.length !== 0 ? (
        renderMap()
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default LocationComponent;
