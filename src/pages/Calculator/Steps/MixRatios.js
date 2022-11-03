import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { calculateInt } from "../../../shared/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { updateSteps } from "../../../features/stepSlice";
import { NumberTextField } from "../../../components/NumberTextField";

import "./steps.css";

const MixRatio = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  console.log("current global state", data);
  const crops = data.crops;
  const mixRatioData = data.mixRatio;
  const speciesSelection = data.speciesSelection;
  const array = [
    { name: "Group A", value: 300 },
    { name: "Group B", value: 200 },
    { name: "Group C", value: 200 },
    { name: "Group D", value: 300 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  const updateSeed = (val, key1, key2, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    if (key2 === "") {
      data[index][key1] = val;
      handleUpdateSteps("seedsSelected", data);
    } else {
      //update deep values (ex: data[0].step1.percentOfSingleSpeciesRate)
      data[index][key1][key2] = val;
      const calculateVal = calculateSeeds(key1, data[index]);
      data[index][calculateVal["key"]] = calculateVal["val"];
      handleUpdateSteps("seedsSelected", data);
    }
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const calculateSeeds = (step, seed) => {
    console.log("ste", step);
    console.log("seeeeed", seed);
    switch (step) {
      case "step1":
        return {
          key: "mixSeedingRate",
          val: calculateInt(
            [
              seed.step1.singleSpeciesSeedingRatePLS,
              seed.step1.percentOfSingleSpeciesRate,
            ],
            "multiply"
          ),
        };
      case "step2":
        return {
          key: "seedsPerAcre",
          val: calculateInt(
            [seed.step2.seedsPound, seed.step2.mixSeedingRate],
            "multiply"
          ),
        };
      case "step3":
        return {
          key: "plantsPerAcre",
          val: calculateInt(
            [seed.seedsPerAcre, seed.step3.percentSurvival],
            "multiply"
          ),
        };
      case "step4":
        return {
          key: "aproxPlantsSqFt",
          val: calculateInt(
            [seed.plantsPerAcre, seed.step4.sqFtAcre],
            "divide"
          ),
        };
      default:
        return;
    }
  };
  const renderPieChart = () => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart width={400} height={400}>
          <Pie
            data={array}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {array.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };
  const renderSeedsSelected = () => {
    console.log("Species selection", speciesSelection.seedsSelected);
    return (
      <Grid item xs={3} md={1}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: 1,
            backgroundColor: "#E5E7D5",
            border: "#C7C7C7 solid 1px",
          }}
        >
          {speciesSelection.seedsSelected.map((s, idx) => {
            return (
              <Fragment>
                <img
                  className={
                    matchesXs
                      ? "left-panel-img-xs"
                      : matchesSm
                      ? "left-panel-img-sm"
                      : matchesMd
                      ? "left-panel-img-md"
                      : "left-panel-img"
                  }
                  src={s.thumbnail.src}
                  alt={s.label}
                  loading="lazy"
                />
                <Typography className="left-panel-text">{s.label}</Typography>
              </Fragment>
            );
          })}
        </Box>
      </Grid>
    );
  };
  const renderAccordian = (data) => {
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          className="accordian-header"
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{data.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderAccordianDetail(data)}</AccordionDetails>
      </Accordion>
    );
  };
  const renderAccordianDetail = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={6}>
          <Typography>Default Single Species Seeding Rate PLS</Typography>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              padding: "11px",
              margin: "0 auto",
              backgroundColor: "#E5E7D5",
              border: "#C7C7C7 solid 1px",
              borderRadius: "50%",
            }}
          >
            <Typography>57</Typography>
          </Box>
          <Typography>Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Default Mix Seeding Rate PLS</Typography>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              padding: "11px",
              margin: "0 auto",
              backgroundColor: "#E5E7D5",
              border: "#C7C7C7 solid 1px",
              borderRadius: "50%",
            }}
          >
            <Typography>19</Typography>
          </Box>
          <Typography>Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "110px",
              height: "50px",
              padding: "11px",
              margin: "0 auto",
              backgroundColor: "#E5E7D5",
              border: "#C7C7C7 solid 1px",
              borderRadius: "16px",
            }}
          >
            <Typography>29,620</Typography>
          </Box>
          <Typography>Aprox plants per</Typography>
          <Button variant="outlined">Sqft</Button>
          {"   "}
          <Button variant="contained">Acres</Button>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "110px",
              height: "50px",
              padding: "11px",
              margin: "0 auto",
              backgroundColor: "#E5E7D5",
              border: "#C7C7C7 solid 1px",
              borderRadius: "16px",
            }}
          >
            <Typography>34,893</Typography>
          </Box>
          <Typography>Seeds per</Typography>
          <Button variant="contained">Sqft</Button>
          {"   "}
          <Button variant="outlined">Acres</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>Change My Rate / Close Steps</Typography>
        </Grid>
        <Grid item xs={12}>
          {renderMixRateSteps(data)}
        </Grid>
      </Grid>
    );
  };
  const renderMixRateSteps = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 1:</Typography>
        </Grid>
        <Grid container xs={12} className="mix-ratio-form-container">
          <Grid item xs={12} md={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Single Species Seeding Rate PLS"
              variant="filled"
              handleChange={(e) => {
                updateSeed(
                  e.target.value,
                  "step1",
                  "singleSpeciesSeedingRatePLS",
                  data
                );
              }}
              value={data.step1.singleSpeciesSeedingRatePLS}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
          <Grid item xs={12} md={1}>
            <Typography className="no-display">_</Typography>
            <Typography>X</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% of Single Species Rate"
              variant="filled"
              handleChange={(e) => {
                updateSeed(
                  e.target.value,
                  "step1",
                  "percentOfSingleSpeciesRate",
                  data
                );
              }}
              value={data.step1.percentOfSingleSpeciesRate}
            />
            <Typography>MCCC</Typography>
          </Grid>
          <Grid item xs={12} md={1}>
            <Typography className="no-display">_</Typography>
            <Typography>=</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Mix Seeding Rate"
              variant="filled"
              value={data.mixSeedingRate}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 2: </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Seeds / Pound"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "step2", "seedsPound", data);
            }}
            value={data.step2.seedsPound}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>X</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "step2", "mixSeedingRate", data);
            }}
            value={data.step2.mixSeedingRate}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>=</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Seeds / Acre"
            variant="filled"
            value={data.seedsPerAcre}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 3: </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Seeds / Acre"
            variant="filled"
            value={data.seedsPerAcre}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>X</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Survival"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "step3", "percentSurvival", data);
            }}
            value={data.step3.percentSurvival}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>=</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Plants / Acre"
            variant="filled"
            value={data.plantsPerAcre}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 4: </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Plants / Acre"
            variant="filled"
            value={data.plantsPerAcre}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>÷</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Sq. Ft./ Acre"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "step4", "sqFtAcre", data);
            }}
            value={data.step4.sqFtAcre}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Typography className="no-display">_</Typography>
          <Typography>=</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Aproximate Plants  / Sq. Ft."
            variant="filled"
            value={data.aproxPlantsSqFt}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </Grid>
    );
  };
  return (
    <Grid xs={12} container>
      {renderSeedsSelected()}
      <Grid
        xs={speciesSelection.seedsSelected.length > 0 ? 9 : 12}
        md={speciesSelection.seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Review Proportions</Typography>
          <Grid container xs={12}>
            <Grid item xs={6} md={6} className="mix-ratio-chart-container">
              {renderPieChart()}
              <Typography className="mix-ratio-chart-header">
                Pounds of Seed / Acre{" "}
              </Typography>
              <Grid item className="mix-ratio-chart-list-50">
                {speciesSelection.seedsSelected.map((s, i) => {
                  return <Typography>{s.label}</Typography>;
                })}
              </Grid>
            </Grid>
            <Grid item xs={6} md={6} className="mix-ratio-chart-container">
              {renderPieChart()}
              <Typography className="mix-ratio-chart-header">
                Pounds of Seed / Acre{" "}
              </Typography>
              <Grid item className="mix-ratio-chart-list-50">
                {speciesSelection.seedsSelected.map((s, i) => {
                  return <Typography>{s.label}</Typography>;
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid container xs={12}>
            {speciesSelection.seedsSelected.map((s, i) => {
              return (
                <Grid item xs={12}>
                  {renderAccordian(s)}
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixRatio;
