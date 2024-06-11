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
  alertState: {
    open: false,
    type: 'error',
    message: 'Network Error - Try again later or refresh the page!',
  },
};

export default initialState;
