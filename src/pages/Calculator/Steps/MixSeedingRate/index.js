import * as React from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { seedsList, seedsLabel } from "./../../../../shared/data/species";
import "./../steps.css";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const MixSeedingRate = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;

  const renderSeedsSelected = () => {
    return <SeedsSelectedList list={seedsSelected} />;
  };
  const renderRightAccordian = (val) => {
    return (
      <Grid item xs={6} className="mix-seeding-rate-grid-right">
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
          <Typography>{val}</Typography>
        </Box>
        <Typography>Lbs / Acre</Typography>
      </Grid>
    );
  };

  const renderAccordian = (seed) => {
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{seed.label}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          <Grid xs={12} container>
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Precision: </Typography>
            </Grid>
            {renderRightAccordian(seed.precision)}
            {/* <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Drilled: </Typography>
            </Grid>
            {renderRightAccordian(3)} */}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Broadcast(with Light Incorporation): </Typography>
            </Grid>
            {renderRightAccordian(seed.broadcast)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>
                Aerial(or broadcast with no Light Incorporation{" "}
                <span className="red-text">Not Recommended</span>):{" "}
              </Typography>
            </Grid>
            {renderRightAccordian(seed.aerial)}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };
  return (
    <Grid xs={12} container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={seedsSelected.length > 0 ? 12 : 12}
        md={seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Mix Seeding Rate</Typography>
        </Grid>
        <Grid item xs={12}>
          {seedsSelected.map((s, i) => {
            return (
              <Grid xs={12}>
                <Grid item>{renderAccordian(s)}</Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixSeedingRate;
