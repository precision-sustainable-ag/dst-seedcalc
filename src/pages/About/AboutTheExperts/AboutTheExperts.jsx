/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/*
  This file contains the HelpComponent, helper functions, and styles
  The HelpComponent is a static  help page that has FAQ, how to use, data dictionary, and information sheets
  RenderContent contains all the text listed in the about section
  styled using CustomStyles from ../../shared/constants
*/

import {
  Box, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { PSAButton } from 'shared-react-components/src';
import { getExpertsData } from '../../../shared/themes/constants';

const AboutTheExperts = () => {
  const [value, setValue] = useState(0);

  const expertGroups = [
    { id: 0, menuOption: 'Development Team', dataType: 'array' },
    { id: 1, menuOption: 'Testing Team', dataType: 'empty' },
    { id: 2, menuOption: 'Midwest Cover Crops Council', dataType: 'empty' },
    { id: 3, menuOption: 'Northeast Cover Crops Council', dataType: 'array' },
    { id: 4, menuOption: 'Southern Cover Crops Council', dataType: 'array' },
    { id: 5, menuOption: 'Western Cover Crops Council', dataType: 'JSX' },
  ];

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ border: 0.5, borderColor: 'grey.300' }} ml={2} mr={2} mt={5}>
      {expertGroups.map((group) => (
        <PSAButton
          buttonType=""
          key={group.id}
          size="Small"
          sx={{
            width: '16.6%',
            minHeight: '61px',
            fontSize: '0.6rem',
            backgroundColor: (group.id === value) ? '#598444' : 'white',
            color: (group.id === value) ? 'white' : '#8abc62',
            '&:hover': { backgroundColor: (group.id === value) ? '#598444' : 'white' },
          }}
          onClick={() => handleChange(group.id)}
          variant="contained"
          title={group.menuOption}
        />

      ))}
      <Box style={{ paddingTop: '15px' }} textAlign="left">
        {expertGroups[value].dataType === 'array'
          ? getExpertsData(value)
            .sort((a, b) => a.lastName.localeCompare(b.lastName))
            .map((expert, idx) => (
              <Typography key={idx} variant="body1" gutterBottom sx={{ mb: 1.5, lineHeight: 1.75 }}>
                <strong>{`${expert.lastName}, ${expert.firstName}; `}</strong>
                <span>{expert.Affiliation}</span>
              </Typography>
            ))
          : getExpertsData(value)}
      </Box>

    </Box>
  );
};
export default AboutTheExperts;
