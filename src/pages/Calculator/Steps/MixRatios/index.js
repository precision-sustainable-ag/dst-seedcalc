/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  calculateAllMixRatioValues,
  calculatePieChartData,
} from '../../../../shared/utils/calculate';
import { updateSteps } from '../../../../features/stepSlice';
import MixRatioSteps from './form';
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from '../../../../components/DSTPieChart';
import {
  SeedDataChip,
  SeedingRateChip,
} from '../../../../components/SeedingRateCard';

import '../steps.scss';
import { adjustProportions, createCalculator, createUserInput } from '../../../../shared/utils/calculator';
// import { setCalculatorRedux } from '../../../../features/calculatorSlice/actions';

const MixRatio = ({ council }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { selectedSpecies, seedsSelected } = data.speciesSelection;

  // create seedcalc and try printing data
  const { soilDrainage, plantingDate, acres } = useSelector((state) => state.siteCondition);
  const mixRedux = useSelector((state) => state.calculator.seedsSelected);

  useEffect(() => {
    const userInput = createUserInput(soilDrainage, plantingDate, acres);
    const seedingRateCalculator = createCalculator(mixRedux, council, userInput);
    // TODO: the calculator is not serializable, not sure if it's right to put it in store
    // dispatch(setCalculatorRedux(seedingRateCalculator));
    mixRedux.forEach((seed) => adjustProportions(seed, seedingRateCalculator));
  }, []);

  // create an key/value pair for the seed and related accordion expanded state
  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray } = calculatePieChartData(seedsSelected);

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const newData = {
      type: 'speciesSelection',
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  const updateSeed = (val, key, seed) => {
    const index = seedsSelected.findIndex((s) => s.id === seed.id);
    const seeds = JSON.parse(JSON.stringify(seedsSelected));
    seeds[index][key] = val;
    handleUpdateSteps('seedsSelected', seeds);

    // create new copy of recently updated Redux state, calculate & update all seed's step data.
    const newData = [...seeds];
    newData[index] = calculateAllMixRatioValues(newData[index], data, council);
    handleUpdateSteps('seedsSelected', newData);
  };

  const showStep = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = seedsSelected.findIndex((s) => s.id === seed.id);
    const seeds = JSON.parse(JSON.stringify(seedsSelected));
    seeds[index][key] = val;
    handleUpdateSteps('seedsSelected', seeds);
  };

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  useEffect(() => {
    // expand related accordion based on sidebar click
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === selectedSpecies;
        return res;
      }, {}),
    );
  }, [selectedSpecies]);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review Proportions</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre </DSTPieChartLabel>
        <DSTPieChartLegend chartData={poundsOfSeedArray} />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart
          chartData={
            council === 'MCCC' ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === 'MCCC' ? 'Plants' : 'Seeds'}
          {' '}
          Per Acre
          {' '}
        </DSTPieChartLabel>
        <DSTPieChartLegend
          chartData={
            council === 'MCCC' ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
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
                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Default Single Species Seeding Rate PLS"
                    value={Math.floor(seed.singleSpeciesSeedingRatePLS)}
                  />
                  {council === 'MCCC' && (
                  <SeedDataChip
                    label="Aprox plants per"
                    value={Math.floor(seed.plantsPerAcre)}
                  />
                  )}
                </Grid>

                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Default Mix Seeding Rate PLS"
                    value={Math.round(seed.mixSeedingRate)}
                  />
                  <SeedDataChip
                    label="Seeds per"
                    value={Math.floor(seed.seedsPerAcre)}
                  />
                </Grid>

                <Grid item xs={12} pt="1rem">
                  <Button
                    onClick={() => {
                      showStep(!seed.showSteps, 'showSteps', seed);
                    }}
                    variant="outlined"
                  >
                    {seed.showSteps ? 'Close Steps' : 'Change My Rate'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {seed.showSteps && (
                  <MixRatioSteps
                    seed={seed}
                    council={council}
                    seedsSelected={seedsSelected}
                    updateSeed={updateSeed}
                  />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};
export default MixRatio;
