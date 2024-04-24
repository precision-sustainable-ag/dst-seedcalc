import { useDispatch, useSelector } from 'react-redux';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import { setCalculationNameRedux, setFromUserHistoryRedux } from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import { getHistories, postHistory } from '../utils/api';

const useUserHistory = (token) => {
  const dispatch = useDispatch();
  const { calculationName } = useSelector((state) => state.user);
  const siteCondition = useSelector((state) => state.siteCondition);
  // not upload crops data to user history since it's too large
  const { crops, ...calculator } = useSelector((state) => state.calculator);

  // function to load history, initially load all history records and return a list of names
  // if given a name param, query by the name and if existed set redux
  const loadHistory = async (name = undefined) => {
    try {
      if (!token) throw new Error('Access token not available!');
      const res = await getHistories(token);
      if (res.data.length > 0) {
        const histories = res.data;
        if (name) {
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

  const saveHistory = async () => {
    if (!token) throw new Error('Access token not available!');

    const data = {
      name: calculationName, siteCondition, calculator,
    };
    const res = await postHistory(token, data);
    console.log('saved history', res);
  };

  return { loadHistory, saveHistory };
};

export default useUserHistory;
