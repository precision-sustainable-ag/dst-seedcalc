import { setCalculator, addSeed } from './index';

export const addSeedRedux = (seed) => (dispatch) => dispatch(addSeed({ seed }));

export const setCalculatorRedux = (calculator) => (dispatch) => dispatch(setCalculator({ calculator }));
