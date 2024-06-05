import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // TODO: whether to remove this redux state
    setCalculationName: (state, { payload }) => {
      const { calculationName } = payload;
      return { ...state, calculationName };
    },
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
  },
});

export const {
  setCalculationName, setHistoryState, setUserHistoryList, setSelectedHistory, setAlertState,
  setHistoryDialogState,
} = userSlice.actions;

export default userSlice;
