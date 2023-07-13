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
    case "percentageDivide":
      return parseFloat(nums[0] / parseFloat(nums[1]) / 100);
    default:
      return;
  }
};

export const calculateAveragePercentage = (nums) => {
  const total = nums.reduce((a, b) => a + b);
  const average = total / nums.length;
  return average * 100;
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
        val: calculateInt(
          [seed.seedsPerPound, seed.mixSeedingRate],
          "multiply"
        ),
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

export const calculateAllMixValues = (prevSeed, siteCondition) => {
  let seed = { ...prevSeed };
  seed.step1Result = calculateReviewMix("step1", seed, siteCondition).val;
  seed.step2Result = calculateReviewMix("step2", seed, siteCondition).val;
  seed.step3Result = calculateReviewMix("step3", seed, siteCondition).val;
  seed.bulkSeedingRate = calculateReviewMix("step4", seed, siteCondition).val;
  seed.poundsForPurchase = calculateReviewMix("step5", seed, siteCondition).val;
  return seed;
};

export const calculateReviewMix = (step, seed, siteCondition) => {
  switch (step) {
    case "step1":
      return {
        key: "step1Result",
        val: calculateInt(
          [seed.singleSpeciesSeedingRatePLS, seed.percentOfSingleSpeciesRate],
          "percentage"
        ),
      };
    case "step2":
      return {
        key: "step2Result",
        val: calculateInt([seed.step1Result, seed.plantingMethod], "multiply"),
      };
    case "step3":
      return {
        key: "step3Result",
        val: calculateInt(
          [
            seed.step2Result,
            calculateInt(
              [seed.step2Result, seed.managementImpactOnMix],
              "percentage"
            ),
          ],
          "add"
        ),
      };
    case "step4":
      return {
        key: "bulkSeedingRate",
        val:
          seed.step3Result /
          (seed.germinationPercentage / 100) /
          (seed.purityPercentage / 100),
      };
    case "step5":
      return {
        key: "poundsForPurchase",
        val: calculateInt(
          [seed.bulkSeedingRate, siteCondition.acres],
          "multiply"
        ),
      };
    default:
      return;
  }
};

/* Review mix end */

/* Confirm plan start */

export const calculateAllConfirmPlan = (prevSeed) => {
  const seed = { ...prevSeed };
  seed.totalPounds = calculateInt(
    [seed.bulkLbsPerAcre, seed.acres],
    "multiply"
  );
  seed.totalCost = calculateInt(
    [seed.costPerPound, seed.totalPounds],
    "multiply"
  );
  return seed;
};
/* Confirm plan end */

/* Calculate NRCS start */

export const calculateNRCSStandards = (i, seeds) => {
  const NRCS = {
    seedingRate: {
      type: "number",
      expect: seeds[i]["MCCC Seeding Rate"] / seeds.length,
      result: 0,
    },
    plantingDate: {
      type: "boolean",
      expect: true,
      result: false,
    },
    soilDrainage: {
      type: "number",
      expect: 0,
      result: 0,
    },
    expectedWinterSurvival: {
      type: "string",
      expect: "",
      result: 0,
    },
  };
};

/* Calculate NRCS end */

export const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

export const convertAcresToSqft = (number) => {
  return number * 43560;
};

export const convertSqftToAcres = (number) => {
  return number / 43560;
};

export const convertToDecimal = (percent) => {
  return parseFloat(percent) / 100;
};
