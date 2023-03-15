import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Link, Button } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ZAxis,
} from "recharts";

import Accordion from "@mui/material/Accordion";
import { Square } from "@mui/icons-material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  calculateAllValues,
  calculateSeeds,
  calculateAllMixValues,
} from "../../../../shared/utils/calculate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { updateSteps } from "../../../../features/stepSlice";
import { NumberTextField } from "../../../../components/NumberTextField";
import { DSTSwitch } from "../../../../components/Switch";

import "./../steps.css";

const ConfirmPlanAccordian = (data) => {
  const calculateSeedsSelectedSum = (key) => {
    return data.speciesSelection.seedsSelected.reduce(
      (sum, a) => sum + parseFloat(a[key]),
      0
    );
  };
  const renderStripedLabels = () => {
    const labels = [
      {
        label: "Single Species Seeding Rate",
        key: "singleSpeciesSeedingRatePLS",
        val: calculateSeedsSelectedSum("singleSpeciesSeedingRatePLS"),
      },
      {
        label: "Added to Mix",
        key: "addedToMix",
        val: calculateSeedsSelectedSum("addedToMix"),
      },
      {
        label: "Drilled or Broadcast with Cultipack",
        key: "drilled",
        val: calculateSeedsSelectedSum("drilled"),
      },
      {
        label: "Management Impacts on Mix (+57%)",
        key: "managementImpactOnMix",
        val: calculateSeedsSelectedSum("managementImpactOnMix"),
      },
      {
        label: "Bulk Germination and Purity",
        key: "bulkGerminationAndPurity",
        val: calculateSeedsSelectedSum("bulkGerminationAndPurity"),
      },
    ];
    const labels2 = [
      { label: "Species Modifications" },
      { label: "Species Review" },
      { label: "Pounds for Purchase" },
    ];
    return (
      <>
        {labels.map((l, i) => {
          return (
            <Grid
              container
              sx={{ backgroundColor: !(i % 2) && "#e3e5d3" }}
              xs={12}
            >
              <Grid item sx={{ textAlign: "justify" }} xs={10}>
                {l.label}
              </Grid>
              <Grid item xs={2}>
                {l.val}
              </Grid>
            </Grid>
          );
        })}
      </>
    );
  };
  const renderAccordianDetail = (data) => {
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
              {Math.floor(data.singleSpeciesSeedingRatePLS)}
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
            <Typography>{Math.floor(data.mixSeedingRate)}</Typography>
          </Box>
          <Typography>Lbs / Acre</Typography>
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
            <Typography>{Math.floor(data.plantsPerAcre)}</Typography>
          </Box>
          <Typography>Aprox plants per</Typography>
          <Button variant="outlined">Sqft</Button>
          {"   "}
          <Button variant="contained">Acres</Button>
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
            <Typography>{Math.floor(data.seedsPerAcre)}</Typography>
          </Box>
          <Typography>Seeds per</Typography>
          <Button variant="contained">Sqft</Button>
          {"   "}
          <Button variant="outlined">Acres</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>Indiana NRCS Standards</Typography>
        </Grid>
        {renderStripedLabels()}
        <Grid item xs={12}>
          <Button
            onClick={(e) => {
              updateSeed(!data.showSteps, "showSteps", data);
            }}
            variant="outlined"
          >
            {data.showSteps ? "Close Steps" : "Change My Rate"}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {data.showSteps && renderMixRateSteps(data)}
        </Grid>
      </Grid>
    );
  };
  const calculateSeedsSelectedSum = (key) => {
    return data.speciesSelection.seedsSelected.reduce(
      (sum, a) => sum + parseFloat(a[key]),
      0
    );
  };
  const renderStripedLabels = () => {
    const labels = [
      {
        label: "Single Species Seeding Rate",
        key: "singleSpeciesSeedingRatePLS",
        val: calculateSeedsSelectedSum("singleSpeciesSeedingRatePLS"),
      },
      {
        label: "Added to Mix",
        key: "addedToMix",
        val: calculateSeedsSelectedSum("addedToMix"),
      },
      {
        label: "Drilled or Broadcast with Cultipack",
        key: "drilled",
        val: calculateSeedsSelectedSum("drilled"),
      },
      {
        label: "Management Impacts on Mix (+57%)",
        key: "managementImpactOnMix",
        val: calculateSeedsSelectedSum("managementImpactOnMix"),
      },
      {
        label: "Bulk Germination and Purity",
        key: "bulkGerminationAndPurity",
        val: calculateSeedsSelectedSum("bulkGerminationAndPurity"),
      },
    ];
    const labels2 = [
      { label: "Species Modifications" },
      { label: "Species Review" },
      { label: "Pounds for Purchase" },
    ];
    return (
      <>
        {labels.map((l, i) => {
          return (
            <Grid
              container
              sx={{ backgroundColor: !(i % 2) && "#e3e5d3" }}
              xs={12}
            >
              <Grid item sx={{ textAlign: "justify" }} xs={10}>
                {l.label}
              </Grid>
              <Grid item xs={2}>
                {l.val}
              </Grid>
            </Grid>
          );
        })}
      </>
    );
  };

  const renderMixRateSteps = (data) => {
    return (
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 1:</Typography>
        </Grid>
        {renderStepsForm(
          "Single Species Seeding Rate PLS",
          "% of Single Species Rate",
          "Mix Seeding Rate"
        )}
        <Grid container xs={12} className="mix-ratio-form-container">
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              disabled={true}
              label="Single Species Seeding Rate PLS"
              variant="filled"
              handleChange={(e) => {
                updateSeed(e.target.value, "singleSpeciesSeedingRatePLS", data);
              }}
              value={data.seedsPerAcre}
            />
            <Typography className="font-15">Lbs / Acre</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">X</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="% of Single Species Rate"
              variant="filled"
              disabled={false}
              handleChange={(e) => {
                updateSeed(e.target.value, "percentOfSingleSpeciesRate", data);
              }}
              value={data.percentOfSingleSpeciesRate}
            />
            <Typography className="font-15">MCCC Recommendation</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Mix Seeding Rate"
              disabled={true}
              variant="filled"
              value={data.mixSeedingRate}
            />
            <Typography className="font-15">Lbs / Acre</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 2: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Planting Method",
          "Mix Seeding Rate PLS"
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={false}
            label="Mix Seeding Rate PLS"
            variant="filled"
            handleChange={(e) => {
              updateSeed(e.target.value, "step2MixSeedingRatePLS", data);
            }}
            value={data.step2MixSeedingRatePLS}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            disabled={true}
            label="Planting Method"
            variant="filled"
            value={data.plantingMethod}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step2Result}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 3: </Typography>
        </Grid>
        {renderStepsForm(
          "Mix Seeding Rate PLS",
          "Mix Seeding Rate PLS",
          "Management impact on mix"
        )}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step2Result}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">+</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">(</Typography>
        </Grid>
        <Grid item xs={2}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "step3MixSeedingRatePLS", data);
            }}
            value={data.step3MixSeedingRatePLS}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">X</Typography>
        </Grid>
        <Grid item xs={2}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Management Impact on Mix"
            variant="filled"
            disabled={true}
            value={data.managementImpactOnMix}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">)</Typography>
        </Grid>
        <Grid container className="steps-row-2" xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={8}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Mix Seeding Rate PLS"
              variant="filled"
              disabled={true}
              value={data.step3Result}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 4: </Typography>
        </Grid>
        {renderStepsForm("Mix Seeding Rate PLS", "% Germination", "% Purity")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Mix Seeding Rate PLS"
            variant="filled"
            disabled={true}
            value={data.step3Result}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Germination"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "germinationPercentage", data);
            }}
            value={data.germinationPercentage}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="% Purity"
            variant="filled"
            disabled={true}
            value={data.purityPercentage}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid container className="steps-row-2" xs={12}>
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>
          <Grid item xs={8}>
            <NumberTextField
              className="text-field-100"
              id="filled-basic"
              label="Bulk Seeding Rate"
              variant="filled"
              disabled={true}
              value={data.bulkSeedingRate}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography className="mix-ratio-step-header">Step 5: </Typography>
        </Grid>
        {renderStepsForm("Bulk Seeding Rate", "Acres", "Pounds for Purchase")}
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Bulk Seeding Rate"
            variant="filled"
            disabled={true}
            value={data.bulkSeedingRate}
          />
          <Typography className="font-15">Lbs / Acre</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Acres"
            variant="filled"
            disabled={false}
            handleChange={(e) => {
              updateSeed(e.target.value, "acres", data);
            }}
            value={data.acres}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            className="text-field-100"
            id="filled-basic"
            label="Pounds for Purchase"
            variant="filled"
            disabled={true}
            value={data.poundsForPurchase}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </Grid>
    );
  };
  return (
    <Accordion xs={12} className="accordian-container">
      <AccordionSummary
        className="accordian-header"
        xs={12}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{data.label}</Typography>
      </AccordionSummary>
      <AccordionDetails>{renderAccordianDetail(data)}</AccordionDetails>
    </Accordion>
  );
};

export default ConfirmPlanAccordian;
