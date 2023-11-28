/* eslint-disable no-unused-vars */
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

const checkNRCS = (seeds, calculator, options) => {
  // build options for NRCS
  // const NRCSOptions = {};
  // seeds.forEach((seed) => {
  //   NRCSOptions[seed.id] = options[seed.label];
  // });
  // console.log(NRCSOptions);

  // manually calculate percent in mix, the result is same as sdk
  const calculatePercentInMix = () => {
    const result = {};
    let sumSeedsPerAcre = 0;
    seeds.forEach((seed) => {
      const seedsPerAcre = calculator.seedsPerAcre(seed, options[seed.label]);
      sumSeedsPerAcre += seedsPerAcre;
      result[seed.label] = seedsPerAcre;
    });
    seeds.forEach((seed) => {
      result[seed.label] /= sumSeedsPerAcre;
    });
    return result;
  };

  const seedsPercentInMix = calculatePercentInMix();
  // console.log('seedsPercentInMix', seedsPercentInMix);

  const checkSeedingRate = () => {
    console.log('-----------Seeding Rate:');
    seeds.forEach((seed) => {
      const seedOption = options[seed.label];
      const baseSeedingRate = calculator.seedingRate(seed, {
        singleSpeciesSeedingRate: seedOption?.singleSpeciesSeedingRate,
      });
      const finalSeedingRate = calculator.seedingRate(seed, seedOption);
      const UPPER_LIMIT = baseSeedingRate * 2.5;
      const LOWER_LIMIT = baseSeedingRate * 0.5;
      console.log(
        seed.label,
        finalSeedingRate,
        LOWER_LIMIT,
        UPPER_LIMIT,
        calculator.nrcs.isValidSeedingRate(seed, seedOption),
      );
    });
  };

  const checkPlantingDate = () => {
    // FIXME: frontend checks for reliable establishment, while sdk checks more, early and late seeding
    console.log('-----------Planting Date:');
    seeds.forEach((seed) => {
      const { plannedPlantingDate } = options[seed.label];

      console.log(seed.label, plannedPlantingDate);
    });
  };

  const checkRatio = () => {
    console.log('-----------Ratio(Percent In Mix):');
    seeds.forEach((seed) => {
      const percentInMix = calculator.percentInMix(seed, options);
      const maxInMix = parseFloat(seed.attributes.Coefficients['Max % Allowed in Mix'].values[0]);
      console.log(seed.label, percentInMix, maxInMix);
      const result = calculator.nrcs.isValidPercentInMix(seed, options);
      console.log(result);
    });
    // TODO: the result is same
    // seeds.forEach((seed) => {
    //   const percentInMix = seedsPercentInMix[seed.label];
    //   const maxInMix = parseFloat(seed.attributes.Coefficients['Max % Allowed in Mix'].values[0]);
    //   console.log(seed.label, percentInMix, '<=', maxInMix, percentInMix <= maxInMix);
    // });
  };

  const checkSoilDrainage = () => {
    console.log('-----------Soil Drainage:');
    seeds.forEach((seed) => {
      const { soilDrainage } = options[seed.label];
      const soilDrainages = seed.attributes['Soil Conditions']?.['Soil Drainage'].values ?? [];
      console.log(seed.label, soilDrainage, soilDrainages, soilDrainages.indexOf(soilDrainage) > -1);
    });
  };

  const checkWinterSurvival = (threshold = 0.5) => {
    console.log('-----------Winter Survivability:');
    let chanceOfMixSurvival = 0.00;
    seeds.forEach((seed) => {
      const percentInMix = calculator.percentInMix(seed, options);
      const winterSurvivability = options[seed.label].percentSurvival;
      chanceOfMixSurvival += percentInMix * winterSurvivability;
    });
    console.log(chanceOfMixSurvival, '>=', 0.5, chanceOfMixSurvival >= 0.5);
  };

  // checkSeedingRate();
  checkPlantingDate();
  // checkRatio();
  // checkSoilDrainage();
  // checkWinterSurvival();
};

export {
  createUserInput, createCalculator, initialOptions, adjustProportions, reviewMix, checkNRCS,
};
