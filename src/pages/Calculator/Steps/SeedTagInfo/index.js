/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styled from '@emotion/styled';
import NumberTextField from '../../../../components/NumberTextField';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';
import '../steps.scss';

const LeftGrid = styled(Grid)({
  '&.MuiGrid-item': {
    height: '80px',
    paddingTop: '15px',
    '& p': {
      fontWeight: 'bold',
    },
  },
});

const SeedTagInfo = () => {
  const dispatch = useDispatch();
  const { council } = useSelector((state) => state.siteCondition);
  const { seedsSelected, options } = useSelector((state) => state.calculator);

  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = true;
      return res;
    }, {}),
  );

  const updateGermination = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], germination: value }));
  };

  const updatePurity = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], purity: value }));
  };

  const updateSeedsPerPound = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], seedsPerPound: value }));
  };

  const seedsPerPound = (seed) => {
    if (options[seed.label].seedsPerPound) return options[seed.label].seedsPerPound;
    if (council === 'MCCC') return seed.attributes['Planting Information']['Seed Count'].values[0];
    if (council === 'NECCC') return seed.attributes.Planting['Seeds Per lb'].values[0];
    return '';
  };

  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  // initially set germination and purity
  useEffect(() => {
    seedsSelected.forEach((seed) => {
      // not set default value if redux value already exist
      if (options[seed.label].germination && options[seed.label].purity) return;
      // FIXME: use 0.85 and 0.95 as default value(applies to NECCC)
      const germination = parseFloat(
        seed.attributes.Coefficients['% Live Seed to Emergence']?.values[0] ?? 0.85,
      );
      const purity = parseFloat(
        seed.attributes.Coefficients['Precision Coefficient']?.values[0] ?? 0.95,
      );
      dispatch(setOptionRedux(seed.label, { ...options[seed.label], germination, purity }));
    });
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Enter seed tag info</Typography>
      </Grid>

      {seedsSelected.map((seed, i) => (
        <Grid item xs={12} key={i}>
          <Accordion
            expanded={accordionState[seed.label]}
            onChange={() => handleExpandAccordion(seed.label)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="accordian-summary"
            >
              <Typography>{seed.label}</Typography>
            </AccordionSummary>
            <AccordionDetails className="accordian-details">
              <Grid container>

                <LeftGrid item xs={6}>
                  <Typography>% Germination: </Typography>
                </LeftGrid>
                <Grid item xs={4}>
                  <NumberTextField
                    value={(options[seed.label].germination ?? 0.85) * 100}
                    handleChange={(e) => {
                      updateGermination(seed.label, parseFloat(e.target.value) / 100);
                    }}
                  />
                </Grid>
                <Grid item xs={2} />

                <LeftGrid item xs={6}>
                  <Typography>% Purity: </Typography>
                </LeftGrid>
                <Grid item xs={4}>
                  <NumberTextField
                    value={(options[seed.label].purity ?? 0.9) * 100}
                    handleChange={(e) => {
                      updatePurity(seed.label, parseFloat(e.target.value) / 100);
                    }}
                  />
                </Grid>
                <Grid item xs={2} />

                <LeftGrid item xs={6}>
                  <Typography>Seeds per Pound </Typography>
                </LeftGrid>
                <Grid item xs={4}>
                  <NumberTextField
                    value={seedsPerPound(seed)}
                    handleChange={(e) => {
                      updateSeedsPerPound(seed.label, parseFloat(e.target.value));
                    }}
                  />
                </Grid>
                <Grid item xs={2} />
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default SeedTagInfo;
