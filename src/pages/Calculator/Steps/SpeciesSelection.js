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
  const [seedsSelected, setSeedsSelected] = useState(
    speciesSelection.seedsSelected
  );
  const [diversitySelected, setDiversitySelected] = useState(
    speciesSelection.diversitySelected
  );
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
  const updateDiversity = (diversity) => {
    setDiversitySelected([...diversitySelected, diversity]);
    handleUpdateSteps("diversitySelected", [
      ...speciesSelection.diversitySelected,
      diversitySelected,
    ]);
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

  const updateSeeds = (seed, species) => {
    if (seedsSelected.length === 0) {
      setSeedsSelected([...seedsSelected, seed]);
      updateDiversity(species);
      handleUpdateSteps("seedsSelected", [
        ...speciesSelection.seedsSelected,
        seed,
      ]);
      handleUpdateSteps("diversitySelected", [
        ...speciesSelection.diversitySelected,
        species,
      ]);
    } else {
      const seedsExist = seedsSelected.indexOf(seed);
      if (seedsExist > -1) {
        setSeedsSelected(seedsSelected.filter((item) => item !== seed));
        handleUpdateSteps(
          "seedsSelected",
          seedsSelected.filter((item) => item !== seed)
        );
        const seedResult = seedsSelected.filter((i) => {
          return i.group.label === species;
        }).length;
        if (seedResult <= 1)
          setDiversitySelected(diversitySelected.filter((d) => d !== species));
        handleUpdateSteps(
          "diversitySelected",
          diversitySelected.filter((d) => d !== species)
        );
      } else {
        setSeedsSelected([...seedsSelected, seed]);
        handleUpdateSteps("seedsSelected", [
          ...speciesSelection.seedsSelected,
          seed,
        ]);
        if (!diversitySelected.includes(species)) {
          updateDiversity(species);
          handleUpdateSteps("diversitySelected", [
            ...speciesSelection.diversitySelected,
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

  return (
    <Grid xs={12} container>
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
          {seedsSelected.length > 0 &&
            seedsSelected.map((s, idx) => {
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
      <Grid xs={10} md={11} item justifyContent="center" alignItems="center">
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
                    <Fade in={d}>
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
                  <Fade in={d}>
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
                        sx={{ maxWidth: 300, maxHeight: 300 }}
                        cols={2}
                        rowHeight="100%"
                      >
                        {filteredSeeds
                          .filter((seeds, i) => seeds.group.label === s)
                          .map((seeds, idx) => (
                            <ImageListItem
                              key={seeds.thumbnail.src + Math.random()}
                            >
                              <img
                                className="panel-img"
                                src={
                                  seeds.thumbnail.src +
                                  "?w=300&h=300&fit=crop&auto=format"
                                }
                                alt={seeds.label}
                                loading="lazy"
                              />
                              <Link
                                className="img-text"
                                onClick={(e) => {
                                  updateSeeds(seeds, s);
                                }}
                              >
                                {seeds.label}
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
