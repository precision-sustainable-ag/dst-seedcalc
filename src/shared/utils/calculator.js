/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-multi-str */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';

const convertToPercent = (num) => Number((parseFloat(num) * 100).toFixed(1));

const twoDigit = (value) => Number(parseFloat(value).toFixed(2));

const createUserInput = (soilDrainage, plantingDate, acres) => ({ soilDrainage, plantingDate, acres });

// eslint-disable-next-line no-undef
const createCalculator = (mix, council, regions, userInput) => new SeedRateCalculator({
  mix, council, regions, userInput,
});

const initialOptions = {
  acres: null,
  plantingMethod: null,
  managementImpactOnMix: null,
  germination: null,
  purity: null,
  singleSpeciesSeedingRate: null,
  percentOfRate: null,
  seedsPerPound: null,
  percentSurvival: null,
  seedsPerAcre: null,
  plantingMethodModifier: null,
  mixSeedingRate: null,
  costPerPound: null,
};

const adjustProportionsMCCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const defaultSingleSpeciesSeedingRatePLS = options.singleSpeciesSeedingRate
  ?? crop.coefficients.singleSpeciesSeedingRate;

  // TODO: when using these funcs, all the OPTION param should be same since some of them may call others
  // const defaultMixSeedingRate = calculator.mixSeedingRate(seed, options);

  const seedingRate = twoDigit(calculator.seedingRate(seed, options));
  const seedsPerAcre = twoDigit(calculator.seedsPerAcre(seed, options));
  // options in calculating plants per acre
  const plantsPerAcre = twoDigit(calculator.plantsPerAcre(seed, options));
  const plantsPerSqft = twoDigit(calculator.plantsPerSqft(seed, options));

  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  console.log('Step 1: Default Single Species Seeding Rate PLS * Percent of Rate = Seeding Rate');
  console.log(defaultSingleSpeciesSeedingRatePLS, ' * ', options.percentOfRate, ' = ', seedingRate);

  console.log('Step 2: Seeds Per Pound * Seeding Rate = Seeds Per Acre');
  console.log(crop.seedsPerPound, ' * ', seedingRate, ' = ', seedsPerAcre);
  console.log('Step 3: Seeds Per Acre * %Survival = Plants Per Acre');
  console.log(seedsPerAcre, ' * ', options.percentSurvival, ' = ', plantsPerAcre);
  console.log('Step 4: Plants Per Acre / Sqft Per Acre = Plants Per Sqft');
  console.log(plantsPerAcre, ' / ', 43560, ' = ', plantsPerSqft);
  const result = {
    step1: { defaultSingleSpeciesSeedingRatePLS, percentOfRate: options.percentOfRate, seedingRate },
    step2: { seedsPerPound: crop.seedsPerPound, seedingRate, seedsPerAcre },
    step3: { seedsPerAcre, percentSurvival: options.percentSurvival, plantsPerAcre },
    step4: { plantsPerAcre, sqftPerAcre: 43560, plantsPerSqft },
  };
  return result;
};

const adjustProportionsNECCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const defaultSingleSpeciesSeedingRatePLS = options.singleSpeciesSeedingRate
  ?? crop.coefficients.singleSpeciesSeedingRate;

  const soilFertilityModifier = calculator.soilFertilityModifier(crop, options);
  const { group } = crop;
  const sumGroupInMix = calculator.speciesInMix[group];

  const seedingRate = twoDigit(calculator.seedingRate(seed, options));
  const seedsPerAcre = twoDigit(calculator.seedsPerAcre(seed, options));
  const seedsPerSqft = twoDigit(seedsPerAcre / 43560);

  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  console.log('Step 1: Default Single Species Seeding Rate PLS *\
  Soil Fertility Modifier / Sum Species Of Group in Mix = Seeding Rate');
  console.log(
    defaultSingleSpeciesSeedingRatePLS,
    ' * ',
    soilFertilityModifier,
    '/',
    sumGroupInMix,
    ' = ',
    seedingRate,
  );
  console.log('Step 2: Seeds Per Pound * Seeding Rate = Seeds Per Acre');
  console.log(crop.seedsPerPound, ' * ', seedingRate, ' = ', seedsPerAcre);
  console.log('Step 3: Seeds Per Acre / Sqft Per Acre = Seeds Per Sqft');
  console.log(seedsPerAcre, ' / ', 43560, ' = ', seedsPerSqft);
  const result = {
    step1: {
      defaultSingleSpeciesSeedingRatePLS, soilFertilityModifier, sumGroupInMix, seedingRate,
    },
    step2: { seedsPerPound: crop.seedsPerPound, seedingRate, seedsPerAcre },
    step3: { seedsPerAcre, sqftPerAcre: 43560, seedsPerSqft },
  };
  return result;
};

const adjustProportionsSCCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const defaultSingleSpeciesSeedingRatePLS = options.singleSpeciesSeedingRate
  ?? crop.coefficients.singleSpeciesSeedingRate;

  console.log('speciesInMix', calculator.sumSpeciesInMix());
  console.log(calculator.isFreezingZone());

  const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(seed, options);
  const plantingTimeModifier = calculator.plantingTimeCoefficient(seed, options);
  const mixCompetitionCoefficient = calculator.getDefaultMixCompetitionCoefficient(seed, options);

  const seedingRate = twoDigit(calculator.seedingRate(seed, options));
  const seedsPerAcre = twoDigit(calculator.seedsPerAcre(seed, options));
  const seedsPerSqft = twoDigit(seedsPerAcre / 43560);

  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  console.log('Step 1: Default Single Species Seeding Rate PLS *\
  Percent Of Rate * Planting Time Modifier * Mix Competition Coefficient = Seeding Rate');
  console.log(
    `${defaultSingleSpeciesSeedingRatePLS} * ${percentOfRate}\
* ${plantingTimeModifier} * ${mixCompetitionCoefficient} = ${seedingRate}`,
  );
  console.log('Step 2: Seeds Per Pound * Seeding Rate = Seeds Per Acre');
  console.log(crop.seedsPerPound, ' * ', seedingRate, ' = ', seedsPerAcre);
  console.log('Step 3: Seeds Per Acre / Sqft Per Acre = Seeds Per Sqft');
  console.log(seedsPerAcre, ' / ', 43560, ' = ', seedsPerSqft);
  const result = {
    step1: {
      defaultSingleSpeciesSeedingRatePLS,
      percentOfRate,
      plantingTimeModifier,
      mixCompetitionCoefficient,
      seedingRate,
    },
    step2: { seedsPerPound: crop.seedsPerPound, seedingRate, seedsPerAcre },
    step3: { seedsPerAcre, sqftPerAcre: 43560, seedsPerSqft },
  };
  return result;
};

const reviewMixMCCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const singleSpeciesSeedingRate = options.singleSpeciesSeedingRate ?? crop.coefficients.singleSpeciesSeedingRate;
  const percentOfSingleSpeciesRate = options.percentOfRate ?? calculator.getDefaultPercentOfSingleSpeciesSeedingRate(seed);

  const baseSeedingRate = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethodModifier: 1,
  }));

  const seedingRateAfterPlantingMethodModifier = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
  }));

  const seedingRateAfterManagementImpact = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
  }));

  const seedingRateAfterPurityAndGermination = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
    purity: options.purity,
    germination: options.germination,
  }));

  const bulkSeedingRate = seedingRateAfterPurityAndGermination;

  const poundsForPurchase = twoDigit(calculator.poundsForPurchase(seed, {
    acres: options.acres,
    seedingRate: bulkSeedingRate,
  }));

  console.log('\n> ', seed.label, '- ReviewYourMixPage');
  console.log('1.Single Species Seeding Rate * Percent of Rate = Seeding Rate');
  console.log(singleSpeciesSeedingRate, ' * ', percentOfSingleSpeciesRate, ' = ', baseSeedingRate);
  console.log('2.Seeding Rate * Planting Method = Seeding Rate');
  console.log(baseSeedingRate, ' * ', options.plantingMethodModifier, ' = ', seedingRateAfterPlantingMethodModifier);
  console.log('3.Seeding Rate + Seeding Rate * Management Impact = Seeding Rate');
  console.log(
    seedingRateAfterPlantingMethodModifier,
    ' + ',
    seedingRateAfterPlantingMethodModifier,
    ' * ',
    options.managementImpactOnMix,
    ' = ',
    seedingRateAfterManagementImpact,
  );
  console.log('4. Seeding Rate / Germination / Purity = Bulk Seeding Rate');
  console.log(seedingRateAfterManagementImpact, ' / ', options.germination, ' / ', options.purity, ' = ', seedingRateAfterPurityAndGermination);
  console.log('5. Bulk Seeding Rate * Acres = Pounds for purchase');
  console.log(bulkSeedingRate, ' * ', options.acres, ' = ', poundsForPurchase);
  const result = {
    step1: { singleSpeciesSeedingRate, percentOfRate: percentOfSingleSpeciesRate, seedingRate: baseSeedingRate },
    step2: { seedingRate: baseSeedingRate, plantingMethodModifier: options.plantingMethodModifier, seedingRateAfterPlantingMethodModifier },
    step3: {
      seedingRate: seedingRateAfterPlantingMethodModifier,
      managementImpactOnMix: options.managementImpactOnMix,
      seedingRateAfterManagementImpact,
    },
    step4: {
      seedingRateAfterManagementImpact, germination: options.germination, purity: options.purity, bulkSeedingRate,
    },
    step5: { bulkSeedingRate, acres: options.acres, poundsForPurchase },
  };
  return result;
};

const reviewMixNECCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const singleSpeciesSeedingRate = options.singleSpeciesSeedingRate ?? crop.coefficients.singleSpeciesSeedingRate;
  const soilFertilityModifier = calculator.soilFertilityModifier(crop, options);
  const { group } = crop;
  const sumGroupInMix = calculator.speciesInMix[group];
  const percentOfRate = options.percentOfRate ?? calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop, options);

  const seedingRate = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
  }));

  const seedingRateAfterPlantingMethodModifier = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
  }));

  const seedingRateAfterManagementImpact = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
  }));

  const seedingRateAfterPurityAndGermination = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
    purity: options.purity,
    germination: options.germination,
  }));

  const bulkSeedingRate = seedingRateAfterPurityAndGermination;

  const poundsForPurchase = twoDigit(calculator.poundsForPurchase(seed, {
    acres: options.acres,
    seedingRate: bulkSeedingRate,
  }));

  console.log('\n> ', seed.label, '- ReviewYourMixPage');
  console.log('Step 1: Default Single Species Seeding Rate PLS *\
  Soil Fertility Modifier / Sum Species Of Group in Mix = Seeding Rate');
  console.log(
    singleSpeciesSeedingRate,
    ' * ',
    soilFertilityModifier,
    '/',
    sumGroupInMix,
    ' = ',
    seedingRate,
  );
  console.log('2.Seeding Rate * Planting Method = Seeding Rate');
  console.log(seedingRate, ' * ', options.plantingMethodModifier, ' = ', seedingRateAfterPlantingMethodModifier);
  console.log('3. Seeding Rate * Management Impact = Seeding Rate');
  console.log(
    seedingRateAfterPlantingMethodModifier,
    ' * ',
    options.managementImpactOnMix,
    ' = ',
    seedingRateAfterManagementImpact,
  );
  console.log('4. Seeding Rate / Germination / Purity = Bulk Seeding Rate');
  console.log(seedingRateAfterManagementImpact, ' / ', options.germination, ' / ', options.purity, ' = ', seedingRateAfterPurityAndGermination);
  console.log('5. Bulk Seeding Rate * Acres = Pounds for purchase');
  console.log(bulkSeedingRate, ' * ', options.acres, ' = ', poundsForPurchase);
  const result = {
    step1: {
      singleSpeciesSeedingRate, soilFertilityModifier, sumGroupInMix, seedingRate,
    },
    step2: { seedingRate, plantingMethodModifier: options.plantingMethodModifier, seedingRateAfterPlantingMethodModifier },
    step3: {
      seedingRate: seedingRateAfterPlantingMethodModifier,
      managementImpactOnMix: options.managementImpactOnMix,
      seedingRateAfterManagementImpact,
    },
    step4: {
      seedingRateAfterManagementImpact, germination: options.germination, purity: options.purity, bulkSeedingRate,
    },
    step5: { bulkSeedingRate, acres: options.acres, poundsForPurchase },
  };
  return result;
};

const reviewMixSCCC = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const singleSpeciesSeedingRate = options.singleSpeciesSeedingRate ?? crop.coefficients.singleSpeciesSeedingRate;
  const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop, options);
  const plantingTimeModifier = calculator.plantingTimeCoefficient(seed, options);
  const mixCompetitionCoefficient = calculator.getDefaultMixCompetitionCoefficient(seed, options);

  const seedingRate = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
  }));

  const seedingRateAfterPlantingMethodModifier = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
  }));

  const seedingRateAfterManagementImpact = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
  }));

  const seedingRateAfterPurityAndGermination = twoDigit(calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
    purity: options.purity,
    germination: options.germination,
  }));

  const bulkSeedingRate = seedingRateAfterPurityAndGermination;

  const poundsForPurchase = twoDigit(calculator.poundsForPurchase(seed, {
    acres: options.acres,
    seedingRate: bulkSeedingRate,
  }));

  console.log('\n> ', seed.label, '- ReviewYourMixPage');
  console.log('Step 1: Default Single Species Seeding Rate PLS *\
  Percent Of Rate * Planting Time Modifier * Mix Competition Coefficient = Seeding Rate');
  console.log(
    `${singleSpeciesSeedingRate} * ${percentOfRate}\
* ${plantingTimeModifier} * ${mixCompetitionCoefficient} = ${seedingRate}`,
  );
  console.log('2.Seeding Rate * Planting Method = Seeding Rate');
  console.log(seedingRate, ' * ', options.plantingMethodModifier, ' = ', seedingRateAfterPlantingMethodModifier);
  console.log('3. Seeding Rate * Management Impact = Seeding Rate');
  console.log(
    seedingRateAfterPlantingMethodModifier,
    ' * ',
    options.managementImpactOnMix,
    ' = ',
    seedingRateAfterManagementImpact,
  );
  console.log('4. Seeding Rate / Germination / Purity = Bulk Seeding Rate');
  console.log(seedingRateAfterManagementImpact, ' / ', options.germination, ' / ', options.purity, ' = ', seedingRateAfterPurityAndGermination);
  console.log('5. Bulk Seeding Rate * Acres = Pounds for purchase');
  console.log(bulkSeedingRate, ' * ', options.acres, ' = ', poundsForPurchase);
  const result = {
    step1: {
      singleSpeciesSeedingRate, percentOfRate, plantingTimeModifier, mixCompetitionCoefficient, seedingRate,
    },
    step2: { seedingRate, plantingMethodModifier: options.plantingMethodModifier, seedingRateAfterPlantingMethodModifier },
    step3: {
      seedingRate: seedingRateAfterPlantingMethodModifier,
      managementImpactOnMix: options.managementImpactOnMix,
      seedingRateAfterManagementImpact,
    },
    step4: {
      seedingRateAfterManagementImpact, germination: options.germination, purity: options.purity, bulkSeedingRate,
    },
    step5: { bulkSeedingRate, acres: options.acres, poundsForPurchase },
  };
  return result;
};

const confirmPlan = (bulkSeedingRate, acres, costPerPound) => {
  const totalPounds = twoDigit(bulkSeedingRate * acres);
  const totalCost = twoDigit(costPerPound * totalPounds);
  return {
    bulkSeedingRate, acres, costPerPound, totalPounds, totalCost,
  };
};

const checkNRCS = (seeds, calculator, options) => {
  const result = {};

  const checkSeedingRate = () => {
    const seedingRate = [];
    console.log('-----------Seeding Rate:');
    seeds.forEach((seed) => {
      const seedOption = options[seed.label];
      // FIXME: need verification because this calculation didn't consider percent
      const baseSeedingRate = twoDigit(calculator.seedingRate(seed, {
        singleSpeciesSeedingRate: seedOption?.singleSpeciesSeedingRate,
      }));
      const finalSeedingRate = twoDigit(calculator.seedingRate(seed, seedOption));
      const UPPER_LIMIT = twoDigit(baseSeedingRate * 2.5);
      const LOWER_LIMIT = twoDigit(baseSeedingRate * 0.5);
      console.log(
        seed.label,
        'result:',
        finalSeedingRate,
        ', expect: ',
        LOWER_LIMIT,
        '<= result <=',
        UPPER_LIMIT,
        calculator.nrcs.isValidSeedingRate(seed, seedOption),
      );
      seedingRate.push({
        label: seed.label,
        result: finalSeedingRate,
        expect: `${LOWER_LIMIT} ≤ result ≤ ${UPPER_LIMIT}`,
        pass: calculator.nrcs.isValidSeedingRate(seed, seedOption).passed,
      });
    });
    result.seedingRate = seedingRate;
  };

  const checkPlantingDate = () => {
    const plantingDate = [];
    // FIXME: frontend checks for reliable establishment, while sdk checks more, early and late seeding
    console.log('-----------Planting Date:');
    seeds.forEach((seed) => {
      const plannedDate = dayjs(options[seed.label].plannedPlantingDate).format('MM/DD');
      const [firstStart, firstEnd, secondStart, secondEnd] = getPlantingDate(seed);
      // eslint-disable-next-line no-shadow
      let result;
      if (dayjs(plannedDate).isBetween(firstStart, firstEnd, 'day')) result = true;
      else if (secondStart && dayjs(plannedDate).isBetween(secondStart, secondEnd, 'day')) result = true;
      else result = false;
      console.log(
        seed.label,
        ', planned:',
        plannedDate,
        ', RE:',
        firstStart,
        '-',
        firstEnd,
        secondStart ? `${secondStart} - ${secondEnd}` : '',
        result,
      );
      plantingDate.push({
        label: seed.label,
        result: plannedDate,
        expect: `${firstStart}-${firstEnd}${secondStart ? `${secondStart}-${secondEnd}` : ''}`,
        pass: result,
      });
    });
    result.plantingDate = plantingDate;
  };

  const checkRatio = () => {
    const ratio = [];
    console.log('-----------Ratio(Percent In Mix):');
    seeds.forEach((seed) => {
      const percentInMix = twoDigit(calculator.percentInMix(seed, options));
      const maxInMix = parseFloat(seed.attributes.Coefficients['Max % Allowed in Mix'].values[0]);
      console.log(seed.label, percentInMix, maxInMix);
      const result = calculator.nrcs.isValidPercentInMix(seed, options);
      console.log(result);
      ratio.push({
        label: seed.label,
        result: percentInMix,
        expect: `≤${maxInMix}`,
        pass: result.passed,
      });
    });
    result.ratio = ratio;
  };

  const checkSoilDrainage = () => {
    const soilDrainageResult = [];
    console.log('-----------Soil Drainage:');
    seeds.forEach((seed) => {
      const { soilDrainage } = options[seed.label];
      const soilDrainages = seed.attributes['Soil Conditions']?.['Soil Drainage'].values ?? [];
      const pass = soilDrainages.map((s) => s.toLowerCase()).indexOf(soilDrainage.toLowerCase()) > -1;
      console.log(seed.label, soilDrainage, soilDrainages, pass);
      soilDrainageResult.push({
        label: seed.label,
        result: `${soilDrainage}`,
        expect: `${soilDrainages.join(',')}`,
        pass,
      });
    });
    result.soilDrainageResult = soilDrainageResult;
  };

  const checkWinterSurvival = (threshold = 0.5) => {
    const winterSurvival = [];
    console.log('-----------Winter Survivability:');
    let chanceOfMixSurvival = 0.00;
    seeds.forEach((seed) => {
      const percentInMix = calculator.percentInMix(seed, options);
      const winterSurvivability = options[seed.label].percentSurvival;
      chanceOfMixSurvival += percentInMix * winterSurvivability;
    });
    chanceOfMixSurvival = twoDigit(chanceOfMixSurvival);
    console.log(chanceOfMixSurvival, '>=', threshold, chanceOfMixSurvival >= threshold);
    winterSurvival.push({
      label: 'Mix winter survival rate',
      result: chanceOfMixSurvival,
      expect: '≥ 0.5',
      pass: chanceOfMixSurvival >= threshold,
    });
    result.winterSurvival = winterSurvival;
  };

  checkSeedingRate();
  checkPlantingDate();
  checkRatio();
  checkSoilDrainage();
  checkWinterSurvival();
  return result;
};

const getPlantingDate = (seed) => {
  const [firstPeriod, secondPeriod] = seed.attributes['Planting and Growth Windows']['Reliable Establishment'].values;
  let secondStart; let secondEnd;
  const firstStart = dayjs(firstPeriod.split(' - ')[0]).format('MM/DD');
  const firstEnd = dayjs(firstPeriod.split(' - ')[1]).format('MM/DD');
  if (secondPeriod) {
    secondStart = dayjs(secondPeriod.split(' - ')[0]).format('MM/DD');
    secondEnd = dayjs(secondPeriod.split(' - ')[1]).format('MM/DD');
  }
  return [firstStart, firstEnd, secondStart, secondEnd];
};

const calculatePieChartData = (seeds, calculator, options = {}) => {
  const seedingRateArray = [];
  const plantsPerSqftArray = [];
  const seedsPerSqftArray = [];
  seeds.forEach((seed) => {
    seedingRateArray.push({
      name: seed.label,
      value: calculator.seedingRate(seed, options[seed.label]),
    });
    seedsPerSqftArray.push({
      name: seed.label,
      value: calculator.seedsPerAcre(seed, options[seed.label]) / 43560,
    });
    plantsPerSqftArray.push({
      name: seed.label,
      value: calculator.plantsPerSqft(seed, options[seed.label]),
    });
  });
  return { seedingRateArray, seedsPerSqftArray, plantsPerSqftArray };
};

const calculatePlantsandSeedsPerAcre = (seed, calculator, options, seedingRate = null, adjustedSeedingRate = null) => {
  const seeds = twoDigit(calculator.seedsPerAcre(
    seed,
    { ...options, percentOfRate: 1, ...(seedingRate !== null && { seedingRate }) },
  ));
  const plants = twoDigit(calculator.plantsPerAcre(
    seed,
    { ...options, percentOfRate: 1, ...(seedingRate !== null && { seedingRate }) },
  ));
  const adjustedSeeds = twoDigit(calculator.seedsPerAcre(
    seed,
    { ...options, ...(adjustedSeedingRate !== null && { seedingRate: adjustedSeedingRate }) },
  ));
  const adjustedPlants = twoDigit(calculator.plantsPerAcre(
    seed,
    { ...options, ...(adjustedSeedingRate !== null && { seedingRate: adjustedSeedingRate }) },
  ));
  return {
    plants, seeds, adjustedPlants, adjustedSeeds,
  };
};

export {
  convertToPercent, twoDigit,
  createUserInput, createCalculator, initialOptions, adjustProportionsMCCC,
  adjustProportionsNECCC, adjustProportionsSCCC, reviewMixMCCC, reviewMixNECCC, reviewMixSCCC, confirmPlan, checkNRCS,
  getPlantingDate, calculatePieChartData, calculatePlantsandSeedsPerAcre,
};
