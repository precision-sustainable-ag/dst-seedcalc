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

const NRCSItem = ({ title, result, data }) => {
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

  const [expanded, setExpanded] = useState(false);

  const renderTable = (tableData) => {
    // eslint-disable-next-line no-shadow
    const createData = (label, expect, result, pass) => ({
      label, expect, result, pass,
    });

    const rows = tableData.seeds.map((d) => createData(
      d.label,
      d.expect,
      d.result,
      d.pass ? 'passed' : 'failed',
    ));

    const cells = ['label', 'result', 'expect', 'pass'];
    return <DSTTable rows={rows} createData={createData} cells={cells} />;
  };

  return (
    <>
      <Grid xs={0} md={1} />
      <Grid xs={12} md={10}>
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
      <Grid xs={0} md={1} />

      <Grid xs={0} md={1} />
      <Grid xs={12} md={10}>
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
            {result ? (
              <CheckIcon sx={{ color: 'green' }} />
            ) : (
              <ClearIcon sx={{ color: 'red' }} />
            )}
            <Typography sx={{ float: 'left', marginLeft: '5px' }}>
              {result ? 'passed' : 'failed'}
            </Typography>
          </NRCSAccordionSummary>
          <NRCSAccordionDetails>{renderTable(data)}</NRCSAccordionDetails>
        </Accordion>
      </Grid>
      <Grid xs={0} md={1} />
    </>
  );
};
const NRCSStandards = ({ NRCS }) => (
  <>
    <Grid item xs={12}>
      <Typography sx={{ fontWeight: 600, fontSize: '20px', margin: '20px' }}>
        Indiana NRCS Standards
      </Typography>
    </Grid>

    <NRCSItem
      title="Seeding Rate"
      result={NRCS.results.seedingRate.value}
      data={NRCS.results.seedingRate}
    />

    <NRCSItem
      title="Planting Date"
      result={NRCS.results.plantingDate.value}
      data={NRCS.results.plantingDate}
    />

    <NRCSItem
      title="Ratio"
      result={NRCS.results.ratio.value}
      data={NRCS.results.ratio}
    />

    <NRCSItem
      title="Soil Drainage"
      result={NRCS.results.soilDrainage.value}
      data={NRCS.results.soilDrainage}
    />

    <NRCSItem
      title="Expected Winter Survival"
      result={NRCS.results.expectedWinterSurvival.value}
      data={NRCS.results.expectedWinterSurvival}
    />
  </>
);

export default NRCSStandards;
