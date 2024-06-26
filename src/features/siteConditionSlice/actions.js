import {
  updateState, updateCounty, updateCountyId, updateSoilDrainage,
  updatePlantingDate, updateAcres, checkNRCS, updateCouncil,
  updateSoilFertility, updateLatlon, setSiteCondition, updateTileDrainage,
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

export const setSiteConditionRedux = (siteCondition) => setSiteCondition({ siteCondition });

export const updateTileDrainageRedux = (prevSoilDrainage, tileDrainage) => updateTileDrainage({ prevSoilDrainage, tileDrainage });
