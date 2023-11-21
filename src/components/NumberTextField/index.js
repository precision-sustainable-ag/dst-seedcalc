import React from 'react';
import TextField from '@mui/material/TextField';

const NumberTextField = ({
  value,
  label,
  handleChange,
  className,
  disabled,
  placeholder,
}) => (
  <TextField
    fullWidth
    className={className}
    value={value}
    label={label}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
    type="number"
    placeholder={placeholder}
    disabled={disabled}
  />
);

export default NumberTextField;
