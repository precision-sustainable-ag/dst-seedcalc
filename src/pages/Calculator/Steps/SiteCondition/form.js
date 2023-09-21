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
      {/* <Grid item xs={5} md={3}>
          <Button onClick={navigateToLocationPage}>
            <ArrowBackIosIcon />
            Change Location
          </Button>
        </Grid>
        <Grid item xs={7} md={9}></Grid> */}

      <Grid item xs={12} padding={15} className="site-condition-container">
        <Dropdown
          value={selectedState?.label || ""}
          label={"State: "}
          handleChange={(e) => handleStateDropdown(e.target.value)}
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
            handleUpdateSteps("soilDrainage", "siteCondition", e.target.value);
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

export default SiteConditionForm;
