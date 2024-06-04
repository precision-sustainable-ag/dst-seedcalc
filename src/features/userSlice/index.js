import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCalculationName: (state, { payload }) => {
      const { calculationName } = payload;
      return { ...state, calculationName };
    },
    setFromUserHistory: (state, { payload }) => {
      const { fromUserHistory } = payload;
      return { ...state, fromUserHistory };
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
  },
});

export const {
  setCalculationName, setFromUserHistory, setUserHistoryList, setSelectedHistory, setAlertState,
} = userSlice.actions;

export default userSlice;
