/* eslint-disable no-multi-str */
/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Button, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InfoIcon from '@mui/icons-material/Info';
import MixRatioSteps from './form';
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from '../../../../components/DSTPieChart';
import SeedingRateCard, { UnitSelection } from '../../../../components/SeedingRateCard';
import {
  adjustProportions, adjustProportionsNECCC, createCalculator, createUserInput, calculatePieChartData,
  calculatePlantsandSeedsPerAcre,
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
  const [showAlert, setShowAlert] = useState(true);
  const [updatedForm, setUpdatedForm] = useState(false);

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

  const [seedData, setSeedData] = useState(seedsSelected.reduce((res, seed) => {
    res[seed.label] = {
      defaultPlant: 0, defaultSeed: 0, adjustedPlant: 0, adjustedSeed: 0,
    };
    return res;
  }, {}));

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
        const {
          plants, seeds, adjustedPlants, adjustedSeeds,
        } = calculatePlantsandSeedsPerAcre(
          seed,
          calculator,
          options[seed.label],
        );
        setSeedData((prev) => ({
          ...prev,
          [seed.label]: {
            defaultPlant: plants,
            defaultSeed: seeds,
            adjustedPlant: adjustedPlants,
            adjustedSeed: adjustedSeeds,
          },
        }));
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
    setUpdatedForm(true);
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

      <Grid item xs={12}>
        {showAlert && (
        <Alert severity="success" onClose={() => setShowAlert(false)} icon={<InfoIcon />}>
          {updatedForm ? 'You now have a custom mix.'
            : 'This is a starting mix based on averages, but not a recommendation. \
            Adjust via dropdown below as needed based on your goals.'}

        </Alert>
        )}

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
              expandIcon={(
                <Typography sx={{ textDecoration: 'underline' }}>
                  {accordionState[seed.label] ? 'Hide ' : 'Show '}
                  Details
                </Typography>
              )}
            >
              <Typography>{seed.label}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid container>

                <Grid item xs={6}>
                  <SeedingRateCard
                    seedingRateLabel="Default Single Species Seeding Rate PLS"
                    seedingRateValue={calculatorResult[seed.label].step1.defaultSingleSpeciesSeedingRatePLS}
                    plantValue={seedData[seed.label].defaultPlant}
                    seedValue={seedData[seed.label].defaultSeed}
                  />
                </Grid>

                <Grid item xs={6}>
                  <SeedingRateCard
                    seedingRateLabel="Default Seeding Rate in Mix"
                    seedingRateValue={calculatorResult[seed.label].step1.seedingRate}
                    plantValue={seedData[seed.label].adjustedPlant}
                    seedValue={seedData[seed.label].adjustedSeed}
                    showTooltip="mixSeedingRate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <UnitSelection />
                </Grid>

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
