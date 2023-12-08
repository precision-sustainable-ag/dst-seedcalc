/* eslint-disable max-len */
import {
  addSeed, removeSeed, setOption, removeOption, updateDiversity, selectSidebarSeed, setMixSeedingRate, setReviewMixResult, setAdjustedMixSeedingRate, importFromCSV,
} from './index';

export const addSeedRedux = (seed) => (dispatch) => dispatch(addSeed({ seed }));

export const removeSeedRedux = (seedName) => (dispatch) => dispatch(removeSeed({ seedName }));

export const setOptionRedux = (seedLabel, option) => (dispatch) => dispatch(setOption({ seedLabel, option }));

export const removeOptionRedux = (seedLabel) => (dispatch) => dispatch(removeOption({ seedLabel }));

export const updateDiversityRedux = (diversity) => (dispatch) => dispatch(updateDiversity({ diversity }));

export const selectSidebarSeedRedux = (seed) => (dispatch) => dispatch(selectSidebarSeed({ seed }));

export const setMixSeedingRateRedux = (mixSeedingRate) => (dispatch) => dispatch(setMixSeedingRate({ mixSeedingRate }));

export const setAdjustedMixSeedingRateRedux = (adjustedMixSeedingRate) => (dispatch) => dispatch(setAdjustedMixSeedingRate({ adjustedMixSeedingRate }));

export const setReviewMixResultRedux = (reviewMixResult) => (dispatch) => dispatch(setReviewMixResult({ reviewMixResult }));

export const importFromCSVCalculator = (csvData) => (dispatch) => dispatch(importFromCSV({ csvData }));
