//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { getCrops, getLocality } from "../../../../features/stepSlice/api";
import { updateSteps } from "../../../../features/stepSlice/index";
import { isEmptyNull, validateForms } from "../../../../shared/utils/format";
import SiteConditionForm from "./form";
import RegionSelector from "./RegionSelector";
import MapComponent from "./MapComponent";
import { DSTLoading } from "../../../../components/DSTLoading";
import "./../steps.css";

const SiteCondition = ({ council, completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const siteCondition = data.value.siteCondition;
  const counties = data.value.counties;
  const NRCS = data.value.NRCS;

  // Location state
  const stateList = data.value.states;
  const [selectedToEditSite, setSelectedToEditSite] = useState({});
  const [step, setStep] = useState(siteCondition.locationStep);

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  // update redux value
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

  // handle steps for the map
  const handleSteps = (type) => {
    type === "next" ? setStep(step + 1) : setStep(step - 1);
    type === "back" && setSelectedToEditSite({});
  };

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  // initially get states data
  useEffect(() => {
    if (data.value.states.length === 0) {
      dispatch(getLocality());
    }
  }, []);

  // Ensure that county id is updated to the current county
  useEffect(() => {
    if (siteCondition.county !== "") {
      const countyId = counties.filter(
        (c, i) => c.label === siteCondition.county
      )[0].id;
      handleUpdateSteps("countyId", "siteCondition", countyId);
    }
  }, [siteCondition.county]);

  // validate all information on this page is selected
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
  }, [siteCondition]);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} className="site-condition-header">
        <Typography variant="h2" className="site-condition-header">
          Tell us about your planting site
        </Typography>
      </Grid>
      {/* <Grid item xs={12} sx={{ height: "1000px" }}></Grid> */}

      {data.loading === "getLocality" ? (
        <DSTLoading />
      ) : (
        <Grid xs={12} md={12} item>
          {step === 1 ? (
            <RegionSelector
              stateList={stateList}
              handleSteps={handleSteps}
              siteCondition={siteCondition}
              handleUpdateSteps={handleUpdateSteps}
              step={step}
            />
          ) : step === 2 ? (
            <MapComponent
              step={step}
              handleSteps={handleSteps}
              selectedToEditSite={selectedToEditSite}
              setSelectedToEditSite={setSelectedToEditSite}
              siteCondition={siteCondition}
              handleUpdateSteps={handleUpdateSteps}
              counties={counties}
            />
          ) : (
            <></>
          )}
        </Grid>
      )}

      <Grid container>
        <SiteConditionForm
          siteCondition={siteCondition}
          handleSteps={handleSteps}
          step={step}
          handleUpdateSteps={handleUpdateSteps}
          council={council}
          counties={counties}
          NRCS={NRCS}
        />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
