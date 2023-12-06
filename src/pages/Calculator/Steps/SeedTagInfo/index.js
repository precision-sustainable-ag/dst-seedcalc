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
import { convertToPercent } from '../../../../shared/utils/calculate';
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
  const { sideBarSelection, seedsSelected, options } = useSelector((state) => state.calculator);

  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const updateGermination = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], germination: value }));
  };

  const updatePurity = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], purity: value }));
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

  useEffect(() => {
    // expand related accordion based on sidebar click
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === sideBarSelection;
        return res;
      }, {}),
    );
  }, [sideBarSelection]);

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
                    value={convertToPercent(options[seed.label].germination ?? 0.85)}
                    handleChange={(e) => {
                      updateGermination(seed.label, parseInt(e.target.value, 10) / 100);
                    }}
                  />
                </Grid>
                <Grid item xs={2} />

                <LeftGrid item xs={6}>
                  <Typography>% Purity: </Typography>
                </LeftGrid>
                <Grid item xs={4}>
                  <NumberTextField
                    value={convertToPercent(options[seed.label].purity ?? 0.9)}
                    handleChange={(e) => {
                      updatePurity(seed.label, parseInt(e.target.value, 10) / 100);
                    }}
                  />
                </Grid>
                <Grid item xs={2} />

                <LeftGrid item xs={6}>
                  <Typography>Seeds per Pound </Typography>
                </LeftGrid>
                <Grid item xs={4}>
                  <NumberTextField
                    disabled
                    value={parseInt(seed.attributes['Planting Information']['Seed Count'].values[0], 10)}
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
