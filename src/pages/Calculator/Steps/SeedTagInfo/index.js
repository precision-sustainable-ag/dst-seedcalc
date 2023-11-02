//////////////////////////////////////////////////////////
//                     Imports                          //
//////////////////////////////////////////////////////////

import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { updateSteps } from "../../../../features/stepSlice";
import { DSTSwitch } from "./../../../../components/Switch";
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

const SeedTagInfo = ({ council }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const speciesSelection = data.speciesSelection;
  const [sameInfoActive, setSameInfoActive] = useState(false);

  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };
  /*  
      handleSeed checks for whether the sameInfoActive is true/false.
      If true, loop through all seeds and update values to the same as the current seed being changed.
      Else, update individual value.
  */
  const handleSeed = (val, key1, key2, seed) => {
    if (sameInfoActive) {
      let data = JSON.parse(JSON.stringify(speciesSelection.seedsSelected));
      speciesSelection.seedsSelected.map((s, i) => {
        data[i]["germinationPercentage"] =
          key1 === "germinationPercentage" ? val : seed.germinationPercentage;
        data[i]["purityPercentage"] =
          key1 === "purityPercentage" ? val : seed.purityPercentage;
      });
      handleUpdateSteps("seedsSelected", data);
    } else {
      updateSeed(val, key1, key2, seed);
    }
  };

  const updateSeed = (val, key1, key2, seed) => {
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
              handleSeed(convertToDecimal(e.target.value), key, "", {
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

  const handleSwitch = () => {
    setSameInfoActive(!sameInfoActive);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Enter seed tag info</Typography>
      </Grid>

      <Grid
        item
        xs={12}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <DSTSwitch checked={sameInfoActive} handleChange={handleSwitch} />
        <Typography>Same Information for All Species</Typography>
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
                  {/* FIXME: this also turns seeds per pound 100 times larger */}
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
