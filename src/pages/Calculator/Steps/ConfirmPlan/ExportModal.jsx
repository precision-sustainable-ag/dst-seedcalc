import React, { useState } from 'react';
import {
  Box, Typography, Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { PSAButton, PSAModal } from 'shared-react-components/src';
import { handleDownload } from '../../../../shared/utils/exportExcel';
import pirschAnalytics from '../../../../shared/utils/analytics';

const modalStyle = {
  padding: '32px',
  maxWidth: 'min(500px, calc(100vw - 80px))',
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

const ExportModal = () => {
  const [open, setOpen] = useState(false);

  const siteCondition = useSelector((state) => state.siteCondition);
  const calculatorRedux = useSelector((state) => state.calculator);
  const { council } = siteCondition;

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

  const handleClick = () => {
    setOpen(true);
    pirschAnalytics('Confirm Plan', {
      meta: { export: 'export to csv' },
    });
  };

  return (
    <>
      <PSAModal
        open={open}
        onClose={() => setOpen(false)}
        modalContent={(
          <Box sx={modalStyle}>
            <Grid container spacing={2}>
              <Grid
                size={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6">
                  How would you like to save your calculation?
                </Typography>
              </Grid>
              <Grid
                size={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <PSAButton buttonType="" variant="contained" onClick={handleExportcsv} data-test="export_csv" title="Export to csv" />
              </Grid>
            </Grid>

          </Box>
        )}
      />
      <PSAButton
        buttonType=""
        sx={buttonStyles}
        onClick={handleClick}
        data-test="export_button"
        title="Export"
      />
    </>
  );
};

export default ExportModal;
