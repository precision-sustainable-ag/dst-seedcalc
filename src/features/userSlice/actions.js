/* eslint-disable import/prefer-default-export */
import { setCalculationName, setFromUserHistory } from './index';

export const setCalculationNameRedux = (calculationName) => setCalculationName({ calculationName });

export const setFromUserHistoryRedux = (fromUserHistory) => setFromUserHistory({ fromUserHistory });
