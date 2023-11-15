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
import styled from "@emotion/styled";

const LeftGrid = styled(Grid)({
  "&.MuiGrid-item": {
    height: "80px",
    paddingTop: "15px",
    "& p": {
      fontWeight: "bold",
    },
  },
});

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
      <>
        <Grid item xs={4}>
          <NumberTextField
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
        <Grid item xs={2}></Grid>
      </>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Enter seed tag info</Typography>
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
                  <LeftGrid item xs={6}>
                    <Typography>% Germination: </Typography>
                  </LeftGrid>
                  {renderRightAccordian(
                    "germinationPercentage",
                    seed,
                    "percent",
                    false
                  )}
                  <LeftGrid item xs={6}>
                    <Typography>% Purity: </Typography>
                  </LeftGrid>
                  {renderRightAccordian(
                    "purityPercentage",
                    seed,
                    "percent",
                    false
                  )}
                  <LeftGrid item xs={6}>
                    <Typography>Seeds per Pound </Typography>
                  </LeftGrid>
                  {renderRightAccordian("poundsOfSeed", seed, "", true)}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default SeedTagInfo;
