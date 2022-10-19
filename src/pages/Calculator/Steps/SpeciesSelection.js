import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Link } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { SearchField } from "../../../components/SearchField";
import { updateSteps } from "./../../../features/stepSlice";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { seedsList, seedsLabel } from "../../../shared/data/species";
import "./steps.css";

const SpeciesSelection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const data = useSelector((state) => state.steps.value);
  const crops = data.crops;
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;
  const diversitySelected = speciesSelection.diversitySelected;
  const [filteredSeeds, setFilteredSeeds] = useState(crops);
  const [query, setQuery] = useState("");

  const updateQuery = (e) => {
    setQuery(e.target.value);
    filterSeeds(e.target.value);
  };
  const handleUpdateSteps = (key, val) => {
    const data = {
      type: "speciesSelection",
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  const filterSeeds = (query) => {
    const filter =
      query !== ""
        ? crops.filter((x) =>
            x.label.toLowerCase().includes(query.toLowerCase())
          )
        : crops;
    setFilteredSeeds(filter);
    handleUpdateSteps("queryResults", filter);
  };
  const checkSeedSelected = (seed) => {
    const seedSelected = seedsSelected.find((f) => seed.label === f.label);
    return typeof seedSelected !== "undefined" ? false : true;
  };
  const updateSeeds = (seed, species) => {
    if (seedsSelected.length === 0) {
      handleUpdateSteps("seedsSelected", [...seedsSelected, seed]);
      handleUpdateSteps("diversitySelected", [...diversitySelected, species]);
    } else {
      const seedsExist = seedsSelected.find((f) => seed.label === f.label);
      if (typeof seedsExist !== "undefined") {
        handleUpdateSteps(
          "seedsSelected",
          seedsSelected.filter((item) => item.label !== seed.label)
        );
        const seedResult = seedsSelected.filter((i) => {
          return i.group.label === species;
        }).length;
        if (seedResult <= 1) {
          handleUpdateSteps(
            "diversitySelected",
            diversitySelected.filter((d) => d !== species)
          );
        }
      } else {
        handleUpdateSteps("seedsSelected", [...seedsSelected, seed]);
        if (!diversitySelected.includes(species)) {
          handleUpdateSteps("diversitySelected", [
            ...diversitySelected,
            species,
          ]);
        }
      }
    }
  };
  const calculateSize = () => {
    return diversitySelected.length === 1
      ? 12
      : diversitySelected.length === 2
      ? 6
      : diversitySelected.length >= 2 && diversitySelected.length < 4
      ? 4
      : 3;
  };
  const renderSeedsSelected = () => {
    return (
      <Grid item xs={2} md={1}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: 1,
            backgroundColor: "#E5E7D5",
            border: "#C7C7C7 solid 1px",
          }}
        >
          {seedsSelected.map((s, idx) => {
            return (
              <Fragment>
                <img
                  className={matches ? "left-panel-img" : "left-panel-img-sm"}
                  src={s.thumbnail.src}
                  alt={s.label}
                  loading="lazy"
                />
                <Typography className="left-panel-text">{s.label}</Typography>
              </Fragment>
            );
          })}
        </Box>
      </Grid>
    );
  };
  return (
    <Grid xs={12} container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={seedsSelected.length > 0 ? 10 : 12}
        md={seedsSelected.length > 0 ? 11 : 12}
        item
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Pick species for the mix.</Typography>
        </Grid>
        <Grid item xs={12} padding={15} className="site-condition-container">
          <SearchField
            handleChange={updateQuery}
            value={query}
            handleFilter={filterSeeds}
          />
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
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Typography>Mix Diversity</Typography>
          </Grid>
          {seedsList.map((s, i) => {
            return (
              <Grid xs={12}>
                <Grid item>
                  <Accordion xs={12} className="accordian-container">
                    <AccordionSummary
                      xs={12}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{seedsLabel[s]}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ImageList
                        sx={{ maxWidth: "100%", maxHeight: 500 }}
                        cols={matches ? 7 : 2}
                      >
                        {filteredSeeds
                          .filter((seeds, i) => seeds.group.label === s)
                          .map((seeds, idx) => (
                            <ImageListItem
                              key={seeds.thumbnail.src + Math.random()}
                            >
                              <img
                                className={
                                  matches ? "panel-img" : "panel-img-sm"
                                }
                                src={
                                  seeds.thumbnail.src +
                                  "?w=300&h=300&fit=crop&auto=format"
                                }
                                alt={seeds.label}
                                onClick={(e) => {
                                  updateSeeds(seeds, s);
                                }}
                                loading="lazy"
                              />
                              <Link
                                className="img-text"
                                onClick={(e) => {
                                  updateSeeds(seeds, s);
                                }}
                              >
                                {seeds.label}{" "}
                              </Link>
                            </ImageListItem>
                          ))}
                      </ImageList>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SpeciesSelection;
