const createUserInput = (soilDrainage, plantingDate, acres) => ({ soilDrainage, plantingDate, acres });

// eslint-disable-next-line no-undef
const createCalculator = (mix, council, userInput) => new SeedRateCalculator({ mix, council, userInput });

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
};

const adjustProportions = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const defaultSingleSpeciesSeedingRatePLS = crop.coefficients.singleSpeciesSeedingRate;

  // TODO: when using these funcs, all the OPTION param should be same since some of them may call others
  // FIXME: the mixSeedingRate is not correct here
  // const defaultMixSeedingRate = calculator.mixSeedingRate(seed, options);

  const seedingRate = calculator.seedingRate(seed, options);
  const seedsPerAcre = calculator.seedsPerAcre(seed, options);
  // options in calculating plants per acre
  const plantPerAcre = calculator.plantsPerAcre(seed, options);
  const plantPerSqft = calculator.plantsPerSqft(seed, options);

  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  // console.log('Default Mix Seeding Rate: ', defaultMixSeedingRate);
  console.log('Default Single Species Seeding Rate PLS * Percent of Rate = Seeding Rate');
  console.log(defaultSingleSpeciesSeedingRatePLS, ' * ', options.percentOfRate, ' = ', seedingRate);

  console.log('Seeds Per Pound * Seeding Rate = Seeds Per Acre');
  console.log(crop.seedsPerPound, ' * ', seedingRate, ' = ', seedsPerAcre);
  console.log('Seeds Per Acre * %Survival = Plants Per Acre');
  console.log(seedsPerAcre, ' * ', options.percentSurvival, ' = ', plantPerAcre);
  console.log('Plants Per Acre / Sqft Per Acre = Plants Per Sqft');
  console.log(plantPerAcre, ' / ', 43560, ' = ', plantPerSqft);
};

const reviewMix = (seed, calculator, options = {}) => {
  const crop = calculator.getCrop(seed);
  const singleSpeciesSeedingRate = options.singleSpeciesSeedingRate ?? crop.coefficients.singleSpeciesSeedingRate;
  const percentOfSingleSpeciesRate = options.percentOfRate ?? calculator.getDefaultPercentOfSingleSpeciesSeedingRate(seed);

  const baseSeedingRate = calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethodModifier: 1,
  });

  const seedingRateAfterPlantingMethodModifier = calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
  });

  const seedingRateAfterManagementImpact = calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
  });

  const seedingRateAfterPurityAndGermination = calculator.seedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
    purity: options.purity,
    germination: options.germination,
  });

  const bulkSeedingRate = seedingRateAfterPurityAndGermination;

  const poundsForPurchase = calculator.poundsForPurchase(seed, {
    acres: options.acres,
    seedingRate: bulkSeedingRate,
  });

  console.log('\n> ', seed.label, '- ReviewYourMixPage');
  // console.log('1.Single Species Seeding Rate:', singleSpeciesSeedingRate);
  // // console.log('% of single species rate :', percentOfSingleSpeciesRate);
  // console.log('2.Base mix seeding Rate :', baseseedingRate);
  // console.log('3.Mix Seeding rate after planting method modifier', seedingRateAfterPlantingMethodModifier);
  // console.log('4.Mix seeding rate after management impact', seedingRateAfterManagementImpact);
  // console.log('5.Mix seeding rate after germination and purity', seedingRateAfterPurityAndGermination);

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
  console.log(seedingRateAfterManagementImpact, ' / ', options.purity, ' / ', options.germination, ' = ', seedingRateAfterPurityAndGermination);
  console.log('5. Bulk Seeding Rate * Acres = Pounds for purchase');
  console.log(bulkSeedingRate, ' * ', options.acres, ' = ', poundsForPurchase);
};

export {
  createUserInput, createCalculator, initialOptions, adjustProportions, reviewMix,
};
