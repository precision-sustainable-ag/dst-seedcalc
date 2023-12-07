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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { twoDigit } from '../../../../shared/utils/calculate';
import ReviewMixSteps from './Steps';
import '../steps.scss';
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from '../../../../components/DSTPieChart';
import {
  SeedDataChip,
  SeedingRateChip,
} from '../../../../components/SeedingRateCard';
import { reviewMix, reviewMixNECCC, calculatePieChartData } from '../../../../shared/utils/calculator';
import { setOptionRedux, setReviewMixResultRedux } from '../../../../features/calculatorSlice/actions';

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
  plantsPerAcreArray: [],
  seedsPerAcreArray: [],
};

// eslint-disable-next-line no-unused-vars
const ReviewMix = ({ calculator }) => {
  const dispatch = useDispatch();

  const { council } = useSelector((state) => state.siteCondition);
  const { seedsSelected, sideBarSelection, options } = useSelector((state) => state.calculator);

  const [prevOptions, setPrevOptions] = useState({});
  const [piechartData, setPieChartData] = useState(defaultPieChartData);

  const [calculatorResult, setCalculatorResult] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = council === 'MCCC' ? defaultResultMCCC : defaultResultNECCC;
      return res;
    }, {}),
  );

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
      }
    });
    // save result in redux
    setCalculatorResult((prev) => {
      dispatch(setReviewMixResultRedux(prev));
      return prev;
    });
    // calculate piechart data
    const {
      seedingRateArray,
      plantsPerAcreArray,
      seedsPerAcreArray,
    } = calculatePieChartData(seedsSelected, calculator, options);
    setPieChartData({ seedingRateArray, plantsPerAcreArray, seedsPerAcreArray });
    setPrevOptions(options);
  }, [options]);

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
        // FIXME: static value here, maybe need to change to dynamic
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
      <Grid item xs={6} md={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart chartData={piechartData.seedingRateArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre</DSTPieChartLabel>
        <DSTPieChartLegend chartData={piechartData.seedingRateArray} />
      </Grid>

      <Grid item xs={6} md={6} sx={{ textAlign: 'justify' }}>
        <DSTPieChart
          chartData={
            council === 'MCCC' ? piechartData.plantsPerAcreArray : piechartData.seedsPerAcreArray
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
              {renderAccordianChart(seed)}

              <Grid container>
                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Seeding Rate in Mix PLS"
                    value={calculatorResult[seed.label].step2.seedingRate}
                  />
                  <SeedDataChip
                    label="Aprox plants per"
                    value={piechartData.plantsPerAcreArray.filter((slice) => slice.name === seed.label)[0]?.value ?? 0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Bulk Seeding Rate"
                    value={calculatorResult[seed.label].step4.bulkSeedingRate}
                  />
                  <SeedDataChip
                    label="Seeds per"
                    value={piechartData.seedsPerAcreArray.filter((slice) => slice.name === seed.label)[0]?.value ?? 0}
                  />
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
