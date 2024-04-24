/* eslint-disable no-console */
import { useDispatch, useSelector } from 'react-redux';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import { setCalculationNameRedux, setFromUserHistoryRedux } from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import { getHistories, createHistory, updateHistory } from '../utils/api';

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
          const history = histories.filter((h) => h.label === name);
          if (history.length > 0) {
            const data = history[0].json;
            console.log('loaded history', name, history[0]);
            dispatch(setSiteConditionRedux(data.siteCondition));
            dispatch(setCalculatorRedux(data.calculator));
            dispatch(setCalculationNameRedux(data.name));
            dispatch(setFromUserHistoryRedux(true));
            // return object since sometime ID property is needed
            return history[0];
          }
          throw new Error('History name not available!');
        }
        console.log('history list', histories.map((history) => (history.label)));
        return histories.map((history) => (history.label));
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
 */
  const saveHistory = async (id = null) => {
    try {
      if (!token) throw new Error('Access token not available!');
      const data = { siteCondition, calculator };
      if (id !== null) {
        // if id is not null, update history with id
        const res = await updateHistory(token, data, calculationName, id);
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