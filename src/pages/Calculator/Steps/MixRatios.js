import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DatePicker } from "../../../components/DatePicker";
import { Dropdown } from "../../../components/Dropdown";
import { NumberTextField } from "../../../components/NumberTextField";
import { DSTSwitch } from "../../../components/Switch";
import { updateSteps } from "../../../features/stepSlice";
import states from "../../../shared/data/states.json";
import counties from "../../../shared/data/countiesAndStates.json";
import { soilDrainage } from "../../../shared/data/dropdown";
import { getCrops } from "../../../features/stepSlice";
import "./steps.css";

const MixRatio = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const crops = data.crops;
  const mixRatioData = data.mixRatio;
  const speciesSelection = data.speciesSelection;

  const updateSeeds = (seed, species) => {
    const newSeed = {
      ...seed,
      poundsOfSeed: 0,
      plantsPerAcre: 0,
      step1: {
        singleSpeciesSeedingRatePLS: 0,
        percentOfSingleSpeciesRate: 0,
      },
      step2: {
        seedsPound: 0,
        mixSeedingRate: 0,
        seedsAcre: 0,
      },
      step3: {
        seedsAcre: 0,
        percentSurvival: 0,
        plantsAcre: 0,
      },
      step4: {
        plantsAcre: 0,
        sqFtAcre: 0,
        aproximatePlants: 0,
      },
    };
    console.log("new seed.", newSeed);
  };

  const renderSeedsSelected = () => {
    console.log("Species selection", speciesSelection.seedsSelected);
    return (
      <Grid item xs={3} md={1}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: 1,
            backgroundColor: "#E5E7D5",
            border: "#C7C7C7 solid 1px",
          }}
        >
          {speciesSelection.seedsSelected.map((s, idx) => {
            return (
              <Fragment>
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
              </Fragment>
            );
          })}
        </Box>
      </Grid>
    );
  };
  return (
    <Grid container justifyContent="center" alignItems="center" size={12}>
      {renderSeedsSelected()}
      <Grid
        xs={speciesSelection.seedsSelected.length > 0 ? 9 : 12}
        md={speciesSelection.seedsSelected.length > 0 ? 11 : 12}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Review a Proportion</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixRatio;
