//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { Typography, Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ZAxis,
} from "recharts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { updateSteps } from "../../../../features/stepSlice";
import { calculateAllMixValues } from "./../../../../shared/utils/calculate";
import { generateNRCSStandards } from "../../../../shared/utils/NRCS/calculateNRCS";
import ReviewMixSteps from "./Steps";
import { calculatePieChartData } from "./../../../../shared/utils/calculate";
import "./../steps.scss";
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from "../../../../components/DSTPieChart";
import {
  SeedDataChip,
  SeedingRateChip,
} from "../../../../components/SeedingRateCard";

const ReviewMix = ({ council }) => {
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const siteCondition = data.siteCondition;
  const speciesSelection = data.speciesSelection;
  const seedingMethod = data.seedingMethod;

  const { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray } =
    calculatePieChartData(speciesSelection.seedsSelected);

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const handleUpdateNRCS = (key, val) => {
    const data = {
      type: "NRCS",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const initialDataLoad = () => {
    let seeds = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    let newData = [...seeds];

    newData.map((s, i) => {
      const index = i;
      newData[index] = calculateAllMixValues(s, data);
      handleUpdateAllSteps(newData, index);
    });
  };

  const handleUpdateAllSteps = (prevData, index) => {
    let seeds = [...prevData];
    seeds[index] = calculateAllMixValues(seeds[index], data);
    handleUpdateSteps("seedsSelected", seeds);
  };

  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let seeds = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    seeds[index][key] = val;
    handleUpdateSteps("seedsSelected", seeds);
    let newData = [...seeds];
    newData[index] = calculateAllMixValues(seeds[index], data);
    handleUpdateAllSteps(newData, index);
  };

  //////////////////////////////////////////////////////////
  //                    State Logic                       //
  //////////////////////////////////////////////////////////

  const updateNRCS = async () => {
    // TODO: NRCS calculated here
    const NRCSData = await generateNRCSStandards(
      speciesSelection.seedsSelected,
      data.siteCondition
    );
    handleUpdateNRCS("results", NRCSData);
  };

  //////////////////////////////////////////////////////////
  //                    useEffect                         //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    initialDataLoad();
    // FIXME: possible issues in useEffect return: state maybe unupdated value
    return () => {
      updateNRCS();
    };
  }, []);

  //////////////////////////////////////////////////////////
  //                     Render                           //
  //////////////////////////////////////////////////////////

  const renderAccordianChart = (seed) => {
    const labels = [
      {
        label: "Single Species Seeding Rate",
        key: "singleSpeciesSeedingRatePLS",
        val: seed["singleSpeciesSeedingRatePLS"],
      },
      {
        label: "Added to Mix",
        key: "step2Result",
        val: seed["step2Result"],
      },
      {
        label: "Drilled or Broadcast with Cultipack",
        key: "drilled",
        val: seed["step2Result"],
      },
      {
        // FIXME: static value here, maybe need to change to dynamic
        label: "Management Impacts on Mix (+57%)",
        key: "managementImpactOnMix",
        val: seed["step3Result"],
      },
      {
        label: "Bulk Germination and Purity",
        key: "bulkSeedingRate",
        val: seed["bulkSeedingRate"],
      },
    ];

    const generateScatterData = (labels) => {
      let results = [];
      let counter = 0;
      labels.map((l, i) => {
        counter += 30;
        results.push({ x: counter, y: l.val, z: 400 });
      });
      return results;
    };

    const scatterData = generateScatterData(labels);

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
                tick={false}
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

        {labels.map((l, i) => {
          return (
            <Grid
              container
              sx={{ backgroundColor: !(i % 2) && "#e3e5d3" }}
              key={i}
            >
              <Grid item sx={{ textAlign: "justify" }} xs={10} pl={1}>
                {l.label}
              </Grid>
              <Grid item xs={2}>
                {l.val}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review your mix</Typography>
      </Grid>
      <Grid item xs={6} md={6} sx={{ textAlign: "justify" }}>
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>{"Pounds of Seed / Acre"}</DSTPieChartLabel>
        <DSTPieChartLegend chartData={poundsOfSeedArray} />
      </Grid>

      <Grid item xs={6} md={6} sx={{ textAlign: "justify" }}>
        <DSTPieChart
          chartData={
            council === "MCCC" ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
        </DSTPieChartLabel>

        <DSTPieChartLegend
          chartData={
            council === "MCCC" ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
      </Grid>
      {speciesSelection.seedsSelected.map((seed, i) => {
        return (
          <Grid item xs={12} key={i}>
            <Accordion xs={12}>
              <AccordionSummary
                xs={12}
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
                      label={"Mix Seeding Rate PLS"}
                      value={Math.floor(seed.singleSpeciesSeedingRatePLS)}
                    />
                    <SeedDataChip
                      label={"Aprox plants per"}
                      value={Math.floor(seed.plantsPerAcre)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <SeedingRateChip
                      label={"Bulk Seeding Rate"}
                      value={Math.floor(seed.bulkSeedingRate)}
                    />
                    <SeedDataChip
                      label={"Seeds per"}
                      value={Math.floor(seed.seedsPerAcre)}
                    />
                  </Grid>

                  <Grid item xs={12} pt={"1rem"}>
                    <Button
                      onClick={(e) => {
                        updateSeed(!seed.showSteps, "showSteps", seed);
                      }}
                      variant="outlined"
                    >
                      {seed.showSteps ? "Close Steps" : "Change My Rate"}
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    {seed.showSteps && (
                      <ReviewMixSteps
                        speciesSelection={speciesSelection}
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
        );
      })}
    </Grid>
  );
};
export default ReviewMix;
