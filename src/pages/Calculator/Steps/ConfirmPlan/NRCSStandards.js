import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import styled from '@emotion/styled';
import DSTTable from '../../../../components/DSTTable';
import '../steps.scss';

const NRCSAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  '&.MuiAccordionSummary-root': {
    minHeight: '1.5rem',
    padding: '0.3125rem 1rem',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.text,
    '.MuiAccordionSummary-content': {
      margin: '0',
    },
    '&.Mui-expanded': {
      minHeight: '2rem',
    },
    '.MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(0deg) !important',
    },
  },
}));

const NRCSAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  '&.MuiAccordionDetails-root': {
    padding: ' 2%',
    'th,td': {
      color: theme.palette.primary.text,
    },
  },
}));

const NRCSItem = ({ title, result }) => {
  const [expanded, setExpanded] = useState(false);

  const renderTable = (tableData) => {
    // eslint-disable-next-line no-shadow
    const createData = (label, result, expect, pass) => ({
      label, result, expect, pass,
    });

    const rows = tableData.map((data) => createData(
      data.label,
      data.result,
      data.expect,
      data.pass ? 'passed' : 'failed',
    ));

    const cells = ['label', 'result', 'expect', 'pass'];
    return <DSTTable rows={rows} cells={cells} />;
  };

  const pass = result.filter((res) => !res.pass).length === 0;

  return (
    <Grid container>
      <Grid item xs={0} md={1} />
      <Grid item xs={12} md={10}>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            float: 'left',
            pt: '1rem',
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item xs={0} md={1} />

      <Grid item xs={0} md={1} />
      <Grid item xs={12} md={10}>
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
        >
          <NRCSAccordionSummary
            expandIcon={(
              <Typography>
                {expanded ? 'Hide' : 'Show'}
                {' '}
                Details
              </Typography>
              )}
          >
            {pass ? (
              <CheckIcon sx={{ color: 'green' }} />
            ) : (
              <ClearIcon sx={{ color: 'red' }} />
            )}
            <Typography sx={{ float: 'left', marginLeft: '5px' }}>
              {pass ? 'passed' : 'failed'}
            </Typography>
          </NRCSAccordionSummary>
          <NRCSAccordionDetails>{renderTable(result)}</NRCSAccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={0} md={1} />
    </Grid>
  );
};

const NRCSStandards = ({ nrcsResult }) => (

  <>
    <Grid item xs={12}>
      <Typography sx={{ fontWeight: 600, fontSize: '20px', margin: '20px' }}>
        Indiana NRCS Standards
      </Typography>
    </Grid>
    {Object.keys(nrcsResult).length > 0
    && (
      <>
        <NRCSItem
          title="Seeding Rate"
          result={nrcsResult.seedingRate}
        />

        <NRCSItem
          title="Planting Date"
          result={nrcsResult.plantingDate}
        />

        <NRCSItem
          title="Ratio"
          result={nrcsResult.ratio}
        />

        <NRCSItem
          title="Soil Drainage"
          result={nrcsResult.soilDrainageResult}
        />

        <NRCSItem
          title="Expected Winter Survival"
          result={nrcsResult.winterSurvival}
        />
      </>
    )}
  </>

);

export default NRCSStandards;
