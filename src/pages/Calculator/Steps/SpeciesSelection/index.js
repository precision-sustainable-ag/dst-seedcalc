import * as React from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Link } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SearchField } from "../../../../components/SearchField";
import { updateSteps, getCropsById } from "./../../../../features/stepSlice";
import { seedsList, seedsLabel } from "../../../../shared/data/species";
import airtable from "../../../../shared/data/airtable.json";
import {
  calculateAllValues,
  calculateSeeds,
} from "../../../../shared/utils/calculate";
import "./../steps.css";
import SeedsSelectedList from "./../../../../components/SeedsSelectedList";
import { DataArray } from "@mui/icons-material";

const SpeciesSelection = () => {
  // themes
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const crops = data.crops;
  const speciesSelection = data.speciesSelection;
  const seedsSelected = speciesSelection.seedsSelected;
  const diversitySelected = speciesSelection.diversitySelected;
  const [filteredSeeds, setFilteredSeeds] = useState(crops);
  const [query, setQuery] = useState("");

  // Filter query logic
  const updateQuery = (e) => {
    setQuery(e.target.value);
    filterSeeds(e.target.value);
  };

  // create a data object that specifies the type(data layer 1), the key(data layer 2), & the value for the key.
  const handleUpdateStore = (type, key, val) => {
    const data = {
      type: type,
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
    handleUpdateStore("speciesSelection", "queryResults", filter);
  };

  // Update Seed/Diversities select logic
  const checkSeedSelected = (seed) => {
    const seedSelected = seedsSelected.find((f) => seed.label === f.label);
    return typeof seedSelected !== "undefined" ? false : true;
  };
  const retrieveCropDetails = async (id) => {
    const response = await dispatch(
      getCropsById({
        cropId: `${id}`,
        regionId: data.siteCondition.stateId,
        countyId: data.siteCondition.countyId,
        url: "https://developapi.covercrop-selector.org/v2/crops/148?regions=18&context=seed_calc&regions=180",
      })
    );
    return response.payload.data;
  };

  const updateSeeds = async (seed, species) => {
    // Check if seed length is greater than 0, if not, check for seed existing in seedsSelected[] array.
    // Update diversity based on whether diversity exists or not.
    // extData is temporary until API updated.
    // data not avail in json: mixSeedingRate, percentOfSingleSpeciesRate,

    // default key values per new seed
    const cropDetails = await retrieveCropDetails(seed.id);
    let newSeed = {
      ...seed,
      ...cropDetails,
      plantingDates: {
        firstReliableEstablishmentStart:
          cropDetails.attributes["Planting and Growth Windows"][
            "Reliable Establishment"
          ]["values"][0] !== undefined
            ? cropDetails.attributes["Planting and Growth Windows"][
                "Reliable Establishment"
              ]["values"][0]
                .split(" - ")[0]
                .slice(0, -5)
            : "",
        firstReliableEstablishmentEnd:
          cropDetails.attributes["Planting and Growth Windows"][
            "Reliable Establishment"
          ]["values"][0] !== undefined
            ? cropDetails.attributes["Planting and Growth Windows"][
                "Reliable Establishment"
              ]["values"][0]
                .split(" - ")[1]
                .slice(0, -5)
            : "",
        secondReliableEstablishmentStart: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[0]
          .slice(0, -5),
        secondReliableEstablishmentEnd: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[1]
          .slice(0, -5),
        earlySeedingDateStart: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[0]
          .slice(0, -5),
        earlySeedingDateEnd: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[1]
          .slice(0, -5),
        lateSeedingDateStart: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[0]
          .slice(0, -5),
        lateSeedingDateEnd: cropDetails.attributes[
          "Planting and Growth Windows"
        ]["Reliable Establishment"]["values"][0]
          .split(" - ")[1]
          .slice(0, -5),
      },
      siteConditionPlantingDate: data.siteCondition.plannedPlantingDate,
      soilDrainage: data.siteCondition.soilDrainage,
      singleSpeciesSeedingRate: parseFloat(
        cropDetails.attributes.Coefficients["Single Species Seeding Rate"]
          .values[0]
      ),
      singleSpeciesSeedingRatePLS: parseFloat(
        cropDetails.attributes.Coefficients["Single Species Seeding Rate"]
          .values[0]
      ),
      percentOfSingleSpeciesRate: (1 / (seedsSelected.length + 1)) * 100,
      seedsPound: parseFloat(
        cropDetails.attributes["Planting"]
          ? cropDetails.attributes["Planting"]["Seeds Per lb"]["values"][0]
          : cropDetails.attributes["Planting Information"]["Seed Count"][
              "values"
            ][0] // TBD
      ),
      mixSeedingRate: 0,
      maxPercentAllowedInMix:
        cropDetails.attributes.Coefficients["Max % Allowed in Mix"][
          "values"
        ][0],
      percentChanceOfWinterSurvival: cropDetails.attributes.Coefficients[
        "% Chance of Winter Survial"
      ]
        ? parseFloat(
            cropDetails.attributes.Coefficients["% Chance of Winter Survial"][
              "values"
            ][0]
          )
        : 0, // There is a typo in value in API
      sqFtAcre: 43560,
      germinationPercentage:
        cropDetails.attributes.Coefficients["% Live Seed to Emergence"] !==
        undefined
          ? parseFloat(
              cropDetails.attributes.Coefficients["% Live Seed to Emergence"][
                "values"
              ][0]
            )
          : 0, // TBD
      purityPercentage:
        cropDetails.attributes.Coefficients["Precision Coefficient"] !==
        undefined
          ? parseFloat(
              cropDetails.attributes.Coefficients["Precision Coefficient"][
                "values"
              ][0]
            )
          : 0, // TBD
      seedsPerAcre: parseFloat(
        cropDetails.attributes["Planting"]
          ? cropDetails.attributes["Planting"]["Seeds Per lb"]["values"][0]
          : cropDetails.attributes["Planting Information"]["Seed Count"][
              "values"
            ][0] // TBD
      ),
      poundsOfSeed: parseFloat(
        cropDetails.attributes["Planting"]
          ? cropDetails.attributes["Planting"]["Seeds Per lb"]["values"][0]
          : cropDetails.attributes["Planting Information"]["Seed Count"][
              "values"
            ][0] // TBD
      ), // TBD
      seedsPerPound: parseFloat(
        cropDetails.attributes["Planting"]
          ? cropDetails.attributes["Planting"]["Seeds Per lb"]["values"][0]
          : cropDetails.attributes["Planting Information"]["Seed Count"][
              "values"
            ][0] // TBD
      ),
      plantsPerAcre: 0,
      aproxPlantsSqFt: 0,
      broadcast: parseFloat(
        cropDetails.attributes.Coefficients["Broadcast Coefficient"] !==
          undefined
          ? cropDetails.attributes.Coefficients["Broadcast Coefficient"][
              "values"
            ][0]
          : 0
      ),
      precision: parseFloat(
        cropDetails.attributes.Coefficients["Precision Coefficient"] !==
          undefined
          ? cropDetails.attributes.Coefficients["Precision Coefficient"][
              "values"
            ][0]
          : 0
      ),
      aerial: parseFloat(
        cropDetails.attributes.Coefficients["Aerial Coefficient"] !== undefined
          ? cropDetails.attributes.Coefficients["Aerial Coefficient"][
              "values"
            ][0]
          : 0
      ),
      drilled: 0, // TBD
      showSteps: false,
      // Review your mix values'
      plantingMethod: 1,
      plantingMethods: cropDetails.attributes["Planting Information"]
        ? cropDetails.attributes["Planting Information"]["Planting Methods"][
            "values"
          ]
        : [], // TBD
      soilDrainages:
        cropDetails.attributes["Soil Conditions"]["Soil Drainage"]["values"],
      managementImpactOnMix: 1, // TBD
      mixSeedingRatePLS: 0, // TBD
      bulkGerminationAndPurity: 0,
      bulkSeedingRate: 0,
      step1MixSeedingRate: 0,
      step1Result: 0,
      step2MixSeedingRatePLS: 0,
      step2Result: 0,
      step3MixSeedingRatePLS: 0,
      step3Result: 0,
      step4MixSeedingRatePLS: 0,
      step4Result: 0,
      acres: data.siteCondition.acres,
      poundsForPurchase: 0,
      // Confirm Plan
      bulkLbsPerAcre: 36, // TBD
      totalPounds: 0,
      costPerPound: 0.43, // TBD
      totalCost: 0,
      addedToMix: 0,
      // NRCS Standards
      NRCSSeedingRate: {
        limit: 0,
        result: 0,
      },
      NRCSPlantingDate: {
        limit: 0,
        result: 0,
      },
      NRCSRatio: {
        limit: 0,
        result: 0,
      },
      NRCSSoilDrainage: {
        limit: 0,
        result: 0,
      },
      NRCSExpectedWinterSurvival: {
        limit: 0,
        result: 0,
      },
    };

    newSeed = calculateAllValues(newSeed);
    // three checks:
    // * seedlength is 0
    // * seed already exists
    // * seed doesn't exist
    if (seedsSelected.length === 0) {
      const newList = seedsSelected.map((s, i) => {
        return {
          ...s,
          percentOfSingleSpeciesRate: (1 / (seedsSelected.length + 1)) * 100,
        };
      });
      handleUpdateStore("speciesSelection", "seedsSelected", [
        ...newList,
        newSeed,
      ]);
      handleUpdateStore("speciesSelection", "diversitySelected", [
        ...diversitySelected,
        species,
      ]);
      // by default, we want equal amount of percentage of the seed in the mix, so whenever updating
      // the seed list, we'll update the percentage in mix of all seeds.
    } else {
      const seedsExist = seedsSelected.find((f) => seed.label === f.label);
      // if seed does exist, remove seed in seedsSelected, as well as diversitySelected
      if (typeof seedsExist !== "undefined") {
        const filterList = seedsSelected.filter(
          (item) => item.label !== seed.label
        );
        const newList = filterList.map((n, i) => {
          return {
            ...n,
            percentOfSingleSpeciesRate: (1 / (seedsSelected.length + 1)) * 100,
          };
        });
        handleUpdateStore("speciesSelection", "seedsSelected", newList);
        const seedResult = seedsSelected.filter((i) => {
          return i.group.label === species;
        }).length;
        if (seedResult <= 1) {
          handleUpdateStore(
            "speciesSelection",
            "diversitySelected",
            diversitySelected.filter((d) => d !== species)
          );
        }
      } else {
        // if seed doesn't exist, add NRCS, seedsSelected, & diveristySelected
        const newList = seedsSelected.map((s, i) => {
          return {
            ...s,
            percentOfSingleSpeciesRate: (1 / (seedsSelected.length + 1)) * 100,
          };
        });
        handleUpdateStore("speciesSelection", "seedsSelected", [
          ...newList,
          newSeed,
        ]);
        if (!diversitySelected.includes(species)) {
          handleUpdateStore("speciesSelection", "diversitySelected", [
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
  const renderDiversityProgress = () => {
    return (
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
    );
  };
  const renderSeedsSelected = () => {
    return (
      <>
        <SeedsSelectedList list={speciesSelection.seedsSelected} />
      </>
    );
  };
  const imgSrc = (imgUrl) => {
    return imgUrl !== null ? imgUrl + "?w=300&h=300&fit=crop&auto=format" : "";
  };
  const renderImageList = (data) => {
    return (
      <ImageList sx={{ maxWidth: "100%" }} cols={matchesSm ? 2 : 6}>
        {filteredSeeds
          .filter((seeds, i) => {
            return seeds.group !== null && seeds.group.label === data;
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
              <img
                className={matchesSm ? "panel-img-sm" : "panel-img"}
                src={imgSrc(
                  seeds.thumbnail !== null && seeds.thumbnail !== ""
                    ? seeds.thumbnail
                    : "https://www.gardeningknowhow.com/wp-content/uploads/2020/04/spinach.jpg"
                )}
                alt={seeds.label}
                onClick={(e) => {
                  updateSeeds(seeds, data);
                }}
                loading="lazy"
              />
              <Link
                className="img-text"
                onClick={(e) => {
                  updateSeeds(seeds, data);
                }}
              >
                {seeds.label}{" "}
              </Link>
            </ImageListItem>
          ))}
      </ImageList>
    );
  };
  const renderAccordian = (data) => {
    console.log("accordiaan data", data);
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{seedsLabel[data]}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          {renderImageList(data)}
        </AccordionDetails>
      </Accordion>
    );
  };
  return (
    <Grid xs={12} container>
      {seedsSelected.length > 0 && renderSeedsSelected()}
      <Grid
        xs={12}
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
          {renderDiversityProgress()}
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Typography>Mix Diversity</Typography>
          </Grid>
          {seedsList.map((s, i) => {
            return (
              <Grid xs={12}>
                <Grid item>{renderAccordian(s)}</Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SpeciesSelection;
