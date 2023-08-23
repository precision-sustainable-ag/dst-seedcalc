import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PieChart,
  Pie,
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
  convertToPercent,
  convertToDecimal,
  calculateAllMixValues,
  calculateAllMixValuesNECCC,
} from "./../../../../shared/utils/calculate";
import { generateNRCSStandards } from "../../../../shared/utils/NRCS/calculateNRCS";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import StripedLabels from "./StripedLabels";

const ReviewMix = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const siteCondition = data.siteCondition;
  const speciesSelection = data.speciesSelection;
  const seedingMethod = data.seedingMethod;

  const plantsPerAcreSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + parseFloat(a.plantsPerAcre),
    0
  );
  const poundsOfSeedSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + parseFloat(a.poundsOfSeed),
    0
  );
  const seedsPerAcreSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + parseFloat(a.seedsPerAcre),
    0
  );
  const poundsOfSeedArray = [];
  const plantsPerAcreArray = [];
  const seedsPerAcreArray = [];
  speciesSelection.seedsSelected.map((s, i) => {
    plantsPerAcreArray.push({
      name: s.label,
      value: s.plantsPerAcre / plantsPerAcreSum,
    });
    seedsPerAcreArray.push({
      name: s.label,
      value: s.seedsPerAcre / seedsPerAcreSum,
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
    let seeds = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    let newData = [...seeds];

    newData.map((s, i) => {
      const index = i;
      // newData[index] =
      //   council === "MCCC"
      //     ? calculateAllMixValues(s, data)
      //     : calculateAllMixValuesNECCC(s, data);
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
    let chartData;
    if (type === "plantsPerAcre") {
      chartData = plantsPerAcreArray;
    }
    if (type === "seedsPerAcre") {
      chartData = seedsPerAcreArray;
    }
    if (type === "poundsOfSeed") {
      chartData = poundsOfSeedArray;
    }
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
  const generateScatterData = (labels) => {
    let results = [];
    let counter = 0;
    labels.map((l, i) => {
      counter += 30;
      results.push({ x: counter, y: l.val, z: 400 });
    });
    return results;
  };
  const generateDetails = (label) => {
    if (label === "Single Species Seeding Rate") {
      return "Single Species Seeding Rate";
    }
    if (label === "Added To Mix") {
      return "Mix seeding rate added to mix";
    }
    if (label === "Drilled or Broadcast with Cultipack") {
      return "Mix seeding rate with drilled";
    }
    if (label === "Management Impacts on Mix (+57%)") {
      return "Mix seeding rate with Management Impact on mix";
    }
    if (label === "Bulk Germination and Purity") {
      return "Bulk Germination and Purity";
    }
    return "";
  };

  const CustomTooltip = (scatterData) => {
    const { active, payload, label } = scatterData;
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{generateDetails(label)}</p>
          <p className="desc">Calculation details</p>
        </div>
      );
    }

    return null;
  };
  const renderAccordianChart = (obj, labels) => {
    const scatterData = generateScatterData(labels);
    // const data = [
    //   { x: 30, y: 1, z: 600 },
    //   { x: 60, y: 2, z: 260 },
    //   { x: 90, y: 1, z: 400 },
    //   { x: 239, y: 1, z: 280 },
    //   { x: 150, y: 1, z: 500 },
    //   { x: 110, y: 1, z: 200 },
    // ];

    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart width={400} height={500} position="center">
              <CartesianGrid strokeDasharray="4" />
              <XAxis type="number" dataKey="x" name="" unit="" />
              <YAxis
                type="number"
                dataKey="y"
                name="Mix Seeding Rate"
                unit=""
              />
              <ZAxis dataKey="z" range={[1000, 1449]} name="" unit="" />
              <Tooltip
                cursor={{ strokeDasharray: "50 50" }}
                // content={CustomTooltip}
              />
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
                {/* <LabelList dataKey="x" content={renderCustomizedScatterLabel} /> */}
                <LabelList dataKey="y" fill="#fff" position="center" />
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
        <AccordionDetails>{renderAccordianDetail(data)}</AccordionDetails>
      </Accordion>
    );
  };
  const renderAccordianDetail = (seed) => {
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
    return (
      <>
        {renderAccordianChart(seed, labels)}
        <Grid container xs={12}>
          <StripedLabels data={data} seed={seed} labels={labels} />
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
                {Math.floor(seed.singleSpeciesSeedingRatePLS)}
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
              <Typography>{Math.floor(seed.bulkSeedingRate)}</Typography>
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
              <Typography>{Math.floor(seed.plantsPerAcre)}</Typography>
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
              <Typography>{Math.floor(seed.seedsPerAcre)}</Typography>
            </Box>
            <Typography>Seeds per</Typography>
            <Button variant="contained">Sqft</Button>
            {"   "}
            <Button variant="outlined">Acres</Button>
          </Grid>

          <Grid item xs={12}>
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
            {seed.showSteps && renderMixRateSteps(seed)}
          </Grid>
        </Grid>
      </>
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
  const generatePercentInGroup = (seed) => {
    const group = seed.group.label;
    let count = 0;
    speciesSelection.seedsSelected.map((s, i) => {
      s.group.label === group && count++;
    });
    return 1 / count;
  };
  const renderMixRateSteps = (seed) => {
    const percentInGroup = generatePercentInGroup(seed);
    return (
      <Grid container xs={12}>
        {/* NECCC Step 1:  */}
        {council === "NECCC" && (
          <>
            <Grid item xs={12}>
              <Typography className="mix-ratio-step-header">
                Step 1:{" "}
              </Typography>
            </Grid>
            {renderStepsForm(
              "Mix Seeding Rate PLS",
              "% in Group",
              "% of Single Species Seeding Rate"
            )}
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                disabled={false}
                label="Single Species Seeding Rate PLS"
                variant="filled"
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    "singleSpeciesSeedingRatePLS",
                    seed
                  );
                }}
                value={seed.singleSpeciesSeedingRatePLS}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">x</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label="% in Group"
                variant="filled"
                disabled={true}
                value={convertToPercent(percentInGroup)}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography className="math-icon">x</Typography>
            </Grid>
            <Grid item xs={3}>
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label="% of Single Species Rate"
                variant="filled"
                disabled={false}
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    "percentOfSingleSpeciesRate",
                    seed
                  );
                }}
                value={seed.percentOfSingleSpeciesRate}
              />
              <Typography>{council === "MCCC" ? "MCCC" : "NECCC"}</Typography>
            </Grid>
            <Grid container className="steps-row-2" xs={12}>
              <Grid item xs={4}>
                <Typography className="math-icon">=</Typography>
              </Grid>
              <Grid item xs={7}>
                <NumberTextField
                  className="text-field-100"
                  id="filled-basic"
                  label="Mix Seeding Rate"
                  disabled={true}
                  variant="filled"
                  value={seed.mixSeedingRate}
                />
                <Typography>Lbs / Acre</Typography>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
          </>
        )}
        {/* NECCC Step 1 END */}
        {/* MCCC Step 1 START */}
        {council === "MCCC" && (
          <>
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
                    updateSeed(
                      e.target.value,
                      "singleSpeciesSeedingRate",
                      seed
                    );
                  }}
                  value={seed.singleSpeciesSeedingRate}
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
                    updateSeed(
                      e.target.value,
                      "percentOfSingleSpeciesRate",
                      seed
                    );
                  }}
                  value={seed.percentOfSingleSpeciesRate}
                />
                <Typography className="font-15">
                  {council === "MCCC" && "MCCC Recommendation"}
                </Typography>
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
                  value={seed.step1Result}
                />
                <Typography className="font-15">Lbs / Acre</Typography>
              </Grid>
            </Grid>
          </>
        )}

        {/* MCCC Step 1 END */}
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
            value={seed.step1Result}
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
            value={seed.plantingMethod}
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
            value={seed.step2Result}
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
        {/*  */}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={seed.step2Result}
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
              updateSeed(e.target.value, "step2Result", seed);
            }}
            value={seed.step2Result}
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
              updateSeed(e.target.value, "managementImpactOnMix", seed);
            }}
            value={seedingMethod.managementImpactOnMix.toFixed(2)}
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
              value={seed.step3Result}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        {/*  */}
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
            value={seed.step3Result}
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
              updateSeed(
                convertToDecimal(e.target.value),
                "germinationPercentage",
                seed
              );
            }}
            value={convertToPercent(seed.germinationPercentage)}
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
            disabled={false}
            handleChange={(e) => {
              updateSeed(
                convertToDecimal(e.target.value),
                "purityPercentage",
                seed
              );
            }}
            value={convertToPercent(seed.purityPercentage)}
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
              value={seed.bulkSeedingRate}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        {/*  */}
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
            value={seed.bulkSeedingRate}
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
              updateSeed(e.target.value, "acres", seed);
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
            value={seed.poundsForPurchase}
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
              {council === "MCCC"
                ? renderPieChart("plantsPerAcre")
                : renderPieChart("seedsPerAcre")}
              <Typography className="mix-ratio-chart-header">
                {council === "MCCC"
                  ? "Pounds of Seed / Acre"
                  : "Seeds Per Acre"}
              </Typography>
              <Grid item className="mix-ratio-chart-list-50">
                {speciesSelection.seedsSelected.map((s, i) => {
                  <Grid container xs={12}>
                    <Grid item xs={2}>
                      <Square sx={{ color: COLORS[i] }}></Square>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography className={matchesMd ? "mix-label-md" : ""}>
                        {s.label}
                      </Typography>
                    </Grid>
                  </Grid>;
                })}
              </Grid>
            </Grid>
            <Grid item xs={6} md={6} className="mix-ratio-chart-container">
              {renderPieChart("poundsOfSeed")}
              <Typography className="mix-ratio-chart-header">
                {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
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
