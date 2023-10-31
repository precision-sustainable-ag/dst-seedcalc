//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  calculateAllMixRatioValues,
  calculateAllValuesNECCC,
} from "./../../../../shared/utils/calculate";
import { updateSteps } from "../../../../features/stepSlice";
import MixRatioSteps from "./form";
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from "../../../../components/DSTPieChart";

import "./../steps.scss";
import {
  SeedDataChip,
  SeedingRateChip,
} from "../../../../components/SeedingRateCard";

const MixRatio = ({ council }) => {
  // themes
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;

  const plantsPerAcreSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.aproxPlantsSqFt),
    0
  );
  const poundsOfSeedSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.poundsOfSeed),
    0
  );
  const seedsPerAcreSum = speciesSelection.seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.seedsPerAcre),
    0
  );
  const poundsOfSeedArray = [];
  const plantsPerAcreArray = [];
  const seedsPerAcreArray = [];
  speciesSelection.seedsSelected.map((s, i) => {
    plantsPerAcreArray.push({
      name: s.label,
      value: parseFloat(s.aproxPlantsSqFt) / plantsPerAcreSum,
    });
    seedsPerAcreArray.push({
      name: s.label,
      value: parseFloat(s.seedsPerAcre) / parseFloat(seedsPerAcreSum),
    });
    poundsOfSeedArray.push({
      name: s.label,
      value: parseFloat(s.poundsOfSeed) / poundsOfSeedSum,
    });
  });

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const handleUpdateAllSteps = (prevData, index) => {
    let seeds = [...prevData];
    seeds[index] =
      council === "MCCC"
        ? calculateAllMixRatioValues(seeds[index], data)
        : calculateAllValuesNECCC(seeds[index], data);
    handleUpdateSteps("seedsSelected", seeds);
  };

  const updateSeed = (val, key, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let seeds = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    seeds[index][key] = val;
    handleUpdateSteps("seedsSelected", seeds);

    // create new copy of recently updated Redux state, calculate & update all seed's step data.
    let newData = [...seeds];
    newData[index] =
      council === "MCCC"
        ? calculateAllMixRatioValues(seeds[index], data)
        : calculateAllValuesNECCC(seeds[index], data);
    handleUpdateAllSteps(newData, index);
  };

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Review Proportions</Typography>
      </Grid>

      <Grid item xs={6} md={6} sx={{ textAlign: "justify" }}>
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre </DSTPieChartLabel>
        <DSTPieChartLegend
          labels={speciesSelection.seedsSelected.map((seed) => seed.label)}
          matchesMd={matchesMd}
        />
      </Grid>

      <Grid item xs={6} md={6} sx={{ textAlign: "justify" }}>
        {council === "MCCC" ? (
          <DSTPieChart chartData={plantsPerAcreArray} />
        ) : (
          <DSTPieChart chartData={seedsPerAcreArray} />
        )}
        <DSTPieChartLabel>
          {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
        </DSTPieChartLabel>
        <DSTPieChartLegend
          labels={speciesSelection.seedsSelected.map((seed) => seed.label)}
          matchesMd={matchesMd}
        />
      </Grid>

      {speciesSelection.seedsSelected.map((seed, i) => {
        return (
          <Grid item xs={12} key={i}>
            <Accordion className="accordian-container">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="accordian-summary"
              >
                <Typography>{seed.label}</Typography>
              </AccordionSummary>

              <AccordionDetails className="accordian-details">
                <Grid container xs={12}>
                  <Grid item xs={6}>
                    <SeedingRateChip
                      label={"Default Single Species Seeding Rate PLS"}
                      value={Math.floor(seed.singleSpeciesSeedingRatePLS)}
                    />
                    {council === "MCCC" && (
                      <SeedDataChip
                        label={"Aprox plants per"}
                        value={Math.floor(seed.plantsPerAcre)}
                      />
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <SeedingRateChip
                      label={"Default Mix Seeding Rate PLS"}
                      value={Math.round(seed.mixSeedingRate)}
                    />
                    <SeedDataChip
                      label={"Seeds per"}
                      value={Math.floor(seed.seedsPerAcre)}
                    />
                  </Grid>

                  <Grid item xs={12} pt={"1rem"}>
                    <Button
                      onClick={() => {
                        updateSeed(!seed.showSteps, "showSteps", seed);
                      }}
                      variant="outlined"
                    >
                      {seed.showSteps ? "Close Steps" : "Change My Rate"}
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    {seed.showSteps && (
                      <MixRatioSteps
                        seed={seed}
                        council={council}
                        speciesSelection={speciesSelection}
                        updateSeed={updateSeed}
                      />
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default MixRatio;
