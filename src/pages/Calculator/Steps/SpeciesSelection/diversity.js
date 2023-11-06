import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Link, Box } from "@mui/material";
import Fade from "@mui/material/Fade";

import { seedsLabel } from "../../../../shared/data/species";
import "./../steps.scss";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
    <Grid container>
      <Typography pt={"1rem"} fontWeight={600}>
        Mix Diversity
      </Typography>
      <Box sx={{ width: "100%", p: "5px 0" }}>
        <Grid
          container
          sx={{
            height: "10px",
            border: "#e5e5e5 1px solid",
            borderRadius: "0.6875rem",
          }}
        >
          {diversitySelected &&
            diversitySelected.length > 0 &&
            diversitySelected.map((d, i) => {
              return (
                <Grid
                  item
                  xs={calculateSize()}
                  bgcolor={COLORS[i]}
                  borderRadius={"0.6875rem"}
                  key={i}
                ></Grid>
              );
            })}
        </Grid>
      </Box>

      {diversitySelected &&
        diversitySelected.length > 0 &&
        diversitySelected.length === 0 && (
          <Grid item xs={12}>
            <Typography fontSize={"0.75rem"}>Select a species</Typography>
          </Grid>
        )}
      {diversitySelected &&
        diversitySelected.length > 0 &&
        diversitySelected.map((d, i) => {
          return (
            <Fade in={true} key={i}>
              <Grid item xs={calculateSize()}>
                <Typography fontSize={"0.75rem"}>{seedsLabel[d]}</Typography>
              </Grid>
            </Fade>
          );
        })}
    </Grid>
  );
};

export default Diversity;
