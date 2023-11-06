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

//////////////////////////////////////////////////////////
//                    Mix Ratio                         //
//////////////////////////////////////////////////////////

export const calculateAllMixRatioValues = (prevSeed, data) => {
  let seed = { ...prevSeed };
  const percentInGroup = generatePercentInGroup(
    prevSeed,
    data.speciesSelection.seedsSelected
  );
  seed.mixSeedingRate = calculateMixRatio("step1", seed).val.toFixed(2);
  seed.seedsPerAcre = calculateMixRatio("step2", seed).val.toFixed(2);
  seed.plantsPerAcre = calculateMixRatio("step3", seed).val.toFixed(2);
  seed.aproxPlantsSqFt = calculateMixRatio("step4", seed).val.toFixed(2);
  return seed;
};

export const calculateMixRatio = (step, seed) => {
  switch (step) {
    case "step1":
      return {
        key: "mixSeedingRate",
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

//////////////////////////////////////////////////////////
//                  NECCC Logic                         //
//////////////////////////////////////////////////////////

export const calculateAllValuesNECCC = (prevSeed, data) => {
  let seed = { ...prevSeed };
  const percentInGroup = generatePercentInGroup(
    prevSeed,
    data.speciesSelection.seedsSelected
  );
  seed.mixSeedingRate = calculateSeedsNECCC("step1", seed, data).val.toFixed(2);
  seed.seedsPerAcre = calculateSeedsNECCC("step2", seed, data).val.toFixed(2);
  seed.aproxPlantsSqFt = calculateSeedsNECCC("step3", seed, data).val.toFixed(
    2
  );
  return seed;
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

//////////////////////////////////////////////////////////
//               Review Mix Logic                       //
//////////////////////////////////////////////////////////

export const calculateAllMixValues = (prevSeed, data) => {
  generatePercentInGroup(prevSeed, data.speciesSelection.seedsSelected);
  let seed = { ...prevSeed };
  seed.step1Result = calculateReviewMix("step1", seed, data).val.toFixed(2);
  seed.step2Result = calculateReviewMix("step2", seed, data).val.toFixed(2);
  seed.step3Result = calculateReviewMix("step3", seed, data).val.toFixed(2);
  seed.bulkSeedingRate = calculateReviewMix("step4", seed, data).val.toFixed(2);
  seed.poundsForPurchase = calculateReviewMix("step5", seed, data).val.toFixed(
    2
  );
  return seed;
};
export const generatePercentInGroup = (seed, seeds) => {
  const group = seed.group.label;
  let count = 0;
  seeds.map((s, i) => {
    s.group.label === group && count++;
  });
  return 1 / count;
};
export const calculateAllMixValuesNECCC = (prevSeed, data) => {
  generatePercentInGroup(prevSeed, data.speciesSelection.seedsSelected);
  let seed = { ...prevSeed };
  seed.step1Result = calculateReviewMixNECCC("step1", seed, data).val.toFixed(
    2
  );
  seed.step2Result = calculateReviewMixNECCC("step2", seed, data).val.toFixed(
    2
  );
  seed.step3Result = calculateReviewMixNECCC("step3", seed, data).val.toFixed(
    2
  );
  seed.bulkSeedingRate = calculateReviewMixNECCC(
    "step4",
    seed,
    data
  ).val.toFixed(2);
  seed.poundsForPurchase = calculateReviewMixNECCC(
    "step5",
    seed,
    data
  ).val.toFixed(2);
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
  return (parseFloat(num) * 100).toFixed(1);
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
const setAll = (obj, val) => {
  Object.keys(obj).forEach((k) => (obj[k] = val));
  return obj;
};
const setNull = (obj) => setAll(obj, null);
export const emptyValues = (data) => {
  const emptyObj = setNull(data);
  return emptyObj;
};

export const calculatePieChartData = (seedsSelected) => {
  const poundsOfSeedArray = [];
  const plantsPerAcreArray = [];
  const seedsPerAcreArray = [];

  const poundsOfSeedSum = seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.poundsOfSeed),
    0
  );
  const plantsPerAcreSum = seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.aproxPlantsSqFt),
    0
  );
  const seedsPerAcreSum = seedsSelected.reduce(
    (sum, a) => parseFloat(sum) + parseFloat(a.seedsPerAcre),
    0
  );

  seedsSelected.forEach((s) => {
    poundsOfSeedArray.push({
      name: s.label,
      value: parseFloat(s.poundsOfSeed) / poundsOfSeedSum,
    });
    plantsPerAcreArray.push({
      name: s.label,
      value: parseFloat(s.aproxPlantsSqFt) / plantsPerAcreSum,
    });
    seedsPerAcreArray.push({
      name: s.label,
      value: parseFloat(s.seedsPerAcre) / parseFloat(seedsPerAcreSum),
    });
  });

  return { poundsOfSeedArray, plantsPerAcreArray, seedsPerAcreArray };
};

export const roundToDecimal = (float, digits) => {
  const factor = Math.pow(10, digits);
  return Math.round(float * factor) / factor;
};
