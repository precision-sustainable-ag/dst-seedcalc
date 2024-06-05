import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHistoryStateRedux, setHistoryDialogStateRedux, setSelectedHistoryRedux,
} from '../../features/userSlice/actions';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import initialCalculatorState from '../../features/calculatorSlice/state';
import initialSiteConditionState from '../../features/siteConditionSlice/state';
import { historyStates } from '../../features/userSlice/state';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';

const HistoryDialog = () => {
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [historyName, setHistoryName] = useState('');

  const {
    calculationName, userHistoryList, historyDialogState,
  } = useSelector((state) => state.user);
  // const { crops } = useSelector((state) => state.calculator);
  const { open, type } = historyDialogState;

  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const handleOpenDialog = (open, type = 'add') => {
    dispatch(setHistoryDialogStateRedux({ open, type }));
  };

  const nameValidation = (name) => {
    if (name === '') return false;
    const result = userHistoryList.find((history) => history.label === name);
    if (result === undefined) return true;
    return false;
  };

  const resetDialogState = () => {
    handleOpenDialog(false);
    setHistoryName('');
    setError(false);
    setHelperText('');
  };

  const handleCreate = () => {
    const result = nameValidation(historyName);
    if (result) {
      // reset redux
      dispatch(setCalculatorRedux(initialCalculatorState));
      dispatch(setSiteConditionRedux(initialSiteConditionState));
      dispatch(setSelectedHistoryRedux({ label: historyName, id: null }));
      dispatch(setHistoryStateRedux(historyStates.new));
    } else {
      setError(true);
      setHelperText('Name invalid or already exists!');
      return;
    }
    resetDialogState();
  };

  const handleUpdate = () => {
    // reset redux
    dispatch(setCalculatorRedux(initialCalculatorState));
    dispatch(setSiteConditionRedux(initialSiteConditionState));
    dispatch(setSelectedHistoryRedux(null));
    dispatch(setHistoryStateRedux(historyStates.none));
    // open dialog and set dialog state as add
    handleOpenDialog(true, 'add');
  };

  const handleCancel = () => {
    resetDialogState();
  };

  // const handleClose = (selection) => {
  //   if (selection === 'YES') {
  //     if (from === historyDialogFromEnums.siteCondition) {
  //       if (!nameValidation()) return;
  //       // if there's already an imported history existed, cleanup calculator redux(except for crops)
  //       if (historyState === historyStates.imported) dispatch(setCalculatorRedux({ ...initialState, crops }));
  //       dispatch(setHistoryStateRedux(historyStates.new));
  //       setOpenModal(false);
  //     }
  //     // on the complete page, update/save the calculation
  //     if (from === historyDialogFromEnums.completePage) {
  //       if (historyState === historyStates.updated) {
  //         // if history is updated but name is not changed, not run nameValidation again
  //         if (selectedHistory.label !== historyName && !nameValidation()) return;
  //         saveHistory(selectedHistory.id, historyName);
  //       } else if (historyState === historyStates.new) {
  //         if (!nameValidation()) return;
  //         saveHistory();
  //       }
  //     }
  //     dispatch(setCalculationNameRedux(historyName));
  //     dispatch(setSelectedHistoryRedux(null));
  //   }
  //   setError(false);
  //   setHelperText('');
  //   setOpen(false);
  // };

  // initially set calculation name
  useEffect(() => {
    setHistoryName(calculationName);
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>
        { type === 'add' && 'Are you creating a new record?'}
        { type === 'update' && 'Are you updating your record?'}
      </DialogTitle>
      <DialogContent>
        {type === 'add'
          && (
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            label="Enter the nickname for this calculation"
            value={historyName}
            onChange={(e) => setHistoryName(e.target.value)}
            error={error}
            helperText={helperText}
          />
          )}
        {type === 'update'
          && (
          <DialogContent>
            <span style={{ color: 'red' }}>Warning: </span>
            Making changes may affect the results of subsequent steps
            that you have saved. Please create a new record instead.
          </DialogContent>
          )}
      </DialogContent>
      <DialogActions>
        {type === 'add'
            && <Button onClick={handleCreate}>Create</Button>}
        {type === 'update'
            && <Button onClick={handleUpdate}>Create a new record</Button>}
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>

    </Dialog>
  );
};
export default HistoryDialog;
