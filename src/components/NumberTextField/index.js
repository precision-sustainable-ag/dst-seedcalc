import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

const NumberTextField = ({
  value,
  label,
  onChange,
  disabled,
  placeholder,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    // update value for disabled textfields(this might cause problems for editable fields)
    if (disabled) {
      setDisplayValue(value.toLocaleString());
    }
  }, [value]);

  // regex for only number or number with decimal
  const regex = /^[0-9]\d*(\.\d+)?$/;

  // value validation using parseFloat
  const handleChange = (e) => {
    const val = e.target.value;
    setDisplayValue(e.target.value);
    if (!regex.test(val)) {
      setError(true);
      setHelperText('Invalid Value!');
    } else {
      setError(false);
      setHelperText('');
      // TODO: NOTE: the onChange would only call with a number value
      onChange(parseFloat(val));
    }
  };

  // remove , when focus
  const handleFocus = (e) => {
    const val = parseFloat(e.target.value.replace(/,/g, ''));
    setDisplayValue(val);
  };

  // when textfield lose focus, parse the value to localestring
  const handleBlur = (e) => {
    const val = parseFloat(e.target.value.replace(/,/g, ''));
    if (!Number.isNaN(val)) {
      setDisplayValue(val.toLocaleString());
    }
  };

  return (
    <TextField
      fullWidth
      value={displayValue}
      label={label}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      placeholder={placeholder}
      disabled={disabled}
      sx={{
      // custom style for undisabled textbox
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #4F5F30',
        },
      }}
      error={error}
      helperText={helperText}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default NumberTextField;
