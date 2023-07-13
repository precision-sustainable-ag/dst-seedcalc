import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import Accordion from "@mui/material/Accordion";
import { Square } from "@mui/icons-material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  calculateAllValues,
  calculateSeeds,
} from "./../../../../shared/utils/calculate";

import { updateSteps } from "./../../../../features/stepSlice";
import { NumberTextField } from "./../../../../components/NumberTextField";

import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const MixRatio = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const plantsPerAcreSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + a.plantsPerAcre,
    0
  );
  const poundsOfSeedSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + a.poundsOfSeed,
    0
  );
  const poundsOfSeedArray = [];
  const plantsPerAcreArray = [];
  speciesSelection.seedsSelected.map((s, i) => {
    plantsPerAcreArray.push({
      name: s.label,
      value: s.plantsPerAcre / plantsPerAcreSum,
    });
    poundsOfSeedArray.push({
      name: s.label,
      value: s.poundsOfSeed / poundsOfSeedSum,
    });
  });

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
  const handleUpdateAllSteps = (prevData, index) => {
    let data = [...prevData];
    data[index] = calculateAllValues(data[index]);
    handleUpdateSteps("seedsSelected", data);
  };
  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    data[index][key] = val;
    handleUpdateSteps("seedsSelected", data);

    // create new copy of recently updated Redux state, calculate & update all seed's step data.
    let newData = [...data];
    newData[index] = calculateAllValues(data[index]);
    handleUpdateAllSteps(newData, index);
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

  const renderPieChart = (type) => {
    const chartData =
      type === "plantsPerAcre" ? plantsPerAcreArray : poundsOfSeedArray;

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
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
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
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
            <Typography>
              {Math.floor(data.singleSpeciesSeedingRatePLS)}
            </Typography>
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
            <Typography>{Math.floor(data.mixSeedingRate)}</Typography>
          </Box>
          <Typography className="font-15">Lbs / Acre</Typography>
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
            <Typography>{Math.floor(data.plantsPerAcre)}</Typography>
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
            <Typography>{Math.floor(data.seedsPerAcre)}</Typography>
          </Box>
          <Typography>Seeds per</Typography>
          <Button variant="contained">Sqft</Button>
          {"   "}
          <Button variant="outlined">Acres</Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={(e) => {
              updateSeed(!data.showSteps, "showSteps", data);
            }}
            variant="outlined"
          >
            {data.showSteps ? "Close Steps" : "Change My Rate"}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {data.showSteps && renderMixRateSteps(data)}
        </Grid>
      </Grid>
    );
  };
  const renderFormLabel = (label1, label2, label3) => {
    return (
      <Grid container xs={12} className="mix-ratio-form-container">
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
          >
            {label1}
          </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
          >
            {label2}
          </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
          >
            {label3}
          </Typography>
        </Grid>
      </Grid>
    );
  };
  const renderFormInput = (data) => {
    return <Grid xs={12} className="mix-ratio-form-container"></Grid>;
  };
  const renderMixRateSteps = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 1:</Typography>
        </Grid>
        {renderFormLabel(
          "Single Species Seeding Rate PLS",
          "% of Single Species Rate",
          "Mix Seeding Rate"
        )}
        <Grid container xs={12} className="mix-ratio-form-container">
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={false}
              label="Single Species Seeding Rate PLS"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "singleSpeciesSeedingRatePLS", data);
              }}
              value={data.singleSpeciesSeedingRatePLS}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">X</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% of Single Species Rate"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "percentOfSingleSpeciesRate", data);
              }}
              value={data.percentOfSingleSpeciesRate}
            />
            <Typography>MCCC</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Mix Seeding Rate"
              disabled={true}
              variant="filled"
              value={data.mixSeedingRate}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 2: </Typography>
        </Grid>
        {renderFormLabel(
          "Single Species Seeding Rate PLS",
          "% of Single Species Rate",
          "Mix Seeding Rate"
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Seeds / Pound"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "seedsPerPound", data);
            }}
            value={data.seedsPerPound}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Mix Seeding Rate"
            variant="filled"
            value={data.mixSeedingRate}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Seeds / Acre"
            variant="filled"
            disabled={true}
            value={data.seedsPerAcre}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 3: </Typography>
        </Grid>
        {renderFormLabel("Seeds/Acre", "% Survival", "Plants/Acre")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Seeds / Acre"
            variant="filled"
            disabled={true}
            value={data.seedsPerAcre}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Survival"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "percentSurvival", data);
            }}
            value={data.percentSurvival}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Plants / Acre"
            variant="filled"
            disabled={true}
            value={data.plantsPerAcre}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 4: </Typography>
        </Grid>
        {renderFormLabel(
          "Plants/Acre",
          "Sq.Ft./Acre",
          "Aproximate Plants/Sq.Ft."
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Plants / Acre"
            variant="filled"
            disabled={true}
            value={data.plantsPerAcre}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Sq. Ft./ Acre"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "sqFtAcre", data);
            }}
            value={data.sqFtAcre}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Aproximate Plants  / Sq. Ft."
            variant="filled"
            disabled={true}
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
        xs={12}
        md={speciesSelection.seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Review Proportions</Typography>
          <Grid container xs={12}>
            <Grid item xs={6} md={6} className="mix-ratio-chart-container">
              {renderPieChart("poundsOfSeed")}
              <Typography className="mix-ratio-chart-header">
                Pounds of Seed / Acre{" "}
              </Typography>
              <Grid item className="mix-ratio-chart-list-50">
                {speciesSelection.seedsSelected.map((s, i) => {
                  return (
                    <Grid container xs={12}>
                      <Grid item xs={2}>
                        <Square sx={{ color: COLORS[i] }}></Square>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography className={matchesMd ? "mix-label-md" : ""}>
                          {s.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={6} md={6} className="mix-ratio-chart-container">
              {renderPieChart("plantsPerAcre")}
              <Typography className="mix-ratio-chart-header">
                Plants Per Acre{" "}
              </Typography>
              <Grid item className="mix-ratio-chart-list-50">
                {speciesSelection.seedsSelected.map((s, i) => {
                  return (
                    <Grid container xs={12}>
                      <Grid item xs={2}>
                        <Square sx={{ color: COLORS[i] }}></Square>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography className={matchesMd ? "mix-label-md" : ""}>
                          {s.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
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
