import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
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
import { Square } from "@mui/icons-material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { updateSteps } from "./../../../../features/stepSlice";
import { NumberTextField } from "./../../../../components/NumberTextField";
import {
  calculateAllValues,
  calculateSeeds,
  calculateAllMixValues,
} from "./../../../../shared/utils/calculate";
import { checkAllNRCSStandards } from "../../../../shared/utils/NRCS/checkNRCS";
import { generateNRCSStandards } from "../../../../shared/utils/NRCS/calculateNRCS";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import { validateNRCS } from "../../../../shared/utils/NRCS/calculateNRCS";

const ReviewMix = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const siteCondition = data.siteCondition;
  const speciesSelection = data.speciesSelection;
  const seedingMethod = data.seedingMethod;

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
  const handleUpdateNRCS = (key, val) => {
    const data = {
      type: "NRCS",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  const initialDataLoad = () => {
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    let newData = [...data];

    newData.map((s, i) => {
      const index = i;
      newData[index] = calculateAllMixValues(s, siteCondition);
      handleUpdateAllSteps(newData, index);
    });
  };
  const handleUpdateAllSteps = (prevData, index) => {
    let data = [...prevData];
    data[index] = calculateAllMixValues(data[index], siteCondition);
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
    let newData = [...data];
    newData[index] = calculateAllMixValues(data[index], siteCondition);
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
  const calculateSeedsSelectedSum = (key) => {
    return data.speciesSelection.seedsSelected.reduce(
      (sum, a) => sum + parseFloat(a[key]),
      0
    );
  };
  const renderStripedLabels = (seed) => {
    const labels = [
      {
        label: "Single Species Seeding Rate",
        key: "singleSpeciesSeedingRatePLS",
        val: seed["singleSpeciesSeedingRatePLS"],
      },
      {
        label: "Added to Mix",
        key: "addedToMix",
        val: seed["addedToMix"],
      },
      {
        label: "Drilled or Broadcast with Cultipack",
        key: "drilled",
        val: seed["addedToMix"],
      },
      {
        label: "Management Impacts on Mix (+57%)",
        key: "managementImpactOnMix",
        val: data["seedingMethod"]["managementImpactOnMix"],
      },
      {
        label: "Bulk Germination and Purity",
        key: "bulkGerminationAndPurity",
        val: data["bulkGerminationAndPurity"],
      },
    ];
    const labels2 = [
      { label: "Species Modifications" },
      { label: "Species Review" },
      { label: "Pounds for Purchase" },
    ];
    return (
      <>
        {labels.map((l, i) => {
          return (
            <Grid
              container
              sx={{ backgroundColor: !(i % 2) && "#e3e5d3" }}
              xs={12}
            >
              <Grid item sx={{ textAlign: "justify" }} xs={10}>
                {l.label}
              </Grid>
              <Grid item xs={2}>
                {l.val}
              </Grid>
            </Grid>
          );
        })}
      </>
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
  const renderAccordianChart = (obj) => {
    const data = [
      { x: 100, y: 700, z: 600 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ];

    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart width={400} height={400} position="center">
              <CartesianGrid strokeDasharray="4" />
              <XAxis type="number" dataKey="x" name="stature" unit="acre" />
              <YAxis type="number" dataKey="y" name="weight" unit="lb" />
              <ZAxis dataKey="z" range={[1000, 1449]} name="score" unit="km" />
              <Tooltip cursor={{ strokeDasharray: "50 50" }} />
              <Scatter name="A school" data={data} fill="#E7885F">
                {/* <LabelList dataKey="x" content={renderCustomizedScatterLabel} /> */}
                <LabelList dataKey="x" fill="#fff" position="center" />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };
  const renderCustomizedScatterLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    return (
      <g>
        <circle cx={x + 20} cy={y + 25} r={radius} fill="#E7885F" />
        <text
          x={x + 20}
          y={y + 25}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value}
        </text>
      </g>
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
        <AccordionDetails>
          {renderAccordianChart(data)}
          {renderAccordianDetail(data)}
        </AccordionDetails>
      </Accordion>
    );
  };
  const renderAccordianDetail = (data) => {
    return (
      <Grid container xs={12}>
        {renderStripedLabels(data)}
        <Grid item xs={6}>
          <Typography>Mix Seeding Rate PLS</Typography>
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
          <Typography>Bulk Seeding Rate</Typography>
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
            <Typography>{Math.floor(data.bulkSeedingRate)}</Typography>
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
  const renderStepsForm = (label1, label2, label3) => {
    if (Array.isArray(label2)) {
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
              {label2[0]}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Typography
              className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            >
              {label2[1]}
            </Typography>
          </Grid>
          <Grid container xs={12} className="mix-ratio-form-container">
            <Grid item xs={3}>
              {label3}
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
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
    }
  };
  const renderMixRateSteps = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 1:</Typography>
        </Grid>
        {renderStepsForm(
          "Single Species Seeding Rate PLS",
          "% of Single Species Rate",
          "Mix Seeding Rate"
        )}
        <Grid container xs={12} className="mix-ratio-form-container">
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={true}
              label="Single Species Seeding Rate PLS"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "singleSpeciesSeedingRate", data);
              }}
              value={data.singleSpeciesSeedingRate}
            />
            <Typography className="font-15">Lbs / Acre</Typography>
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
            <Typography className="font-15">MCCC Recommendation</Typography>
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
              value={data.step1Result}
            />
            <Typography className="font-15">Lbs / Acre</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 2: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Planting Method",
          "Mix Seeding Rate PLS"
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Mix Seeding Rate PLS"
            variant="filled"
            // handleChange={(e) => {
            //   updateSeed(e.target.value, "step2MixSeedingRatePLS", data);
            // }}
            value={data.step1Result}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={false}
            label="Planting Method"
            variant="filled"
            value={data.plantingMethod}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step2Result}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 3: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Mix Seeding Rate PLS",
          "Management impact on mix"
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step2Result}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">+</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">(</Typography>
        </Grid>
        <Grid item xs={2}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            handleChange={(e) => {
              updateSeed(e.target.value, "step2Result", data);
            }}
            value={data.step2Result}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={2}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Management Impact on Mix"
            variant="filled"
            disabled={true}
            handleChange={(e) => {
              updateSeed(e.target.value, "managementImpactOnMix", data);
            }}
            value={seedingMethod.managementImpactOnMix}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">)</Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid container className="steps-row-2" xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={7}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Mix Seeding Rate PLS"
              variant="filled"
              disabled={true}
              value={data.step3Result}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 4: </Typography>
        </Grid>
        {renderStepsForm("Mix Seeding Rate PLS", "% Germination", "% Purity")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step3Result}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Germination"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "germinationPercentage", data);
            }}
            value={data.germinationPercentage}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Purity"
            variant="filled"
            disabled={true}
            value={data.purityPercentage}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid container className="steps-row-2" xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={7}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Bulk Seeding Rate"
              variant="filled"
              disabled={true}
              value={data.bulkSeedingRate}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 5: </Typography>
        </Grid>
        {renderStepsForm("Bulk Seeding Rate", "Acres", "Pounds for Purchase")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Bulk Seeding Rate"
            variant="filled"
            disabled={true}
            value={data.bulkSeedingRate}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">x</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Acres"
            variant="filled"
            disabled={true}
            handleChange={(e) => {
              updateSeed(e.target.value, "acres", data);
            }}
            value={siteCondition.acres}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Pounds for Purchase"
            variant="filled"
            disabled={true}
            value={data.poundsForPurchase}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </Grid>
    );
  };
  const updateNRCS = async () => {
    const NRCSData = await generateNRCSStandards(
      speciesSelection.seedsSelected,
      data.siteCondition
    );
    const NRCSResults = NRCSData;

    await handleUpdateNRCS("results", NRCSData);
  };
  useEffect(() => {
    initialDataLoad();
    return () => {
      updateNRCS();
    };
  }, []);
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
          <Typography variant="h2">Review your mix</Typography>
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
export default ReviewMix;
