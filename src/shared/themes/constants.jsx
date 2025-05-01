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
        { lastName: 'Ackroyd', firstName: 'Victoria', Affiliation: 'University of Maryland' },
        { lastName: 'Gaskin', firstName: 'Julia', Affiliation: 'Univ. of Georgia' },
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA ARS' },
        { lastName: 'Reberg-Horton', firstName: 'Chris', Affiliation: 'North Carolina State University' },
        { lastName: 'Bandooni', firstName: 'Rohit', Affiliation: 'North Carolina State University' },
        { lastName: 'Morrow', firstName: 'Anna', Affiliation: 'Purdue University' },
        { lastName: 'Darby', firstName: 'Heather', Affiliation: 'University of Vermont' },
        { lastName: 'Davis', firstName: 'Brian', Affiliation: 'North Carolina State University' },
        { lastName: 'Pinegar', firstName: 'Mikah', Affiliation: 'North Carolina State University' },
        { lastName: 'Hitchcock', firstName: 'Rick', Affiliation: 'University of Georga' },
        { lastName: 'Smith', firstName: 'Adam', Affiliation: 'North Carolina State University' },
        { lastName: 'Puckett', firstName: 'Trevor', Affiliation: 'North Carolina State University' },
        { lastName: 'Agamohammadnia', firstName: 'Milad', Affiliation: 'North Carolina State University' },
        { lastName: 'Xu', firstName: 'Jingtong', Affiliation: 'North Carolina State University' },
        { lastName: 'Adusumelli', firstName: 'Vyshnavi', Affiliation: 'North Carolina State University' },
        { lastName: 'Chittilapilly', firstName: 'Boscosylvester John', Affiliation: 'North Carolina State University' },
        { lastName: 'Chavan', firstName: 'Ameya', Affiliation: 'North Carolina State University' },
        { lastName: 'Darby ', firstName: 'Heather ', Affiliation: 'University of Vermont' },
        { lastName: 'Paul', firstName: 'Salon', Affiliation: 'USDA NRCS, retired' },
        { lastName: 'Bjorkman ', firstName: 'Thomas', Affiliation: 'Cornell University' },
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
        { lastName: 'Ackroyd', firstName: 'Victoria', Affiliation: 'University of Maryland' },
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA ARS' },
        { lastName: 'Paul', firstName: 'Salon', Affiliation: 'USDA NRCS, retired' },
        { lastName: 'VanGessel', firstName: 'Mark ', Affiliation: 'University of Delaware' },
        { lastName: 'Raubenstein', firstName: 'Scott', Affiliation: 'Perdue AgriBusinesses' },
        { lastName: 'Cooper', firstName: 'Aaron', Affiliation: 'Maryland farmer' },
        { lastName: 'Workman', firstName: 'Kirsten', Affiliation: 'Cornell University' },
        { lastName: 'Goodson', firstName: 'Mark', Affiliation: 'USDA NRCS' },
        { lastName: 'Wilson', firstName: 'Dave', Affiliation: ' Kings AgriSeeds' },
        { lastName: 'Verhallen', firstName: 'Anne ', Affiliation: 'Ontario Ministry of Agriculture, Food, and Rural Affairs, ret.' },
        { lastName: 'Majewski', firstName: 'Carl', Affiliation: 'University of New Hampshire Extension' },
        { lastName: 'Cochrane', firstName: 'Chad', Affiliation: 'USDA NRCS' },
        { lastName: 'Bench', firstName: 'Christian', Affiliation: 'New Jersey farmer, USDA NRCS' },
        { lastName: 'Hyde', firstName: 'Jim', Affiliation: 'USDA NRCS' },
        { lastName: 'Gates', firstName: 'Dale', Affiliation: 'USDA NRCS' },
        { lastName: 'Larson', firstName: 'Zach', Affiliation: 'Bayer' },
        { lastName: 'Shawnna ', firstName: 'Clark', Affiliation: 'USDA NRCS Plant Materials Center' },
        { lastName: 'Wallace ', firstName: 'John', Affiliation: 'Penn State University' },
        { lastName: 'Bjorkman ', firstName: 'Thomas', Affiliation: 'Cornell University' },
        { lastName: 'Brown ', firstName: 'Kate', Affiliation: 'Rutgers University' },
        { lastName: 'Hashemi ', firstName: 'Masoud', Affiliation: 'University of Massachusetts-Amherst' },
        { lastName: 'Darby ', firstName: 'Heather ', Affiliation: 'University of Vermont' },
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
