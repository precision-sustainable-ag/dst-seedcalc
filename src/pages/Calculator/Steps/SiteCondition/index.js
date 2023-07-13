import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { DatePicker } from "./../../../../components/DatePicker";
import { Dropdown } from "./../../../../components/Dropdown";
import { NumberTextField } from "./../../../../components/NumberTextField";
import { DSTSwitch } from "./../../../../components/Switch";
import { updateSteps } from "./../../../../features/stepSlice";
import states from "./../../../../shared/data/states.json";
import counties from "./../../../../shared/data/countiesAndStates.json";
import { soilDrainage } from "./../../../../shared/data/dropdown";
import { getCrops, getCropsById } from "./../../../../features/stepSlice";
import "./../steps.css";

const SiteCondition = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps);
  const siteCondition = data.value.siteCondition;

  const [checked, setChecked] = useState(data.value.NRCS.enabled);

  const handleUpdateSteps = (key, type, val) => {
    const data = {
      type: type,
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const handleSwitch = () => {
    setChecked(!checked);
    handleUpdateSteps("enabled", "NRCS", !checked);
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
              handleUpdateSteps("county", "siteCondition", e.target.value);
            }}
            size={12}
            items={countyFilter}
          />
        </Grid>
      );
    }
  };

  useEffect(() => {
    dispatch(getCrops());
    dispatch(
      getCropsById({
        cropId: "148",
        regionId: "18",
        countyId: "180",
        url: "https://developapi.covercrop-selector.org/v2/crops/148?regions=18&context=seed_calc&regions=180",
      })
    );
  }, []);
  return (
    <Grid container justifyContent="center" alignItems="center" size={12}>
      <Grid item xs={12} className="site-condition-header">
        <Typography variant="h2" className="site-condition-header">
          Tell us about your planting site
        </Typography>
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Dropdown
          value={siteCondition.state}
          label={"State: "}
          handleChange={(e) => {
            handleUpdateSteps("state", "siteCondition", e.target.value);
            handleUpdateSteps("county", "siteCondition", "");
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
            console.log("e", e);
            const formattedDate = `${e["$M"] + 1}/${e["$D"]}/${e["$y"]}`;
            console.log("formatted date", formattedDate);
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
        <Typography variant="nrcsStandard">Check NRCS Standards: </Typography>
        <DSTSwitch checked={checked} handleChange={handleSwitch} />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
