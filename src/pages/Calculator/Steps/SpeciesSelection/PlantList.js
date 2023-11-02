import * as React from "react";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import "./../steps.scss";

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
                sx={{
                  color: "red",
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
