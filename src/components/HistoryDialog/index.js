import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,
  Typography,
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

const HistoryDialog = ({ setStep, setSiteConditionStep }) => {
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
    // return to first step
    setStep(0);
    setSiteConditionStep(1);
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
            <Typography>
              <span style={{ color: 'red' }}>Warning: </span>
              Making changes may affect the results of subsequent steps
              that you have saved. Please create a new record instead.
            </Typography>
          </DialogContent>
          )}
        {type === 'warning'
          && (
          <DialogContent>
            <Typography>
              <span style={{ color: 'red' }}>Warning: </span>
              Making changes on this page will erase the results of subsequent steps you have saved
              and initiate a new calculation. Please be aware of this.
            </Typography>
          </DialogContent>
          )}
      </DialogContent>
      <DialogActions>
        {type === 'add'
            && <Button onClick={handleCreate} variant="contained">Create</Button>}
        {type === 'update'
            && <Button onClick={handleUpdate} variant="contained">Create a new record</Button>}
        {type === 'warning'
            && <Button onClick={handleCancel} variant="contained">Confirm</Button>}
        {type !== 'warning'
            && <Button onClick={handleCancel} variant="contained">Cancel</Button>}
      </DialogActions>

    </Dialog>
  );
};
export default HistoryDialog;
