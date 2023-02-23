export const calculateInt = (nums, type) => {
  switch (type) {
    case "add":
      return parseFloat(nums[0]) + parseFloat(nums[1]);
    case "subtract":
      return parseFloat(nums[0]) - parseFloat(nums[1]);
    case "multiply":
      return parseFloat(nums[0]) * parseFloat(nums[1]);
    case "divide":
      return parseFloat(nums[0]) / parseFloat(nums[1]);
    case "percentage":
      return parseFloat(nums[0]) * (parseFloat(nums[1]) / 100);
    default:
      return;
  }
};

/* Mix Ratios Calculate Logic */

export const calculateAllValues = (prevSeed) => {
  let seed = { ...prevSeed };
  seed.mixSeedingRate = calculateSeeds("step1", seed).val;
  seed.seedsPerAcre = calculateSeeds("step2", seed).val;
  seed.plantsPerAcre = calculateSeeds("step3", seed).val;
  seed.aproxPlantsSqFt = calculateSeeds("step4", seed).val;
  return seed;
};
export const calculateSeeds = (step, seed) => {
  switch (step) {
    case "step1":
      return {
        key: "mixSeedingRate",
        val: calculateInt(
          [seed.singleSpeciesSeedingRatePLS, seed.percentOfSingleSpeciesRate],
          "percentage"
        ),
      };
    case "step2":
      return {
        key: "seedsPerAcre",
        val: calculateInt([seed.seedsPound, seed.mixSeedingRate], "multiply"),
      };
    case "step3":
      return {
        key: "plantsPerAcre",
        val: calculateInt(
          [seed.seedsPerAcre, seed.percentSurvival],
          "percentage"
        ),
      };
    case "step4":
      return {
        key: "aproxPlantsSqFt",
        val: calculateInt([seed.plantsPerAcre, seed.sqFtAcre], "divide"),
      };
    default:
      return;
  }
};

/* Review Mix Calculate logic */

export const calculateAllMixValues = (prevSeed) => {
  let seed = { ...prevSeed };
  seed.mixSeedingRate = calculateReviewMix("step1", seed).val;
  seed.step2Result = calculateReviewMix("step2", seed).val;
  seed.step3Result = calculateReviewMix("step3", seed).val;
  seed.bulkSeedingRate = calculateReviewMix("step4", seed).val;
  seed.poundsForPurchase = calculateReviewMix("step5", seed).val;
  return seed;
};

export const calculateReviewMix = (step, seed) => {
  switch (step) {
    case "step1":
      return {
        key: "mixSeedingRate",
        val: calculateInt(
          [seed.singleSpeciesSeedingRatePLS, seed.percentOfSingleSpeciesRate],
          "percentage"
        ),
      };
    case "step2":
      return {
        key: "step2Result",
        val: calculateInt(
          [seed.step2MixSeedingRatePLS, seed.plantingMethod],
          "multiply"
        ),
      };
    case "step3":
      return {
        key: "step3Result",
        val: calculateInt(
          [
            seed.step2Result,
            calculateInt(
              [seed.step3MixSeedingRatePLS, seed.managementImpactOnMix],
              "multiply"
            ),
          ],
          "divide"
        ),
      };
    case "step4":
      return {
        key: "bulkSeedingRate",
        val: calculateInt(
          [
            seed.step3Result,
            calculateInt(
              [seed.germinationPercentage, seed.purityPercentage],
              "divide"
            ),
          ],
          "divide"
        ),
      };
    case "step5":
      return {
        key: "poundsForPurchase",
        val: calculateInt([seed.bulkSeedingRate, seed.acres], "divide"),
      };
    default:
      return;
  }
};

/* Review mix end */

export const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};
