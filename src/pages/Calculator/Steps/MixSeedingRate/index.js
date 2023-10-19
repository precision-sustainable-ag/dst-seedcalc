//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Slider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { updateSteps } from "../../../../features/stepSlice";
import "./../steps.scss";

const MixSeedingRate = () => {
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
  const [marks, setMarks] = useState([]);

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "seedingMethod",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  //////////////////////////////////////////////////////////
  //                    State Logic                       //
  //////////////////////////////////////////////////////////

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
    setSeedingRateCoefficient(coefficient);
    setMarks([
      {
        value: minimum,
        label: `Low Limit on Mix Seeding Rate: ${minimum} Lbs/Acre`,
      },
      {
        value: coefficient,
        label: `Calculated Mix Seeding Rate: ${coefficient} Lbs/Acre`,
      },
      {
        value: maximum,
        label: `High Limit on Mix Seeding Rate: ${maximum} Lbs/Acre`,
      },
    ]);
    toggleDataLoaded(true);
  };

  const updateManagementImpactOnMix = (e) => {
    setSeedingRateCoefficient(e.target.value);
    const percentage = e.target.value / seedingRateAverage - 0.5;
    handleUpdateSteps("managementImpactOnMix", percentage);
  };

  //////////////////////////////////////////////////////////
  //                    useEffect                         //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    updateSeedingRateAverage();
  }, []);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Adjust Seeding Rate of Mix</Typography>
      </Grid>
      <Grid container sx={{ padding: "3% 3%" }}>
        <Grid
          container
          xs={5}
          sm={6}
          flexDirection={"column"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{
              color: "#4F5F30",
              fontSize: "0.75rem",
              fontWeight: "600",
              lineHeight: "0.9375rem",
              border: "2px solid #4f5f30",
              padding: "0.5rem",
              borderRadius: "1rem",
            }}
          >
            Factors that lower Seeding Rate:
            <br />- Cost Saving
            <br />- Low Biomass
            <br />- Planting Green
          </Typography>

          <Typography
            sx={{
              color: "#4F5F30",
              fontSize: "0.75rem",
              fontWeight: "600",
              lineHeight: "0.9375rem",
              border: "2px solid #4f5f30",
              padding: "0.5rem",
              borderRadius: "1rem",
            }}
          >
            Factors that may raise Seeding Rate:
            <br />- Erosion Control
            <br />- Weed Supression
            <br />- Grazing
          </Typography>
        </Grid>
        <Grid
          container
          xs={7}
          sm={6}
          justifyContent="flex-start"
          alignItems="center"
          minHeight={"28rem"}
        >
          {dataLoaded && (
            <Stack sx={{ height: "24rem" }}>
              <Slider
                orientation="vertical"
                min={min}
                max={max}
                value={seedingRateCoefficient}
                valueLabelDisplay="off"
                onChange={(e) => {
                  updateManagementImpactOnMix(e);
                }}
                marks={marks}
                track={false}
                sx={{
                  "& .MuiSlider-thumb": {
                    "&::before": {
                      content: `'${seedingRateCoefficient}'`,
                      position: "absolute",
                      backgroundColor: "white",
                      color: "primary.text",
                      border: "3px solid",
                      padding: "1rem",
                      height: "4rem",
                      width: "4rem",
                      borderRadius: "50%",
                      zIndex: 2,
                      boxSizing: "border-box",
                    },
                  },
                  "& .MuiSlider-mark": {
                    width: "0",
                    height: "0",
                    "&Label": {
                      left: "5rem",
                      color: "primary.text",
                      border: "2px solid",
                      borderRadius: "1rem",
                      padding: "0.5rem",
                      backgroundColor: "white",
                      fontSize: "0.75rem",
                      display: "flex",
                      whiteSpace: "normal",
                      width: "8rem",
                    },
                  },
                }}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixSeedingRate;
