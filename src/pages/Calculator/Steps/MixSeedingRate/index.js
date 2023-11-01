//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { Typography, Slider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

import { updateSteps } from "../../../../features/stepSlice";
import "./../steps.scss";

const MixSeedingSlider = styled(Slider)(({ theme, min, max, coefficient }) => ({
  "& .MuiSlider-thumb": {
    zIndex: 2,
    "&:hover": {
      boxShadow: "0px 0px 5px 25px rgba(79, 95, 48, 0.16)",
    },
    "&.Mui-active": {
      boxShadow: "0px 0px 5px 28px rgba(79, 95, 48, 0.32)",
    },
    "&::before": {
      content: `'${coefficient}'`,
      position: "absolute",
      backgroundColor: "white",
      color: theme.palette.primary.text,
      border: "4px solid",
      height: "4rem",
      width: "4rem",
      borderRadius: "50%",
      boxSizing: "border-box",
      paddingTop: "1rem",
    },
  },
  "& .MuiSlider-mark": {
    width: "0",
    height: "0",
    pointerEvents: "none",
    "&::after": {
      position: "absolute",
      content: `""`,
      width: "6rem",
      color: theme.palette.primary.text,
      borderTop: "2px dotted",
      zIndex: -1,
    },
    "&Label": {
      pointerEvents: "none",
      left: "6rem",
      color: theme.palette.primary.text,
      border: "2px solid",
      borderRadius: "1rem",
      padding: "0.5rem",
      backgroundColor: "white",
      fontSize: "0.75rem",
      display: "flex",
      whiteSpace: "normal",
      width: "6rem",
    },
  },
  "& .MuiSlider-rail": {
    zIndex: 1,
    opacity: 1,
    color: theme.palette.primary.dark,
    "&::before ": {
      content: `'${max}'`,
      position: "absolute",
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.text,
      border: "2px solid",
      height: "4rem",
      width: "4rem",
      borderRadius: "50%",
      boxSizing: "border-box",
      top: "-2rem",
      right: "-1.85rem",
      paddingTop: "1rem",
    },
    "&::after": {
      content: `'${min}'`,
      position: "absolute",
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.text,
      border: "2px solid",
      height: "4rem",
      width: "4rem",
      borderRadius: "50%",
      boxSizing: "border-box",
      top: "22rem",
      right: "-1.85rem",
      paddingTop: "1rem",
    },
  },
  "& .MuiSlider-track": {
    color: theme.palette.primary.text,
    zIndex: 1,
    position: "absolute",
    bottom: "2rem !important",
  },
}));

const MixSeedingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.text,
  fontSize: "0.75rem",
  fontWeight: "600",
  lineHeight: "0.9375rem",
  border: "2px solid #4f5f30",
  padding: "0.5rem",
  borderRadius: "1rem",
}));

const MixSeedingRate = () => {
  // themes
  const theme = useTheme();

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

  const updateManagementImpactOnMix = () => {
    const percentage = seedingRateCoefficient / seedingRateAverage - 0.5;
    handleUpdateSteps("managementImpactOnMix", percentage);
  };

  //////////////////////////////////////////////////////////
  //                    useEffect                         //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    const average = Math.round(
      seedsSelected.reduce(
        (total, seed) => total + parseFloat(seed.mixSeedingRate),
        0
      )
    );
    const minimum = Math.round(average - average / 2);
    const maximum = Math.round(average + average / 2);
    const coefficient = Math.round(
      average + (seedingMethod.managementImpactOnMix - 0.5) * average
    );
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
          item
          xs={4}
          sm={5}
          flexDirection={"column"}
          justifyContent="space-between"
          alignItems="center"
        >
          <MixSeedingTypography>
            Factors that may raise Seeding Rate:
            <br />- Erosion Control
            <br />- Weed Supression
            <br />- Grazing
          </MixSeedingTypography>

          <MixSeedingTypography>
            Factors that lower Seeding Rate:
            <br />- Cost Saving
            <br />- Low Biomass
            <br />- Planting Green
          </MixSeedingTypography>
        </Grid>
        <Grid
          container
          item
          xs={8}
          sm={7}
          justifyContent="flex-start"
          alignItems="center"
          minHeight={"28rem"}
          pl={"3rem"}
        >
          {dataLoaded && (
            <Stack sx={{ height: "24rem" }}>
              <MixSeedingSlider
                orientation="vertical"
                min={min}
                max={max}
                value={seedingRateCoefficient}
                valueLabelDisplay="off"
                onChange={(e) => setSeedingRateCoefficient(e.target.value)}
                onChangeCommitted={updateManagementImpactOnMix}
                marks={marks}
                coefficient={seedingRateCoefficient}
                theme={theme}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MixSeedingRate;
