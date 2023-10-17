import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Link } from "@mui/material";
import Fade from "@mui/material/Fade";

import { seedsLabel } from "../../../../shared/data/species";
import "./../steps.scss";

const Diversity = ({ diversitySelected }) => {
  const calculateSize = () => {
    return diversitySelected.length === 1
      ? 12
      : diversitySelected.length === 2
      ? 6
      : diversitySelected.length >= 2 && diversitySelected.length < 4
      ? 4
      : 3;
  };

  return (
    <Grid container justify="space-between" alignItems="stretch">
      <Grid
        container
        xs={12}
        className="progress-bar"
        justify="space-between"
        alignItems="stretch"
      >
        {diversitySelected &&
          diversitySelected.length > 0 &&
          diversitySelected.map((d, i) => {
            return (
              <Fade in={true}>
                <Grid
                  item
                  xs={calculateSize()}
                  className="progress-bar-item"
                ></Grid>
              </Fade>
            );
          })}
      </Grid>
      {diversitySelected &&
        diversitySelected.length > 0 &&
        diversitySelected.length === 0 && (
          <Grid item xs={12}>
            <Typography className="progress-bar-text">
              Select a species
            </Typography>
          </Grid>
        )}
      {diversitySelected &&
        diversitySelected.length > 0 &&
        diversitySelected.map((d, i) => {
          return (
            <Fade in={true}>
              <Grid item xs={calculateSize()}>
                <Typography className="progress-bar-text">
                  {seedsLabel[d]}
                </Typography>
              </Grid>
            </Fade>
          );
        })}
    </Grid>
  );
};

export default Diversity;
