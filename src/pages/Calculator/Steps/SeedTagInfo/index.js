//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import * as React from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { updateSteps } from "../../../../features/stepSlice";
import {
  convertToPercent,
  convertToDecimal,
} from "../../../../shared/utils/calculate";
import { NumberTextField } from "./../../../../components/NumberTextField";
import "./../steps.scss";

const SeedTagInfo = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const updateSeed = (val, key1, seed) => {
    // find index of seed, parse a copy, update proper values, & send to Redux
    const index = speciesSelection.seedsSelected.findIndex(
      (s) => s.id === seed.id
    );
    let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
    data[index][key1] = val;
    handleUpdateSteps("seedsSelected", data);
  };

  const renderRightAccordian = (key, data, type, disabled) => {
    const value =
      type === "percent" ? convertToPercent(data[key]) : Math.floor(data[key]);
    return (
      <Grid item xs={6}>
        <NumberTextField
          className="text-field-50"
          disabled={disabled}
          value={value}
          handleChange={(e) => {
            updateSeed(convertToDecimal(e.target.value), key, {
              ...data,
              [key]: convertToDecimal(e.target.value),
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
          className="accordian-summary"
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
            {/* FIXME: this also turns seeds per pound 100 times larger */}
            {renderRightAccordian("poundsOfSeed", data, "", true)}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Enter seed tag info</Typography>
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
export default SeedTagInfo;
