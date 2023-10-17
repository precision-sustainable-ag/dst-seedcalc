//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

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

import { updateSteps } from "../../../../features/stepSlice";
import { calculateAllMixValues } from "./../../../../shared/utils/calculate";
import { generateNRCSStandards } from "../../../../shared/utils/NRCS/calculateNRCS";
import "./../steps.scss";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import StripedLabels from "./StripedLabels";
import ReviewMixSteps from "./Steps";
import PieChartComponent from "./PieChart";

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

  // TODO: make into shared function
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
    return () => {
      updateNRCS();
    };
  }, []);

  //////////////////////////////////////////////////////////
  //                     Render                           //
  //////////////////////////////////////////////////////////

  const renderSeedsSelected = () => {
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
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
            {seed.showSteps && (
              <ReviewMixSteps
                speciesSelection={speciesSelection}
                council={council}
                renderStepsForm={renderStepsForm}
                updateSeed={updateSeed}
                seedingMethod={seedingMethod}
                siteCondition={siteCondition}
                seed={seed}
              />
            )}
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
              {council === "MCCC" ? (
                <PieChartComponent
                  type={"plantsPerAcre"}
                  plantsPerAcreArray={plantsPerAcreArray}
                  seedsPerAcreArray={seedsPerAcreArray}
                  poundsOfSeedArray={poundsOfSeedArray}
                  COLORS={COLORS}
                  renderCustomizedLabel={renderCustomizedLabel}
                />
              ) : (
                <PieChartComponent
                  type={"seedsPerAcre"}
                  plantsPerAcreArray={plantsPerAcreArray}
                  seedsPerAcreArray={seedsPerAcreArray}
                  poundsOfSeedArray={poundsOfSeedArray}
                  COLORS={COLORS}
                  renderCustomizedLabel={renderCustomizedLabel}
                />
              )}
              <Typography className="mix-ratio-chart-header">
                {council === "MCCC"
                  ? "Pounds of Seed / Acre"
                  : "Seeds Per Acre"}
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
              <PieChartComponent
                type={"poundsOfSeed"}
                plantsPerAcreArray={plantsPerAcreArray}
                seedsPerAcreArray={seedsPerAcreArray}
                poundsOfSeedArray={poundsOfSeedArray}
                COLORS={COLORS}
                renderCustomizedLabel={renderCustomizedLabel}
              />

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
