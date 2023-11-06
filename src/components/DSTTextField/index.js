import React from "react";
import TextField from "@mui/material/TextField";

export const DSTTextField = ({
  value,
  label,
  handleChange,
  className,
  disabled,
}) => {
  return (
    <TextField
      fullWidth
      className={className}
      value={value}
      label={label}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{ inputProps: { min: 0 }, disabled: disabled }}
    />
  );
};
