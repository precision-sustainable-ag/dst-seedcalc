import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCalculationNameRedux, setFromUserHistoryRedux, setSelectedHistoryRedux } from '../../features/userSlice/actions';
import useUserHistory from '../../shared/hooks/useUserHistory';
import { setCalculatorRedux } from '../../features/calculatorSlice/actions';
import initialState from '../../features/calculatorSlice/state';

export const historyDialogFromEnums = {
  siteCondition: 'siteConditoin',
  completePage: 'completePage',
};

const HistoryDialog = ({ buttonLabel, from, token }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [historyName, setHistoryName] = useState('');

  const { saveHistory } = useUserHistory(token);

  const {
    calculationName, fromUserHistory, userHistoryList, selectedHistory,
  } = useSelector((state) => state.user);
  const { crops } = useSelector((state) => state.calculator);

  const dispatch = useDispatch();

  const nameValidation = () => {
    if (userHistoryList.find((h) => h.label === historyName)) {
      setError(true);
      setHelperText('A calculation with same name already exists!');
      return false;
    }
    return true;
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = (selection) => {
    if (selection === 'YES') {
      if (from === historyDialogFromEnums.siteCondition) {
        if (!nameValidation()) return;
        // if there's an imported history, cleanup calculator redux(except for crops)
        if (fromUserHistory) dispatch(setCalculatorRedux({ ...initialState, crops }));
      }
      // on the complete page, update/save the calculation
      if (from === historyDialogFromEnums.completePage) {
        if (fromUserHistory) {
          if (selectedHistory.label !== historyName && !nameValidation()) return;
          saveHistory(selectedHistory.id, historyName);
        } else {
          if (!nameValidation()) return;
          saveHistory();
        }
      }
      dispatch(setCalculationNameRedux(historyName));
      dispatch(setSelectedHistoryRedux(null));
      dispatch(setFromUserHistoryRedux(false));
    }
    setError(false);
    setHelperText('');
    setOpen(false);
  };

  // initially set calculation name
  useEffect(() => {
    setHistoryName(calculationName);
  }, []);

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          {from === historyDialogFromEnums.siteCondition
            ? 'Do you want to create a new calculation and save it?'
            : 'Do you want to save this calculation?'}
        </DialogTitle>
        <Typography pl="1.5rem">
          {from === historyDialogFromEnums.siteCondition
            ? 'You can also save it after the calculation.'
            : ''}
        </Typography>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('YES')}>Yes</Button>
          <Button onClick={() => handleClose('NO')}>No</Button>
        </DialogActions>

      </Dialog>
      <Button variant="contained" onClick={handleOpenDialog}>
        {buttonLabel}
      </Button>
    </>
  );
};
export default HistoryDialog;
