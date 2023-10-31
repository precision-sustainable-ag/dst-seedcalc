import Grid from "@mui/material/Grid";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import { Square } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { calculatePieChartData } from "../../../../shared/utils/calculate";

import "./../steps.scss";

// TODO: build pie chart to a custom component, this should be done in another pr
const ConfirmPlanCharts = ({ council, speciesSelection, matchesMd }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;

  const poundsForPurchaseSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + a.poundsForPurchase,
    0
  );

  const { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray } =
    calculatePieChartData(speciesSelection.seedsSelected);

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

  return (
    <Grid container xs={12} sx={{ padding: "0.5rem" }}>
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
          <Typography>{parseInt(poundsForPurchaseSum) + "lbs"}</Typography>
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
          {/* FIXME: static value here */}
          <Typography>$35.33</Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        className="pie-chart-container"
        sx={{
          borderRight: "1px solid #CCCCCC",
          borderBottom: "1px solid #CCCCCC",
          padding: "10px",
        }}
      >
        {council === "MCCC"
          ? renderPieChart("plantsPerAcre")
          : renderPieChart("seedsPerAcre")}
        <Typography className="mix-ratio-chart-header" sx={{ fontWeight: 600 }}>
          {council === "MCCC" ? "Pounds of Seed / Acre" : "Seeds Per Acre"}
        </Typography>
        <Grid item className="mix-ratio-chart-list-50">
          {speciesSelection.seedsSelected.map((s, i) => {
            return (
              <Grid container xs={12} key={i}>
                <Grid item xs={2}>
                  <Square sx={{ color: COLORS[i] }}></Square>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    className={matchesMd ? "mix-label-md" : ""}
                    color={"primary.text"}
                  >
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
        className="pie-chart-container"
        sx={{
          borderBottom: "1px solid #CCCCCC",
          padding: "10px",
        }}
      >
        {/* FIXME: the chart rendered seems different than the label? */}
        {renderPieChart("poundsOfSeed")}
        <Typography className="mix-ratio-chart-header" sx={{ fontWeight: 600 }}>
          {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
        </Typography>
        <Grid item className="mix-ratio-chart-list-50">
          {speciesSelection.seedsSelected.map((s, i) => {
            return (
              <Grid container xs={12} key={i}>
                <Grid item xs={2}>
                  <Square sx={{ color: COLORS[i] }}></Square>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    className={matchesMd ? "mix-label-md" : ""}
                    color={"primary.text"}
                  >
                    {s.label}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ConfirmPlanCharts;
