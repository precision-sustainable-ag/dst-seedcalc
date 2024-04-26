/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import {
  setCalculationNameRedux, setFromUserHistoryRedux, setUserHistoryListRedux, setSelectedHistoryRedux,
} from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import { getHistories, createHistory, updateHistory } from '../utils/api';
import { historyState } from '../../features/userSlice/state';

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
      const res = await getHistories(token);
      if (res.data.length > 0) {
        const histories = res.data;
        if (name !== null) {
          // name is not null, find match history record and return it
          const history = histories.find((h) => h.label === name);
          if (history !== undefined) {
            const data = history.json;
            console.log('loaded history', name, history);
            dispatch(setSiteConditionRedux(data.siteCondition));
            dispatch(setCalculatorRedux(data.calculator));
            dispatch(setCalculationNameRedux(history.label));
            dispatch(setFromUserHistoryRedux(historyState.imported));
            dispatch(setSelectedHistoryRedux({ label: history.label, id: history.id }));
            // return object since sometime ID property is needed
            return history[0];
          }
          throw new Error('History name not available!');
        } else {
          // name is null, return a list of history name and id
          const historyList = histories.map((history) => ({ label: history.label, id: history.id }));
          dispatch(setUserHistoryListRedux(historyList));
          console.log('history list', historyList);
          return historyList;
        }
      }
      throw new Error('No available history record!');
    } catch (err) {
      // FIXME: temporary error handling for all api calls, not throwing it
      console.error('Error when loading history: ', err);
      // throw err;
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
        // if id is not null, update history with id
        const res = await updateHistory(token, data, name, id);
        console.log('updated history', res);
      } else {
        // if id is null, create a new history
        const res = await createHistory(token, data, calculationName);
        console.log('created history', res);
      }
    } catch (err) {
      console.error('Error when saving history: ', err);
    }
  };

  return { loadHistory, saveHistory };
};

export default useUserHistory;
