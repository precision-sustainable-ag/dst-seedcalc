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

import { seedsList, seedsLabel } from "../../../shared/data/species";
import "./steps.css";

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
    return (
      <Grid item xs={matchesMd ? 12 : 1}>
        <Box className="selected-seeds-box">
          <Grid
            className="selected-seeds-container"
            container
            flexDirection={matchesMd ? "row" : "column"}
          >
            {speciesSelection.seedsSelected.map((s, idx) => {
              return (
                <Grid item className="selected-seeds-item">
                  <img
                    className={
                      matchesXs
                        ? "left-panel-img-xs"
                        : matchesSm
                        ? "left-panel-img-sm"
                        : matchesMd
                        ? "left-panel-img-md"
                        : "left-panel-img"
                    }
                    src={
                      s.thumbnail !== null
                        ? s.thumbnail.src
                        : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
                    }
                    alt={s.label}
                    loading="lazy"
                  />
                  <Typography className="left-panel-text">{s.label}</Typography>
                </Grid>
              );
            })}{" "}
          </Grid>
        </Box>
      </Grid>
    );
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
          <Typography>{Math.floor(val)}</Typography>
        </Box>
        <Typography>Lbs / Acre</Typography>
      </Grid>
    );
  };

  const renderAccordian = (data) => {
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{seedsLabel[data]}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          <Grid xs={12} container>
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Precision: </Typography>
            </Grid>
            {renderRightAccordian(35)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Drilled: </Typography>
            </Grid>
            {renderRightAccordian(3)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>Broadcast(with Light Incorporation): </Typography>
            </Grid>
            {renderRightAccordian(3)}
            <Grid item xs={6} className="mix-seeding-rate-grid-left">
              <Typography>
                Aerial(or broadcast with no Light Incorporation{" "}
                <span className="red-text">Not Recommended</span>):{" "}
              </Typography>
            </Grid>
            {renderRightAccordian(0)}
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
          {seedsList.map((s, i) => {
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
