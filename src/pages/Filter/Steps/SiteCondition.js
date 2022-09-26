import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { DatePicker } from "../../../components/DatePicker";
import { Dropdown } from "../../../components/Dropdown";
import { DSTButton } from "../../../components/Button";
import { SearchField } from "../../../components/SearchField";
import { NumberTextField } from "../../../components/NumberTextField";
import { DSTSwitch } from "../../../components/Switch";
import { updateSteps } from "../../../features/stepSlice";
import states from "./../../../shared/data/states.json";
import counties from "./../../../shared/data/countiesAndStates.json";
import { soilDrainage } from "./../../../shared/data/dropdown";
import "./steps.css";
const SiteCondition = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const siteCondition = data.value.siteCondition;
  const [checked, setChecked] = useState(false);

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "siteCondition",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  const handleSwitch = () => {
    setChecked(!checked);
  };
  const renderCountyList = () => {
    const countyFilter = counties
      .filter((a, i) => a.State === siteCondition.state)
      .map((b, i) => b.County);
    if (siteCondition.state !== "") {
      return (
        <Grid item xs={12} padding={15} className="site-condition-container">
          <Dropdown
            value={siteCondition.county}
            label={"County: "}
            handleChange={(e) => {
              handleUpdateSteps("county", e.target.value);
            }}
            size={12}
            items={countyFilter}
          />
        </Grid>
      );
    }
  };
  return (
    <Grid container justifyContent="center" alignItems="center" size={12}>
      <Grid item xs={12} className="site-condition-header">
        <h2>Tell us about your planting site</h2>
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Dropdown
          value={siteCondition.state}
          label={"State: "}
          handleChange={(e) => {
            handleUpdateSteps("state", e.target.value);
            handleUpdateSteps("county", "");
          }}
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
            handleUpdateSteps("soilDrainage", e.target.value);
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
            console.log("date picka", e["$d"]);
            handleUpdateSteps("plannedPlantingDate", e["$d"]);
          }}
        />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <NumberTextField
          value={siteCondition.acres}
          label={"Acres"}
          handleChange={(e) => {
            console.log("eeee", e);
            handleUpdateSteps("acres", e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <h3>Check NRCS Standards: </h3>
        <DSTSwitch checked={checked} handleChange={handleSwitch} />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
