import React from 'react';
import { Switch } from '@mui/material';
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

const label = { inputProps: { 'aria-label': 'Switch' } };
const DSTSwitch = ({ checked, handleChange, disabled = false }) => (
  <Switch
    {...label}
    checked={checked}
    onChange={handleChange}
    color="default"
    sx={{
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: 'primary.text',
        opacity: '0.9',
      },
    }}
    disabled={disabled}
  />
);
export default DSTSwitch;
