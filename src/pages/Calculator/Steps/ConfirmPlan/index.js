import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Accordion from "@mui/material/Accordion";
import { Square } from "@mui/icons-material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { calculateAllConfirmPlan } from "../../../../shared/utils/calculate";
import { generateNullSeed } from "../../../../shared/utils/seeds";
import { handleDownload } from "./../../../../shared/utils/exportExcel";
import { updateSteps } from "../../../../features/stepSlice";
import { NumberTextField } from "../../../../components/NumberTextField";
import { DSTSwitch } from "../../../../components/Switch";
import NRCSDetailModal from "./modal";
import { generateNRCSStandards } from "./../../../../shared/utils/NRCS/calculateNRCS";

import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const ConfirmPlan = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops &  reducer
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState({ value: false, seeds: [] });
  const dispatch = useDispatch();

  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const NRCS = data.NRCS;

  useEffect(() => {
    generateNRCSStandards(speciesSelection.seedsSelected);
  }, []);

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
  const handleModalOpen = (data) => {
    !modalOpen && setCurrentModal(data);
    setModalOpen(!modalOpen);
  };
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
  const initialDataLoad = () => {
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    let newData = [...data];
    speciesSelection.seedsSelected.map((s, i) => {
      newData[i] = calculateAllConfirmPlan(s);
      handleUpdateAllSteps(newData, i);
    });
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

  const renderSeedsSelected = (seed) => {
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
  };
  const renderSeedData = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="confirm-plan-header">{data.label}</Typography>
        </Grid>
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
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="confirm-plan-header">
            Total Cost of mix:
          </Typography>
        </Grid>
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
            {/* <Typography>Cost / Pound</Typography> */}
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
            disabled={true}
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

  useEffect(() => {
    initialDataLoad();
  }, []);
  return (
    <Grid xs={12} container>
      {currentModal !== null && (
        <NRCSDetailModal
          modalOpen={modalOpen}
          handleModalOpen={handleModalOpen}
          data={currentModal}
        />
      )}
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
          <Grid container sx={{ marginTop: "5px" }} xs={12}>
            <Grid item xs={matchesUpMd ? 11 : 10}></Grid>
            <Grid item xs={matchesUpMd ? 1 : 2}>
              <Button
                className="export-button"
                onClick={() => {
                  handleDownload([
                    ...speciesSelection.seedsSelected,
                    {
                      ...generateNullSeed(),
                      label: "EXT-DATA-OBJECT",
                      extData: JSON.stringify(data),
                    },
                  ]);
                }}
              >
                Export
              </Button>
            </Grid>
          </Grid>
          <Grid container xs={12} sx={{ padding: "20px" }}>
            <Grid
              item
              xs={6}
              sx={{
                borderRight: "1px solid #CCCCCC",
                borderBottom: "1px solid #CCCCCC",
                padding: "10px",
              }}
            >
              <Typography className="data-circle-label">
                Amount of mix for 50 acres
              </Typography>
              <Box className="data-circle">
                <Typography>3,425</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                borderBottom: "1px solid #CCCCCC",
                padding: "10px",
              }}
            >
              <Typography className="data-circle-label">Price/Acre</Typography>
              <Box className="data-circle">
                <Typography>$35.33</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              className="mix-ratio-chart-container"
              sx={{
                borderRight: "1px solid #CCCCCC",
                borderBottom: "1px solid #CCCCCC",
                padding: "10px",
              }}
            >
              {renderPieChart("poundsOfSeed")}
              <Typography
                className="mix-ratio-chart-header"
                sx={{ fontWeight: 600 }}
              >
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
            <Grid
              item
              xs={6}
              md={6}
              className="mix-ratio-chart-container"
              sx={{
                borderBottom: "1px solid #CCCCCC",
                padding: "10px",
              }}
            >
              {renderPieChart("plantsPerAcre")}
              <Typography
                className="mix-ratio-chart-header"
                sx={{ fontWeight: 600 }}
              >
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
            {NRCS.enabled && (
              <>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "20px", margin: "20px" }}
                  >
                    Indiana NRCS Standards
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}
                  >
                    Seeding Rate
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Box className="NRCS-result-container">
                    <Typography sx={{ float: "left" }}>
                      {" "}
                      {NRCS.results.seedingRate.value ? (
                        <CheckIcon sx={{ color: "green" }}></CheckIcon>
                      ) : (
                        <ClearIcon sx={{ color: "red" }}></ClearIcon>
                      )}
                    </Typography>
                    <Typography sx={{ float: "left", marginLeft: "5px" }}>
                      {NRCS.results.seedingRate.value ? "passed" : "failed"}
                    </Typography>
                    <Link
                      sx={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                      onClick={() => {
                        handleModalOpen(NRCS.results.seedingRate);
                      }}
                    >
                      Show Details
                    </Link>
                  </Box>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}
                  >
                    Planting Date
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>

                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Box className="NRCS-result-container">
                    <Typography sx={{ float: "left" }}>
                      {" "}
                      {NRCS.results.plantingDate.value ? (
                        <CheckIcon sx={{ color: "green" }}></CheckIcon>
                      ) : (
                        <ClearIcon sx={{ color: "red" }}></ClearIcon>
                      )}
                    </Typography>
                    <Typography sx={{ float: "left", marginLeft: "5px" }}>
                      {NRCS.results.plantingDate.value ? "passed" : "failed"}
                    </Typography>
                    <Link
                      sx={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                      onClick={() => {
                        handleModalOpen(NRCS.results.plantingDate);
                      }}
                    >
                      Show Details
                    </Link>
                  </Box>
                </Grid>
                <Grid xs={1}></Grid>

                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}
                  >
                    Ratio
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Box className="NRCS-result-container">
                    <Typography sx={{ float: "left" }}>
                      {" "}
                      {NRCS.results.ratio.value ? (
                        <CheckIcon sx={{ color: "green" }}></CheckIcon>
                      ) : (
                        <ClearIcon sx={{ color: "red" }}></ClearIcon>
                      )}
                    </Typography>
                    <Typography sx={{ float: "left", marginLeft: "10px" }}>
                      {NRCS.results.ratio.value ? "passed" : "failed"}
                    </Typography>
                    <Link
                      sx={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                      onClick={() => {
                        handleModalOpen(NRCS.results.ratio);
                      }}
                    >
                      Show Details
                    </Link>
                  </Box>
                </Grid>
                <Grid xs={1}></Grid>

                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}
                  >
                    Soil Drainage
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Box className="NRCS-result-container">
                    <Typography sx={{ float: "left" }}>
                      {NRCS.results.soilDrainage.value ? (
                        <CheckIcon sx={{ color: "green" }}></CheckIcon>
                      ) : (
                        <ClearIcon sx={{ color: "red" }}></ClearIcon>
                      )}
                    </Typography>
                    <Typography sx={{ float: "left", marginLeft: "5px" }}>
                      {NRCS.results.soilDrainage.value ? "passed" : "failed"}
                    </Typography>
                    <Link
                      sx={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                      onClick={() => {
                        handleModalOpen(NRCS.results.soilDrainage);
                      }}
                    >
                      Show Details
                    </Link>
                  </Box>
                </Grid>
                <Grid xs={1}></Grid>

                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 600, float: "left" }}
                  >
                    Expected Winter Survival
                  </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                  <Box className="NRCS-result-container">
                    <Typography sx={{ float: "left", marginLeft: "5px" }}>
                      {NRCS.results.expectedWinterSurvival.value}
                    </Typography>
                    <Link
                      sx={{
                        float: "right",
                        cursor: "pointer",
                        marginTop: "2px",
                      }}
                      onClick={() => {
                        handleModalOpen(NRCS.results.expectedWinterSurvival);
                      }}
                    >
                      Show Details
                    </Link>
                  </Box>
                </Grid>
                <Grid xs={1}></Grid>
              </>
            )}
            <Grid item xs={12}>
              {" "}
              {speciesSelection.seedsSelected.map((s, i) => {
                return <> {renderSeedData(s)}</>;
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
