import Grid from "@mui/material/Grid";
import { ThemeProvider, Typography } from "@mui/material";

import { dstTheme } from "./../../../shared/themes";
const SeedTagInfo = () => {
  return (
    <ThemeProvider theme={dstTheme}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h2">Seed Tag Info</Typography>
      </Grid>
    </ThemeProvider>
  );
};
export default SeedTagInfo;
