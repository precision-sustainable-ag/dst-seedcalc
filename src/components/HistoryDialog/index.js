/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const HistoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [historyName, setHistoryName] = useState('');
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
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
          <Button onClick={handleClose}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>

      </Dialog>
      <Button variant="contained" onClick={() => setOpen(!open)}>
        Create new calculation
      </Button>
    </>
  );
};
export default HistoryDialog;
