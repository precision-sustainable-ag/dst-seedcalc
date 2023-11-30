import {
  updateState, updateCounty, updateCountyId, updateSoilDrainage,
  updatePlantingDate, updateAcres, checkNRCS, updateCouncil, updateSoilFertility,
} from './index';

export const setStateRedux = (state, stateId) => (dispatch) => {
  dispatch(updateState({ state, stateId }));
};

export const setCountyRedux = (county) => (dispatch) => {
  dispatch(updateCounty({ county }));
};

export const setCountyIdRedux = (countyId) => (dispatch) => {
  dispatch(updateCountyId({ countyId }));
};

export const setSoilDrainageRedux = (soilDrainage) => (dispatch) => {
  dispatch(updateSoilDrainage({ soilDrainage }));
};

export const setPlantingDateRedux = (plantingDate) => (dispatch) => {
  dispatch(updatePlantingDate({ plantingDate }));
};

export const setAcresRedux = (acres) => (dispatch) => {
  dispatch(updateAcres({ acres }));
};

export const checkNRCSRedux = (check) => (dispatch) => {
  dispatch(checkNRCS({ checkNRCS: check }));
};

export const setCouncilRedux = (council) => (dispatch) => {
  dispatch(updateCouncil({ council }));
};

export const setSoilFertilityRedux = (soilFertility) => (dispatch) => {
  dispatch(updateSoilFertility({ soilFertility }));
};
