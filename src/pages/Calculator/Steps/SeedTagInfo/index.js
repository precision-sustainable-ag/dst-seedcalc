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
import { updateSteps } from '../../../../features/stepSlice';
import {
  convertToPercent,
  convertToDecimal,
} from '../../../../shared/utils/calculate';
import NumberTextField from '../../../../components/NumberTextField';
import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

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
  const data = useSelector((state) => state.steps.value);
  const { selectedSpecies, seedsSelected } = data.speciesSelection;

  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const mixRedux = useSelector((state) => state.calculator.seedsSelected);
  const options = useSelector((state) => state.calculator.options);

  const handleUpdateSteps = (key, val) => {
    const newData = {
      type: 'speciesSelection',
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  const updateSeed = (val, key1, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = seedsSelected.findIndex((s) => s.id === seed.id);
    // eslint-disable-next-line no-shadow
    const data = JSON.parse(JSON.stringify(seedsSelected));
    data[index][key1] = val;
    handleUpdateSteps('seedsSelected', data);
  };

  const updateGermination = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], germination: value }));
  };

  const updatePurity = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], purity: value }));
  };

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  // initially set germination and purity
  useEffect(() => {
    mixRedux.forEach((seed) => {
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
        res[seed.label] = seed.label === selectedSpecies;
        return res;
      }, {}),
    );
  }, [selectedSpecies]);

  // eslint-disable-next-line no-shadow
  const renderRightAccordian = (key, data, type, disabled) => {
    const value = type === 'percent' ? convertToPercent(data[key]) : Math.floor(data[key]);
    return (
      <>
        <Grid item xs={4}>
          {/* FIXME: the number field of percent could overflow */}
          <NumberTextField
            disabled={disabled}
            value={value}
            handleChange={(e) => {
              updateSeed(convertToDecimal(e.target.value), key, {
                ...data,
                [key]: convertToDecimal(e.target.value),
              });
              // TODO: new calculator redux here
              if (key === 'germinationPercentage') {
                updateGermination(data.label, parseInt(e.target.value, 10) / 100);
              } else if (key === 'purityPercentage') {
                updatePurity(data.label, parseInt(e.target.value, 10) / 100);
              }
            }}
          />
        </Grid>
        <Grid item xs={2} />
      </>
    );
  };

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
                {renderRightAccordian(
                  'germinationPercentage',
                  seed,
                  'percent',
                  false,
                )}
                <LeftGrid item xs={6}>
                  <Typography>% Purity: </Typography>
                </LeftGrid>
                {renderRightAccordian(
                  'purityPercentage',
                  seed,
                  'percent',
                  false,
                )}
                <LeftGrid item xs={6}>
                  <Typography>Seeds per Pound </Typography>
                </LeftGrid>
                {renderRightAccordian('poundsOfSeed', seed, '', true)}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default SeedTagInfo;
