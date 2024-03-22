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
    // FIXME: temporary fix for this
    value={value?.toLocaleString() || 'None'}
    label={label}
    onChange={handleChange}
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={InputProps}
    placeholder={placeholder}
    disabled={disabled}
    sx={{
      // custom style for undisabled textbox
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #4F5F30',
      },
    }}
  />
);

export default NumberTextField;
