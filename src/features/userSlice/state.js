export const historyState = {
  none: 'none',
  new: 'new',
  imported: 'imported',
  updated: 'updated',
};

const initialState = {
  calculationName: '',
  historyState: historyState.none,
  userHistoryList: [],
  selectedHistory: null,
  alertState: {
    open: false,
    severity: 'error',
    message: 'Network Error - Try again later or refresh the page!',
  },
  historyDialogState: {
    open: false,
    type: 'add',
  },
};

export default initialState;
