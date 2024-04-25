/* eslint-disable import/prefer-default-export */
import {
  setCalculationName, setFromUserHistory, setUserHistoryList, setSelectedHistory,
} from './index';

export const setCalculationNameRedux = (calculationName) => setCalculationName({ calculationName });

export const setFromUserHistoryRedux = (fromUserHistory) => setFromUserHistory({ fromUserHistory });

export const setUserHistoryListRedux = (userHistoryList) => setUserHistoryList({ userHistoryList });

export const setSelectedHistoryRedux = (selectedHistory) => setSelectedHistory({ selectedHistory });
