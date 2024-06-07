import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  Box, Grid, Modal, Typography, Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { importFromCSVCalculator } from '../../features/calculatorSlice/actions';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import useUserHistory from '../../shared/hooks/useUserHistory';
import Dropdown from '../Dropdown';
import { setCalculationNameRedux, setHistoryDialogStateRedux } from '../../features/userSlice/actions';

const modalStyle = {
  position: 'absolute',
  top: ' 50%',
  left: ' 50%',
  transform: ' translate(-50%, -50%)',
  backgroundColor: ' #fff',
  border: ' 2px solid #000',
  boxShadow:
    ' 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
  padding: ' 32px',
  maxWidth: '500px',
};

const DSTImport = ({ token }) => {
  const [openModal, setOpenModal] = useState(false);

  const [histories, setHistories] = useState([]);

  const dispatch = useDispatch();

  const { loadHistory } = useUserHistory();

  const { calculationName } = useSelector((state) => state.user);

  const { isAuthenticated } = useAuth0();

  /// ///////////////////////////////////////////////////////
  //                  Import Logic                        //
  /// ///////////////////////////////////////////////////////

  const handleOpenModal = () => {
    // there's possibilities that click 'Create New Calculation', set a name and then click 'Import'.
    // If this happens then the dropdown will popup with a not available name.
    // Set the calculation name to empty to prevent this behaviour.
    dispatch(setCalculationNameRedux(''));
    setOpenModal(true);
  };

  const handleFileUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const siteCondition = JSON.parse(results.data[0].extData);
        const calculator = JSON.parse(results.data[1].extData);

        dispatch(setSiteConditionRedux(siteCondition));
        dispatch(importFromCSVCalculator(calculator));
        setOpenModal(!openModal);
      },
    });
  };

  const handleSelectHistory = (e) => {
    dispatch(setCalculationNameRedux(e.target.value));
  };

  const handleLoadUserHistory = () => {
    loadHistory(token, calculationName);
    setOpenModal(!openModal);
  };

  // initially load all history records
  useEffect(() => {
    const loadHistories = async () => {
      const historyList = await loadHistory(token);
      setHistories(historyList);
    };
    // token is null initially so only call when token is available
    if (token !== null) loadHistories();
  }, [token]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Grid container spacing={5}>
            {isAuthenticated && (
              <Grid container item spacing={1}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Typography variant="h6">
                    Create New Calculation
                  </Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(setHistoryDialogStateRedux({ open: true, type: 'add' }));
                      setOpenModal(false);
                    }}
                  >
                    create new calculation
                  </Button>
                </Grid>
              </Grid>

            )}

            <Grid container item spacing={1}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Typography variant="h6">
                  Import from CSV
                </Typography>
              </Grid>

              <Grid xs={12} item display="flex" justifyContent="center" alignItems="center">
                <input
                  id="contained-button-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  hidden
                />
                {/* eslint-disable-next-line */}
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Import from CSV
                </Button>
              </label>
              </Grid>
            </Grid>

            {isAuthenticated && (
              <Grid container item xs={12} spacing={1}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Typography variant="h6">
                    Import from User History
                  </Typography>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Dropdown
                      value={calculationName}
                      label="Select your calculation"
                      items={histories}
                      handleChange={handleSelectHistory}
                      minWidth={220}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Button variant="contained" onClick={handleLoadUserHistory}>
                      Import
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{ textDecoration: 'none', margin: '1rem' }}
      >
        {isAuthenticated ? 'Import / Create calculation' : 'Import Calculation'}
      </Button>
    </>
  );
};

export default DSTImport;
