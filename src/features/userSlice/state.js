export const historyStates = {
  none: 'none',
  new: 'new',
  imported: 'imported',
  updated: 'updated',
};

const initialState = {
  historyState: historyStates.none,
  userHistoryList: [],
  selectedHistory: null,
  alertState: {
    open: false,
    type: 'error',
    message: 'Network Error - Try again later or refresh the page!',
  },
  historyDialogState: {
    open: false,
    type: 'add',
  },
  visitedMixRatios: false,
  activeStep: 0,
};

export default initialState;
