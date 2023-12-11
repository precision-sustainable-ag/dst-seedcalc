export const calculateRatio = (crop, seedsSelected) => {
  const identifier = '≤ ';

  const seedsPerAcre = parseFloat(crop.seedsPerAcre);
  const sumSeedsPerAcre = seedsSelected.reduce(
    (sum, s) => sum + parseFloat(s.seedsPerAcre),
    0,
  );
  const percentInMix = (seedsPerAcre / sumSeedsPerAcre).toFixed(2);
  return {
    label: crop.label,
    expect: identifier + crop.maxPercentAllowedInMix,
    result: percentInMix,
    pass: percentInMix <= crop.maxPercentAllowedInMix,
  };
};

export const calculateExpectedWinterSurvival = (seedsSelected) => {
  const identifier = '≥ ';
  const sumSeedsPerAcre = seedsSelected.reduce(
    (sum, s) => sum + parseFloat(s.seedsPerAcre),
    0,
  );
  let sum = 0;
  seedsSelected.map((s) => {
    const seedsPerAcre = parseFloat(s.seedsPerAcre);
    const percentInMix = (seedsPerAcre / sumSeedsPerAcre).toFixed(2);
    sum += parseFloat(s.percentChanceOfWinterSurvival) * percentInMix;
    return null;
  });

  return {
    label: 'Mix winter survival rate',
    expect: `${identifier}0.5`,
    result: sum.toFixed(2),
    pass: sum >= 0.5,
  };
};

export const calculatePlantingDate = (seed, siteDate) => {
  const {
    firstReliableEstablishmentStart, firstReliableEstablishmentEnd,
    secondReliableEstablishmentStart, secondReliableEstablishmentEnd,
  } = seed.plantingDates;
  // take planting date from first page, then the seed data's stuff
  const startDate = new Date(firstReliableEstablishmentStart).getTime();
  const endDate = new Date(firstReliableEstablishmentEnd).getTime();
  const secondStartDate = new Date(secondReliableEstablishmentStart).getTime();
  const secondEndDate = new Date(secondReliableEstablishmentEnd).getTime();
  const plannedDate = new Date(siteDate.slice(0, -5)).getTime();
  const siteDateMonth = (new Date(siteDate).getMonth() + 1)
    .toString()
    .padStart(2, '0');
  const siteDateDate = (new Date(siteDate).getDate() + 1)
    .toString()
    .padStart(2, '0');
  const formattedSiteDate = `${siteDateMonth}/${siteDateDate}`;
  const pass = (plannedDate >= startDate && plannedDate <= endDate)
    || (secondStartDate && plannedDate >= secondStartDate && plannedDate <= secondEndDate);
  return {
    label: seed.label,
    expect: `${firstReliableEstablishmentStart} - ${firstReliableEstablishmentEnd}\
    ${secondStartDate ? `, ${secondReliableEstablishmentStart} - ${secondReliableEstablishmentEnd}` : ''}`,
    result: formattedSiteDate,
    pass,
  };
};

export const calculateSeedingRate = (crop, seedsSelected) => {
  const { singleSpeciesSeedingRate } = crop;

  const seedingRateResult = (
    (singleSpeciesSeedingRate
      * crop.plantingMethod
      * crop.managementImpactOnMix)
    / (seedsSelected.length * crop.germinationPercentage * crop.purityPercentage)
  ).toFixed(2);

  return {
    label: crop.label,
    expect:
      `${(singleSpeciesSeedingRate * 0.5).toFixed(2)
      } ≤ result ≤ ${
        (singleSpeciesSeedingRate * 2.5).toFixed(2)}`,
    result: seedingRateResult,
    pass:
      !!(singleSpeciesSeedingRate * 0.5 <= seedingRateResult
      && seedingRateResult <= singleSpeciesSeedingRate * 2.5),
  };
};

export const calculateSoilDrainage = (
  crop,
  { soilDrainage },
) => {
  // take soil drainage selected from user, then check if soil Drainage in crop
  // contains data

  const { soilDrainages } = crop;
  const pass = soilDrainages.indexOf(crop.soilDrainage) > -1;
  return {
    label: crop.label,
    expect: soilDrainages.join(', '),
    result: soilDrainage,
    pass,
  };
};

export const validateNRCS = (arr) => {
  const pass = arr.every((n) => n.pass === true);
  return pass;
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
  seedsSelected.map((s) => {
    const seedingRateResult = calculateSeedingRate(s, seedsSelected);
    const plantingDateResult = calculatePlantingDate(
      s,
      siteCondition.plannedPlantingDate,
    );
    const ratioResult = calculateRatio(s, seedsSelected);
    const soilDrainageResult = calculateSoilDrainage(
      s,
      siteCondition,
      seedsSelected,
    );

    if (!seedingRateResult.pass) result.seedingRate.value = false;
    if (!plantingDateResult.pass) result.plantingDate.value = false;
    if (!ratioResult.pass) result.ratio.value = false;
    if (!soilDrainageResult.pass) result.soilDrainage.value = false;

    result.seedingRate.seeds.push(seedingRateResult);
    result.plantingDate.seeds.push(plantingDateResult);
    result.soilDrainage.seeds.push(soilDrainageResult);
    result.ratio.seeds.push(ratioResult);
    return null;
  });

  const expectedWinterSurvivalResult = calculateExpectedWinterSurvival(seedsSelected);
  if (!expectedWinterSurvivalResult.pass) { result.expectedWinterSurvival.value = false; }
  result.expectedWinterSurvival.seeds.push(expectedWinterSurvivalResult);

  result.seedingRate.value = validateNRCS(result.seedingRate.seeds);
  result.ratio.value = validateNRCS(result.ratio.seeds);
  result.plantingDate.value = validateNRCS(result.plantingDate.seeds);
  result.soilDrainage.value = validateNRCS(result.soilDrainage.seeds);
  return result;
};

/*
    map through seeds => check every NCSU value
    map through seeds
*/
