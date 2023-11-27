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

  // const percentSurvival = seed.attributes.Coefficients['% Chance of Winter Survial'].values[0];

  // const options = { plantingMethodModifier: 1, percentSurvival };
  // TODO: when using these funcs, all the OPTION param should be same since some of them may call others
  const defaultMixSeedingRate = calculator.mixSeedingRate(seed, options);
  const seedingRate = calculator.seedingRate(seed, options);
  const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop, options);
  const seedsPerAcre = calculator.seedsPerAcre(seed, options);
  // options in calculating plants per acre
  const plantPerAcre = calculator.plantsPerAcre(seed, options);
  const plantPerSqft = calculator.plantsPerSqft(seed, options);

  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  console.log('Default Mix Seeding Rate: ', defaultMixSeedingRate);
  console.log('Default Single Species Seeding Rate PLS * Percent of Rate = Seeding Rate');
  console.log(defaultSingleSpeciesSeedingRatePLS, ' * ', percentOfRate, ' = ', seedingRate);

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

  const baseMixSeedingRate = calculator.mixSeedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethodModifier: 1,
  });

  const mixSeedingRateAfterPlantingMethodModifier = calculator.mixSeedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
  });

  const mixSeedingRateAfterManagementImpact = calculator.mixSeedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
  });

  const mixSeedingRateAfterPurityAndGermination = calculator.mixSeedingRate(seed, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethod: options.plantingMethod,
    plantingMethodModifier: options.plantingMethodModifier,
    managementImpactOnMix: options.managementImpactOnMix,
    purity: options.purity,
    germination: options.germination,
  });

  const bulkSeedingRate = mixSeedingRateAfterPurityAndGermination;

  const poundsForPurchase = calculator.poundsForPurchase(seed, {
    acres: options.acres,
    seedingRate: bulkSeedingRate,
  });

  console.log('\n> ', seed.label, '- ReviewYourMixPage');
  console.log('1.Single Species Seeding Rate:', singleSpeciesSeedingRate);
  // console.log('% of single species rate :', percentOfSingleSpeciesRate);
  console.log('2.Base mix seeding Rate :', baseMixSeedingRate);
  console.log('3.Mix Seeding rate after planting method modifier', mixSeedingRateAfterPlantingMethodModifier);
  console.log('4.Mix seeding rate after management impact', mixSeedingRateAfterManagementImpact);
  console.log('5.Mix seeding rate after germination and purity', mixSeedingRateAfterPurityAndGermination);

  console.log('1.Single Species Seeding Rate * Percent of Rate = Mix Seeding Rate');
  console.log(singleSpeciesSeedingRate, ' * ', percentOfSingleSpeciesRate, ' = ', baseMixSeedingRate);
  console.log('2.Mix Seeding Rate * Planting Method = Mix Seeding Rate');
  console.log(baseMixSeedingRate, ' * ', options.plantingMethodModifier, ' = ', mixSeedingRateAfterPlantingMethodModifier);
  console.log('3.Mix Seeding Rate + Mix Seeding Rate * Management Impact = Mix Seeding Rate');
  console.log(
    mixSeedingRateAfterPlantingMethodModifier,
    ' + ',
    mixSeedingRateAfterPlantingMethodModifier,
    ' * ',
    options.managementImpactOnMix,
    ' = ',
    mixSeedingRateAfterManagementImpact,
  );
  console.log('4. Mix Seeding Rate / Germination / Purity = Bulk Seeding Rate');
  console.log(mixSeedingRateAfterManagementImpact, ' / ', options.purity, ' / ', options.germination, ' = ', mixSeedingRateAfterPurityAndGermination);
  console.log('5. Bulk Seeding Rate * Acres = Pounds for purchase');
  console.log(bulkSeedingRate, ' * ', options.acres, ' = ', poundsForPurchase);
};

export {
  createUserInput, createCalculator, initialOptions, adjustProportions, reviewMix,
};
