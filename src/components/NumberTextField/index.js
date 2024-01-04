import React from 'react';
import TextField from '@mui/material/TextField';

const NumberTextField = ({
  value,
  label,
  handleChange,
  disabled,
  placeholder,
  InputProps,
}) => (
  <TextField
    fullWidth
    value={value}
    label={label}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={InputProps}
    type="number"
    placeholder={placeholder}
    disabled={disabled}
  />
);

export default NumberTextField;
