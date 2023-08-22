import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { VerticalSlider } from "../../../../components/VerticalSlider";
import "./../steps.css";
import { updateSteps } from "./../../../../features/stepSlice";
import SeedsSelectedList from "../../../../components/SeedsSelectedList";

const SeedingMethod = ({ council }) => {
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

  const [dataLoaded, toggleDataLoaded] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [seedingRateCoefficient, setSeedingRateCoefficient] = useState(0);
  const [seedingRateAverage, setSeedingRateAverage] = useState(0);

  const updateSeedingRateAverage = async () => {
    let average = 0;
    seedsSelected.map((s, i) => {
      average += Math.round(s.mixSeedingRate);
    });
    const minimum = average - average / 2;
    const maximum = average + average / 2;
    const coefficient =
      average + (seedingMethod.managementImpactOnMix - 0.5) * average;
    setMin(minimum);
    setMax(maximum);
    setSeedingRateAverage(average);
    setSeedingRateCoefficient(
      average + (seedingMethod.managementImpactOnMix - 0.5) * average
    );
    console.log("*** max, min, coefficient", maximum, minimum, coefficient);
    toggleDataLoaded(true);
  };
  const updateManagementImpactOnMix = (e) => {
    const percentage = e.target.value / seedingRateAverage - 0.5;
    setSeedingRateCoefficient(e.target.value);
    handleUpdateSteps("managementImpactOnMix", percentage);
  };
  const clearChart = () => {
    toggleDataLoaded(false);
  };
  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "seedingMethod",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const renderSeedsSelected = () => {
    return <SeedsSelectedList list={speciesSelection.seedsSelected} />;
  };
  const renderVerticalSlider = (seedingRate, handleUpdateSteps) => {
    const marks = [];

    marks.push({ value: min, label: `${min}` });
    marks.push({ value: seedingRateCoefficient, label: `${seedingRate}` });
    marks.push({ value: max, label: `${max}` });

    return (
      <Grid xs={3} container justifyContent="center" alignItems="center">
        <VerticalSlider
          marks={marks}
          value={seedingRate}
          handleChange={(e) => {
            updateManagementImpactOnMix(e);
          }}
        />
      </Grid>
    );
  };

  useEffect(() => {
    updateSeedingRateAverage();
    return () => {
      console.log("clearing chart");

      dataLoaded && clearChart();
    };
  }, []);
  return (
    <Grid xs={12} justify="center" container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={seedsSelected.length > 0 ? 12 : 12}
        md={seedsSelected.length > 0 ? 11 : 12}
        item
      >
        <Grid item xs={12}>
          <Typography variant="h2">Adjust Seeding Rate of Mix</Typography>
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
          {dataLoaded &&
            renderVerticalSlider(
              seedingMethod.mixSeedingRate,
              handleUpdateSteps
            )}
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
