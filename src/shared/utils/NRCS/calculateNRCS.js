import airtable from "../../data/airtable.json";
import { soilDrainage } from "../../data/dropdown";
import { calculateInt } from "../calculate";
import { checkPlantingDate } from "./checkNRCS";

export const calculateRatio = (crop, seedsSelected) => {
  const sumOfSeeds = seedsSelected.reduce(
    (sum, s) => sum + parseFloat(s.poundsOfSeed),
    0
  );
  const seedRatio = crop.poundsOfSeed / sumOfSeeds;
  return {
    label: crop.label,
    expect: crop.maxPercentAllowedInMix,
    result: seedRatio,
    pass: seedRatio <= crop.maxPercentAllowedInMix,
  };
};

export const calculateExpectedWinterSurvival = (crop, seedsSelected) => {
  // winter survival rate / lenght of seeds
  const averageSurvival =
    seedsSelected.reduce(
      (a, b) =>
        a.percentChanceOfWinterSurvival + b.percentChanceOfWinterSurvival
    ) / seedsSelected.length;
  return {
    label: crop.label,
    expect: "winterSurviaval",
    result: 0.0,
    pass: false,
  };
};
export const calculatePlantingDate = (seed) => {
  // take planting date from first page, then the seed data's stuff
  const data = checkPlantingDate(seed);
  return {
    label: seed.label,
    expect: data.expect,
    result: data.result,
    pass: false,
  };
};

export const calculateSeedingRate = (crop, seedsSelected) => {
  // multiply the crop by the plantMethodModifier,
  // then c
  const seedingRateNRCS = {
    value: calculateInt(crop.mixSeedingRate, crop.plantingMethod, "multiply"),
    seeds: [],
  };
  const seedingRateResult = calculateInt(
    crop.singleSpeciesSeedingRate,
    seedsSelected.length,
    "divide"
  );

  return {
    label: crop.label,
    expect: seedingRateNRCS,
    result: seedingRateResult,
    pass: seedingRateResult <= seedingRateNRCS ? true : false,
  };
};

export const calculateSoilDrainage = (crop, seedsSelected) => {
  // take soil drainage selected from user, then check if soil Drainage in crop
  // contains data

  const soilDrainages = crop.soilDrainages;
  const pass = soilDrainages.indexOf(crop.soilDrainage) > -1;
  return {
    label: crop.label,
    expect: crop.soilDrainages,
    result: crop.soilDrainage,
    pass: soilDrainages.indexOf(crop.soilDrainage) > -1,
  };
};

export const generateNRCSStandards = (seedsSelected) => {
  const result = {
    seedingRate: {
      value: false,
      seeds: [],
    },
    plantingDate: {
      value: false,
      seeds: [],
    },
    ratio: {
      value: false,
      seeds: [],
    },
    soilDrainage: {
      value: false,
      seeds: [],
    },
    expectedWinterSurvival: {
      value: 0,
      seeds: [],
    },
  };
  seedsSelected.map((s, i) => {
    const seedingRateResult = calculateSeedingRate(s, seedsSelected);
    const plantingDateResult = calculatePlantingDate(s);
    const ratioResult = calculateRatio(s, seedsSelected);
    const soilDrainageResult = calculateSoilDrainage(s, seedsSelected);
    const expectedWinterSurvivalResult = calculateExpectedWinterSurvival(
      s,
      seedsSelected
    );

    if (!seedingRateResult.pass) result.seedingRate.value = false;
    if (!plantingDateResult.pass) result.plantingDate.value = false;
    if (!ratioResult.pass) result.ratio.value = false;
    if (!soilDrainageResult.pass) result.soilDrainage.value = false;

    if (!expectedWinterSurvivalResult) result.expectedWinterSurvival();

    result.seedingRate.seeds.push(seedingRateResult);
    result.plantingDate.seeds.push(plantingDateResult);
    result.soilDrainage.seeds.push(soilDrainageResult);
    result.ratio.seeds.push(ratioResult);
    result.expectedWinterSurvival.seeds.push(
      calculateExpectedWinterSurvival(s, seedsSelected)
    );
  });
  console.log("results generate", result);
  return result;
};

/*
    map through seeds => check every NCSU value 
    map through seeds 
*/
