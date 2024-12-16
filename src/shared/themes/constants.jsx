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
    case 1:
      return [
        { lastName: 'Davis', firstName: 'Brian', Affiliation: 'North Carolina State University' },
        { lastName: 'Marcillo', firstName: 'Guillermo', Affiliation: 'North Carolina State University' },
        { lastName: 'Peterson', firstName: 'Cara', Affiliation: 'University of Maryland' },
        { lastName: 'Sweep', firstName: 'Ethan', Affiliation: 'USDA ARS' },
        { lastName: 'Schomberg', firstName: 'Harry', Affiliation: 'USDA ARS' },
        { lastName: 'Purtilo', firstName: 'Jim', Affiliation: 'University of Maryland' },
        { lastName: 'Musial', firstName: 'Christian', Affiliation: 'University of Maryland' },
        { lastName: 'Lorenzi', firstName: 'Eli', Affiliation: 'University of Maryland' },
        { lastName: 'Jachja', firstName: 'Tiffany', Affiliation: 'University of Maryland' },
        { lastName: 'Wallace', firstName: 'Eric', Affiliation: 'University of Maryland' },
        { lastName: 'Aviles', firstName: 'Miguel', Affiliation: 'University of Maryland' },
        { lastName: 'Dalal', firstName: 'Sohum', Affiliation: 'University of Maryland' },
        { lastName: 'Choi', firstName: 'Brian', Affiliation: 'University of Maryland' },
        { lastName: 'Ma', firstName: 'Yanzhuo', Affiliation: 'University of Maryland' },
        { lastName: 'Nolan', firstName: 'Jack', Affiliation: 'University of Maryland' },
        { lastName: 'Pradhan', firstName: 'Neelima', Affiliation: 'University of Maryland' },
        { lastName: 'McCloskey', firstName: 'Mark', Affiliation: 'University of Maryland' },
        { lastName: 'Lee', firstName: 'Alex', Affiliation: 'University of Maryland' },
        { lastName: 'Hyun Lim', firstName: 'Jeong', Affiliation: 'University of Maryland' },
        { lastName: 'McNamee', firstName: 'Patrick', Affiliation: 'University of Maryland' },
        { lastName: 'Obizoba', firstName: 'Chukwuebuka', Affiliation: 'University of Maryland' },
        { lastName: 'Proctor', firstName: 'Alex', Affiliation: 'University of Maryland' },
        { lastName: 'Tamrakar', firstName: 'Sushant', Affiliation: 'University of Maryland' },
        { lastName: 'Feder', firstName: 'Matthew', Affiliation: 'University of Maryland' },
        { lastName: 'Kovvuru', firstName: 'Gautham', Affiliation: 'University of Maryland' },
        { lastName: 'Lee', firstName: 'Isaac', Affiliation: 'University of Maryland' },
        { lastName: 'Patel', firstName: 'Meekit', Affiliation: 'University of Maryland' },
        { lastName: 'Stumbaugh', firstName: 'Ryan', Affiliation: 'University of Maryland' },
        { lastName: 'Wallberg', firstName: 'Micah', Affiliation: 'University of Maryland' },
        { lastName: 'Wilton', firstName: 'Zachary', Affiliation: 'University of Maryland' },
      ];
    case 2:
      return (
        <>
          <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
            The MCCC verifies cover crop data at the state/provence level with cover crop experts from diverse state geographies and a breadth of experience.
            These experts include University Extension, Government Agencies, seed industry, and farmers.
          </Typography>
          <br />
          <a
            target="_blank"
            style={
          { fontSize: '20px', display: 'flex', justifyContent: 'center' }
          }
            href="https://midwestcovercrops.org/decision-tool-collaborators/"
            rel="noreferrer"
          >
            <b>About The Experts </b>
          </a>
        </>
      );
    case 3:
      return [
        { lastName: 'Bench', firstName: 'Christian', Affiliation: 'New Jersey farmer, USDA NRCS' },
        { lastName: 'Bergstrom', firstName: 'Gary', Affiliation: 'Cornell University' },
        { lastName: 'Björkman', firstName: 'Thomas', Affiliation: 'Cornell University' },
        { lastName: 'Brown', firstName: 'Rebecca', Affiliation: 'Rhode Island State University' },
        { lastName: 'Cavigelli', firstName: 'Michel', Affiliation: 'USDA ARS' },
        { lastName: 'Clark', firstName: 'Shawnna', Affiliation: 'USDA NRCS Plant Materials Center' },
        { lastName: 'Cochrane', firstName: 'Chad', Affiliation: 'USDA NRCS' },
        { lastName: 'Cooper', firstName: 'Aaron', Affiliation: 'Maryland farmer' },
        { lastName: 'Darby', firstName: 'Heather', Affiliation: 'University of Vermont' },
        { lastName: 'Duiker', firstName: 'Sjoerd', Affiliation: 'Penn State University' },
        { lastName: 'Farbotnik', firstName: 'Kaitlin', Affiliation: 'USDA NRCS' },
        { lastName: 'Gallandt', firstName: 'Eric', Affiliation: 'University of Maine' },
        { lastName: 'Gill', firstName: 'Kelly', Affiliation: 'Xerces Society' },
        { lastName: 'Goodson', firstName: 'Mark', Affiliation: 'USDA NRCS' },
        { lastName: 'Hively', firstName: 'W. Dean', Affiliation: 'USGS' },
        { lastName: 'Hooks', firstName: 'Cerruti', Affiliation: 'University of Maryland' },
        { lastName: 'Hyde', firstName: 'Jim', Affiliation: 'USDA NRCS' },
        { lastName: 'Larson', firstName: 'Zach', Affiliation: 'Bayer' },
        { lastName: 'Lilley', firstName: 'Jason', Affiliation: 'University of Maine' },
        { lastName: 'Long', firstName: 'Rebecca', Affiliation: 'University of Maine' },
        { lastName: 'Mallory', firstName: 'Ellen', Affiliation: 'University of Maine' },
        { lastName: 'Mehl', firstName: 'Hillary', Affiliation: 'USDA ARS' },
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA ARS' },
        { lastName: 'O Reilly', firstName: 'Christine', Affiliation: 'Ontario Ministry of Agriculture, Food, and Rural Affairs' },
        { lastName: 'Raubenstein', firstName: 'Scott', Affiliation: 'Perdue AgriBusinesses' },
        { lastName: 'Ruhl', firstName: 'Lindsey', Affiliation: 'University of Vermont' },
        { lastName: 'Salon', firstName: 'Paul', Affiliation: 'USDA NRCS, retired' },
        { lastName: 'Smith', firstName: 'Brandon', Affiliation: 'American Farmland Trust' },
        { lastName: 'VanGessel', firstName: 'Mark', Affiliation: 'University of Delaware' },
        { lastName: 'Verhallen', firstName: 'Anne', Affiliation: 'Ontario Ministry of Agriculture, Food, and Rural Affairs, ret.' },
        { lastName: 'Wallace', firstName: 'John', Affiliation: 'Penn State University' },
        { lastName: 'Wilson', firstName: 'Dave', Affiliation: 'Kings AgriSeeds' },
        { lastName: 'Workman', firstName: 'Kirsten', Affiliation: 'Cornell University' },
      ];
    case 4:
      return [
        { lastName: 'Cappellazzi', firstName: 'Shannon', Affiliation: 'GO Seed' },
        { lastName: 'Berns', firstName: 'Keith ', Affiliation: 'Nebraska farmer, Green Cover Seed' },
        { lastName: 'Chase', firstName: 'Carlene', Affiliation: 'University of Florida' },
        { lastName: 'Treadwell', firstName: 'Danielle', Affiliation: 'University of Florida' },
        { lastName: 'Haramoto', firstName: 'Erin', Affiliation: 'University of Kentucky' },
        { lastName: 'Berns', firstName: 'Jakin', Affiliation: 'Green Cover Seed' },
        { lastName: 'Rupert', firstName: 'Jonathan', Affiliation: 'Smith Seed Services' },
        { lastName: 'Lofton', firstName: 'Josh', Affiliation: 'Oklahoma State University' },
        { lastName: 'Gaskin', firstName: 'Julia', Affiliation: 'University of Georgia, retired' },
        { lastName: 'Balkcom', firstName: 'Kip', Affiliation: 'USDA ARS' },
        { lastName: 'Reiter', firstName: 'Mark', Affiliation: 'Virginia Tech' },
        { lastName: 'Lowder', firstName: 'Nathan', Affiliation: 'USDA NRCS' },
        { lastName: 'Basinger', firstName: 'Nicholas', Affiliation: 'Unversity of Georgia' },
        { lastName: 'Stout Evans', firstName: 'Rachel', Affiliation: 'USDA NRCS' },
        { lastName: 'Waring', firstName: 'Robert', Affiliation: 'Virginia farmer ' },
        { lastName: 'Seehaver', firstName: 'Sarah', Affiliation: 'North Carolina State University' },
        { lastName: 'Dempsey', firstName: 'Mark', Affiliation: 'Carolina Farm Stewardship Association' },
        { lastName: 'Singh Farmaha', firstName: 'Bhupinder', Affiliation: 'Clemson University' },
        { lastName: 'Fultz', firstName: 'Lisa', Affiliation: 'Louisiana State University AgCenter, USDA ARS' },
        { lastName: 'Gamble', firstName: 'Audrey', Affiliation: 'Auburn University' },
        { lastName: 'Hendrix', firstName: 'James', Affiliation: 'Louisiana State University AgCenter' },
        { lastName: 'Kelton', firstName: 'Jessica', Affiliation: 'Auburn University' },
        { lastName: 'McWhirt', firstName: 'Amanda', Affiliation: 'University of Arkansas' },
        { lastName: 'Panicker', firstName: 'Girish', Affiliation: 'Alcorn State University' },
        { lastName: 'Park', firstName: 'Dara', Affiliation: 'Clemson University' },
        { lastName: 'Prevost', firstName: 'Dan', Affiliation: 'Southern Ag, Inc.' },
        { lastName: 'Rajan', firstName: 'Nithya', Affiliation: 'Texas A&M University' },
        { lastName: 'Rudolph', firstName: 'Rachel', Affiliation: 'University of Kentucky' },
        { lastName: 'Thomas', firstName: 'Mark', Affiliation: 'Mountain View Seeds' },
        { lastName: 'Walker', firstName: 'Forbes', Affiliation: 'University of Tennessee' },
        { lastName: 'Ye', firstName: 'Rongzhong', Affiliation: 'Clemson University' },
        { lastName: 'Williams', firstName: 'Mary (Mimi)', Affiliation: 'USDA NRCS Plant Materials Center' },
        { lastName: 'Cole', firstName: 'Tracy', Affiliation: 'USDA NRCS' },
        { lastName: 'Proctor', firstName: 'Stuart', Affiliation: 'USDA NRCS' },
        { lastName: 'Scoggins', firstName: 'Keith', Affiliation: 'USDA NRCS' },
        { lastName: 'Green', firstName: 'Steven', Affiliation: 'Arkansas State University' },
        { lastName: 'Stone', firstName: 'Caleb', Affiliation: 'USDA NRCS' },
        { lastName: 'Vega', firstName: 'Rafael', Affiliation: 'USDA NRCS' },
        { lastName: 'Valencia', firstName: 'Elide', Affiliation: 'University of Puerto Rico' },
        { lastName: 'Leonard', firstName: 'Thomas', Affiliation: 'Gaia Herbs' },
        { lastName: 'Anoruo', firstName: 'Florence', Affiliation: 'South Carolina State University' },
        { lastName: 'Best', firstName: 'Terry', Affiliation: 'USDA NRCS' },
        { lastName: 'Sykes', firstName: 'Virginia', Affiliation: 'University of Tennessee' },
        { lastName: 'Rodriguez', firstName: 'Mario', Affiliation: 'USDA NRCS' },
        { lastName: 'Marrero', firstName: 'Edrick', Affiliation: 'USDA NRCS' },
        { lastName: 'Matos', firstName: 'Manuel', Affiliation: 'USDA NRCS' },
        { lastName: 'Vega', firstName: 'Jacqueline', Affiliation: 'USDA NRCS' },
      ];
    case 5:
      return (
        <>
          <Typography style={{ paddingTop: '15px' }} variant="body1" align="left">
            Data for the Western Cover Crop Council is soon to come!
          </Typography>
          <br />
          <a target="_blank" style={{ fontSize: '20px', display: 'flex', justifyContent: 'center' }} href="https://westerncovercrops.org/" rel="noreferrer">
            <b>Western Cover Crop Council Site </b>
          </a>
        </>
      );
    default:
      return [
        { lastName: 'Mirsky', firstName: 'Steven', Affiliation: 'USDA-ARS' },
        { lastName: 'Reberg-Horton', firstName: 'Chris', Affiliation: 'North Carolina State University' },
        { lastName: 'Bandooni', firstName: 'Rohit', Affiliation: 'North Carolina State University' },
        { lastName: 'Raturi', firstName: 'Ankita', Affiliation: 'Purdue University' },
        { lastName: 'Norton', firstName: 'Juliet', Affiliation: 'Purdue University' },
        { lastName: 'Morrow', firstName: 'Anna', Affiliation: 'Purdue University' },
        { lastName: 'Ackroyd', firstName: 'Victoria', Affiliation: 'University of Maryland' },
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
      ];
  }
};
