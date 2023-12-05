import {
  addSeed, removeSeed, setOption, removeOption, updateDiversity,
} from './index';

export const addSeedRedux = (seed) => (dispatch) => dispatch(addSeed({ seed }));

export const removeSeedRedux = (seedName) => (dispatch) => dispatch(removeSeed({ seedName }));

export const setOptionRedux = (seedLabel, option) => (dispatch) => dispatch(setOption({ seedLabel, option }));

export const removeOptionRedux = (seedLabel) => (dispatch) => dispatch(removeOption({ seedLabel }));

export const updateDiversityRedux = (diversity) => (dispatch) => dispatch(updateDiversity({ diversity }));
