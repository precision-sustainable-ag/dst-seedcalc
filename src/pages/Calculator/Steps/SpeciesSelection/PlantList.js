import * as React from "react";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";

import "./../steps.scss";

const CheckBoxIcon = ({ style }) => {
  return (
    <Box sx={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M14 0H4C1.79086 0 0 1.79086 0 4V14C0 16.2091 1.79086 18 4 18H14C16.2091 18 18 16.2091 18 14V4C18 1.79086 16.2091 0 14 0Z"
          fill="#5992E6"
        />
        <path
          d="M6 9L8.25 11L12 7"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Box>
  );
};

const PlantList = ({
  seedType,
  filteredSeeds,
  seedsSelected,
  updateSeeds,
  council,
  plantingDate,
}) => {
  const checkPlantingDate = (council, seed, siteDate) => {
    if (council === "MCCC") return true;
    // FIXME: this method didn't take crops with 2 RE period into count
    const startDate = new Date(
      seed["Planting and Growth Windows"]["Reliable Establishment"]?.[0]
        .split(" - ")[0]
        .slice(0, -5)
    ).getTime();
    const endDate = new Date(
      seed["Planting and Growth Windows"]["Reliable Establishment"]?.[0]
        .split(" - ")[1]
        .slice(0, -5)
    ).getTime();
    const plannedDate = new Date(siteDate.slice(0, -5)).getTime();
    const pass = plannedDate >= startDate && plannedDate <= endDate;
    return pass;
  };

  const SeedCard = ({ name, imgSrc, onSelect, recommended }) => {
    return (
      <Card
        sx={{
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          width: "160px",
        }}
      >
        <CardActionArea onClick={onSelect} disableRipple>
          <CardMedia
            component="img"
            height={"160px"}
            image={imgSrc}
            alt={name}
            sx={{ border: "2px solid green", borderRadius: "1rem" }}
          />
          {!recommended && (
            <Typography
              sx={{
                color: "#DA7059",
                position: "absolute",
                top: "2rem",
                fontStyle: "italic",
                fontWeight: "bold",
                bgcolor: "primary.light",
                opacity: "80%",
              }}
            >
              Not Recommended for Planting Date
            </Typography>
          )}

          <CardContent>
            <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Grid container spacing={"1rem"} pl={"1rem"}>
      {filteredSeeds
        .filter((seed) => {
          return seed.group !== null && seed.group.label === seedType;
        })
        .map((seed, i) => (
          <Grid item key={i} position={"relative"}>
            {seedsSelected.filter((s) => s.label === seed.label).length > 0 && (
              <CheckBoxIcon
                style={{
                  position: "absolute",
                  right: "-0.5rem",
                  top: "0.5rem",
                  zIndex: 1,
                }}
              />
            )}
            <SeedCard
              name={seed.label}
              imgSrc={
                seed.thumbnail ??
                "https://placehold.it/250x150?text=Placeholder"
              }
              onSelect={() => updateSeeds(seed, seedType)}
              recommended={checkPlantingDate(council, seed, plantingDate)}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default PlantList;
