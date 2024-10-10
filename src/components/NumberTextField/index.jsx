import React, { useEffect, useState } from 'react';
import { PSATextField } from 'shared-react-components/src';

const NumberTextField = ({
  value,
  label,
  onChange,
  disabled,
  emptyWarning,
  placeholder,
  sx,
  className,
  testId,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    // TODO: for editable textfields, not use toLocalString since it'll not pass regex check
    if (disabled) {
      setDisplayValue(value.toLocaleString());
    } else setDisplayValue(value);
  }, [value]);

  // regex for only number or number with decimal
  const regex = /^[0-9]\d*(\.\d+)?$/;

  // value validation using parseFloat, call onChange method
  // TODO: NOTE: the onChange would only call with a Number value
  const handleChange = (e) => {
    const val = e.target.value;
    setDisplayValue(e.target.value);
    if (!regex.test(val)) {
      setError(true);
      setHelperText('Invalid Value!');
    } else {
      setError(false);
      setHelperText('');
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
    <PSATextField
      fullWidth
      value={displayValue}
      label={label}
      onChange={handleChange}
      className={className}
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
        '.MuiOutlinedInput-notchedOutline': emptyWarning && {
          borderColor: 'rgba(255, 0, 0, .5)',
        },
        ...sx,
      }}
      error={error}
      helperText={helperText}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-test={testId}
    />
  );
};

export default NumberTextField;
