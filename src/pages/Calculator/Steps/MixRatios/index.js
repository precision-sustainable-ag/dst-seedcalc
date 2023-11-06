//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import Grid from "@mui/material/Grid";
import { Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  calculateAllMixRatioValues,
  calculateAllValuesNECCC,
  calculatePieChartData,
} from "./../../../../shared/utils/calculate";
import { updateSteps } from "../../../../features/stepSlice";
import MixRatioSteps from "./form";
import {
  DSTPieChart,
  DSTPieChartLabel,
  DSTPieChartLegend,
} from "../../../../components/DSTPieChart";
import {
  SeedDataChip,
  SeedingRateChip,
} from "../../../../components/SeedingRateCard";

import "./../steps.scss";

const MixRatio = ({ council }) => {
  // useSelector for crops & mixRaxio reducer

  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;

  const { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray } =
    calculatePieChartData(speciesSelection.seedsSelected);

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

      <Grid item xs={6} sx={{ textAlign: "justify" }}>
        <DSTPieChart chartData={poundsOfSeedArray} />
        <DSTPieChartLabel>Pounds of Seed / Acre </DSTPieChartLabel>
        <DSTPieChartLegend chartData={poundsOfSeedArray} />
      </Grid>

      <Grid item xs={6} sx={{ textAlign: "justify" }}>
        <DSTPieChart
          chartData={
            council === "MCCC" ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
        <DSTPieChartLabel>
          {council === "MCCC" ? "Plants" : "Seeds"} Per Acre{" "}
        </DSTPieChartLabel>
        <DSTPieChartLegend
          chartData={
            council === "MCCC" ? plantsPerAcreArray : seedsPerAcreArray
          }
        />
      </Grid>

      {speciesSelection.seedsSelected.map((seed, i) => {
        return (
          <Grid item xs={12} key={i}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="accordian-summary"
              >
                <Typography>{seed.label}</Typography>
              </AccordionSummary>

              <AccordionDetails className="accordian-details">
                <Grid container>
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
