//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { DatePicker } from "./../../../../components/DatePicker";
import { Dropdown } from "./../../../../components/Dropdown";
import { NumberTextField } from "./../../../../components/NumberTextField";
import { DSTSwitch } from "./../../../../components/Switch";
import { soilDrainage } from "./../../../../shared/data/dropdown";
import {
  getCrops,
  getLocality,
  getRegion,
} from "../../../../features/stepSlice/api";
import { updateSteps } from "../../../../features/stepSlice/index";
import LocationComponent from "./LocationComponent";
import { isEmptyNull, validateForms } from "../../../../shared/utils/format";
import "./../steps.css";

const SiteCondition = ({ council, completedStep, setCompletedStep }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const siteCondition = data.value.siteCondition;
  const states = data.value.states.filter(
    (x) => x.parents[0].shorthand === council
  );
  const counties = data.value.counties;
  const [checked, setChecked] = useState(data.value.NRCS.enabled);

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
  const navigateToLocationPage = () => {
    handleUpdateSteps("locationSelected", "siteCondition", false);
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
      const countyFilter = counties.map((b, i) => b.County);
      if (siteCondition.state !== "") {
        return (
          <Grid item xs={12} padding={15} className="site-condition-container">
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
  const handleStates = (e) => {
    const state = states.filter((s, i) => s.label === e.target.value);
    handleUpdateSteps("state", "siteCondition", e.target.value);
    handleUpdateSteps("stateId", "siteCondition", state[0].id);
    handleUpdateSteps("county", "siteCondition", "");
    handleUpdateSteps("countyId", "siteCondition", "");
    state[0].id !== undefined &&
      dispatch(getRegion({ regionId: state[0].id })).then((res) => {});
  };
  const handleRegion = (e) => {
    const countyId = counties.filter((c, i) => c.label === e)[0].id;
    handleUpdateSteps("county", "siteCondition", e);
    handleUpdateSteps("countyId", "siteCondition", countyId);

    dispatch(
      getCrops({
        regionId: countyId,
      })
    );
  };

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
      const countyId = counties.filter(
        (c, i) => c.label === siteCondition.county
      )[0].id;

      dispatch(
        getCrops({
          regionId: countyId,
        })
      );
    }
  }, [siteCondition]);
  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  const renderDropdown = () => {
    return (
      <>
        <Grid item xs={5} md={3}>
          <Button onClick={navigateToLocationPage}>
            <ArrowBackIosIcon />
            Change Location
          </Button>
        </Grid>
        <Grid item xs={7} md={9}></Grid>

        <Grid item xs={12} padding={15} className="site-condition-container">
          <Dropdown
            value={siteCondition.state}
            label={"State: "}
            handleChange={handleStates}
            size={12}
            items={states}
          />
        </Grid>
        {renderCountyList()}
        <Grid item xs={12} padding={15} className="site-condition-container">
          <Dropdown
            value={siteCondition.soilDrainage}
            label={"Soil Drainage: "}
            handleChange={(e) => {
              handleUpdateSteps(
                "soilDrainage",
                "siteCondition",
                e.target.value
              );
            }}
            size={12}
            items={soilDrainage}
          />
        </Grid>
        <Grid item xs={12} padding={15} className="site-condition-container">
          <DatePicker
            label={"Planned Planting Date: "}
            value={siteCondition.plannedPlantingDate}
            handleChange={(e) => {
              const formattedDate = `${e["$M"] + 1}/${e["$D"]}/${e["$y"]}`;
              handleUpdateSteps(
                "plannedPlantingDate",
                "siteCondition",
                formattedDate
              );
            }}
          />
        </Grid>
        <Grid item xs={12} padding={15} className="site-condition-container">
          <NumberTextField
            value={siteCondition.acres}
            label={"Acres"}
            disabled={false}
            handleChange={(e) => {
              handleUpdateSteps("acres", "siteCondition", e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} padding={15} className="site-condition-container">
          {council === "MCCC" && (
            <>
              <Typography variant="nrcsStandard">
                Check NRCS Standards:{" "}
              </Typography>
              <DSTSwitch checked={checked} handleChange={handleSwitch} />
            </>
          )}
        </Grid>
      </>
    );
  };
  return (
    <Grid container justifyContent="center" alignItems="center" size={12}>
      <Grid item xs={12} className="site-condition-header">
        <Typography variant="h2" className="site-condition-header">
          Tell us about your planting site
        </Typography>
      </Grid>
      {!siteCondition.locationSelected ? (
        <Grid xs={12} item>
          <LocationComponent />
        </Grid>
      ) : (
        renderDropdown()
      )}
    </Grid>
  );
};
export default SiteCondition;
