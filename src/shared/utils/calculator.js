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
  console.log('Default Single Species Seeding Rate PLS :', defaultSingleSpeciesSeedingRatePLS);
  console.log('Default mix seeding Rate :', defaultMixSeedingRate);
  console.log('Percent of Rate :', percentOfRate);
  console.log('Seeding Rate :', seedingRate);

  console.log('Seeds Per Pound :', crop.seedsPerPound);
  console.log('Seeds Per Acre', seedsPerAcre);
  console.log('Plants Per Acre', plantPerAcre);
  console.log('Plants Per Sqft', plantPerSqft);
};

export {
  createUserInput, createCalculator, initialOptions, adjustProportions,
};
