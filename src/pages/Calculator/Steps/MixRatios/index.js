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
import {
  adjustProportions, adjustProportionsNECCC, createCalculator, createUserInput,
} from '../../../../shared/utils/calculator';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const defaultResultMCCC = {
  step1: { defaultSingleSpeciesSeedingRatePLS: 0, percentOfRate: 0, seedingRate: 0 },
  step2: { seedsPerPound: 0, seedingRate: 0, seedsPerAcre: 0 },
  step3: { seedsPerAcre: 0, percentSurvival: 0, plantsPerAcre: 0 },
  step4: { plantPerAcre: 0, sqftPerAcre: 43560, plantPerSqft: 0 },
};

const defaultResultNECCC = {
  step1: {
    defaultSingleSpeciesSeedingRatePLS: 0, soilFertilityModifer: 0, sumGroupInMix: 0, seedingRate: 0,
  },
  step2: { seedsPerPound: 0, seedingRate: 0, seedsPerAcre: 0 },
  step3: { seedsPerAcre: 0, sqftPerAcre: 43560, seedsPerSqft: 0 },
};

const MixRatio = ({ council, calculator, setCalculator }) => {
  const [initCalculator, setInitCalculator] = useState(false);
  const [prevOptions, setPrevOptions] = useState({});

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { selectedSpecies, seedsSelected } = data.speciesSelection;

  const { soilDrainage, plantingDate, acres } = useSelector((state) => state.siteCondition);
  const mixRedux = useSelector((state) => state.calculator.seedsSelected);
  const options = useSelector((state) => state.calculator.options);

  const [calculatorResult, setCalculatorResult] = useState(
    mixRedux.reduce((res, seed) => {
      res[seed.label] = council === 'MCCC' ? defaultResultMCCC : defaultResultNECCC;
      return res;
    }, {}),
  );
  console.log('calculatorResult', calculatorResult);

  // initialize calculator, set initial options
  useEffect(() => {
    const userInput = createUserInput(soilDrainage, plantingDate, acres);
    const seedingRateCalculator = createCalculator(mixRedux, council, userInput);
    setCalculator(seedingRateCalculator);
    mixRedux.forEach((seed) => {
      // FIXME: updated percentOfRate here, this is a temporary workaround for MCCC
      const newOption = {
        ...options[seed.label],
        percentOfRate: council === 'MCCC' ? 1 / mixRedux.length : null,
      };
      dispatch(setOptionRedux(seed.label, newOption));
    });
    setInitCalculator(true);
  }, []);

  // run adjust proportions on options change
  useEffect(() => {
    if (!initCalculator) return;
    mixRedux.forEach((seed) => {
      if (options[seed.label] !== prevOptions[seed.label]) {
        let result;
        if (council === 'MCCC') result = adjustProportions(seed, calculator, options[seed.label]);
        else if (council === 'NECCC') result = adjustProportionsNECCC(seed, calculator, options[seed.label]);
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
      }
    });
    setPrevOptions(options);
  }, [options, initCalculator]);

  // create an key/value pair for the seed and related accordion expanded state
  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const {
    plantsPerAcreArray,
    seedsPerAcreArray,
    seedingRateArray,
  } = calculatePieChartData(seedsSelected, calculatorResult);

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

  // function to handle form value change, update options
  const handleFormValueChange = (seed, option, value) => {
    dispatch(setOptionRedux(seed.label, { ...options[seed.label], [option]: value }));
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
        <DSTPieChart chartData={seedingRateArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre </DSTPieChartLabel>
        <DSTPieChartLegend chartData={seedingRateArray} />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart
          chartData={
            council === 'MCCC' ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === 'MCCC' ? 'Plants ' : 'Seeds '}
          Per Acre
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
                    value={
                      calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS
                    }
                  />
                  {council === 'MCCC' && (
                  <SeedDataChip
                    label="Aprox plants per"
                    value={calculatorResult[seed.label].step3.plantsPerAcre}
                  />
                  )}
                </Grid>

                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Default Seeding Rate in Mix"
                    value={calculatorResult[seed.label].step1.seedingRate}
                  />
                  <SeedDataChip
                    label="Seeds per"
                    value={calculatorResult[seed.label].step2.seedsPerAcre}
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
                    handleFormValueChange={handleFormValueChange}
                    calculatorResult={calculatorResult[seed.label]}
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
