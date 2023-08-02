export const checkMixSeedingRate = ({
  finalMixSeedingRate,
  mixSeedingRate,
}) => {
  if (
    finalMixSeedingRate < mixSeedingRate * 2.5 &&
    finalMixSeedingRate > mixSeedingRate / 2
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * LOGIC Translation
 *
 * The formula checks if the "Input - Planting Date" is within any of the following date ranges:
 * 1. First Reliable Establishment Start and End
 * 2. Second Reliable Establishment Start and End
 * 3. Early Seeding Date Start and End
 * 4. Late Seeding Date Start and End
 *
 * If the planting date falls within any of these ranges, the formula returns 1; otherwise, it returns 0.
 */

export const checkPlantingDate = (crop) => {
  var plantingDate = crop.siteConditionPlantingDate;
  if (!(plantingDate instanceof Date)) plantingDate = new Date(plantingDate);

  const firstReliableEstablishmentStart = new Date(
    crop.plantingDates.firstReliableEstablishmentStart
  );
  const firstReliableEstablishmentEnd = new Date(
    crop.plantingDates.firstReliableEstablishmentEnd
  );
  const secondReliableEstablishmentEnd = new Date(
    crop.plantingDates.secondReliableEstablishmentEnd
  );
  const secondReliableEstablishmentStart = new Date(
    crop.plantingDates.secondReliableEstablishmentStart
  );
  const earlySeedingDateStart = new Date(
    crop.plantingDates.earlySeedingDateStart
  );
  const earlySeedingDateEnd = new Date(crop.plantingDates.earlySeedingDateEnd);
  const lateSeedingDateStart = new Date(
    crop.plantingDates.lateSeedingDateStart
  );
  const lateSeedingDateEnd = new Date(crop.plantingDates.lateSeedingDateEnd);

  console.log(">> crop:", crop);

  const inFirstReliableEstablishment =
    plantingDate >= firstReliableEstablishmentStart &&
    plantingDate <= firstReliableEstablishmentEnd;
  const inSecondReliableEstablishment =
    plantingDate >= secondReliableEstablishmentStart &&
    plantingDate <= secondReliableEstablishmentEnd;
  const inEarlySeedingDate =
    plantingDate >= earlySeedingDateStart &&
    plantingDate <= earlySeedingDateEnd;
  const inLateSeedingDate =
    plantingDate >= lateSeedingDateStart && plantingDate <= lateSeedingDateEnd;
  const result =
    inFirstReliableEstablishment ||
    inSecondReliableEstablishment ||
    inEarlySeedingDate ||
    inLateSeedingDate
      ? true
      : false;
  console.log("RESUlT:", result);
  return result;
};

/**
 * LOGIC Translation
 *
 * The formula checks if the "% in Mix" for a specific seed is greater than the
 * "Max % Allowed in Mix (from Cover Crop)".
 *
 * If it is, the formula returns 0; otherwise, it returns 1.
 */

export const checkPercentMix = (percentInMix, crop) => {
  console.log("percent", percentInMix, crop);
  const maxPercentAllowedInMix = crop.maxPercentAllowedInMix;

  return percentInMix > maxPercentAllowedInMix ? false : true;
};

/**
 * LOGIC Translation
 *
 * The formula checks if the "Input - Soil Drainage" is found within the
 * "Soil Drainage (from Cover Crop)" string.
 *
 * If it is found (the index is greater than 0), the formula returns 1; otherwise, it returns 0.
 */

/* 
    Check soil drainage returns the soil drainage. check if the soil drainage exists in the crop.
    
*/
export const checkSoilDrainage = (soilDrainage, crop) => {
  const soilDrainages = crop.soilDrainages;

  return soilDrainages.indexOf(soilDrainage) > -1;
};

export const checkAllNRCSStandards = (seedSelected, seeds) => {
  /*
   * @ the specific seed, run specific check for NRCS values
   * Afterwards, go
   */
  console.log("check seed", seedSelected, seeds);

  const NRCSResults = {
    mixSeedingRate: checkMixSeedingRate(seedSelected.mixSeedingRate, seeds),
    percentMix: checkPercentMix(1 / seeds.length, seedSelected),
    soilDrainage: checkSoilDrainage(seedSelected.soilDrainage, seedSelected),
    plantingDate: checkPlantingDate(seedSelected, seeds),
  };
  return NRCSResults;
};
