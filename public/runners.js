/* eslint-disable */

function AdjustProportionsPage_Pea(pea_winter, calculator) {
  const crop = calculator.getCrop(pea_winter); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
  const defaultSingleSpeciesSeedingRatePLS =
    crop.coefficients.singleSpeciesSeedingRate;
  const defaultMixSeedingRate = calculator.mixSeedingRate(pea_winter, {
    plantingMethodModifier: 1,
  }); // here you can use either the pea_winter response object, or the crop interface. it does not matter.
  console.log("seeding rate: ", calculator.seedingRate(pea_winter));
  const seedsPerAcre = calculator.seedsPerAcre(pea_winter);
  const plantPerAcre = calculator.plantsPerAcre(pea_winter);
  const plantPerSqft = calculator.plantsPerSqft(pea_winter);
  console.log("\n> ", pea_winter.label, "- AdjustProportionsPage");
  console.log(
    "Default Single Species Seeding Rate PLS :",
    defaultSingleSpeciesSeedingRatePLS
  );
  console.log("Default mix seeding Rate :", defaultMixSeedingRate);
  console.log("Seeds Per Pound :", crop.seedsPerPound);
  console.log("Seeds Per Acre", seedsPerAcre);
  console.log("Plants Per Acre", plantPerAcre);
  console.log("Plants Per Sqft", plantPerSqft);
}

function AdjustProportionsPage_Rapeseed(rapeseed, calculator) {
  const options = {
    // values that are purely obtained from user input.
    acres: null, // if null or undefined, defaults to 1
    plantingMethod: null, // if null or undefined, default value will be generated.
    // these values are purley user input
    // but also only effect calculations when a value is provided.
    managementImpactOnMix: null, // if null or undefined, the managementImpactOnMix will not be considered ( no additional calculation will occur. )
    germination: null, // if null or undefined, the % germination will not be considered ( no additional calculation will occur. )
    purity: null, // if null or undefined, the % purity will not be considered ( no additional calculation will occur. )

    // values that have crop / static defaults
    singleSpeciesSeedingRate: 3, // if this is null or undefined, a default value will be generated.
    percentOfRate: 0.25, // if this is null or undefined, a default value will be generated.
    seedsPerPound: null, // if null or undefined, it will be extracted from crop object
    percentSurvival: null, // if null or undefined, defaults to 0.85 (85%)

    // values that are calculations
    seedsPerAcre: null, // if null or undefined, this will be calculated using other options provided or default values.
    plantingMethodModifier: 1, // if this is null or undefined, it will be calculated using options provided or default values.
    mixSeedingRate: null, // if null or undefined, it will be calculated other options provided or default values.
  };
  /**
   * NOTE:
   * On this page, we want to calculate the base seeding without any additional modifier,
   * so we nulled out all of our options, and gave plantingMethodModifier a 1
   * We needed to pass 1 as the plantingMethodModifier, because we initialized the calculator with
   * a plantingMethod of 'Precision' which will cause the calculator to generate a plantingMethodModifier value
   * for the mixSeedingRate, passing in a 1 will override the need to calculate the plantingMethodModifier.
   */
  const crop = calculator.getCrop(rapeseed); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
  const defaultSingleSpeciesSeedingRatePLS =
    options.singleSpeciesSeedingRate ??
    crop.coefficients.singleSpeciesSeedingRate;
  const defaultMixSeedingRate = calculator.mixSeedingRate(rapeseed, options); // here you can use either the pea_winter response object, or the crop interface. it does not matter.
  const seedsPerAcre = calculator.seedsPerAcre(rapeseed, options);
  const plantPerAcre = calculator.plantsPerAcre(rapeseed, options);
  const plantPerSqft = calculator.plantsPerSqft(rapeseed, options);

  console.log("\n> ", rapeseed.label, "- AdjustProportionsPage");
  console.log(
    "Default Single Species Seeding Rate PLS :",
    defaultSingleSpeciesSeedingRatePLS
  );
  console.log("Default mix seeding Rate :", defaultMixSeedingRate);
  console.log("Seeds Per Pound :", crop.seedsPerPound);
  console.log("Seeds Per Acre", seedsPerAcre);
  console.log("Plants Per Acre", plantPerAcre);
  console.log("Plants Per Sqft", plantPerSqft);
}

function ReviewYourMixPage_Oat(oat_spring, calculator) {
  const options = {
    // values that are purely obtained from user input.
    acres: 50, // if null or undefined, defaults to 1
    plantingMethod: "Drilled", // if null or undefined, default value will be generated.
    // these values are purley user input
    // but also only effect calculations when a value is provided.
    managementImpactOnMix: 0.57, // if null or undefined, the managementImpactOnMix will not be considered ( no additional calculation will occur. )
    germination: 0.85, // if null or undefined, the % germination will not be considered ( no additional calculation will occur. )
    purity: 0.95, // if null or undefined, the % purity will not be considered ( no additional calculation will occur. )

    // values that have crop / static defaults
    singleSpeciesSeedingRate: 45, // if this is null or undefined, a default value will be generated.
    percentOfRate: null, // if this is null or undefined, a default value will be generated.
    seedsPerPound: null, // if null or undefined, it will be extracted from crop object
    percentSurvival: null, // if null or undefined, defaults to 0.85 (85%)

    // values that are calculations
    seedsPerAcre: null, // if null or undefined, this will be calculated using other options provided or default values.
    plantingMethodModifier: 1, // if this is null or undefined, it will be calculated using options provided or default values.
    mixSeedingRate: null, // if null or undefined, it will be calculated other options provided or default values.
  };

  const crop = calculator.getCrop(oat_spring); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
  const singleSpeciesSeedingRate =
    options.singleSpeciesSeedingRate ??
    crop.coefficients.singleSpeciesSeedingRate;
  const percentOfSingleSpeciesRate =
    options.percentOfRate ??
    calculator.getDefaultPercentOfSingleSpeciesSeedingRate(oat_spring);
  // here we want the base seeding rate, so we need to pass in only the singleSpeciesSeedingRate, percentOfRate, and plantingMethodModifier = 1
  const baseMixSeedingRate = calculator.mixSeedingRate(oat_spring, {
    singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
    percentOfRate: options.percentOfRate,
    plantingMethodModifier: 1,
  });
  // here we want to account for planting method modifier so we pass in the planting method,
  // you could also pass in plantingMethodModifier if you have pre-calculated it else ware.
  const mixSeedingRateAfterPlantingMethodModifier = calculator.mixSeedingRate(
    oat_spring,
    {
      singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
      percentOfRate: options.percentOfRate,
      plantingMethod: options.plantingMethod,
      plantingMethodModifier: options.plantingMethodModifier, // if this is null, it will be calculated with the plantingMethod option.
    }
  );

  const mixSeedingRateAfterManagementImpact = calculator.mixSeedingRate(
    oat_spring,
    {
      singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
      percentOfRate: options.percentOfRate,
      plantingMethod: options.plantingMethod,
      plantingMethodModifier: options.plantingMethodModifier, // if this is null, it will be calculated with the plantingMethod option.
      managementImpactOnMix: options.managementImpactOnMix, // this does not have a default value, and if it is null or undefined the operation will be ignored.
    }
  );

  const mixSeedingRateAfterPurityAndGermination = calculator.mixSeedingRate(
    oat_spring,
    {
      singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
      percentOfRate: options.percentOfRate,
      plantingMethod: options.plantingMethod,
      plantingMethodModifier: options.plantingMethodModifier, // if this is null, it will be calculated with the plantingMethod option.
      managementImpactOnMix: options.managementImpactOnMix, // this does not have a default value, and if it is null or undefined the operation will be ignored.
      purity: options.purity, // this does not have a default value, and if it is null or undefined the operation will be ignored.
      germination: options.germination, // this does not have a default value, and if it is null or undefined the operation will be ignored.
    }
  );

  const bulkSeedingRate = mixSeedingRateAfterPurityAndGermination;

  const poundsForPurchase = calculator.poundsForPurchase(oat_spring, {
    acres: options.acres,
    mixSeedingRate: bulkSeedingRate,
  });

  console.log("\n> ", oat_spring.label, "- ReviewYourMixPage");
  console.log("Single Species Seeding Rate PLS :", singleSpeciesSeedingRate);
  console.log("% of single species rate :", percentOfSingleSpeciesRate);
  console.log("Base mix seeding Rate :", baseMixSeedingRate);
  console.log(
    "Mix Seeding rate after planting method modifier (Step 3)",
    mixSeedingRateAfterPlantingMethodModifier
  );
  console.log(
    "Mix seeding rate after management impact (Step 4)",
    mixSeedingRateAfterPlantingMethodModifier
  );
  console.log(
    "Mix seeding rate after germination and purity (Step 4)",
    mixSeedingRateAfterPurityAndGermination
  );
  console.log("Bulk Seeding Rate", bulkSeedingRate);
  console.log("Acres", options.acres ?? 1);
  console.log("Pounds for purchase", poundsForPurchase);
}

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
async function nrcsCheckSeedingRateWithNoNRCSStandardData(calculator) {
  console.log("\n\n-------------------------------------");
  console.log("Running NRCS Seeding Rate Check");
  console.log("-------------------------------------");

  console.log("Using default values:");
  const result = calculator.nrcs.mixPassesSeedingRateStandards();

  console.log("Passed:", result.passed);

  const options = {
    148: {
      // pea
      // here we give a very 250% managementImpactOnMix, resulting in a finalMixSeedingRate which will be too high.
      // this is meant to immitate the user setting their own managementImpactOnMix rather than using our default.
      managementImpactOnMix: 2.5,
    },
    23: {
      // oat
      // here we set our percentOfRate to 1% which results in a finalMixSeedingRate which will be too low.
      // this is meant to immitate the user using a custom value in place of our default percentOfRate.
      percentOfRate: 0.01,
    },
    161: {
      // rapeseed
      // use rapeseeds default settings. which will cause it to pass.
    },
  };

  console.log("Mimicing user provided bad values:");
  const failedResult = calculator.nrcs.mixPassesSeedingRateStandards(options);
  console.log("Passed:", failedResult.passed);

  printNrcsFailureErrors(failedResult.errors);
}

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
async function nrcsCheckPlantingDate(calculator) {
  console.log("\n\n-------------------------------------");
  console.log("Running NRCS Planting Date Check");
  console.log("-------------------------------------");

  console.log("Using default values:");
  const result = calculator.nrcs.mixPassesPlantingDateStandards({
    plantingDate: "3/31",
  });

  console.log("Passed:", result.passed);

  console.log("Mimicing user provided bad values:");
  const failedResult = calculator.nrcs.mixPassesPlantingDateStandards({
    plantingDate: "3/30",
  });
  console.log("Passed:", failedResult.passed);

  printNrcsFailureErrors(failedResult.errors);
}

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
async function nrcsCheckPercentInMix(calculator) {
  console.log("\n\n-------------------------------------");
  console.log("Running NRCS Percent In Mix Check");
  console.log("-------------------------------------");

  console.log("Using default values:");
  const result = calculator.nrcs.mixPassesRatioStandards();
  console.log("Passed:", result.passed);

  console.log("Mimicing user provided bad values:");

  const options = {
    148: {
      // pea
      // because pea's is default % in mix limit is 100%, we are going to provide a custom % in mix limit
      // to force it to fail. Based on the value we provided for rapeseed,
      // the estimated % of peas in the mix is rought 1.5% of the mix.
      // so we are going to set the maxInMix to 1% for oats, which will cause this to fail as well.
      // maxInMix: 0.01
    },
    23: {
      // oat
    },
    161: {
      // rapeseed
      // Rapeseed is the only 1 of these three that has a limit less that 100%
      // here we are saying that we want to use 500% of the baseSeedingRate.
      // This will effectively cause the % of rapeseed in the mix to be higher than 60% ( which is rapeseeds default % in mix limit.)
      percentOfRate: 5,
    },
  };

  const failedResult = calculator.nrcs.mixPassesRatioStandards(options);
  console.log("Passed:", failedResult.passed);

  printNrcsFailureErrors(failedResult.errors);
}

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
// async function nrcsCheckPlantingDate(calculator) {
//   console.log("\n\n-------------------------------------");
//   console.log("Running NRCS Planting Date Check");
//   console.log("-------------------------------------");

//   console.log("Using default values:");
//   const result = calculator.nrcs.mixPassesPlantingDateStandards({
//     plantingDate: "3/31",
//   });
//   console.log("Passed:", result.passed);

//   console.log("Mimicing user provided bad values:");

//   const failedResult = calculator.nrcs.mixPassesPlantingDateStandards({
//     plantingDate: "3/29",
//   });
//   console.log("Passed:", failedResult.passed);

//   printNrcsFailureErrors(failedResult.errors);
// }

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
async function nrcsCheckSoilDrainage(calculator) {
  console.log("\n\n-------------------------------------");
  console.log("Running NRCS Soil Drainage Check");
  console.log("-------------------------------------");

  console.log("Using default values:");
  const result = calculator.nrcs.mixPassesSoilDrainageStandards({
    soilDrainage: ["Well Drained"],
  });
  console.log("Passed:", result.passed);

  console.log("Mimicing user provided bad values:");

  const failedResult = calculator.nrcs.mixPassesSoilDrainageStandards({
    soilDrainage: ["Well Drained", "Excessively Drained"],
  });
  console.log("Passed:", failedResult.passed);

  printNrcsFailureErrors(failedResult.errors);
}

/**
 * mimics data found at Airtable as of 6/9/2023
 * https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
async function nrcsCheckWinterSurvival(calculator) {
  console.log("\n\n-------------------------------------");
  console.log("Running NRCS Winter Survival Check");
  console.log("-------------------------------------");

  console.log("Using default values:");
  const result = calculator.nrcs.mixPassesWinterSurvivalStandards();
  console.log("Passed:", result.passed);

  /**
   * Here we pass in a custom threshold of 60%
   * The default threshold is 50%
   *
   * We use 60% here because based on the values present at the time of 6/12/23
   * we know that this mix's default values have a winter survivability of 55%.
   */
  console.log("Failed (custom threshold):");
  const failedToMeetThresholdResult =
    calculator.nrcs.mixPassesWinterSurvivalStandards({ threshold: 0.6 });
  console.log("Passed:", failedToMeetThresholdResult.passed);
  printNrcsFailureErrors(failedToMeetThresholdResult.errors);

  /**
   * Here we pass in custom % winter survivability per crop.
   *
   * for demo-ing purposes only use one of the two failure options at a time.
   */
  console.log("Failed (custom crop values):");
  const options = {
    148: {
      // pea
    },
    23: {
      // oat
      // here we set the seedPerAcre to a super high number, causing this mix to be mostly oats.
      // oats by default has a 40% change of winter survival
      // this means if the mix is mostly oats, the mix will have a winter survival close t 40%.
      // which does not meet the default threshold of 50%.
      seedsPerAcre: 99999999,
    },
    161: {
      // rapeseed
      // another way to cause failure is by changing the chanceWinterSurvival
      // in this mix, rapeseeds default chance is 21% (0.21)
      // so by changing this to 10% (0.1) we ensure that the mix will not meet the 50% threshold.
      // chanceWinterSurvival: 0.1
    },
  };

  const failedResult =
    calculator.nrcs.mixPassesWinterSurvivalStandards(options);
  console.log("Passed:", failedResult.passed);

  printNrcsFailureErrors(failedResult.errors);
}
