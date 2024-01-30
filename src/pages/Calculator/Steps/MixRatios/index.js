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
import MixRatioSteps from './form';
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from '../../../../components/DSTPieChart';
import SeedDataTable from '../../../../components/SeedDataTable';
import {
  adjustProportions, adjustProportionsNECCC, createCalculator, createUserInput, calculatePieChartData, twoDigit,
} from '../../../../shared/utils/calculator';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';
import '../steps.scss';

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

const defaultPieChartData = {
  seedingRateArray: [],
  plantsPerAcreArray: [],
  seedsPerAcreArray: [],
};

const MixRatio = ({ calculator, setCalculator }) => {
  const [initCalculator, setInitCalculator] = useState(false);
  const [prevOptions, setPrevOptions] = useState({});
  const [piechartData, setPieChartData] = useState(defaultPieChartData);

  const dispatch = useDispatch();
  const { seedsSelected, sideBarSelection, options } = useSelector((state) => state.calculator);
  const {
    council, soilDrainage, plantingDate, acres,
  } = useSelector((state) => state.siteCondition);

  const [calculatorResult, setCalculatorResult] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = council === 'MCCC' ? defaultResultMCCC : defaultResultNECCC;
      return res;
    }, {}),
  );

  // create an key/value pair for the seed and related accordion expanded state
  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const [showSteps, setShowSteps] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  const buildSeedData = (seed) => [
    {
      label: 'Default Single Species Seeding Rate PLS',
      value: `${calculatorResult[seed].step1.defaultSingleSpeciesSeedingRatePLS} Lbs/Acre`,
    },
    {
      label: 'Default Seeding Rate in Mix',
      value: `${calculatorResult[seed].step1.seedingRate} Lbs/Acre`,
    }, {
      label: 'Approx plants per acre',
      value: council === 'MCCC' ? calculatorResult[seed].step3.plantsPerAcre : '',
    }, {
      label: 'Approx plants per sqft',
      value: council === 'MCCC' ? twoDigit(calculatorResult[seed].step3.plantsPerAcre / 43560) : '',
    }, {
      label: 'Approx seeds per acre',
      value: calculatorResult[seed].step2.seedsPerAcre,
    }, {
      label: 'Approx seeds per sqft',
      value: twoDigit(calculatorResult[seed].step2.seedsPerAcre / 43560),
    }];

  // initialize calculator, set initial options
  useEffect(() => {
    const userInput = createUserInput(soilDrainage, plantingDate, acres);
    const seedingRateCalculator = createCalculator(seedsSelected, council, userInput);
    setCalculator(seedingRateCalculator);
    seedsSelected.forEach((seed) => {
      // FIXME: updated percentOfRate here, this is a temporary workaround for MCCC
      const newOption = {
        ...options[seed.label],
        percentOfRate: council === 'MCCC' ? 1 / seedsSelected.length : null,
      };
      dispatch(setOptionRedux(seed.label, newOption));
    });
    setInitCalculator(true);
  }, []);

  // run adjust proportions on options change
  useEffect(() => {
    if (!initCalculator) return;
    seedsSelected.forEach((seed) => {
      if (options[seed.label] !== prevOptions[seed.label]) {
        let result;
        if (council === 'MCCC') result = adjustProportions(seed, calculator, options[seed.label]);
        else if (council === 'NECCC') result = adjustProportionsNECCC(seed, calculator, options[seed.label]);
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
      }
    });
    // calculate piechart data
    const {
      seedingRateArray,
      plantsPerAcreArray,
      seedsPerAcreArray,
    } = calculatePieChartData(seedsSelected, calculator, options);
    setPieChartData({ seedingRateArray, plantsPerAcreArray, seedsPerAcreArray });
    setPrevOptions(options);
  }, [options, initCalculator]);

  // expand related accordion based on sidebar click
  useEffect(() => {
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === sideBarSelection;
        return res;
      }, {}),
    );
  }, [sideBarSelection]);

  /// ///////////////////////////////////////////////////////
  //                      Redux                           //
  /// ///////////////////////////////////////////////////////

  // function to handle form value change, update options
  const handleFormValueChange = (seed, option, value) => {
    dispatch(setOptionRedux(seed.label, { ...options[seed.label], [option]: value }));
  };

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review Proportions</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart chartData={piechartData.seedingRateArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre </DSTPieChartLabel>
        <DSTPieChartLegend chartData={piechartData.seedingRateArray} />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart
          chartData={
            council === 'MCCC' ? piechartData.plantsPerAcreArray : piechartData.seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === 'MCCC' ? 'Plants ' : 'Seeds '}
          Per Acre
        </DSTPieChartLabel>
        <DSTPieChartLegend
          chartData={
            council === 'MCCC' ? piechartData.plantsPerAcreArray : piechartData.seedsPerAcreArray
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
                <Grid item xs={0} md={3} />

                <Grid item xs={12} md={6} pt="1rem">
                  <SeedDataTable data={buildSeedData(seed.label)} />
                </Grid>
                <Grid item xs={0} md={3} />

                <Grid item xs={12} pt="1rem">
                  <Button
                    onClick={() => {
                      setShowSteps({ ...showSteps, [seed.label]: !showSteps[seed.label] });
                    }}
                    variant="outlined"
                  >
                    {showSteps[seed.label] ? 'Close Steps' : 'Change My Rate'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {showSteps[seed.label] && (
                  <MixRatioSteps
                    seed={seed}
                    council={council}
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
