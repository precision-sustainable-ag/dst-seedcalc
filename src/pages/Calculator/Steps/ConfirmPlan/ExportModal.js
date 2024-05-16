import React, { useState } from 'react';
import {
  Button, Modal, Box, Typography, Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { handleDownload } from '../../../../shared/utils/exportExcel';
import HistoryDialog, { historyDialogFromEnums } from '../../../../components/HistoryDialog';

const modalStyle = {
  position: 'absolute',
  top: ' 50%',
  left: ' 50%',
  transform: ' translate(-50%, -50%)',
  width: '80%',
  backgroundColor: ' #fff',
  border: ' 2px solid #000',
  boxShadow:
    ' 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
  padding: ' 32px',
  maxWidth: '500px',
};

const buttonStyles = {
  bgcolor: '#e7885f',
  color: 'white',
  padding: '7px',
  width: '83px',
  margin: '3px',
  fontSize: '12px',
  borderRadius: '26px',
};

const ExportModal = ({ token }) => {
  const [open, setOpen] = useState(false);

  const siteCondition = useSelector((state) => state.siteCondition);
  const calculatorRedux = useSelector((state) => state.calculator);
  const { council } = siteCondition;

  const { isAuthenticated } = useAuth0();

  const handleExportcsv = () => {
    handleDownload(
      [
        {
          label: 'SITE-CONDITION',
          extData: JSON.stringify(siteCondition),
        },
        {
          label: 'CALCULATOR',
          extData: JSON.stringify(calculatorRedux),
        },
      ],
      council,
    );
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6">
                How would you like to save your calculation?
              </Typography>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="contained" onClick={handleExportcsv}>Export to csv</Button>
            </Grid>

            {isAuthenticated
              && (
              <Grid item xs={12} display="flex" justifyContent="center">
                <HistoryDialog
                  buttonLabel="Save this calculation"
                  from={historyDialogFromEnums.completePage}
                  token={token}
                  setOpenModal={setOpen}
                />
              </Grid>
              )}
          </Grid>

        </Box>
      </Modal>
      <Button sx={buttonStyles} onClick={() => setOpen(true)}>
        Export
      </Button>
    </>
  );
};

export default ExportModal;
