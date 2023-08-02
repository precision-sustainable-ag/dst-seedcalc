import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

/* 
  marks are as follows:
  take val, set that to default value, 
  then set mark as minimum 50 below the current mixing state
  set mark as maximum of 50 above the current mixing state

*/
export const VerticalSlider = ({ value, marks, handleChange }) => {
  return (
    <Stack sx={{ height: "50vh" }} spacing={1} direction="row">
      <Slider
        orientation="vertical"
        getAriaValueText={valuetext}
        defaultValue={marks[1].value}
        steps={10}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={marks[0].value}
        max={marks[2].value}
      />
    </Stack>
  );
};
