import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/*
{
    name: Dropdown,
    description: Re-usable dropdown component,
    params: {
        data: Dropdown value,
        buttonClass: Class of button,
        size: Size of the Dropdown,
        theme: Theme of the button
    }
}
*/
const Dropdown = ({
  value,
  label,
  handleChange,
  items,
  emptyWarning,
  disabled = false,
  minWidth = 120,
}) => (
  <Box sx={{ color: '#4F5F30' }}>
    <FormControl fullWidth sx={{ minWidth }}>
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{ '.MuiOutlinedInput-notchedOutline': emptyWarning && { borderColor: 'rgba(255, 0, 0, .5)' } }}
        disabled={disabled}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {items.map((item, i) => (
          <MenuItem key={`${item}${i}`} value={item.label} color="#4F5F30">
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default Dropdown;
