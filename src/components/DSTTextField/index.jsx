import React from 'react';
import TextField from '@mui/material/TextField';

const DSTTextField = ({
  value,
  label,
  handleChange,
  className,
  disabled,
  testId,
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
    InputProps={{ inputProps: { min: 0 }, disabled }}
    data-test={testId}
  />
);

export default DSTTextField;
