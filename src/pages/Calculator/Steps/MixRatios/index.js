/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-multi-str */

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
import MixRatioSteps from './form';
import DSTPieChart from '../../../../components/DSTPieChart';
import { UnitSelection, SeedInfo } from '../../../../components/SeedingRateCard';
import {
  adjustProportionsMCCC, adjustProportionsNECCC, adjustProportionsSCCC,
  createCalculator, createUserInput, calculatePieChartData, calculatePlantsandSeedsPerAcre,
} from '../../../../shared/utils/calculator';
import { setOptionRedux, setMixRatioOptionRedux } from '../../../../features/calculatorSlice/actions';
import { pieChartUnits } from '../../../../shared/data/units';
import '../steps.scss';
import { setAlertStateRedux, setFromUserHistoryRedux } from '../../../../features/userSlice/actions';
import { historyState } from '../../../../features/userSlice/state';

const getCalculatorResult = (council) => {
  const defaultResultMCCC = {
    step1: { defaultSingleSpeciesSeedingRatePLS: 0, percentOfRate: 0, seedingRate: 0 },
    step2: { seedsPerPound: 0, seedingRate: 0, seedsPerAcre: 0 },
    step3: { seedsPerAcre: 0, percentSurvival: 0, plantsPerAcre: 0 },
    step4: { plantPerAcre: 0, sqftPerAcre: 43560, plantPerSqft: 0 },
  };

  const defaultResultNECCC = {
    step1: {
      defaultSingleSpeciesSeedingRatePLS: 0, soilFertilityModifier: 0, sumGroupInMix: 0, seedingRate: 0,
    },
    step2: { seedsPerPound: 0, seedingRate: 0, seedsPerAcre: 0 },
    step3: { seedsPerAcre: 0, sqftPerAcre: 43560, seedsPerSqft: 0 },
  };

  const defaultResultSCCC = {
    step1: {
      defaultSingleSpeciesSeedingRatePLS: 0,
      percentOfRate: 0,
      plantingTimeModifier: 0,
      mixCompetitionCoefficient: 0,
      seedingRate: 0,
    },
    step2: { seedsPerPound: 0, seedingRate: 0, seedsPerAcre: 0 },
    step3: { seedsPerAcre: 0, sqftPerAcre: 43560, seedsPerSqft: 0 },
  };

  switch (council) {
    case 'MCCC':
      return defaultResultMCCC;
    case 'NECCC':
      return defaultResultNECCC;
    case 'SCCC':
      return defaultResultSCCC;
    default:
      return null;
  }
};

const defaultPieChartData = {
  seedingRateArray: [],
  plantsPerSqftArray: [],
  seedsPerSqftArray: [],
};

const MixRatio = ({
  calculator, setCalculator, alertState,
}) => {
  const [initCalculator, setInitCalculator] = useState(false);
  const [prevOptions, setPrevOptions] = useState({});
  const [piechartData, setPieChartData] = useState(defaultPieChartData);
  const [updatedForm, setUpdatedForm] = useState(false);

  const dispatch = useDispatch();
  const {
    seedsSelected, sideBarSelection, mixRatioOptions,
  } = useSelector((state) => state.calculator);
  const {
    council, soilDrainage, plantingDate, acres, county,
  } = useSelector((state) => state.siteCondition);
  const { fromUserHistory } = useSelector((state) => state.user);

  const [calculatorResult, setCalculatorResult] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = getCalculatorResult(council);
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
    // use a region object array for sdk init
    const regions = [{ label: county }];
    const seedingRateCalculator = createCalculator(seedsSelected, council, regions, userInput);
    setCalculator(seedingRateCalculator);
    // If historyState is imported, not init options, use mixRatioOptions instead
    if (fromUserHistory !== historyState.imported) {
      seedsSelected.forEach((seed) => {
        // if percentOfRate is not null, skip this step(this happens when add new crop for a imported history)
        if (mixRatioOptions[seed.label].percentOfRate === null) {
          // FIXME: updated percentOfRate here, this is a temporary workaround for MCCC
          const newOption = {
            ...mixRatioOptions[seed.label],
            percentOfRate: (council === 'MCCC'
            || (council === 'SCCC' && !seedingRateCalculator.isFreezingZone()))
              ? 1 / seedsSelected.length : null,
          };
          dispatch(setMixRatioOptionRedux(seed.label, newOption));
        }
      });
    }
    setInitCalculator(true);
  }, []);

  // run adjust proportions on options change
  useEffect(() => {
    if (!initCalculator) return;
    seedsSelected.forEach((seed) => {
      const seedOption = mixRatioOptions[seed.label];
      if (seedOption !== prevOptions[seed.label]) {
        let result;
        if (council === 'MCCC') result = adjustProportionsMCCC(seed, calculator, seedOption);
        else if (council === 'NECCC') result = adjustProportionsNECCC(seed, calculator, seedOption);
        else if (council === 'SCCC') result = adjustProportionsSCCC(seed, calculator, seedOption);
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
        const {
          plants, seeds, adjustedPlants, adjustedSeeds,
        } = calculatePlantsandSeedsPerAcre(seed, calculator, seedOption);
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
      // if history is not imported, update mixRatioOptions to options
      if (fromUserHistory !== historyState.imported) dispatch(setOptionRedux(seed.label, seedOption));
      // if history is updated, this will remove previously imported options redux and set it as mixRatioOptions
    });
    // calculate piechart data
    const {
      seedingRateArray,
      plantsPerSqftArray,
      seedsPerSqftArray,
    } = calculatePieChartData(seedsSelected, calculator, mixRatioOptions);
    setPieChartData({ seedingRateArray, plantsPerSqftArray, seedsPerSqftArray });
    setPrevOptions(mixRatioOptions);
    // when options change, set mixRatiosOptions in redux
    // FIXME: maybe need to think a little bit more situations
    // if (!fromUserHistory) dispatch(setMixRatioOptionsRedux(options));
  }, [mixRatioOptions, initCalculator]);

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
    dispatch(setAlertStateRedux({
      ...alertState,
      open: true,
      type: 'success',
      message: 'You now have a custom mix. You can edit this information in furthur steps.',
    }));
    dispatch(setMixRatioOptionRedux(seed.label, { ...mixRatioOptions[seed.label], [option]: value }));
    // set historyState.updated if change anything
    if (fromUserHistory === historyState.imported) dispatch(setFromUserHistoryRedux(historyState.updated));
  };

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    if (!alertState.open) {
      dispatch(setAlertStateRedux({
        ...alertState,
        open: true,
        type: 'success',
        message: updatedForm ? 'You now have a custom mix. You can edit this information in furthur steps.'
          : 'This is a starting mix based on averages, but not a recommendation. \
          Adjust as needed based on your goals.',
      }));
    }
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
        <DSTPieChart
          chartData={piechartData.seedingRateArray}
          label={pieChartUnits.poundsOfSeedPerAcre}
        />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        {council === 'MCCC' && (
          <DSTPieChart
            chartData={piechartData.plantsPerSqftArray}
            label={pieChartUnits.plantsPerSqft}
          />
        )}
        {(council === 'NECCC' || council === 'SCCC') && (
        <DSTPieChart
          chartData={piechartData.seedsPerSqftArray}
          label={pieChartUnits.seedsPerSqft}
        />
        )}
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
                <SeedInfo
                  seed={seed}
                  seedData={seedData}
                  calculatorResult={calculatorResult}
                  handleFormValueChange={handleFormValueChange}
                  council={council}
                  options={mixRatioOptions[seed.label]}
                />

                <Grid item xs={12}>
                  <UnitSelection />
                </Grid>

                <Grid item xs={12} pt="1rem">
                  <Button
                    sx={{
                      borderRadius: '1rem',
                    }}
                    onClick={() => {
                      setShowSteps({ ...showSteps, [seed.label]: !showSteps[seed.label] });
                    }}
                    variant="outlined"
                  >
                    {showSteps[seed.label] ? 'Close Steps' : 'View Calculations'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {showSteps[seed.label] && (
                  <MixRatioSteps
                    council={council}
                    calculatorResult={calculatorResult[seed.label]}
                    options={mixRatioOptions[seed.label]}
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
