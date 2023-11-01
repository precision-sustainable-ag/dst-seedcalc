import Grid from "@mui/material/Grid";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import { Square } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { calculatePieChartData } from "../../../../shared/utils/calculate";

import "./../steps.scss";
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from "../../../../components/DSTPieChart";

// TODO: build pie chart to a custom component, this should be done in another pr
const ConfirmPlanCharts = ({ council, speciesSelection, matchesMd }) => {
  const poundsForPurchaseSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => sum + a.poundsForPurchase,
    0
  );

  const { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray } =
    calculatePieChartData(speciesSelection.seedsSelected);

  const ConfirmPlanChip = ({ label, value }) => {
    return (
      <>
        <Typography
          sx={{ fontWeight: 600, minHeight: "45px", color: "primary.text" }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            bgcolor: "#e7885f",
            color: "white",
            borderRadius: "50%",
            width: "5rem",
            height: "5rem",
            margin: "0 auto 10px auto",
          }}
        >
          <Typography sx={{ pt: "30px" }}>{value}</Typography>
        </Box>
      </>
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
        }}
      >
        <ConfirmPlanChip
          label={"Amount of mix for 50 acres"}
          value={parseInt(poundsForPurchaseSum) + "lbs"}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          borderBottom: "1px solid #CCCCCC",
        }}
      >
        {/* FIXME: static value here */}
        <ConfirmPlanChip label={"Price/Acre"} value={"$35.33"} />
      </Grid>

      <Grid
        item
        xs={6}
        md={6}
        sx={{
          borderRight: "1px solid #CCCCCC",
          borderBottom: "1px solid #CCCCCC",
          textAlign: "justify",
        }}
      >
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>{"Pounds of Seed / Acre"}</DSTPieChartLabel>
        <DSTPieChartLegend
          labels={speciesSelection.seedsSelected.map((seed) => seed.label)}
          matchesMd={matchesMd}
        />
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        sx={{
          borderBottom: "1px solid #CCCCCC",
          textAlign: "justify",
        }}
      >
        {/* FIXME: the chart rendered seems different than the label? */}
        <DSTPieChart
          chartData={
            council === "MCCC" ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
        </DSTPieChartLabel>
        <DSTPieChartLegend
          labels={speciesSelection.seedsSelected.map((seed) => seed.label)}
          matchesMd={matchesMd}
        />
      </Grid>
    </Grid>
  );
};
export default ConfirmPlanCharts;
