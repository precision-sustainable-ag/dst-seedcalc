import { useDispatch, useSelector } from 'react-redux';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import { setCalculationNameRedux, setFromUserHistoryRedux } from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import { getHistory, postHistory } from '../utils/api';

const useUserHistory = (token) => {
  const dispatch = useDispatch();
  const { calculationName } = useSelector((state) => state.user);
  const siteCondition = useSelector((state) => state.siteCondition);
  // not upload crops data to user history since it's too large
  const { crops, ...calculator } = useSelector((state) => state.calculator);

  const loadHistory = async () => {
    const res = await getHistory(token);
    console.log('history', res.data.json);
    // set redux
    dispatch(setSiteConditionRedux(res.data.json.siteCondition));
    dispatch(setCalculatorRedux(res.data.json.calculator));
    dispatch(setCalculationNameRedux(res.data.json.name));
    dispatch(setFromUserHistoryRedux(true));
  };

  const saveHistory = async () => {
    const data = {
      name: calculationName, siteCondition, calculator,
    };
    const res = await postHistory(token, data);
    console.log(res);
  };

  return { loadHistory, saveHistory };
};

export default useUserHistory;
