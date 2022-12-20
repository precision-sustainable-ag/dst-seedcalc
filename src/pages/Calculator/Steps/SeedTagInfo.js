import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { updateSteps } from "../../../features/stepSlice";
import { DSTSwitch } from "../../../components/Switch";
import { seedsList, seedsLabel } from "../../../shared/data/species";
import { NumberTextField } from "../../../components/NumberTextField";
import "./steps.css";

const SeedTagInfo = () => {
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
  const [sameInfoActive, setSameInfoActive] = useState(false);
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
                    src={s.thumbnail.src}
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

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  /*  
      handleSeed checks for whether the sameInfoActive is true/false.
      If true, loop through all seeds and update values to the same as the current seed being changed.
      Else, update individual value.
  */
  const handleSeed = (val, key1, key2, seed) => {
    if (sameInfoActive) {
      let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
      speciesSelection.seedsSelected.map((s, i) => {
        data[i]["germinationPercentage"] =
          key1 === "germinationPercentage" ? val : seed.germinationPercentage;
        data[i]["purityPercentage"] =
          key1 === "purityPercentage" ? val : seed.purityPercentage;
      });
      handleUpdateSteps("seedsSelected", data);
    } else {
      updateSeed(val, key1, key2, seed);
    }
  };
  const updateSeed = (val, key1, key2, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    data[index][key1] = val;
    handleUpdateSteps("seedsSelected", data);
  };

  const renderRightAccordian = (key, data, type, disabled) => {
    const value = Math.floor(data[key]);
    return (
      <Grid item xs={6} className="seed-tag-info-grid-right">
        <NumberTextField
          className="text-field-50"
          id="filled-basic"
          variant="filled"
          disabled={disabled}
          value={data[key]}
          handleChange={(e) => {
            handleSeed(e.target.value, key, "", {
              ...data,
              [key]: e.target.value,
            });
          }}
        />
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
          <Typography>{data.label}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          <Grid xs={12} container>
            <Grid item xs={6} className="seed-tag-info-grid-left">
              <Typography>% Germination: </Typography>
            </Grid>
            {renderRightAccordian(
              "germinationPercentage",
              data,
              "percent",
              false
            )}
            <Grid item xs={6} className="seed-tag-info-grid-left">
              <Typography>% Purity: </Typography>
            </Grid>
            {renderRightAccordian("purityPercentage", data, "percent", false)}
            <Grid item xs={6} className="seed-tag-info-grid-left">
              <Typography>Seeds per Pound </Typography>
            </Grid>
            {renderRightAccordian("poundsOfSeed", data, "", true)}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };
  const handleSwitch = () => {
    setSameInfoActive(!sameInfoActive);
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
          <Typography variant="h2">Enter seed tag info</Typography>
        </Grid>
        <Grid item xs={12}>
          <DSTSwitch checked={sameInfoActive} handleChange={handleSwitch} />{" "}
          Same Information for All Species
        </Grid>
        <Grid item xs={12}>
          {speciesSelection.seedsSelected.map((s, i) => {
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
export default SeedTagInfo;
