//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { calculateAllConfirmPlan } from "../../../../shared/utils/calculate";
import { handleDownload } from "./../../../../shared/utils/exportExcel";
import { updateSteps } from "../../../../features/stepSlice/index";
import NRCSDetailModal from "./modal";
import { generateNRCSStandards } from "./../../../../shared/utils/NRCS/calculateNRCS";
import ConfirmPlanCharts from "./charts";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";
import { emptyValues } from "../../../../shared/utils/calculate";
import ConfirmPlanForm from "./form";

const ConfirmPlan = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // useSelector for crops &  reducer
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState({ value: false, seeds: [] });
  const dispatch = useDispatch();

  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const NRCS = data.NRCS;

  const poundsForPurchaseSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + a.poundsForPurchase,
    0
  );

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

  //////////////////////////////////////////////////////////
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  const handleModalOpen = (data) => {
    !modalOpen && setCurrentModal(data);
    setModalOpen(!modalOpen);
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

  const renderSeedsSelected = (seed) => {
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
  };

  const generateSeedNull = () => {
    const seed = { ...speciesSelection.seedsSelected[1] };
    console.log("generateSeedNull", emptyValues(seed));
    return emptyValues(seed);
  };

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    initialDataLoad();
    generateNRCSStandards(speciesSelection.seedsSelected, data.siteCondition);
  }, []);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

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

          {/* Export */}

          <Grid container sx={{ marginTop: "5px" }} xs={12}>
            <Grid item xs={matchesUpMd ? 11 : 10}></Grid>
            <Grid item xs={matchesUpMd ? 1 : 2}>
              <Button
                className="export-button"
                onClick={() => {
                  handleDownload(
                    [
                      ...speciesSelection.seedsSelected,
                      {
                        ...generateSeedNull(),
                        label: "EXT-DATA-OBJECT",
                        extData: JSON.stringify(data),
                      },
                    ],
                    council
                  );
                }}
              >
                Export
              </Button>
            </Grid>
          </Grid>

          {/* Charts */}

          <ConfirmPlanCharts
            council={council}
            renderPieChart={renderPieChart}
            poundsForPurchaseSum={poundsForPurchaseSum}
            speciesSelection={speciesSelection}
            COLORS={COLORS}
            matchesMd={matchesMd}
          />
          <ConfirmPlanForm
            updateSeed={updateSeed}
            NRCS={NRCS}
            handleModal={handleModalOpen}
            data={data}
            speciesSelection={speciesSelection}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ConfirmPlan;
