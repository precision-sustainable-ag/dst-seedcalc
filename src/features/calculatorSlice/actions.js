import {
  addSeed, removeSeed, setOption, removeOption, updateDiversity, selectSidebarSeed,
} from './index';

export const addSeedRedux = (seed) => (dispatch) => dispatch(addSeed({ seed }));

export const removeSeedRedux = (seedName) => (dispatch) => dispatch(removeSeed({ seedName }));

export const setOptionRedux = (seedLabel, option) => (dispatch) => dispatch(setOption({ seedLabel, option }));

export const removeOptionRedux = (seedLabel) => (dispatch) => dispatch(removeOption({ seedLabel }));

export const updateDiversityRedux = (diversity) => (dispatch) => dispatch(updateDiversity({ diversity }));

export const selectSidebarSeedRedux = (seed) => (dispatch) => dispatch(selectSidebarSeed({ seed }));
