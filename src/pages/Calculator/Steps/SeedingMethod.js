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

import { VerticalSlider } from "../../../components/VerticalSlider";
import { seedsList, seedsLabel } from "../../../shared/data/species";
import "./steps.css";

const SeedingMethod = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const seedingMethod = data.seedingMethod;
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "seedingMethod",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const updateSteps = (val, key1, key2, seed) => {
    let data = { seedingRate: val };
    handleUpdateSteps("seedingRate", val);
  };

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
    <Grid xs={12} justify="center" container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={seedsSelected.length > 0 ? 12 : 12}
        md={seedsSelected.length > 0 ? 11 : 12}
        item
      >
        <Grid item xs={12}>
          <Typography variant="h2">Seeding Method</Typography>
        </Grid>
        <Grid
          sx={{ paddingTop: 5 }}
          container
          xs={12}
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            xs={4}
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Grid item xs={12}>
              <Typography>
                <Box
                  className="seeding-method-detail-container"
                  sx={{ marginBottom: "40px" }}
                >
                  <Typography>Factors that lower Seeding Rate:</Typography>
                  <Typography>- Cost Saving</Typography>
                  <Typography>- Low Biomass</Typography>
                  <Typography>- Planting Green</Typography>
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box
                className="seeding-method-label-container"
                sx={{ marginBottom: "40px" }}
              >
                <Typography>Calculated Mix Seeding Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className="seeding-method-detail-container">
                <Typography>Factors that may raise Seeding Rate: </Typography>
                <Typography>- Erosion Control</Typography>
                <Typography>- Weed Supression</Typography>
                <Typography>- Grazing</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid xs={3} container justifyContent="center" alignItems="center">
            <VerticalSlider
              value={seedingMethod.seedingRate}
              handleChange={handleUpdateSteps}
            />
          </Grid>
          <Grid container xs={5} sx={{ height: "400px" }}>
            <Grid item xs={12} justifyContent="flex-start">
              <Box
                className="seeding-method-label-container"
                sx={{ marginBottom: "270px" }}
              >
                <Typography>High limit of Mix Seeding Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} justifyContent="flex-end">
              <Box className="seeding-method-label-container">
                <Typography>Low limit of Mix Seeding Rate</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SeedingMethod;