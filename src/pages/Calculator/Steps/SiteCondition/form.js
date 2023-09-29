//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { DatePicker } from "./../../../../components/DatePicker";
import { Dropdown } from "./../../../../components/Dropdown";
import { NumberTextField } from "./../../../../components/NumberTextField";
import { DSTSwitch } from "./../../../../components/Switch";
import { soilDrainage } from "./../../../../shared/data/dropdown";
import "./../steps.css";
import "./siteCondition.css";

const SiteConditionForm = ({
  siteCondition,
  states,
  renderCountyList,
  handleUpdateSteps,
  council,
  checked,
  handleSwitch,
  handleStateDropdown,
  setSelectedState,
  selectedState,
}) => {
  return (
    <>
      {renderCountyList()}
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
