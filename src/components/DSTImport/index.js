import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

import {
  Box, Grid, Modal, Typography, Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { importFromCSVCalculator } from '../../features/calculatorSlice/actions';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';

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

const DSTImport = ({ setIsImported }) => {
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    navigate('/');
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
            <Grid xs={3} item />
            <Grid xs={6} item>
              <Typography variant="h6" component="h2">
                Import a CSV file
              </Typography>
            </Grid>
            <Grid xs={3} item />
            <Grid xs={2} item />
            <Grid xs={8} item>
              <Typography sx={{ mt: 2 }}>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
              </Typography>
            </Grid>
            <Grid xs={2} item />
            <Grid xs={8} item />
            <Grid xs={4} item>
              <Button
                sx={{ marginTop: '15px' }}
                onClick={handleImportCSV}
              >
                Import CSV
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
