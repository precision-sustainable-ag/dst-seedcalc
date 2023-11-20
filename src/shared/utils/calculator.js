const createUserInput = (soilDrainage, plantingDate, acres) => ({ soilDrainage, plantingDate, acres });

// eslint-disable-next-line no-undef
const createCalculator = (mix, council, userInput) => new SeedRateCalculator({ mix, council, userInput });

const adjustProportions = (seed, calculator) => {
  const crop = calculator.getCrop(seed);
  // loads standardized crop interface,
  // this is best for when you need to access properties of the crop itself,
  // because this object will be standardized across all councils.
  // and provides standard dot notation property accessors.
  const defaultSingleSpeciesSeedingRatePLS = crop.coefficients.singleSpeciesSeedingRate;
  const defaultMixSeedingRate = calculator.mixSeedingRate(seed, { plantingMethodModifier: 1 });
  // here you can use either the seed response object, or the crop interface. it does not matter.
  const seedsPerAcre = calculator.seedsPerAcre(seed);
  const plantPerAcre = calculator.plantsPerAcre(seed);
  const plantPerSqft = calculator.plantsPerSqft(seed);
  console.log('\n> ', seed.label, '- AdjustProportionsPage');
  console.log('Default Single Species Seeding Rate PLS :', defaultSingleSpeciesSeedingRatePLS);
  console.log('Default mix seeding Rate :', defaultMixSeedingRate);
  console.log('Seeds Per Pound :', crop.seedsPerPound);
  console.log('Seeds Per Acre', seedsPerAcre);
  console.log('Plants Per Acre', plantPerAcre);
  console.log('Plants Per Sqft', plantPerSqft);
};

export { createUserInput, createCalculator, adjustProportions };
