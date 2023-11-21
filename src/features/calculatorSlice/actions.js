import {
  setCalculator, addSeed, removeSeed, setOption, removeOption,
} from './index';

export const setCalculatorRedux = (calculator) => (dispatch) => dispatch(setCalculator({ calculator }));

export const addSeedRedux = (seed) => (dispatch) => dispatch(addSeed({ seed }));

export const removeSeedRedux = (seedName) => (dispatch) => dispatch(removeSeed({ seedName }));

export const setOptionRedux = (seedLabel, option) => (dispatch) => dispatch(setOption({ seedLabel, option }));

export const removeOptionRedux = (seedLabel) => (dispatch) => dispatch(removeOption({ seedLabel }));
