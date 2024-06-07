/* eslint-disable import/prefer-default-export */
import {
  setHistoryState, setUserHistoryList, setSelectedHistory, setAlertState,
  setHistoryDialogState,
} from './index';

export const setHistoryStateRedux = (historyState) => setHistoryState({ historyState });

export const setUserHistoryListRedux = (userHistoryList) => setUserHistoryList({ userHistoryList });

export const setSelectedHistoryRedux = (selectedHistory) => setSelectedHistory({ selectedHistory });

export const setAlertStateRedux = ({ open, severity, message }) => setAlertState({ open, severity, message });

export const setHistoryDialogStateRedux = ({ open, type }) => setHistoryDialogState({ open, type });
