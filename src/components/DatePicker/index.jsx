import React from 'react';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

/*
{
    name: DatePicker
    description: Re-usable Date Picker component,
    params: {
        label: Date Label
        value: Date value
        handleChange: Function when user selects a date
    }
}
*/

const DatePicker = ({
  label, value, handleChange,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Stack spacing={3}>
      <DesktopDatePicker
        label={label}
        format="MM/DD/YYYY"
        value={dayjs(value)}
        onChange={handleChange}
        slotProps={{
          textField: {
            sx: {
              '.MuiPickersOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, .45)' },
              color: 'red',
            },
          },
        }}
      />
    </Stack>
  </LocalizationProvider>
);

export default DatePicker;
