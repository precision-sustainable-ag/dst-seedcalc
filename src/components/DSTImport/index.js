import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Box, Grid, Modal, Typography, Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { importFromCSVCalculator } from '../../features/calculatorSlice/actions';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import useUserHistory from '../../shared/hooks/useUserHistory';

const modalStyle = {
  position: 'absolute',
  top: ' 50%',
  left: ' 50%',
  transform: ' translate(-50%, -50%)',
  width: ' 400px',
  backgroundColor: ' #fff',
  border: ' 2px solid #000',
  boxShadow:
    ' 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
  padding: ' 32px',
};

const DSTImport = ({ setIsImported, token }) => {
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState(null);

  const dispatch = useDispatch();

  const { loadHistory } = useUserHistory(token);

  /// ///////////////////////////////////////////////////////
  //                  Import Logic                        //
  /// ///////////////////////////////////////////////////////

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const siteCondition = JSON.parse(results.data[0].extData);
        const calculator = JSON.parse(results.data[1].extData);
        setCSVImport([siteCondition, calculator]);
        setIsImported(true);
      },
    });
  };

  const handleImportCSV = () => {
    if (CSVImport === null) {
      setOpenModal(!openModal);
      return;
    }
    dispatch(setSiteConditionRedux(CSVImport[0]));
    dispatch(importFromCSVCalculator(CSVImport[1]));
    setOpenModal(!openModal);
  };

  const handleLoadUserHistory = () => {
    loadHistory();
    setOpenModal(!openModal);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6" component="h2">
                Import From CSV
              </Typography>
            </Grid>

            <Grid xs={12} item display="flex" justifyContent="center" alignItems="center" pt="1rem">
              <Typography>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
              </Typography>
              <Button onClick={handleImportCSV}>
                Import
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center" pt="1rem">
              <Typography variant="h6" component="h2">
                Import From User History
              </Typography>
            </Grid>

            <Grid xs={12} item display="flex" justifyContent="center" alignItems="center" pt="1rem">
              <Button onClick={handleLoadUserHistory}>
                Import
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => setOpenModal(!openModal)}
        sx={{ textDecoration: 'none', margin: '1rem' }}
      >
        Import previous calculation
      </Button>
    </>
  );
};

export default DSTImport;
