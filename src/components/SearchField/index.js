import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

/*
{
    name: SearchField,
    description: Re-usable Search Field component,
    params: {
      value: value of string
      handleChange: logic for onChange
    }
}
*/

const SearchField = ({ value, handleChange }) => (
  <Paper
    sx={{
      p: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '80%',
    }}
  >
    <InputBase
      sx={{ pl: 1, flex: 1 }}
      value={value}
      placeholder="Search Filter list"
      inputProps={{ 'aria-label': 'Search Filter List' }}
      onChange={handleChange}
    />
    <IconButton
      type="button"
      sx={{ p: '0.625rem', color: 'primary.text' }}
      aria-label="search"
    >
      <SearchIcon />
    </IconButton>
  </Paper>
);

export default SearchField;
