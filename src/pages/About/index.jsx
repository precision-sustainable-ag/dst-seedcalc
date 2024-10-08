import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Stack, Typography, Button,
} from '@mui/material';
import { useSelector } from 'react-redux';
import LicenseAndCopyright from './LicenseAndCopyright';

const About = () => {
  const [value, setValue] = useState(0);
  const [attribution, setAttribution] = useState(null);

  const { council } = useSelector((state) => state.siteCondition);

  const pageSections = [
    {
      id: 0,
      menuOption: 'License and Copyright',
      title: 'License and Copyright',
    },
    {
      id: 1,
      menuOption: 'Funding and Acknowledgements',
      title: 'Funding and Acknowledgements',
    },
    {
      id: 2,
      menuOption: 'About the Experts',
      title: 'About The Experts',
    },
  ];

  const getContent = () => {
    switch (value) {
      case 0:
        return (
          <LicenseAndCopyright />
        );
      // case 1:
      //   return (
      //     <FundingAndAcknowledgements />
      //   );
      // case 2: return (
      //   <AboutTheExperts />
      // );
      default: return null;
    }
  };

  useEffect(() => {
    const url = `https://${
      /(localhost|dev)/i.test(window.location) ? 'developapi' : 'api'
    }.covercrop-selector.org/v2/regions?locality=state&context=seed_calc`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAttribution(council === ''
          ? data.attributions.generalStatement
          : data.attributions[council].withoutModifications);
      });
  }, []);

  return (
    <Box sx={{ border: 0.5, borderColor: 'grey.300' }} ml={2} mr={2} mt={5}>
      <Grid container spacing={0} justifyContent="center" mt={4} mb={5} pt={3}>
        <Grid item xs={12} sm={12} md={3.4} lg={3.4} xl={3.4}>
          <div
            style={{
              border: '1px solid #4F5F30',
              borderRight: '0px',
            }}
          >
            {pageSections.map((section) => (
              <Button
                key={section.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  borderRadius: '0px',
                  width: '100%',
                }}
                onClick={() => setValue(section.id)}
                variant={value === section.id ? 'contained' : 'text'}
              >
                {section.menuOption}
              </Button>
            ))}
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          mt={{
            xs: 3, sm: 3, md: 0, lg: 0, xl: 0,
          }}
        >
          <div style={{ border: '1px solid #4F5F30', minHeight: '320px' }}>
            <Stack pl={3} pr={3} pb={4}>
              <center>
                <Typography variant="h4" gutterBottom>
                  {pageSections.filter((section) => section.id === value)[0].title}
                </Typography>
              </center>
              {getContent()}
              <Typography fontSize="12px">{attribution}</Typography>
            </Stack>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
