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

export const calculateAllValues = (prevSeed, data) => {
  let seed = { ...prevSeed };
  const percentInGroup = generatePercentInGroup(
    prevSeed,
    data.speciesSelection.seedsSelected
  );
  console.log("percentingroup", percentInGroup);
  seed.mixSeedingRate = Math.round(calculateSeeds("step1", seed).val);
  seed.seedsPerAcre = Math.round(calculateSeeds("step2", seed).val);
  seed.plantsPerAcre = Math.round(calculateSeeds("step3", seed).val);
  seed.aproxPlantsSqFt = Math.round(calculateSeeds("step4", seed).val);
  return seed;
};
export const calculateAllValuesNECCC = (prevSeed, data) => {
  let seed = { ...prevSeed };
  console.log("prev ", prevSeed, data);
  const percentInGroup = generatePercentInGroup(
    prevSeed,
    data.speciesSelection.seedsSelected
  );
  console.log("percentingroup", percentInGroup);
  seed.mixSeedingRate = Math.round(
    calculateSeedsNECCC("step1", seed, data).val
  );
  seed.seedsPerAcre = Math.round(calculateSeedsNECCC("step2", seed, data).val);
  seed.aproxPlantsSqFt = Math.round(
    calculateSeedsNECCC("step3", seed, data).val
  );
  return seed;
};
export const calculateSeeds = (step, seed) => {
  switch (step) {
    case "step1":
      return {
        key: "mixSeedingRate",
        val: calculateInt(
          [seed.singleSpeciesSeedingRatePLS, seed.percentOfSingleSpeciesRate],
          "multiply"
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
          [seed.seedsPerAcre, seed.percentChanceOfWinterSurvival],
          "multiply"
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

export const calculateSeedsNECCC = (step, seed, { speciesSelection }) => {
  switch (step) {
    case "step1":
      return {
        key: "mixSeedingRate",
        val: calculateInt(
          [
            generatePercentInGroup(seed, speciesSelection.seedsSelected),
            calculateInt(
              [
                seed.singleSpeciesSeedingRatePLS,
                convertToDecimal(seed.percentOfSingleSpeciesRate),
              ],
              "multiply"
            ),
          ],
          "multiply"
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
        key: "aproxPlantsSqFt",
        val: calculateInt([seed.seedsPerAcre, seed.sqFtAcre], "divide"),
      };
    default:
      return;
  }
};

/* Review Mix Calculate logic */

export const calculateAllMixValues = (prevSeed, data) => {
  console.log("data", data);
  generatePercentInGroup(prevSeed, data.speciesSelection.seedsSelected);
  let seed = { ...prevSeed };
  seed.step1Result = Math.round(calculateReviewMix("step1", seed, data).val);
  seed.step2Result = Math.round(calculateReviewMix("step2", seed, data).val);
  seed.step3Result = Math.round(calculateReviewMix("step3", seed, data).val);
  seed.bulkSeedingRate = Math.round(
    calculateReviewMix("step4", seed, data).val
  );
  seed.poundsForPurchase = Math.round(
    calculateReviewMix("step5", seed, data).val
  );
  return seed;
};
export const generatePercentInGroup = (seed, seeds) => {
  const group = seed.group.label;
  let count = 0;
  seeds.map((s, i) => {
    s.group.label === group && count++;
  });
  console.log("count...", group, count);
  return 1 / count;
};
export const calculateAllMixValuesNECCC = (prevSeed, data) => {
  console.log("data", data);
  generatePercentInGroup(prevSeed, data.speciesSelection.seedsSelected);
  let seed = { ...prevSeed };
  seed.step1Result = Math.round(
    calculateReviewMixNECCC("step1", seed, data).val
  );
  seed.step2Result = Math.round(
    calculateReviewMixNECCC("step2", seed, data).val
  );
  seed.step3Result = Math.round(
    calculateReviewMixNECCC("step3", seed, data).val
  );
  seed.bulkSeedingRate = Math.round(
    calculateReviewMixNECCC("step4", seed, data).val
  );
  seed.poundsForPurchase = Math.round(
    calculateReviewMixNECCC("step5", seed, data).val
  );
  return seed;
};

export const calculateReviewMix = (
  step,
  seed,
  { siteCondition, seedingMethod }
) => {
  switch (step) {
    case "step1":
      return {
        key: "step1Result",
        val: calculateInt(
          [
            seed.singleSpeciesSeedingRatePLS,
            convertToDecimal(seed.percentOfSingleSpeciesRate),
          ],
          "multiply"
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
              [seed.step2Result, seedingMethod.managementImpactOnMix],
              "multiply"
            ),
          ],
          "add"
        ),
      };
    case "step4":
      return {
        key: "bulkSeedingRate",
        val:
          seed.step3Result / seed.germinationPercentage / seed.purityPercentage,
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

export const calculateReviewMixNECCC = (
  step,
  seed,
  { siteCondition, speciesSelection }
) => {
  console.log(
    "convertToDecimal(seed.percentOfSingleSpeciesRate)",
    convertToDecimal(seed.percentOfSingleSpeciesRate)
  );
  switch (step) {
    case "step1":
      return {
        key: "step1Result",
        val: calculateInt(
          [
            generatePercentInGroup(seed, speciesSelection.seedsSelected),
            calculateInt(
              [
                seed.singleSpeciesSeedingRatePLS,
                convertToDecimal(seed.percentOfSingleSpeciesRate),
              ],
              "multiply"
            ),
          ],
          "multiply"
        ),
      };
    case "step2":
      return {
        key: "step2Result",
        val: calculateInt([seed.seedsPerPound, seed.step1Result], "multiply"),
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
          "subtract"
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
    [seed.bulkSeedingRate, seed.acres],
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

export const convertToPercent = (num) => {
  return parseFloat(num) * 100;
};

export const convertToDecimal = (num) => {
  return parseFloat(num) / 100;
};

const convertToFormat = () => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
};
