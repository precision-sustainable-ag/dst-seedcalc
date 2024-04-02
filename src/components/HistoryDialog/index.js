import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCalculationNameRedux } from '../../features/userSlice/actions';
import useUserHistory from '../../shared/hooks/useUserHistory';

export const historyDialogFromEnums = {
  siteCondition: 'siteConditoin',
  completePage: 'completePage',
};

const HistoryDialog = ({ buttonLabel, from }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [historyName, setHistoryName] = useState('');

  const { calculationName } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { saveHistory } = useUserHistory();

  const nameValidation = () => {
    // TODO: update this function to check if name already exists
    setError(true);
    setHelperText('error!');
    if (error === true) return true;
    return false;
  };

  const handleClose = (selection) => {
    // TODO: run this function after user click yes or no
    if (!nameValidation()) return;
    if (selection === 'YES') {
      dispatch(setCalculationNameRedux(historyName));
      if (from === historyDialogFromEnums.completePage) {
        saveHistory();
      }
    }
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
            : 'Do you want to save this calaulation?'}
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
      <Button variant="contained" onClick={() => setOpen(!open)}>
        {buttonLabel}
      </Button>
    </>
  );
};
export default HistoryDialog;
