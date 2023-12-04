import React from 'react';
import TextField from '@mui/material/TextField';
import { twoDigit } from '../../shared/utils/calculate';

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
    value={twoDigit(value)}
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
