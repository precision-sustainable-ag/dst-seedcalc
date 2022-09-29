import Grid from "@mui/material/Grid";
import { Typography, ThemeProvider } from "@mui/material";
import { dstTheme } from "./../../../shared/themes";

const ReviewMix = () => {
  return (
    <ThemeProvider theme={dstTheme}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h2">Review Mix</Typography>
      </Grid>
    </ThemeProvider>
  );
};
export default ReviewMix;
