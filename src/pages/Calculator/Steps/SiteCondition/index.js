//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { Dropdown } from "./../../../../components/Dropdown";
import {
  getCrops,
  getLocality,
  getRegion,
  getSSURGOData,
  getZoneData,
} from "../../../../features/stepSlice/api";
import { updateSteps } from "../../../../features/stepSlice/index";
import LocationComponent from "./LocationComponent";
import { isEmptyNull, validateForms } from "../../../../shared/utils/format";
import SiteConditionForm from "./form";
import statesLatLongDict from "../../../../shared/data/statesLatLongDict";
import "./../steps.scss";

const SiteCondition = ({ council, completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const siteCondition = data.value.siteCondition;
  const states = data.value.states.filter(
    (x) => x.parents[0].shorthand === council
  );
  const counties = data.value.counties;
  const [checked, setChecked] = useState(data.value.NRCS.enabled);

  // Location state
  const stateList = data.value.states;
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(siteCondition.locationStep);
  const [mapState, setMapState] = useState({});
  const [selectedState, setSelectedState] = useState(
    Object.keys(siteCondition.stateSelected) > 0
      ? siteCondition.stateSelected
      : {}
  );

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, type, val) => {
    const data = {
      type: type,
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  const handleSwitch = () => {
    setChecked(!checked);
    handleUpdateSteps("enabled", "NRCS", !checked);
  };
  const renderCountyList = () => {
    if (counties.length > 0) {
      if (siteCondition.state !== "") {
        return (
          <Grid item xs={12} md={6} className="site-condition-form-container">
            <Dropdown
              value={siteCondition.county}
              label={
                council === "MCCC" ? "County: " : "USDA Plant Hardiness Zone: "
              }
              handleChange={(e) => handleRegion(e.target.value)}
              size={12}
              items={counties}
            />
          </Grid>
        );
      }
    }
  };
  const handleRegion = (e) => {
    const countyId = counties.filter((c, i) => c.label === e)[0].id;
    console.log("handle region", e, countyId);
    handleUpdateSteps("county", "siteCondition", e);
    if (countyId !== undefined && countyId !== undefined) {
      console.log("handle region pass", e, countyId);
      dispatch(
        getCrops({
          regionId: countyId,
        })
      );
    }
  };

  //////////////////////////////////////////////////////////
  //                   Location Logic                     //
  //////////////////////////////////////////////////////////

  // RegionalSelector function to update Redux with the latitude/longitude based on state selected.
  const handleStateDropdown = (val) => {
    const stateSelected = stateList.filter((s, i) => s.label === val)[0];
    setSelectedState(stateSelected);
    handleUpdateSteps("state", "siteCondition", val);
    handleUpdateSteps("stateSelected", "siteCondition", stateSelected);
  };
  //
  const handleState = (val) => {
    // Clear out all seeds selected in Redux
    handleUpdateSteps("seedsSelected", "speciesSelection", []);
    handleUpdateSteps("diversitySelected", "speciesSelection", []);
    const stateSelected = stateList.filter((s) => s.label === val)[0];

    // Update lat/lon state values
    setSelectedToEditSite({
      ...selectedToEditSite,
      latitude: statesLatLongDict[val][0],
      longitude: statesLatLongDict[val][1],
    });

    // Update Redux
    handleUpdateSteps("latitude", "siteCondition", statesLatLongDict[val][0]);
    handleUpdateSteps("longitude", "siteCondition", statesLatLongDict[val][1]);
    handleUpdateSteps("state", "siteCondition", val);
    handleUpdateSteps("stateId", "siteCondition", stateSelected.id);
    handleUpdateSteps(
      "council",
      "siteCondition",
      stateSelected.parents[0].shorthand
    );

    // Retrieve region and SSURGO data
    stateSelected.id !== undefined &&
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
    siteCondition.siteId !== undefined &&
      dispatch(getRegion({ regionId: siteCondition.siteId })).then((res) => {});
  };

  //////////////////////////////////////////////////////////
  //                 Location useEffect                   //
  //////////////////////////////////////////////////////////

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
      console.log("county", county, counties);
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

  // This is to ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== "") {
      const countyId = counties.filter(
        (c, i) => c.label === siteCondition.county
      )[0].id;
      handleUpdateSteps("countyId", "siteCondition", countyId);
    }
  }, [siteCondition.county]);

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    dispatch(getLocality());
  }, []);

  useEffect(() => {
    validateForms(
      !isEmptyNull(siteCondition.state) &&
        !isEmptyNull(siteCondition.soilDrainage) &&
        siteCondition.acres !== 0 &&
        !isEmptyNull(siteCondition.county),
      0,
      completedStep,
      setCompletedStep
    );
    if (!isEmptyNull(siteCondition.county)) {
      const county = counties.filter(
        (c, i) => c.label === siteCondition.county
      )[0];
      if (county !== undefined && county.id !== undefined) {
        dispatch(
          getCrops({
            regionId: county.id,
          })
        );
      }
    }
  }, [siteCondition]);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2">Tell us about your planting site</Typography>
      </Grid>

      {stateList.length > 0 && (
        <Grid xs={11} md={11} item>
          <LocationComponent
            step={step}
            handleSteps={handleSteps}
            selectedState={selectedState}
            setSelectedToEditSite={setSelectedToEditSite}
            setMapState={setMapState}
            stateList={stateList}
            handleStateDropdown={handleStateDropdown}
            data={data}
            siteCondition={siteCondition}
            handleUpdateSteps={handleUpdateSteps}
          />
        </Grid>
      )}
      <Grid xs={11} md={11} container>
        <SiteConditionForm
          siteCondition={siteCondition}
          states={stateList}
          handleSteps={handleSteps}
          step={step}
          setSelectedState={setSelectedState}
          selectedState={selectedState}
          handleStateDropdown={handleStateDropdown}
          renderCountyList={renderCountyList}
          handleUpdateSteps={handleUpdateSteps}
          council={council}
          checked={checked}
          handleSwitch={handleSwitch}
        />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
