import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import { createHistory, updateHistory, getHistories } from './api';

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
  extraReducers: (builder) => {
    builder
      .addCase(createHistory.pending, (state) => {
        state.error = false;
      })
      .addCase(createHistory.fulfilled, (state) => {
        state.error = false;
      })
      .addCase(createHistory.rejected, (state) => {
        state.error = true;
      })
      .addCase(updateHistory.pending, (state) => {
        state.error = false;
      })
      .addCase(updateHistory.fulfilled, (state) => {
        state.error = false;
      })
      .addCase(updateHistory.rejected, (state) => {
        state.error = true;
      })
      .addCase(getHistories.pending, (state) => {
        state.error = false;
      })
      .addCase(getHistories.fulfilled, (state) => {
        state.error = false;
      })
      .addCase(getHistories.rejected, (state) => {
        state.error = true;
      });
  },
});

export const {
  setCalculationName, setFromUserHistory, setUserHistoryList, setSelectedHistory, setAlertState,
} = userSlice.actions;

export default userSlice;
