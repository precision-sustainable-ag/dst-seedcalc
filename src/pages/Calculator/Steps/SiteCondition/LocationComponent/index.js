//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import RegionSelector from "./RegionSelector";
import MapComponent from "./MapComponent";
import { updateSteps } from "../../../../../features/stepSlice";
import {
  getRegion,
  getSSURGOData,
  getZoneData,
} from "../../../../../features/stepSlice/api";

const LocationComponent = ({
  step,
  handleSteps,
  selectedState,
  setSelectedToEditSite,
  setMapState,
  handleStateDropdown,
  stateList,
  data,
  siteCondition,
  handleUpdateSteps,
}) => {
  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  const renderMap = () => {
    return (
      <MapComponent
        council={siteCondition.council}
        currentStep={step}
        currentState={siteCondition.state}
        handleLocation={setSelectedToEditSite}
        handleSteps={handleSteps}
        list={stateList}
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
          setMapState={setMapState}
          setSelectedState={handleStateDropdown}
          selectedState={selectedState}
        />
      </>
    );
  };

  return (
    <Grid xs={12} container>
      <Grid xs={12} item>
        {step === 1 && stateList.length !== 0 ? (
          renderRegionSelector()
        ) : step === 2 && stateList.length !== 0 ? (
          renderMap()
        ) : (
          <></>
        )}
      </Grid>
      <Grid xs={4} item>
        {step !== 1 && (
          <Button
            sx={{ float: "left" }}
            onClick={() => handleSteps("back", false)}
          >
            <ArrowBackIosIcon />
            Select State
          </Button>
        )}
      </Grid>
      <Grid xs={4} item></Grid>
      <Grid xs={4} item>
        {Object.keys(selectedState).length !== 0 && step !== 2 && (
          <Button
            sx={{ float: "right" }}
            onClick={() => handleSteps("next", step === 2 ? true : false)}
          >
            Mark Location
            <ArrowForwardIosIcon />
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default LocationComponent;
