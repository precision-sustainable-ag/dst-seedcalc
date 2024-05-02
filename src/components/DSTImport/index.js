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
import { setCalculationNameRedux } from '../../features/userSlice/actions';
import HistoryDialog, { historyDialogFromEnums } from '../HistoryDialog';

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
};

const DSTImport = ({ token }) => {
  const [openModal, setOpenModal] = useState(false);
  const [CSVImport, setCSVImport] = useState(null);
  const [histories, setHistories] = useState([]);

  const dispatch = useDispatch();

  const { loadHistory } = useUserHistory(token);

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
        setCSVImport([siteCondition, calculator]);
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

  const handleSelectHistory = (e) => {
    dispatch(setCalculationNameRedux(e.target.value));
  };

  const handleLoadUserHistory = () => {
    loadHistory(calculationName);
    setOpenModal(!openModal);
  };

  // open the modal if user is logged in
  useEffect(() => {
    if (isAuthenticated) setOpenModal(true);
  }, []);

  // initially load all history records
  useEffect(() => {
    const loadHistories = async () => {
      const historyList = await loadHistory();
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
          <Grid container spacing="1rem">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6">
                Do you want to import previous calculation, or create a new one?
              </Typography>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6" component="h2">
                Import From CSV
              </Typography>
            </Grid>

            <Grid xs={12} item display="flex" justifyContent="center" alignItems="center">
              <Typography>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
              </Typography>
              <Button onClick={handleImportCSV}>
                Import
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6" component="h2">
                Import From User History
              </Typography>
            </Grid>

            <Grid xs={12} item display="flex" justifyContent="center" alignItems="center">
              <Grid xs={8} item>
                <Dropdown
                  value={calculationName}
                  label="Select your calculation"
                  items={histories}
                  handleChange={handleSelectHistory}
                />
              </Grid>
              <Button onClick={handleLoadUserHistory}>
                Import
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6" component="h2">
                Create New Calculation
              </Typography>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <HistoryDialog
                buttonLabel="+ new calculation"
                from={historyDialogFromEnums.siteCondition}
                token={token}
                setOpenModal={setOpenModal}
              />
            </Grid>

          </Grid>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{ textDecoration: 'none', margin: '1rem' }}
      >
        Import / Create calculation
      </Button>
    </>
  );
};

export default DSTImport;
