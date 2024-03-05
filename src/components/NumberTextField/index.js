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
    value={value.toLocaleString()}
    label={label}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={InputProps}
    placeholder={placeholder}
    disabled={disabled}
  />
);

export default NumberTextField;
