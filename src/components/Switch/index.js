import { Switch } from "@mui/material";
import { Fragment } from "react";
/*
{
  name: DSTSwitch,
  description: Re-usable Switch component.
  params: {
    checked: check boolean value to pass in,
    handleChange: handle logic for DSTSwitch
  }
}
*/

const label = { inputProps: { "aria-label": "Switch" } };
export const DSTSwitch = ({ checked, handleChange }) => {
  return (
    <Fragment>
      <Switch
        {...label}
        checked={checked}
        onChange={handleChange}
        color="default"
      />
    </Fragment>
  );
};
