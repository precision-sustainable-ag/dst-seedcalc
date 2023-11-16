import * as React from "react";
import dayjs from "dayjs";
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
  const seedsList = filteredSeeds.filter((seed) => {
    return seed.group !== null && seed.group.label === seedType;
  });

  const checkPlantingDate = (seed) => {
    if (council === "MCCC") return true;
    const [firstPeriod, secondPeriod] =
      seed["Planting and Growth Windows"]["Reliable Establishment"];
    let firstStart, firstEnd, secondStart, secondEnd;

    firstStart = dayjs(dayjs(firstPeriod.split(" - ")[0]).format("MM/DD"));
    firstEnd = dayjs(dayjs(firstPeriod.split(" - ")[1]).format("MM/DD"));
    if (secondPeriod) {
      secondStart = dayjs(dayjs(secondPeriod.split(" - ")[0]).format("MM/DD"));
      secondEnd = dayjs(dayjs(secondPeriod.split(" - ")[1]).format("MM/DD"));
    }

    const plannedDate = dayjs(dayjs(plantingDate).format("MM/DD"));

    if (!plannedDate.isBetween(firstStart, firstEnd, "day")) {
      if (
        secondStart &&
        !plannedDate.isBetween(secondStart, secondEnd, "day")
      ) {
        return `Seeding date outside of recommended window: ${firstStart.format(
          "MM/DD"
        )} - ${firstEnd.format("MM/DD")}, ${secondStart.format(
          "MM/DD"
        )} - ${secondEnd.format("MM/DD")}`;
      } else {
        return `Seeding date outside of recommended window: ${firstStart.format(
          "MM/DD"
        )} - ${firstEnd.format("MM/DD")}`;
      }
    }
  };

  return (
    <Grid container spacing={"1rem"} pl={"1rem"}>
      {seedsList.length === 0 ? (
        <Typography variant="h6">No available seeds in this type!</Typography>
      ) : (
        seedsList.map((seed, i) => (
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

            <Card
              sx={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                width: "160px",
              }}
            >
              <CardActionArea
                onClick={() => updateSeeds(seed, seedType)}
                disableRipple
              >
                <CardMedia
                  component="img"
                  height={"160px"}
                  image={
                    seed.thumbnail ??
                    "https://placehold.it/250x150?text=Placeholder"
                  }
                  alt={seed.label}
                  sx={{ border: "2px solid green", borderRadius: "1rem" }}
                />

                <Typography
                  sx={{
                    color: "#DA7059",
                    position: "absolute",
                    top: "1rem",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    bgcolor: "primary.light",
                    opacity: "80%",
                    fontSize: "0.875rem",
                  }}
                >
                  {checkPlantingDate(seed)}
                </Typography>

                <CardContent>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {seed.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default PlantList;
