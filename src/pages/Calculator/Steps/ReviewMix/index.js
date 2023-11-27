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
import { updateSteps } from '../../../../features/stepSlice';
import { calculateAllMixValues, calculatePieChartData } from '../../../../shared/utils/calculate';
import { generateNRCSStandards } from '../../../../shared/utils/NRCS/calculateNRCS';
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
import { reviewMix } from '../../../../shared/utils/calculator';

// eslint-disable-next-line no-unused-vars
const ReviewMix = ({ council, calculator }) => {
  // useSelector for crops & mixRaxio reducer
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { siteCondition } = data;
  const { seedingMethod } = data;
  const { selectedSpecies, seedsSelected } = data.speciesSelection;

  const mixRedux = useSelector((state) => state.calculator.seedsSelected);
  const options = useSelector((state) => state.calculator.options);

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

  const handleUpdateNRCS = (key, val) => {
    const newData = {
      type: 'NRCS',
      key,
      value: val,
    };
    dispatch(updateSteps(newData));
  };

  const handleUpdateAllSteps = (prevData, index) => {
    const seeds = [...prevData];
    seeds[index] = calculateAllMixValues(seeds[index], data);
    handleUpdateSteps('seedsSelected', seeds);
  };

  const initialDataLoad = () => {
    const seeds = JSON.parse(JSON.stringify(seedsSelected));
    const newData = [...seeds];

    newData.map((s, i) => {
      const index = i;
      newData[index] = calculateAllMixValues(s, data);
      handleUpdateAllSteps(newData, index);
      return null;
    });
  };

  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = seedsSelected.findIndex((s) => s.id === seed.id);
    const seeds = JSON.parse(JSON.stringify(seedsSelected));
    seeds[index][key] = val;
    handleUpdateSteps('seedsSelected', seeds);
    const newData = [...seeds];
    newData[index] = calculateAllMixValues(seeds[index], data);
    handleUpdateAllSteps(newData, index);
  };

  /// ///////////////////////////////////////////////////////
  //                    State Logic                       //
  /// ///////////////////////////////////////////////////////

  const updateNRCS = async () => {
    // TODO: NRCS calculated here
    const NRCSData = await generateNRCSStandards(
      seedsSelected,
      data.siteCondition,
    );
    handleUpdateNRCS('results', NRCSData);
  };

  // handler for click to open accordion
  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  /// ///////////////////////////////////////////////////////
  //                    useEffect                         //
  /// ///////////////////////////////////////////////////////

  useEffect(() => {
    // expand related accordion based on sidebar click
    setAccordionState(
      seedsSelected.reduce((res, seed) => {
        res[seed.label] = seed.label === selectedSpecies;
        return res;
      }, {}),
    );
  }, [selectedSpecies]);

  useEffect(() => {
    initialDataLoad();
    // FIXME: possible issues in useEffect return: state maybe unupdated value
    return () => {
      updateNRCS();
    };
  }, []);

  useEffect(() => {
    mixRedux.forEach((seed) => {
      reviewMix(seed, calculator, options[seed.label]);
    });
  }, []);

  /// ///////////////////////////////////////////////////////
  //                     Render                           //
  /// ///////////////////////////////////////////////////////

  const renderAccordianChart = (seed) => {
    const labels = [
      {
        label: 'Single Species Seeding Rate',
        key: 'singleSpeciesSeedingRatePLS',
        val: seed.singleSpeciesSeedingRatePLS,
      },
      {
        label: 'Added to Mix',
        key: 'step2Result',
        val: seed.step2Result,
      },
      {
        label: 'Drilled or Broadcast with Cultipack',
        key: 'drilled',
        val: seed.step2Result,
      },
      {
        // FIXME: static value here, maybe need to change to dynamic
        label: 'Management Impacts on Mix (+57%)',
        key: 'managementImpactOnMix',
        val: seed.step3Result,
      },
      {
        label: 'Bulk Germination and Purity',
        key: 'bulkSeedingRate',
        val: seed.bulkSeedingRate,
      },
    ];

    const generateScatterData = () => {
      const results = [];
      let counter = 0;
      labels.map((l) => {
        counter += 30;
        results.push({ x: counter, y: l.val, z: 400 });
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
              {l.val}
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
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre</DSTPieChartLabel>
        <DSTPieChartLegend chartData={poundsOfSeedArray} />
      </Grid>

      <Grid item xs={6} md={6} sx={{ textAlign: 'justify' }}>
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
              {renderAccordianChart(seed)}

              <Grid container>
                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Mix Seeding Rate PLS"
                    value={Math.floor(seed.singleSpeciesSeedingRatePLS)}
                  />
                  <SeedDataChip
                    label="Aprox plants per"
                    value={Math.floor(seed.plantsPerAcre)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SeedingRateChip
                    label="Bulk Seeding Rate"
                    value={Math.floor(seed.bulkSeedingRate)}
                  />
                  <SeedDataChip
                    label="Seeds per"
                    value={Math.floor(seed.seedsPerAcre)}
                  />
                </Grid>

                <Grid item xs={12} pt="1rem">
                  <Button
                    onClick={() => {
                      updateSeed(!seed.showSteps, 'showSteps', seed);
                    }}
                    variant="outlined"
                  >
                    {seed.showSteps ? 'Close Steps' : 'Change My Rate'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {seed.showSteps && (
                  <ReviewMixSteps
                    seedsSelected={seedsSelected}
                    council={council}
                    updateSeed={updateSeed}
                    seedingMethod={seedingMethod}
                    siteCondition={siteCondition}
                    seed={seed}
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
