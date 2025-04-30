/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Typography,
} from '@mui/material';

export const CustomStyles = () => ({
  progressColor: '#2b7b79',
  darkGreen: '#598444',
  defaultFontSize: '1em',
  lighterGreen: '#598445',
  lightGreen: '#add08f',
  greenishWhite: '#f0f7eb',
  primaryProgressBtnColor: '#49a8ab',
  primaryProgressBtnBorderColor: '#62b8bc',
  secondaryProgressBtnColor: '#e3f2f4',
  secondaryProgressBtnBorderColor: '#e3f2f4',
  fullyRoundedRadius: '200px',
  semiRoundedRadius: '10px',
  _10pxRoundedRadius: '10px',
  _5pxRoundedRadius: '5px',
  mildlyRoundedRadius: '5px',
  nonRoundedRadius: '0px',
  defaultButtonPadding: '10px 20px 10px 20px',
});

export const getExpertsData = (councilId) => {
  switch (councilId) {
    case 0:
      return [
        { lastName: 'Norton', firstName: 'Juliet', Affiliation: 'Purdue University' },
        { lastName: 'Raturi', firstName: 'Ankita', Affiliation: 'Purdue University' },
        { lastName: 'Ackroyd', firstName: 'Victoria', Affiliation: 'UMD/USDA-ARS' },
        { lastName: 'Gaskin', firstName: 'Julia', Affiliation: 'Univ. of Georgia' },
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA ARS' },
      ];
    case 1:
      return (
        <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
          Data not available
        </Typography>
      );
    case 2:
      return (
        <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
          Data not available
        </Typography>
      );
    case 3:
      return [
        { lastName: 'Ackroyd', firstName: 'Victoria', Affiliation: 'UMD/USDA-ARS' },
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA ARS' },
      ];
    case 4:
      return [
        { lastName: 'Wszelaki', firstName: 'Annette', Affiliation: 'Univ of Tennessee' },
        { lastName: 'Balkcom', firstName: 'Kip', Affiliation: 'USDA ARS' },
        { lastName: 'Treadwell', firstName: 'Danielle', Affiliation: 'Univ. of Florida' },
        { lastName: 'Seehaver', firstName: 'Sarah', Affiliation: 'North Carolina State Univ.' },
        { lastName: 'Rupert', firstName: 'John', Affiliation: 'Smith Seed' },
        { lastName: 'Berns', firstName: 'Jakin', Affiliation: 'Green Cover Seed, MS' },
        { lastName: 'Lowder', firstName: 'Nathan', Affiliation: 'USDA NRCS' },
        { lastName: 'Gaskin', firstName: 'Julia', Affiliation: 'Univ. of Georgia' },
        { lastName: 'Waring', firstName: 'Robert', Affiliation: 'Farmer, VA' },
        { lastName: 'Haramoto', firstName: 'Erin', Affiliation: 'Univ. of Kentucky' },
        { lastName: 'Peshek', firstName: 'Brett', Affiliation: 'Farmer, Green Cover Seed' },
        { lastName: 'Reiter', firstName: 'Mark', Affiliation: 'Virginia Tech' },
        { lastName: 'Evans', firstName: 'Rachel', Affiliation: 'USDA NRCS' },
        { lastName: 'Lofton', firstName: 'Josh', Affiliation: 'Oklahoma State Univ.' },
        { lastName: 'Chase', firstName: 'Carlene', Affiliation: 'Univ. of Florida' },
        { lastName: 'Basinger', firstName: 'Nicholas', Affiliation: 'Univ. of Georgia' },
        { lastName: 'Cappellazzi', firstName: 'Shannon', Affiliation: 'GO Seed' },
        { lastName: 'Dempsey', firstName: 'Mark', Affiliation: 'Carolina Farm Stewardship Association' },
        { lastName: 'Fultz', firstName: 'Lisa', Affiliation: 'LSU AgCenter' },
        { lastName: 'Gamble', firstName: 'Audrey', Affiliation: 'Auburn University' },
        { lastName: 'Hendrix', firstName: 'James', Affiliation: 'member' },
        { lastName: 'Kelton', firstName: 'Jessica', Affiliation: 'Auburn University' },
        { lastName: 'McWhirt', firstName: 'Amanda', Affiliation: 'University of Arkansas' },
        { lastName: 'Panicker', firstName: 'Girish', Affiliation: 'Alcorn State University' },
        { lastName: 'Park', firstName: 'Dara', Affiliation: 'Clemson UNiversity' },
        { lastName: 'Prevost', firstName: 'Dan', Affiliation: '' },
        { lastName: 'Rajan', firstName: 'NITHYA', Affiliation: 'TEXAS A&M' },
        { lastName: 'Rudolph', firstName: 'Rachel', Affiliation: 'Univ. of KY' },
        { lastName: 'Thomas', firstName: 'Mark', Affiliation: 'Seed industry' },
        { lastName: 'Walker', firstName: 'Forbes', Affiliation: 'University of Tennessee' },
        { lastName: 'Ye', firstName: 'Rongzhong', Affiliation: 'Clemson University' },
        { lastName: 'Williams', firstName: 'Mimi', Affiliation: 'NRCS PMCs' },
        { lastName: 'Cole', firstName: 'Tracy', Affiliation: 'NRCS' },
        { lastName: 'Proctor', firstName: 'Stuart', Affiliation: 'NRCS' },
        { lastName: 'Scoggins', firstName: 'Keith', Affiliation: 'NRCS' },
        { lastName: 'Green', firstName: 'Steven', Affiliation: 'Arkansas State Univ.' },
        { lastName: 'Stone', firstName: 'Caleb', Affiliation: 'NRCS' },
        { lastName: 'Vega', firstName: 'Rafael', Affiliation: 'NRCS' },
        { lastName: 'Valencia', firstName: 'Elide', Affiliation: 'Univ. of Puerto Rico, SCCC Board' },
        { lastName: 'Leonard', firstName: 'Thomas', Affiliation: 'Gaia Herbs' },
        { lastName: 'Anoruo', firstName: 'Florence', Affiliation: 'South Carolina State University/1890' },
        { lastName: 'Sykes', firstName: 'Virginia', Affiliation: 'Univ. of Tennessee' },
        { lastName: 'Singh Farmaha', firstName: 'Bhupinder', Affiliation: 'Clemson University' },
        { lastName: 'L. Best', firstName: 'Terry', Affiliation: 'Govt Employee - Soil Conservationist' },
      ];
    case 5:
      return (
        <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
          Data not available
        </Typography>
      );
    default:
      return (
        <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
          Data not available
        </Typography>
      );
  }
};
