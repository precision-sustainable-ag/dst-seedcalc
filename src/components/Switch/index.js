import { Switch } from "@mui/material";
import { Fragment } from "react";
/*
{
  name: DSTSwitch,
  description: Re-usable Switch component.
  params: {
    steps: An array of steps as str value
    activeStep: Current active step
    skipped: A set of steps  that are skipped
    handleNext: Function when user clicks "Next"
    handleBack: Function when user clicks "Back"
    handleSkip: Function when user clicks "Skip"
    handleReset: Function when user clicks "Reset"
  }
}
*/

const label = { inputProps: { "aria-label": "Switch" } };
export const DSTSwitch = ({ checked, handleChange }) => {
  return (
    <div>
      <Switch
        {...label}
        checked={checked}
        onChange={handleChange}
        color="default"
      />
    </div>
  );
};
