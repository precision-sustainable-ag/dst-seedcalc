import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  Box, Grid, Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { PSAButton, PSADropdown, PSAModal } from 'shared-react-components/src';
import { importFromCSVCalculator } from '../../features/calculatorSlice/actions';
import { setSiteConditionRedux } from '../../features/siteConditionSlice/actions';
import useUserHistory from '../../shared/hooks/useUserHistory';
import { setHistoryDialogStateRedux } from '../../features/userSlice/actions';
import pirschAnalytics from '../../shared/utils/analytics';
import { getAuthToken } from '../../shared/utils/authToken';

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

const DSTImport = () => {
  const [openModal, setOpenModal] = useState(false);
  const [histories, setHistories] = useState([]);
  const [calculationName, setCaclulationName] = useState('');

  const dispatch = useDispatch();

  const { loadHistory } = useUserHistory();

  const { isAuthenticated } = useAuth0();

  /// ///////////////////////////////////////////////////////
  //                  Import Logic                        //
  /// ///////////////////////////////////////////////////////

  const handleCreateNewHistory = () => {
    pirschAnalytics('History', {
      meta: {
        history: 'Create calculation',
      },
    });
    dispatch(setHistoryDialogStateRedux({ open: true, type: 'add' }));
    setOpenModal(false);
  };

  const handleFileUpload = (event) => {
    pirschAnalytics('History', {
      meta: {
        history: 'Import CSV',
      },
    });
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

  const handleLoadUserHistory = () => {
    pirschAnalytics('History', {
      meta: {
        history: 'Import calculation',
      },
    });
    loadHistory(calculationName);
    setOpenModal(!openModal);
  };

  // initially load all history records
  useEffect(() => {
    const loadHistories = async () => {
      const historyList = await loadHistory();
      setHistories(historyList);
    };
    const token = getAuthToken();
    // token is null initially so only call when token is available
    if (token !== null) loadHistories();
  }, [openModal]);

  return (
    <>
      <PSAModal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        modalContent={(
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
                    <PSAButton
                      buttonType=""
                      variant="contained"
                      onClick={handleCreateNewHistory}
                      data-test="create_calculation"
                      title="create new calculation"
                    />
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
                    <PSAButton
                      buttonType=""
                      variant="contained"
                      color="primary"
                      component="span"
                      data-test="import_from_csv"
                      title="Import from CSV"
                    />
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
                      <PSADropdown
                        label="Select your calculation"
                        items={histories.map((history) => ({ label: history.label, value: history.label }))}
                        formSx={{ minWidth: 220 }}
                        SelectProps={{
                          value: calculationName,
                          onChange: (e) => setCaclulationName(e.target.value),
                          MenuProps: {
                            style: { color: '#4F5F30' },
                          },
                          'data-test': 'select_calculation',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                      <PSAButton
                        buttonType=""
                        variant="contained"
                        onClick={handleLoadUserHistory}
                        data-test="import_calculation"
                        title="Import"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      />
      <PSAButton
        buttonType=""
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{ textDecoration: 'none', margin: '1rem' }}
        data-test="import_button"
        title={isAuthenticated ? 'Import / Create calculation' : 'Import Calculation'}
      />
    </>
  );
};

export default DSTImport;
