import { Typography, useMediaQuery, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";

const CompletedPage = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesUpMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      <Grid xs={12} container>
        <Grid xs={12} className="cp-empty-block-50" container></Grid>
        <Grid xs={3} item></Grid>
        <Grid xs={6} item>
          <Typography>
            Thank you for completing the Seeding Rate Calculator Cognitive
            Walkthrough
          </Typography>
        </Grid>
        <Grid xs={3}></Grid>
      </Grid>
      <Grid xs={12} className="cp-empty-block" container></Grid>
      <Grid xs={12} container>
        <Grid xs={3} item></Grid>
        <Grid xs={6} item>
          <Typography sx={{ fontWeight: 600 }}>
            Questions or Comments? Email Juliet Norton jnnorton@purdue.edu
          </Typography>
        </Grid>
        <Grid xs={3} item></Grid>
      </Grid>
      <Grid xs={12} className="cp-empty-block" container></Grid>
      <Grid xs={12} container>
        <Grid xs={!matchesUpMd ? 6 : 3} item>
          <img
            alt="axilab"
            src="./axilab.png"
            className={!matchesUpMd ? "logo-img-80" : "logo-img-50"}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 6 : 3} item>
          <img
            alt="MCCC"
            src="./MCCCLogo.png"
            className={!matchesUpMd ? "logo-img-80" : "logo-img-50"}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 3 : 2} item>
          <img
            alt="PSA"
            src="./PSALogo.png"
            className={!matchesUpMd ? "logo-img-80" : "logo-img-50"}
          />
        </Grid>
        <Grid xs={!matchesUpMd ? 9 : 4} item>
          <img
            alt="NECCC"
            src="./NECCCWideLogo.png"
            className={!matchesUpMd ? "logo-img-80" : "logo-img-50"}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default CompletedPage;
