import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PSAButton, PSATextField } from 'shared-react-components/src';
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
    userHistoryList, historyDialogState,
  } = useSelector((state) => state.user);
  const { open, type } = historyDialogState;

  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const handleOpenDialog = (open) => {
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

  return (
    <Dialog open={open}>
      <DialogTitle data-test="dialog_title">
        { type === 'add' && 'Are you creating a new record?'}
        { type === 'update' && 'Are you updating your record?'}
      </DialogTitle>
      <DialogContent>
        {type === 'add'
          && (
          <PSATextField
            autoFocus
            fullWidth
            variant="standard"
            label="Enter the nickname for this calculation"
            value={historyName}
            onChange={(e) => setHistoryName(e.target.value)}
            error={error}
            helperText={helperText}
            data-test="input_calculation_name"
          />
          )}
        {type === 'update'
          && (
          <DialogContent>
            <Typography data-test="warning_text">
              <span style={{ color: 'red' }}>Warning: </span>
              Making changes may affect the results of subsequent steps
              that you have saved. Please create a new record instead.
            </Typography>
          </DialogContent>
          )}
      </DialogContent>
      <DialogActions>
        {type === 'add'
            && <PSAButton buttonType="" onClick={handleCreate} variant="contained" data-test="create_button" title="Create" />}
        {type === 'update'
            && <PSAButton buttonType="" onClick={handleUpdate} variant="contained" data-test="create_record_button" title="Create a new record" />}
        <PSAButton buttonType="" onClick={handleCancel} variant="contained" data-test="cancel_button" title="Cancel" />
      </DialogActions>

    </Dialog>
  );
};
export default HistoryDialog;
