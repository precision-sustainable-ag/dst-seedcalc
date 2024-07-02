/* eslint-disable import/prefer-default-export */
import {
  setHistoryState, setUserHistoryList, setSelectedHistory, setAlertState,
  setHistoryDialogState, setMaxAvailableStep,
} from './index';

export const setHistoryStateRedux = (historyState) => setHistoryState({ historyState });

export const setUserHistoryListRedux = (userHistoryList) => setUserHistoryList({ userHistoryList });

export const setSelectedHistoryRedux = (selectedHistory) => setSelectedHistory({ selectedHistory });

export const setAlertStateRedux = ({ open, type, message }) => setAlertState({ open, type, message });

export const setHistoryDialogStateRedux = ({ open, type }) => setHistoryDialogState({ open, type });

export const setMaxAvailableStepRedux = (maxAvailableStep) => setMaxAvailableStep({ maxAvailableStep });
