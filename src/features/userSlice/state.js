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
  alertState: {
    open: false,
    severity: 'error',
    message: 'Network Error - Try again later or refresh the page!',
  },
};

export default initialState;
