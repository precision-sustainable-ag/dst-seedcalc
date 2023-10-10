import * as React from "react";
import Grid from "@mui/material/Grid";
import { Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import "./../steps.css";

const ImageListComponent = ({
  seed,
  filteredSeeds,
  council,
  data,
  updateSeeds,
}) => {
  // themes
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const imgSrc = (imgUrl) => {
    return imgUrl !== null ? imgUrl + "?w=300&h=300&fit=crop&auto=format" : "";
  };
  const checkPlantingDate = (seed, siteDate) => {
    const startDate = new Date(
      seed["Planting and Growth Windows"]["Reliable Establishment"][0]
        .split(" - ")[0]
        .slice(0, -5)
    ).getTime();
    const endDate = new Date(
      seed["Planting and Growth Windows"]["Reliable Establishment"][0]
        .split(" - ")[1]
        .slice(0, -5)
    ).getTime();
    const plannedDate = new Date(siteDate.slice(0, -5)).getTime();
    const pass = plannedDate >= startDate && plannedDate <= endDate;
    return pass;
  };

  return (
    <ImageList sx={{ maxWidth: "100%" }} cols={matchesSm ? 2 : 6}>
      {filteredSeeds
        .filter((seeds, i) => {
          return seeds.group !== null && seeds.group.label === seed;
        })
        .map((seeds, idx) => (
          <ImageListItem
            key={
              imgSrc(
                seeds.thumbnail !== null && seeds.thumbnail !== ""
                  ? seeds.thumbnail
                  : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
              ) + Math.random()
            }
          >
            {council === "NECCC" &&
              checkPlantingDate(
                seeds,
                data.siteCondition.plannedPlantingDate
              ) && (
                <>
                  <Grid
                    sx={{
                      position: "absolute",
                      backgroundColor: "white",
                      opacity: "0.7",
                      width: "100%",
                      height: "35%",
                      marginTop: "20px",
                    }}
                  ></Grid>
                  <Typography
                    sx={{
                      color: "red",
                      position: "absolute",
                      marginTop: "30px",
                    }}
                  >
                    Not Recommended for planting dates
                  </Typography>
                </>
              )}

            <img
              className={matchesSm ? "panel-img-sm" : "panel-img"}
              src={imgSrc(
                seeds.thumbnail !== null && seeds.thumbnail !== ""
                  ? seeds.thumbnail
                  : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
              )}
              alt={seeds.label}
              onClick={(e) => {
                updateSeeds(seeds, seed);
              }}
              loading="lazy"
            />
            <Link
              className="img-text"
              onClick={(e) => {
                updateSeeds(seeds, seed);
              }}
            >
              {seeds.label}{" "}
            </Link>
          </ImageListItem>
        ))}
    </ImageList>
  );
};

export default ImageListComponent;
