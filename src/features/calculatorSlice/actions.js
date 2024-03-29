/* eslint-disable max-len */
import {
  addSeed, removeSeed, setOption, removeOption,
  updateDiversity, selectSidebarSeed, setMixSeedingRate,
  setAdjustedMixSeedingRate, importFromCSV, setBulkSeedingRate, selectUnit,
  setSeedingMethods,
} from './index';

export const addSeedRedux = (seed) => addSeed({ seed });

export const removeSeedRedux = (seedName) => removeSeed({ seedName });

export const setOptionRedux = (seedLabel, option) => setOption({ seedLabel, option });

export const removeOptionRedux = (seedLabel) => removeOption({ seedLabel });

export const updateDiversityRedux = (diversity) => updateDiversity({ diversity });

export const selectSidebarSeedRedux = (seed) => selectSidebarSeed({ seed });

export const setMixSeedingRateRedux = (mixSeedingRate) => setMixSeedingRate({ mixSeedingRate });

export const setAdjustedMixSeedingRateRedux = (adjustedMixSeedingRate) => setAdjustedMixSeedingRate({ adjustedMixSeedingRate });

export const setBulkSeedingRateRedux = (bulkSeedingRate) => setBulkSeedingRate({ bulkSeedingRate });

export const importFromCSVCalculator = (csvData) => importFromCSV({ csvData });

export const selectUnitRedux = (unit) => selectUnit({ unit });

export const setSeedingMethodsRedux = (seedingMethods) => setSeedingMethods({ seedingMethods });
