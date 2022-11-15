import { useState } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { DatePicker } from "../../../components/DatePicker";
import { Dropdown } from "../../../components/Dropdown";
import { DSTButton } from "../../../components/Button";
import { SearchField } from "../../../components/SearchField";
import { DSTSwitch } from "../../../components/Switch";
import "./steps.css";
const SiteCondition = () => {
  const [date, setDate] = useState(dayjs("2014-08-18T21:11:54"));
  const [dropdownValue, setDropdownValue] = useState("test");
  const [checked, handleSwitchChange] = useState(false);
  const handleDatePicker = (newDate) => {
    setDate(newDate);
  };
  const handleDropdown = (e) => {
    setDropdownValue(e.target.value);
  };
  const handleSwitch = () => {
    handleSwitchChange(!checked);
  };
  return (
    <Grid container justifyContent="center" alignItems="center" size={12}>
      <Grid item xs={12}>
        <Typography variant="h2">Site Condition</Typography>
      </Grid>

      <Grid item xs={12} padding={15} className="site-condition-container">
        <Typography variant="h3">Date Picker Component: </Typography>
        <DatePicker value={date} handleChange={handleDatePicker} />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Typography variant="h3">Dropdown Component: </Typography>
        <Dropdown
          value={dropdownValue}
          label={"Select item: "}
          handleChange={handleDropdown}
          size={12}
          items={["test", "dropodown", "beep"]}
        />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Typography variant="h3">Button Component: </Typography>
        <DSTButton
          text="Button test"
          buttonClass="dst-button"
          size={12}
          theme="dstTheme"
          path={{ type: "local", url: "/calculator" }}
        />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Typography variant="h3">Search Field Component: </Typography>
        <SearchField />
      </Grid>
      <Grid item xs={12} padding={15} className="site-condition-container">
        <Typography variant="h3">Switch: </Typography>
        <DSTSwitch checked={checked} handleChange={handleSwitch} />
      </Grid>
    </Grid>
  );
};
export default SiteCondition;
