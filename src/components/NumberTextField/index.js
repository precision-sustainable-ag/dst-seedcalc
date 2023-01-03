import React from "react";
import TextField from "@mui/material/TextField";

export const NumberTextField = ({
  value,
  label,
  handleChange,
  className,
  disabled,
}) => {
  return (
    <TextField
      fullWidth
      className={className !== "" ? className : "number-text-container"}
      value={value}
      label={label}
      onChange={handleChange}
      id="outlined-number"
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{ inputProps: { min: 0 }, disabled: disabled }}
    />
  );
};
