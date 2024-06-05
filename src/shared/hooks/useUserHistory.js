/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import {
  setCalculationNameRedux, setHistoryStateRedux, setUserHistoryListRedux, setSelectedHistoryRedux,
  setAlertStateRedux,
} from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import { getHistories, createHistory, updateHistory } from '../../features/userSlice/api';
import { historyStates } from '../../features/userSlice/state';

const useUserHistory = (token) => {
  const dispatch = useDispatch();
  const { calculationName } = useSelector((state) => state.user);
  const siteCondition = useSelector((state) => state.siteCondition);
  // not upload crops data to user history since it's too large
  const { crops, ...calculator } = useSelector((state) => state.calculator);

  /**
 * This function loads history from user history api.
 * If no param, return a list of name of current history records.
 * If `name` is specified, return relevant history object.
 * @param {string} name - The name of history record, default to `null`.
 */
  const loadHistory = async (name = null) => {
    try {
      if (!token) throw new Error('Access token not available!');
      const res = await dispatch(getHistories({ accessToken: token }));
      if (res.payload.data.length > 0) {
        const histories = res.payload.data;
        if (name !== null) {
          // name is not null, find match history record and return it
          const history = histories.find((h) => h.label === name);
          if (history !== undefined) {
            const data = history.json;
            console.log('loaded history', name, history);
            dispatch(setSiteConditionRedux(data.siteCondition));
            dispatch(setCalculatorRedux(data.calculator));
            dispatch(setCalculationNameRedux(history.label));
            dispatch(setHistoryStateRedux(historyStates.imported));
            dispatch(setSelectedHistoryRedux({ label: history.label, id: history.id }));
            dispatch(setAlertStateRedux({
              open: true,
              severity: 'success',
              message: 'History loaded.',
            }));
            // return object since sometime ID property is needed
            return history;
          }
          throw new Error('History name not available!');
        } else {
          // name is null, return a list of history name and id
          const historyList = histories.map((history) => ({ label: history.label, id: history.id }));
          dispatch(setUserHistoryListRedux(historyList));
          return historyList;
        }
      }
      throw new Error('No available history record!');
    } catch (err) {
      dispatch(setAlertStateRedux({
        open: true,
        severity: 'error',
        message: `Error when loading history: ${err}, please try again later or refresh the page!`,
      }));
    }
    return [];
  };

  /**
 * This function saves history by user history api.
 * If no param, create a new history record.
 * If `id` is specified, update relevant history object.
 * @param {number} id - The id of history to update, default to `null`.
 * @param {string} name - The name of history to update, default to `null`.
 */
  const saveHistory = async (id = null, name = null) => {
    try {
      if (!token) throw new Error('Access token not available!');
      const data = { siteCondition, calculator };
      if (id !== null) {
        const params = {
          accessToken: token, historyData: data, name, id,
        };
        // if id is not null, update history with id
        const res = await dispatch(updateHistory(params));
        console.log('updated history', res.payload);
        dispatch(setAlertStateRedux({
          open: true,
          severity: 'success',
          message: 'History updated.',
        }));
      } else {
        const params = {
          accessToken: token, historyData: data, name: calculationName,
        };
        // if id is null, create a new history
        const res = await dispatch(createHistory(params));
        console.log('created history', res.payload);
        dispatch(setAlertStateRedux({
          open: true,
          severity: 'success',
          message: 'History saved.',
        }));
      }
    } catch (err) {
      dispatch(setAlertStateRedux({
        open: true,
        severity: 'error',
        message: `Error when saving history: ${err}, please try again later or refresh the page!`,
      }));
    }
  };

  return { loadHistory, saveHistory };
};

export default useUserHistory;
