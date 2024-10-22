/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { PSAButton } from 'shared-react-components/src';
import {
  reviewMixMCCC, reviewMixNECCC, calculatePieChartData,
  calculatePlantsandSeedsPerAcre,
  reviewMixSCCC,
} from '../../../../shared/utils/calculator';
import ReviewMixSteps from './Steps';
import DSTPieChart from '../../../../components/DSTPieChart';
import DSTBarChart from '../../../../components/DSTBarChart';
import SeedingRateCard, { UnitSelection } from '../../../../components/SeedingRateCard';
import { setBulkSeedingRateRedux, setOptionRedux } from '../../../../features/calculatorSlice/actions';
import { pieChartUnits, seedDataUnits } from '../../../../shared/data/units';
import { historyStates } from '../../../../features/userSlice/state';
import { setHistoryStateRedux } from '../../../../features/userSlice/actions';
import '../steps.scss';
import DSTAccordion from '../../../../components/DSTAccordion';

const getCalculatorResult = (council) => {
  const defaultResultMCCC = {
    step1: { singleSpeciesSeedingRate: 0, percentOfRate: 0, seedingRate: 0 },
  };

  const defaultResultNECCC = {
    step1: {
      singleSpeciesSeedingRate: 0, soilFertilityModifier: 0, sumGroupInMix: 0, seedingRate: 0,
    },
  };

  const defaultResultSCCC = {
    step1: {
      singleSpeciesSeedingRate: 0,
      percentOfRate: 0,
      plantingTimeModifier: 0,
      mixCompetitionCoefficient: 0,
      seedingRate: 0,
    },
  };

  const restSteps = {
    step2: { seedingRate: 0, plantingMethodModifier: 0, seedingRateAfterPlantingMethodModifier: 0 },
    step3: { seedingRate: 0, managementImpactOnMix: 0, seedingRateAfterManagementImpact: 0 },
    step4: {
      seedingRateAfterManagementImpact: 0, germination: 0, purity: 0, bulkSeedingRate: 0,
    },
    step5: { bulkSeedingRate: 0, acres: 0, poundsForPurchase: 0 },
  };

  switch (council) {
    case 'MCCC':
      return { ...defaultResultMCCC, ...restSteps };
    case 'NECCC':
      return { ...defaultResultNECCC, ...restSteps };
    case 'SCCC':
      return { ...defaultResultSCCC, ...restSteps };
    default:
      return null;
  }
};

const defaultPieChartData = {
  seedingRateArray: [],
  plantsPerSqftArray: [],
  seedsPerSqftArray: [],
};

// eslint-disable-next-line no-unused-vars
const ReviewMix = ({ calculator }) => {
  const dispatch = useDispatch();
  const { council } = useSelector((state) => state.siteCondition);
  const {
    seedsSelected, sideBarSelection, options,
  } = useSelector((state) => state.calculator);
  const { historyState } = useSelector((state) => state.user);

  const [prevOptions, setPrevOptions] = useState({});
  const [piechartData, setPieChartData] = useState(defaultPieChartData);

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

  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = seedsSelected.length === 1;
      return res;
    }, {}),
  );

  const [showSteps, setShowSteps] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = false;
      return res;
    }, {}),
  );

  /// ///////////////////////////////////////////////////////
  //                    State Logic                       //
  /// ///////////////////////////////////////////////////////

  // function to handle form value change, update options
  const handleFormValueChange = (seed, option, value) => {
    dispatch(setOptionRedux(seed.label, { ...options[seed.label], [option]: value }));
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
  };

  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  /// ///////////////////////////////////////////////////////
  //                    useEffect                         //
  /// ///////////////////////////////////////////////////////

  // expand related accordion based on sidebar click
  useEffect(() => {
    if (sideBarSelection !== '') {
      setAccordionState(
        seedsSelected.reduce((res, seed) => {
          res[seed.label] = seed.label === sideBarSelection;
          return res;
        }, {}),
      );
    }
  }, [sideBarSelection]);

  // run reviewMix on options change
  useEffect(() => {
    seedsSelected.forEach((seed) => {
      if (options[seed.label] !== prevOptions[seed.label]) {
        let result;
        if (council === 'MCCC') result = reviewMixMCCC(seed, calculator, options[seed.label]);
        else if (council === 'NECCC') result = reviewMixNECCC(seed, calculator, options[seed.label]);
        else if (council === 'SCCC') result = reviewMixSCCC(seed, calculator, options[seed.label]);
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
        const {
          plants, seeds, adjustedSeeds,
        } = calculatePlantsandSeedsPerAcre(
          seed,
          calculator,
          options[seed.label],
          result.step2.seedingRate,
          result.step4.bulkSeedingRate,
        );
        setSeedData((prev) => ({
          ...prev,
          [seed.label]: {
            defaultPlant: plants,
            defaultSeed: seeds,
            adjustedPlant: plants,
            adjustedSeed: adjustedSeeds,
          },
        }));
      }
    });
    // calculate piechart data
    const {
      seedingRateArray,
      plantsPerSqftArray,
      seedsPerSqftArray,
    } = calculatePieChartData(seedsSelected, calculator, options);
    setPieChartData({ seedingRateArray, plantsPerSqftArray, seedsPerSqftArray });
    setPrevOptions(options);
  }, [options]);

  useEffect(() => {
    let result = {};
    seedsSelected.forEach((seed) => {
      result = { ...result, [seed.label]: calculatorResult[seed.label].step5.bulkSeedingRate };
    });
    dispatch(setBulkSeedingRateRedux(result));
  }, [calculatorResult]);

  /// ///////////////////////////////////////////////////////
  //                     Render                           //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review your mix</Typography>
      </Grid>

      {seedsSelected.length > 1 && (
        <>
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
        </>
      )}

      {seedsSelected.map((seed, i) => (
        <Grid item xs={12} key={i}>
          <DSTAccordion
            expanded={accordionState[seed.label]}
            onChange={() => handleExpandAccordion(seed.label)}
            summary={<Typography>{seed.label}</Typography>}
            testId={`accordion-${seed.label}`}
          >
            <Grid container>
              <DSTBarChart seed={seed} calculatorResult={calculatorResult} />
              <Grid item xs={6} pt="1rem">
                <SeedingRateCard
                  seedingRateLabel={seedDataUnits.pureLiveSeed}
                  seedingRateValue={calculatorResult[seed.label].step2.seedingRate}
                  plantValue={seedData[seed.label].defaultPlant}
                  seedValue={seedData[seed.label].defaultSeed}
                />
              </Grid>

              <Grid item xs={6} pt="1rem">
                <SeedingRateCard
                  seedingRateLabel={seedDataUnits.bulkSeed}
                  seedingRateValue={calculatorResult[seed.label].step4.bulkSeedingRate}
                  plantValue={seedData[seed.label].adjustedPlant}
                  seedValue={seedData[seed.label].adjustedSeed}
                />
              </Grid>
              <Grid item xs={12}>
                <UnitSelection />
              </Grid>

              <Grid item xs={12} pt="1rem">
                <PSAButton
                  buttonType=""
                  onClick={() => {
                    setShowSteps({ ...showSteps, [seed.label]: !showSteps[seed.label] });
                  }}
                  variant="outlined"
                  data-test="change_my_rate_button"
                  title={showSteps[seed.label] ? 'Close Steps' : 'Change My Rate'}
                />
              </Grid>

              <Grid item xs={12}>
                {showSteps[seed.label] && (
                <ReviewMixSteps
                  council={council}
                  seed={seed}
                  handleFormValueChange={handleFormValueChange}
                  calculatorResult={calculatorResult[seed.label]}
                  options={options[seed.label]}
                />
                )}
              </Grid>
            </Grid>
          </DSTAccordion>

        </Grid>
      ))}
    </Grid>
  );
};
export default ReviewMix;
