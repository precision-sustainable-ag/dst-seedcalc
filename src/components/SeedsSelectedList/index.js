import * as React from "react";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, Fragment } from "react";
import { Typography, Box, Link, useMediaQuery } from "@mui/material";

const SeedsSelectedList = ({ list }) => {
  console.log("list...", list);
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid item xs={matchesMd ? 12 : 1}>
      <Box className="selected-seeds-box">
        <Grid
          className="selected-seeds-container"
          container
          flexDirection={matchesMd ? "row" : "column"}
        >
          {list.map((s, idx) => {
            return (
              <Grid item className="selected-seeds-item">
                <img
                  className={
                    matchesXs
                      ? "left-panel-img-xs"
                      : matchesSm
                      ? "left-panel-img-sm"
                      : matchesMd
                      ? "left-panel-img-md"
                      : "left-panel-img"
                  }
                  src={
                    s.thumbnail !== null && s.thumbnail !== ""
                      ? s.thumbnail
                      : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
                  }
                  alt={s.label}
                  loading="lazy"
                />
                <Typography className="left-panel-text">{s.label}</Typography>
              </Grid>
            );
          })}{" "}
        </Grid>
      </Box>
    </Grid>
  );
};

export default SeedsSelectedList;
