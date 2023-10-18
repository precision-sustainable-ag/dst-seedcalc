//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { useState } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { DatePicker } from "./../../../../components/DatePicker";
import { Dropdown } from "./../../../../components/Dropdown";
import { NumberTextField } from "./../../../../components/NumberTextField";
import { DSTSwitch } from "./../../../../components/Switch";
import { soilDrainage } from "./../../../../shared/data/dropdown";
import "./../steps.scss";
import "./siteCondition.css";
import { useDispatch } from "react-redux";

const SiteConditionForm = ({
  siteCondition,
  handleUpdateSteps,
  council,
  counties,
  NRCS,
}) => {
  const [checked, setChecked] = useState(NRCS.enabled);
  const dispatch = useDispatch();

  const handleSwitch = () => {
    setChecked(!checked);
    handleUpdateSteps("enabled", "NRCS", !checked);
  };

  const handleRegion = (e) => {
    const countyId = counties.filter((c, i) => c.label === e)[0].id;
    handleUpdateSteps("county", "siteCondition", e);
    if (countyId !== undefined && countyId !== undefined) {
      dispatch(
        getCrops({
          regionId: countyId,
        })
      );
    }
  };

  return (
    <>
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

      <Grid item xs={12} md={6} className="site-condition-form-container">
        <Dropdown
          value={siteCondition.soilDrainage}
          label={"Soil Drainage: "}
          handleChange={(e) => {
            handleUpdateSteps("soilDrainage", "siteCondition", e.target.value);
          }}
          size={12}
          items={soilDrainage}
        />
      </Grid>

      <Grid item xs={12} md={6} className="site-condition-form-container">
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

      <Grid item xs={12} md={6} className="site-condition-form-container">
        <NumberTextField
          value={siteCondition.acres}
          label={"Acres"}
          disabled={false}
          handleChange={(e) => {
            handleUpdateSteps("acres", "siteCondition", e.target.value);
          }}
        />
      </Grid>

      <Grid item xs={12} md={12} className="site-condition-form-container">
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

export default SiteConditionForm;
