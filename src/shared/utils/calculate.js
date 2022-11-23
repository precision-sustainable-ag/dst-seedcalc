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

export const calculateAllSteps = (prevSeed) => {
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
          [
            seed.step1.singleSpeciesSeedingRatePLS,
            seed.step1.percentOfSingleSpeciesRate,
          ],
          "percentage"
        ),
      };
    case "step2":
      return {
        key: "seedsPerAcre",
        val: calculateInt(
          [seed.step2.seedsPound, seed.mixSeedingRate],
          "multiply"
        ),
      };
    case "step3":
      return {
        key: "plantsPerAcre",
        val: calculateInt(
          [seed.seedsPerAcre, seed.step3.percentSurvival],
          "percentage"
        ),
      };
    case "step4":
      return {
        key: "aproxPlantsSqFt",
        val: calculateInt([seed.plantsPerAcre, seed.step4.sqFtAcre], "divide"),
      };
    default:
      return;
  }
};
export const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};
