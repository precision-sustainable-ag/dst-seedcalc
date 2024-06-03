export const historyState = {
  none: 'none',
  new: 'new',
  imported: 'imported',
  updated: 'updated',
};

const initialState = {
  calculationName: '',
  fromUserHistory: historyState.none,
  userHistoryList: [],
  selectedHistory: null,
  error: false,
};

export default initialState;
