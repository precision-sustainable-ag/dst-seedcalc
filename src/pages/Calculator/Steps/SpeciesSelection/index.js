//////////////////////////////////////////////////////////
//                      Imports                         //
//////////////////////////////////////////////////////////

import * as React from "react";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Link } from "@mui/material";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SearchField } from "../../../../components/SearchField";
import { updateSteps } from "../../../../features/stepSlice/index";
import { getCropsById } from "../../../../features/stepSlice/api";
import { seedsList, seedsLabel } from "../../../../shared/data/species";
import { calculateAllMixRatioValues } from "../../../../shared/utils/calculate";
import "./../steps.css";
import SeedsSelectedList from "./../../../../components/SeedsSelectedList";
import { validateForms } from "../../../../shared/utils/format";
import ImageListComponent from "./imageListComponent";
import Diversity from "./diversity";

const SpeciesSelection = ({ council, completedStep, setCompletedStep }) => {
  // themes
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  // useSelector for crops reducer data
  const dispatch = useDispatch();
  const data = useSelector((state) => state.steps.value);
  const { crops, speciesSelection } = data;
  const seedsSelected = speciesSelection.seedsSelected;
  const diversitySelected = speciesSelection.diversitySelected;
  const [filteredSeeds, setFilteredSeeds] = useState(crops);
  const [query, setQuery] = useState("");

  //////////////////////////////////////////////////////////
  //                      Redux                           //
  //////////////////////////////////////////////////////////

  const handleUpdateStore = (type, key, val) => {
    const data = {
      type: type,
      key: key,
      value: val,
    };
    dispatch(updateSteps(data));
  };

  //////////////////////////////////////////////////////////
  //                    State Logic                       //
  //////////////////////////////////////////////////////////

  // Filter query logic
  const updateQuery = (e) => {
    setQuery(e.target.value);
    filterSeeds(e.target.value);
  };

  // create a data object that specifies the type(data layer 1), the key(data layer 2), & the value for the key.

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
        secondReliableEstablishmentStart:
          council === "MCCC"
            ? cropDetails.attributes["Planting and Growth Windows"][
                "Reliable Establishment"
              ]["values"][1]
                .split(" - ")[0]
                .slice(0, -5)
            : "",
        secondReliableEstablishmentEnd:
          council === "MCCC"
            ? cropDetails.attributes["Planting and Growth Windows"][
                "Reliable Establishment"
              ]["values"][1]
                .split(" - ")[1]
                .slice(0, -5)
            : "",
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
        council === "MCCC"
          ? cropDetails.attributes.Coefficients["Max % Allowed in Mix"][
              "values"
            ][0]
          : 0,
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
          : 0.85, // TBD
      purityPercentage:
        cropDetails.attributes.Coefficients["Precision Coefficient"] !==
        undefined
          ? parseFloat(
              cropDetails.attributes.Coefficients["Precision Coefficient"][
                "values"
              ][0]
            )
          : 0.95, // TBD
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
          : cropDetails.attributes.Coefficients[
              "Broadcast with Cultivation Coefficient"
            ]
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
      drilled: parseFloat(
        cropDetails.attributes.Coefficients["% Live Seed to Emergence"] !==
          undefined
          ? cropDetails.attributes.Coefficients["% Live Seed to Emergence"]
          : 0
      ), // TBD
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
      highFertilityMonocultureCoefficient: cropDetails.attributes.Coefficients[
        "High Fertility Monoculture Coefficient"
      ]
        ? cropDetails.attributes.Coefficients[
            "High Fertility Monoculture Coefficient"
          ]
        : 0,
      highFertilityCompetitiveCoefficient: cropDetails.attributes.Coefficients[
        "High Fertility Competition Coefficient"
      ]
        ? cropDetails.attributes.Coefficients[
            "High Fertility Competition Coefficient"
          ]
        : 0,
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
    };
    newSeed = calculateAllMixRatioValues(newSeed, data);
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
      // update Redux with the seedsSelected and diversitySelected with the new list.
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

  const renderSeedsSelected = () => {
    return (
      <>
        <SeedsSelectedList list={speciesSelection.seedsSelected} />
      </>
    );
  };

  //////////////////////////////////////////////////////////
  //                     useEffect                        //
  //////////////////////////////////////////////////////////

  useEffect(() => {
    validateForms(
      speciesSelection.seedsSelected.length > 1,
      1,
      completedStep,
      setCompletedStep
    );
  }, [speciesSelection]);

  //////////////////////////////////////////////////////////
  //                      Render                          //
  //////////////////////////////////////////////////////////

  const renderAccordian = (seed) => {
    return (
      <Accordion xs={12} className="accordian-container">
        <AccordionSummary
          xs={12}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{seedsLabel[seed]}</Typography>
        </AccordionSummary>
        <AccordionDetails className="accordian-details">
          <ImageListComponent
            seed={seed}
            matchesSm={matchesSm}
            filteredSeeds={filteredSeeds}
            council={council}
            data={data}
            updateSeeds={updateSeeds}
          />
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
          <Diversity diversitySelected={diversitySelected} />
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
