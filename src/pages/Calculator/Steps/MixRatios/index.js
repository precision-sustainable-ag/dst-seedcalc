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
  //                   State Logic                        //
  //////////////////////////////////////////////////////////

  const renderAccordian = (data) => {
    return (
      <Accordion className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          className="accordian-summary"
        >
          <Typography>{data.label}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          {renderAccordianDetail(data)}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderAccordianDetail = (seed) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={6}>
          <Typography>Default Single Species Seeding Rate PLS</Typography>
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
            <Typography>
              {Math.floor(seed.singleSpeciesSeedingRatePLS)}
            </Typography>
          </Box>
          <Typography>Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Default Mix Seeding Rate PLS</Typography>
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
            <Typography>{Math.round(seed.mixSeedingRate)}</Typography>
          </Box>
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={6}>
          {council === "MCCC" && (
            <>
              <Box
                sx={{
                  width: "110px",
                  height: "50px",
                  padding: "11px",
                  margin: "0 auto",
                  backgroundColor: "#E5E7D5",
                  border: "#C7C7C7 solid 1px",
                  borderRadius: "16px",
                }}
              >
                <Typography>{Math.floor(seed.plantsPerAcre)}</Typography>
              </Box>
              <Typography>Aprox plants per</Typography>
              <Button variant="outlined">Sqft</Button>
              {"   "}
              <Button variant="contained">Acres</Button>
            </>
          )}
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "110px",
              height: "50px",
              padding: "11px",
              margin: "0 auto",
              backgroundColor: "#E5E7D5",
              border: "#C7C7C7 solid 1px",
              borderRadius: "16px",
            }}
          >
            <Typography>{Math.floor(seed.seedsPerAcre)}</Typography>
          </Box>
          <Typography>Seeds per</Typography>
          <Button variant="contained">Sqft</Button>
          {"   "}
          <Button variant="outlined">Acres</Button>
        </Grid>
        <Grid item xs={12} pt={"1rem"}>
          <Button
            onClick={(e) => {
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
              renderFormLabel={renderFormLabel}
              updateSeed={updateSeed}
              generatePercentInGroup={generatePercentInGroup}
            />
          )}
        </Grid>
      </Grid>
    );
  };

  const renderFormLabel = (label1, label2, label3) => {
    return (
      <Grid container xs={12} className="mix-ratio-form-container">
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            sx={{ fontSize: matchesMd ? "0.75rem" : "0" }}
          >
            {label1}
          </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            sx={{ fontSize: matchesMd ? "0.75rem" : "0" }}
          >
            {label2}
          </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography
            className={matchesMd ? "mix-ratio-form-label" : "no-display"}
            sx={{ fontSize: matchesMd ? "0.75rem" : "0" }}
          >
            {label3}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const generatePercentInGroup = (seed) => {
    const group = seed.group.label;
    let count = 0;
    speciesSelection.seedsSelected.map((s, i) => {
      s.group.label === group && count++;
    });
    return 1 / count;
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

      {speciesSelection.seedsSelected.map((s, i) => {
        return (
          <Grid item xs={12}>
            {renderAccordian(s)}
          </Grid>
        );
      })}
    </Grid>
  );
};
export default MixRatio;
