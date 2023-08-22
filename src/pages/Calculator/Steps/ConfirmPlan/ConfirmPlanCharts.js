import Grid from "@mui/material/Grid";
import { Typography, Box, Link, Button, Modal } from "@mui/material";
import { Square } from "@mui/icons-material";

// import { ConfirmPlanChart }
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const ConfirmPlanCharts = ({
  council,
  renderPieChart,
  poundsForPurchaseSum,
  speciesSelection,
  COLORS,
  matchesMd,
}) => {
  return (
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
          <Typography>{parseInt(poundsForPurchaseSum)}</Typography>
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
        <Typography className="mix-ratio-chart-header" sx={{ fontWeight: 600 }}>
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
        <Typography className="mix-ratio-chart-header" sx={{ fontWeight: 600 }}>
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
  );
};
export default ConfirmPlanCharts;
