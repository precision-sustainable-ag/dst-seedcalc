import * as React from "react";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, Fragment } from "react";
import { Typography, Box, Link, useMediaQuery } from "@mui/material";

const SeedsSelectedList = ({ list }) => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={
        matchesMd
          ? {
              height: "100px",
              whiteSpace: "normal",
              overflowX: "auto",
              opacity: "90%",
            }
          : {
              height: "100%",
            }
      }
      bgcolor={"#e5e7d5"}
      border={"#c7c7c7 solid 1px"}
      display={"flex"}
      flexDirection={matchesMd ? "row" : "column"}
    >
      {list.map((s, idx) => {
        return (
          <Box minWidth={matchesMd ? "120px" : ""}>
            <img
              style={{
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                marginTop: "10px",
              }}
              src={
                s.thumbnail !== null && s.thumbnail !== ""
                  ? s.thumbnail
                  : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
              }
              alt={s.label}
              loading="lazy"
            />
            <Typography
              color={"primary.text"}
              fontSize={"12px"}
              lineHeight={1.25}
            >
              {s.label}
            </Typography>
          </Box>
        );
      })}{" "}
    </Box>
  );
};

export default SeedsSelectedList;
