import Grid from "@mui/material/Grid";
import { Typography, ThemeProvider } from "@mui/material";
import { dstTheme } from "./../../../shared/themes";

const SpeciesSelection = () => {
  return (
    <ThemeProvider theme={dstTheme}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h2">Species Selection</Typography>
      </Grid>
    </ThemeProvider>
  );
};
export default SpeciesSelection;
