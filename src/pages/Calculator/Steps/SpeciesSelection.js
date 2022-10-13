import Grid from "@mui/material/Grid";
import { Typography, Box, Link } from "@mui/material";
import { useState, Fragment } from "react";
import { SearchField } from "../../../components/SearchField";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Fade from "@mui/material/Fade";
import "./steps.css";
// filter logic => filter through speciesList
const speciesList = [
  {
    name: "Brassicas",
    seeds: [
      { name: "Radish, Daikon", imgUrl: "./seeds/radish_daikon.png" },
      { name: "Rapeseed", imgUrl: "./seeds/rapeseed.png" },
      { name: "Turnip", imgUrl: "./seeds/turnip.png" },
    ],
  },
  {
    name: "Broadleaves",
    seeds: [
      { name: "Radish, Daikon", imgUrl: "./seeds/radish_daikon.png" },
      { name: "Rapeseed", imgUrl: "./seeds/rapeseed.png" },
      { name: "Turnip", imgUrl: "./seeds/turnip.png" },
    ],
  },
  {
    name: "Grasses",
    seeds: [
      { name: "Barley", imgUrl: "./seeds/barley.png" },
      { name: "Milet Japanese", imgUrl: "./seeds/milet_japanese.png" },
      { name: "Milet Pearl", imgUrl: "./seeds/milet_pearl.png" },
      { name: "Sudangrass", imgUrl: "./seeds/sudangrass.png" },
      { name: "Triticale", imgUrl: "./seeds/triticale.png" },
      { name: "Wheat", imgUrl: "./seeds/wheat.png" },
    ],
  },
  {
    name: "Legumes",
    seeds: [
      { name: "Clover, Berseem", imgUrl: "./seeds/clover_berseem.png" },
      { name: "Clover, Crimson", imgUrl: "./seeds/clover_crimson.png" },
      { name: "Clover, Red", imgUrl: "./seeds/clover_red.png" },
      { name: "Cowpea", imgUrl: "./seeds/cowpea.png" },
      { name: "Pea", imgUrl: "./seeds/pea.png" },
      { name: "Sweetclover", imgUrl: "./seeds/sweetclover.png" },
      { name: "Hairy Vetch", imgUrl: "./seeds/hairy_vetch.png" },
    ],
  },
];
const seedsList = [];
speciesList.map((s, i) =>
  s.seeds.map((seeds, i) => seedsList.push(seeds.name))
);
const SpeciesSelection = () => {
  const [seedsSelected, setSeedsSelected] = useState([]);
  const [diversitySelected, setDiversitySelected] = useState([]);
  const [query, setQuery] = useState("");

  const updateQuery = (e) => {
    setQuery(e.target.value);
    filterSeeds(e.target.value);
  };
  const updateDiversity = (diversity) => {
    setDiversitySelected([...diversitySelected, diversity]);
  };
  const filterSeeds = (query) => {
    const filter = seedsList.filter((f, i) => f.name === query);
    console.log("FILTA", filter);
  };
  const checkDiversityContains = (diversity) => {
    diversitySelected.includes(diversity);
  };
  const updateSeeds = (seed, species) => {
    if (seedsSelected.length === 0) {
      setSeedsSelected([...seedsSelected, seed]);
      updateDiversity(species.name);
    } else {
      const index = seedsSelected.indexOf(seed);
      if (index > -1) {
        setSeedsSelected(seedsSelected.filter((item) => item !== seed));
        setDiversitySelected(
          diversitySelected.filter((d) => d !== species.name)
        );
      } else {
        setSeedsSelected([...seedsSelected, seed]);
        !diversitySelected.includes(species.name) &&
          updateDiversity(species.name);
      }
    }
    console.log("after update seeds", seedsSelected);
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
                    className="left-panel-img"
                    src={s.imgUrl}
                    alt={s.name}
                    loading="lazy"
                  />
                  <Typography className="left-panel-text">{s.name}</Typography>
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
              {diversitySelected.map((d, i) => {
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
            {diversitySelected.length === 0 && (
              <Grid item xs={12}>
                <Typography className="progress-bar-text">
                  Select a species
                </Typography>
              </Grid>
            )}
            {diversitySelected.map((d, i) => {
              return (
                <Fade in={d}>
                  <Grid item xs={calculateSize()}>
                    <Typography className="progress-bar-text">{d}</Typography>
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
          {speciesList.map((species, i) => {
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
                      <Typography>{species.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ImageList
                        sx={{ maxWidth: 300, maxHeight: 300 }}
                        cols={2}
                        rowHeight="100%"
                      >
                        {species.seeds.map((seeds, idx) => (
                          <ImageListItem key={seeds.imgUrl + Math.random()}>
                            <img
                              className="panel-img"
                              src={
                                seeds.imgUrl +
                                "?w=300&h=300&fit=crop&auto=format"
                              }
                              alt={seeds.name}
                              loading="lazy"
                            />
                            <Link
                              className="img-text"
                              onClick={(e) => {
                                updateSeeds(seeds, species);
                              }}
                            >
                              {seeds.name}
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
