import { SiteCondition } from "../../../pages/Calculator/Steps";
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
  let avg = 0;
  seedsSelected.map((s, i) => {
    avg += parseFloat(s.percentChanceOfWinterSurvival);
  });

  return {
    label: crop.label,
    expect: crop.percentChanceOfWinterSurvival,
    result: avg / seedsSelected.length,
    pass: crop.percentChanceOfWinterSurvival >= avg / seedsSelected.length,
  };
};
export const calculatePlantingDate = (seed, siteDate) => {
  // take planting date from first page, then the seed data's stuff
  const startDate = new Date(
    seed.plantingDates.firstReliableEstablishmentStart
  ).getTime();
  const endDate = new Date(
    seed.plantingDates.firstReliableEstablishmentEnd
  ).getTime();
  const secondStartDate = new Date(
    seed.plantingDates.secondReliableEstablishmentStart
  ).getTime();
  const secondEndDate = new Date(
    seed.plantingDates.secondReliableEstablishmentEnd
  ).getTime();
  const plannedDate = new Date(siteDate.slice(0, -5)).getTime();
  const pass =
    (plannedDate >= startDate && plannedDate <= endDate) ||
    (plannedDate >= secondStartDate && plannedDate <= secondEndDate);
  return {
    label: seed.label,
    expect: `${seed.plantingDates.firstReliableEstablishmentStart} - ${seed.plantingDates.firstReliableEstablishmentEnd}, ${seed.plantingDates.secondReliableEstablishmentStart} - ${seed.plantingDates.secondReliableEstablishmentEnd}`,
    result: siteDate.slice(0, -5),
    pass: pass,
  };
};

export const calculateSeedingRate = (crop, seedsSelected) => {
  // multiply the crop by the plantMethodModifier,
  // then c
  const seedingRateNRCS = calculateInt(
    [crop.mixSeedingRate, crop.plantingMethod],
    "multiply"
  );

  const seedingRateResult = calculateInt(
    [crop.singleSpeciesSeedingRate, seedsSelected.length],
    "divide"
  );
  return {
    label: crop.label,
    expect: seedingRateNRCS,
    result: seedingRateResult,
    pass: seedingRateResult <= seedingRateNRCS ? true : false,
  };
};

export const calculateSoilDrainage = (
  crop,
  { soilDrainage },
  seedsSelected
) => {
  // take soil drainage selected from user, then check if soil Drainage in crop
  // contains data

  const soilDrainages = crop.soilDrainages;
  const pass = soilDrainages.indexOf(crop.soilDrainage) > -1;
  return {
    label: crop.label,
    expect: crop.soilDrainages,
    result: soilDrainage,
    pass: soilDrainages.indexOf(soilDrainage) > -1,
  };
};

export const generateNRCSStandards = (seedsSelected, siteCondition) => {
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
    const plantingDateResult = calculatePlantingDate(
      s,
      siteCondition.plannedPlantingDate
    );
    const ratioResult = calculateRatio(s, seedsSelected);
    const soilDrainageResult = calculateSoilDrainage(
      s,
      siteCondition,
      seedsSelected
    );
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

  result.seedingRate.value = validateNRCS(result.seedingRate.seeds);
  result.ratio.value = validateNRCS(result.ratio.seeds);
  result.plantingDate.value = validateNRCS(result.plantingDate.seeds);
  result.soilDrainage.value = validateNRCS(result.soilDrainage.seeds);
  return result;
};
export const validateNRCS = (arr) => {
  const pass = arr.every((n) => {
    return n.pass === true;
  });
  return pass;
};

/*
    map through seeds => check every NCSU value 
    map through seeds 
*/
