import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Accordion from "@mui/material/Accordion";
import { Square } from "@mui/icons-material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { calculateAllConfirmPlan } from "../../../../shared/utils/calculate";
import { updateSteps } from "../../../../features/stepSlice";
import { NumberTextField } from "../../../../components/NumberTextField";
import { DSTSwitch } from "../../../../components/Switch";

import "./../steps.css";

const ConfirmPlan = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops &  reducer

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
    data[index] = calculateAllConfirmPlan(data[index]);
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
    newData[index] = calculateAllConfirmPlan(data[index]);
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
    return (
      <Grid item xs={matchesMd ? 12 : 1}>
        <Box className="selected-seeds-box">
          <Grid
            className="selected-seeds-container"
            container
            flexDirection={matchesMd ? "row" : "column"}
          >
            {speciesSelection.seedsSelected.map((s, idx) => {
              return (
                <Grid item className="selected-seeds-item">
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
                </Grid>
              );
            })}{" "}
          </Grid>
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
          expanded={true}
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
        <Grid item xs={12}>
          {renderConfirmPlanForm(data)}
        </Grid>
      </Grid>
    );
  };
  const renderStepsForm = (label1, label2, label3) => {
    if (Array.isArray(label2)) {
      return (
        <Grid container xs={12} className="confirm-plan-form-container">
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
          <Grid container xs={12} className="confirm-plan-form-container">
            <Grid item xs={3}>
              {label3}
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container xs={12} className="confirm-plan-form-container">
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
  const renderTotalCostOfMix = (data) => {
    const totalCostOfMix = data.speciesSelection.seedsSelected.reduce(
      (sum, a) => sum + a.totalCost,
      0
    );
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          className="accordian-header"
          xs={12}
          expanded={true}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Total Cost of Mix</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {" "}
          <Grid container xs={12}>
            <Grid item xs={3} className="confirm-plan-form-container">
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label={`${data.speciesSelection.seedsSelected[0].label}`}
                variant="filled"
                disabled={true}
                value={data.speciesSelection.seedsSelected[0].totalCost}
              />{" "}
            </Grid>
            <Grid item xs={1} className="confirm-plan-form-container">
              <Typography className="math-icon">+</Typography>
            </Grid>
            {data.speciesSelection.seedsSelected.map((s, i) => {
              if (i !== 0) {
                return (
                  <>
                    <Grid item xs={3} className="confirm-plan-form-container">
                      <NumberTextField
                        className="text-field-100"
                        id="filled-basic"
                        label={`${s.label}`}
                        variant="filled"
                        disabled={true}
                        value={s.totalCost}
                      />{" "}
                    </Grid>
                    <Grid item xs={1} className="confirm-plan-form-container">
                      <Typography className="math-icon">
                        {i !== data.speciesSelection.seedsSelected.length - 1
                          ? "+"
                          : "="}
                      </Typography>
                    </Grid>
                  </>
                );
              }
            })}
            <Grid item xs={3} className="confirm-plan-form-container">
              <NumberTextField
                className="text-field-100"
                id="filled-basic"
                label={"Total Cost of Mix"}
                variant="filled"
                disabled={true}
                value={totalCostOfMix}
              />{" "}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };
  const renderConfirmPlanForm = (data) => {
    return (
      <Grid container xs={12}>
        {renderStepsForm("Bulk Lbs / Acre", "Acres", "Total Pounds")}
        <Grid container xs={12} className="confirm-plan-form-container">
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={true}
              label="Bulk Lbs / Acre"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "bulkLbsPerAcre", data);
              }}
              value={data.bulkLbsPerAcre}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">X</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Acres"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "acres", data);
              }}
              value={data.acres}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Total Pounds"
              disabled={true}
              variant="filled"
              value={data.totalPounds}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        <Grid container xs={12} className="steps-row-2">
          <Grid item xs={3}>
            <Typography>Cost / Pound</Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Cost/Pound"
              variant="filled"
              disabled={true}
              value={data.costPerPound}
            />
          </Grid>
          <Grid item xs={3}>
            {" "}
            <DSTSwitch
              checked={data.confirmToggle}
              handleChange={(e) => {
                updateSeed(!data.confirmToggle, "confirmToggle", data);
              }}
            />
          </Grid>
        </Grid>

        {renderStepsForm("Cost/Pound", "Total Pounds", "Total Cost")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={false}
            label="Cost/Pound"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "costPerPound", data);
            }}
            value={data.costPerPound}
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
            label="Total Pounds"
            variant="filled"
            value={data.totalPounds}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Total Cost"
            variant="filled"
            disabled={true}
            value={data.totalCost}
          />
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
          <Typography variant="h2">Confirm your plan</Typography>
          <Grid container xs={12}>
            <Grid item xs={6}>
              <Typography>Amount of mix for 50 acres</Typography>
              <Box className="data-circle">
                <Typography>3,425</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography>Price/Acre</Typography>
              <Box className="data-circle">
                <Typography>$35.33</Typography>
              </Box>
            </Grid>
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
            <Grid item xs={12}>
              <Typography>Indiana NRCS Standards</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box className="data-circle">
                <CheckIcon className="data-circle-icon" />
              </Box>
              <Typography>Seeding Rate</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box className="data-circle">
                <ClearIcon className="data-circle-icon" />
              </Box>
              <Typography>Planting Date</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box className="data-circle">
                <CheckIcon className="data-circle-icon" />
              </Box>
              <Typography>Ratio</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box className="data-circle">
                <CheckIcon className="data-circle-icon" />
              </Box>
              <Typography>Soil Drainage</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box className="data-circle">
                <Typography>67%</Typography>
              </Box>
              <Typography>Expected Winter Survival</Typography>
            </Grid>
            <Grid item xs={12}>
              {" "}
              {speciesSelection.seedsSelected.map((s, i) => {
                return <> {renderAccordian(s)}</>;
              })}
              {renderTotalCostOfMix(data)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ConfirmPlan;
