import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 50,
    label: "50",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 70,
    label: "70",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 90,
    label: "90",
  },
  {
    value: 100,
    label: "100",
  },
];
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
        steps={20}
        valueLabelDisplay="auto"
        min={marks[0].value}
        max={marks[2].value}
      />
    </Stack>
  );
};
