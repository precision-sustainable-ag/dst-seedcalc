import Grid from "@mui/material/Grid";
import { Typography, ThemeProvider } from "@mui/material";
import { dstTheme } from "./../../../shared/themes";

const MixSeedingRate = () => {
  return (
    <ThemeProvider theme={dstTheme}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h2">Mix Seeding Rate</Typography>
      </Grid>
    </ThemeProvider>
  );
};
export default MixSeedingRate;
