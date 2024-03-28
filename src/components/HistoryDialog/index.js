/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setCalculationNameRedux } from '../../features/userSlice/actions';

const HistoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [historyName, setHistoryName] = useState('');

  const dispatch = useDispatch();

  const handleClose = (selection) => {
    if (selection === 'YES') dispatch(setCalculationNameRedux(historyName));
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Do you want to create a new calculation and save it?</DialogTitle>
        <Typography pl="1.5rem">You can also save it after the calculation.</Typography>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            label="Enter the nickname for this calculation"
            value={historyName}
            onChange={(e) => setHistoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('YES')}>Yes</Button>
          <Button onClick={() => handleClose('NO')}>No</Button>
        </DialogActions>

      </Dialog>
      <Button variant="contained" onClick={() => setOpen(!open)}>
        Create new calculation
      </Button>
    </>
  );
};
export default HistoryDialog;
