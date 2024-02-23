import {
  updateState, updateCounty, updateCountyId, updateSoilDrainage,
  updatePlantingDate, updateAcres, checkNRCS, updateCouncil,
  updateSoilFertility, updateLatlon, importFromCSV, updateTileDrainage,
} from './index';

export const setStateRedux = (state, stateId) => updateState({ state, stateId });

export const setCountyRedux = (county) => updateCounty({ county });

export const setCountyIdRedux = (countyId) => updateCountyId({ countyId });

export const setSoilDrainageRedux = (soilDrainage) => updateSoilDrainage({ soilDrainage });

export const setPlantingDateRedux = (plantingDate) => updatePlantingDate({ plantingDate });

export const setAcresRedux = (acres) => updateAcres({ acres });

export const checkNRCSRedux = (check) => checkNRCS({ checkNRCS: check });

export const setCouncilRedux = (council) => updateCouncil({ council });

export const setSoilFertilityRedux = (soilFertility) => updateSoilFertility({ soilFertility });

export const updateLatlonRedux = (latlon) => updateLatlon({ latlon });

export const importFromCSVSite = (csvData) => importFromCSV({ csvData });

export const updateTileDrainageRedux = (tileDrainage) => updateTileDrainage({ tileDrainage });
