/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  LabelList,
  ZAxis,
} from 'recharts';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {
  twoDigit, reviewMix, reviewMixNECCC, calculatePieChartData,
  calculatePlantsandSeedsPerAcre,
} from '../../../../shared/utils/calculator';
import ReviewMixSteps from './Steps';
import '../steps.scss';
import { DSTPieChart } from '../../../../components/DSTPieChart';
import SeedingRateCard, { UnitSelection } from '../../../../components/SeedingRateCard';
import { setBulkSeedingRateRedux, setOptionRedux } from '../../../../features/calculatorSlice/actions';

const defaultResultMCCC = {
  step1: { singleSpeciesSeedingRate: 0, percentOfRate: 0, seedingRate: 0 },
  step2: { seedingRate: 0, plantingMethodModifier: 0, seedingRateAfterPlantingMethodModifier: 0 },
  step3: { seedingRate: 0, managementImpactOnMix: 0, seedingRateAfterManagementImpact: 0 },
  step4: {
    seedingRateAfterManagementImpact: 0, germination: 0, purity: 0, bulkSeedingRate: 0,
  },
  step5: { bulkSeedingRate: 0, acres: 0, poundsForPurchase: 0 },
};

const defaultResultNECCC = {
  step1: {
    singleSpeciesSeedingRate: 0, soilFertilityModifer: 0, sumGroupInMix: 0, seedingRate: 0,
  },
  step2: { seedingRate: 0, plantingMethodModifier: 0, seedingRateAfterPlantingMethodModifier: 0 },
  step3: { seedingRate: 0, managementImpactOnMix: 0, seedingRateAfterManagementImpact: 0 },
  step4: {
    seedingRateAfterManagementImpact: 0, germination: 0, purity: 0, bulkSeedingRate: 0,
  },
  step5: { bulkSeedingRate: 0, acres: 0, poundsForPurchase: 0 },
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

  const [prevOptions, setPrevOptions] = useState({});
  const [piechartData, setPieChartData] = useState(defaultPieChartData);

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

  /// ///////////////////////////////////////////////////////
  //                    State Logic                       //
  /// ///////////////////////////////////////////////////////

  // function to handle form value change, update options
  const handleFormValueChange = (seed, option, value) => {
    dispatch(setOptionRedux(seed.label, { ...options[seed.label], [option]: value }));
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
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === sideBarSelection;
        return res;
      }, {}),
    );
  }, [sideBarSelection]);

  // run reviewMix on options change
  useEffect(() => {
    seedsSelected.forEach((seed) => {
      if (options[seed.label] !== prevOptions[seed.label]) {
        let result;
        if (council === 'MCCC') result = reviewMix(seed, calculator, options[seed.label]);
        else if (council === 'NECCC') result = reviewMixNECCC(seed, calculator, options[seed.label]);
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
        const {
          plants, seeds, adjustedPlants, adjustedSeeds,
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
            adjustedPlant: adjustedPlants,
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

  const renderAccordianChart = (seed) => {
    const labels = [
      {
        label: 'Single Species Seeding Rate',
        key: 'singleSpeciesSeedingRatePLS',
        val: calculatorResult[seed.label].step1.singleSpeciesSeedingRate,
      },
      {
        label: 'Added to Mix',
        key: 'step2Result',
        val: calculatorResult[seed.label].step2.seedingRate,
      },
      {
        label: 'Drilled or Broadcast with Cultipack',
        key: 'drilled',
        val: calculatorResult[seed.label].step2.seedingRateAfterPlantingMethodModifier,
      },
      {
        label: `Management Impacts on Mix (${calculatorResult[seed.label].step3.managementImpactOnMix})`,
        key: 'managementImpactOnMix',
        val: calculatorResult[seed.label].step3.seedingRateAfterManagementImpact,
      },
      {
        label: 'Bulk Germination and Purity',
        key: 'bulkSeedingRate',
        val: calculatorResult[seed.label].step4.bulkSeedingRate,
      },
    ];

    const generateScatterData = () => {
      const results = [];
      let counter = 0;
      labels.map((l) => {
        counter += 30;
        results.push({ x: counter, y: twoDigit(l.val), z: 400 });
        return null;
      });
      return results;
    };

    const scatterData = generateScatterData();

    return (
      <Grid container>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart width={400} height={500} position="center">
              <XAxis type="number" dataKey="x" name="" unit="" tick={false} />
              <YAxis
                type="number"
                dataKey="y"
                name="Mix Seeding Rate"
                unit=""
              />
              <ZAxis dataKey="z" range={[1000, 1449]} name="" unit="" />

              <Scatter
                name="Mix Seeding Rates"
                data={scatterData}
                fill="#E7885F"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <LabelList dataKey="y" fill="#fff" position="center" />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Grid>

        {labels.map((l, i) => (
          <Grid
            container
            sx={{ backgroundColor: !(i % 2) && '#e3e5d3' }}
            key={i}
          >
            <Grid item sx={{ textAlign: 'justify' }} xs={10} pl={1}>
              {l.label}
            </Grid>
            <Grid item xs={2}>
              {twoDigit(l.val)}
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review your mix</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart
          chartData={piechartData.seedingRateArray}
          label="Pounds of Seed / Acre"
        />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'justify' }}>
        {council === 'MCCC' && (
          <DSTPieChart
            chartData={piechartData.plantsPerSqftArray}
            label="Plants Per Sqft"
          />
        )}
        {council === 'NECCC' && (
        <DSTPieChart
          chartData={piechartData.seedsPerSqftArray}
          label="Seeds Per Sqft"
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
              {renderAccordianChart(seed)}

              <Grid container pt="1rem">
                <Grid item xs={6}>
                  <SeedingRateCard
                    seedingRateLabel="Seeding Rate in Mix PLS"
                    seedingRateValue={calculatorResult[seed.label].step2.seedingRate}
                    plantValue={seedData[seed.label].defaultPlant}
                    seedValue={seedData[seed.label].defaultSeed}
                  />
                </Grid>

                <Grid item xs={6}>
                  <SeedingRateCard
                    seedingRateLabel="Bulk Seeding Rate"
                    seedingRateValue={calculatorResult[seed.label].step4.bulkSeedingRate}
                    plantValue={seedData[seed.label].adjustedPlant}
                    seedValue={seedData[seed.label].adjustedSeed}
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
                  <ReviewMixSteps
                    council={council}
                    seed={seed}
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
export default ReviewMix;
