import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setHistoryState: (state, { payload }) => {
      const { historyState } = payload;
      return { ...state, historyState };
    },
    setUserHistoryList: (state, { payload }) => {
      const { userHistoryList } = payload;
      return { ...state, userHistoryList };
    },
    setSelectedHistory: (state, { payload }) => {
      const { selectedHistory } = payload;
      return { ...state, selectedHistory };
    },
    setAlertState: (state, { payload }) => ({ ...state, alertState: { ...state.alertState, ...payload } }),
    setHistoryDialogState: (state, { payload }) => ({ ...state, historyDialogState: { ...payload } }),
    setVisitedMixRatios: (state, { payload }) => {
      const { visitedMixRatios } = payload;
      return { ...state, visitedMixRatios };
    },
    setMaxAvailableStep: (state, { payload }) => {
      const { maxAvailableStep } = payload;
      return { ...state, maxAvailableStep };
    },
  },
});

export const {
  setHistoryState, setUserHistoryList, setSelectedHistory, setAlertState,
  setHistoryDialogState, setVisitedMixRatios, setMaxAvailableStep,
} = userSlice.actions;

export default userSlice;
