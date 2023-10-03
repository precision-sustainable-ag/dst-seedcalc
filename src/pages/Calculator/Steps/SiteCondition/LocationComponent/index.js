//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import RegionSelector from "./RegionSelector";
import MapComponent from "./MapComponent";

const LocationComponent = ({
  step,
  handleSteps,
  selectedState,
  setSelectedToEditSite,
  setMapState,
  handleStateDropdown,
  stateList,
  siteCondition,
}) => {
  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  console.log("siteCondition.stateSelected", siteCondition.stateSelected);

  return (
    <Grid xs={12} container>
      <Grid xs={12} item>
        {step === 1 && stateList.length !== 0 ? (
          <RegionSelector
            states={stateList}
            handleSteps={handleSteps}
            handleStateDropdown={handleStateDropdown}
            setMapState={setMapState}
            selectedState={siteCondition.stateSelected}
          />
        ) : step === 2 && stateList.length !== 0 ? (
          <MapComponent
            step={step}
            handleLocation={setSelectedToEditSite}
            handleSteps={handleSteps}
            selectedState={selectedState}
            states={stateList}
            lat={siteCondition.latitude}
            lng={siteCondition.longitude}
          />
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};

export default LocationComponent;
