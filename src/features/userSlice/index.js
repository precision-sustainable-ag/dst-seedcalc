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
    setMaxAvailableStep: (state, { payload }) => {
      const { maxAvailableStep } = payload;
      return { ...state, maxAvailableStep };
    },
  },
});

export const {
  setHistoryState, setUserHistoryList, setSelectedHistory, setAlertState,
  setHistoryDialogState, setMaxAvailableStep,
} = userSlice.actions;

export default userSlice;
