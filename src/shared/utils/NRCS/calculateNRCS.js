import { calculateInt } from "../calculate";

export const calculateRatio = (crop, seedsSelected) => {
  const identifier = "≤ ";
  const sumOfSeeds = seedsSelected.reduce(
    (sum, s) => sum + parseFloat(s.poundsOfSeed),
    0
  );
  const seedRatio = (crop.poundsOfSeed / sumOfSeeds).toFixed(2);
  return {
    label: crop.label,
    expect: identifier + crop.maxPercentAllowedInMix,
    result: seedRatio,
    pass: seedRatio <= crop.maxPercentAllowedInMix,
  };
};

export const calculateExpectedWinterSurvival = (crop, seedsSelected) => {
  // winter survival rate / lenght of seeds
  const identifier = "≥ ";
  let sum = 0;
  seedsSelected.map((s, i) => {
    sum += parseFloat(s.percentChanceOfWinterSurvival);
  });
  const averageWinterSurvival = sum / seedsSelected.length;

  return {
    label: crop.label,
    expect: crop.percentChanceOfWinterSurvival,
    result: averageWinterSurvival,
    pass: crop.percentChanceOfWinterSurvival >= averageWinterSurvival,
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
  const siteDateMonth = (new Date(siteDate).getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const siteDateDate = (new Date(siteDate).getDate() + 1)
    .toString()
    .padStart(2, "0");
  const formattedSiteDate = `${siteDateMonth}/${siteDateDate}`;
  const pass =
    (plannedDate >= startDate && plannedDate <= endDate) ||
    (plannedDate >= secondStartDate && plannedDate <= secondEndDate);
  return {
    label: seed.label,
    expect: `${seed.plantingDates.firstReliableEstablishmentStart} - ${seed.plantingDates.firstReliableEstablishmentEnd}, ${seed.plantingDates.secondReliableEstablishmentStart} - ${seed.plantingDates.secondReliableEstablishmentEnd}`,
    result: formattedSiteDate,
    pass: pass,
  };
};

export const calculateSeedingRate = (crop, seedsSelected) => {
  // multiply the crop by the plantMethodModifier,
  // then c
  const identifier = "≤ ";

  const seedingRateNRCS = calculateInt(
    [crop.mixSeedingRate, crop.plantingMethod],
    "multiply"
  ).toFixed(2);

  const seedingRateResult = calculateInt(
    [crop.singleSpeciesSeedingRate, seedsSelected.length],
    "divide"
  ).toFixed(2);

  return {
    label: crop.label,
    expect: identifier + seedingRateNRCS,
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
    expect: soilDrainages.join(", "),
    result: soilDrainage,
    pass: pass,
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
      value: false,
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

    if (!expectedWinterSurvivalResult.pass)
      result.expectedWinterSurvival.value = false;

    result.seedingRate.seeds.push(seedingRateResult);
    result.plantingDate.seeds.push(plantingDateResult);
    result.soilDrainage.seeds.push(soilDrainageResult);
    result.ratio.seeds.push(ratioResult);
    result.expectedWinterSurvival.seeds.push(expectedWinterSurvivalResult);
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
