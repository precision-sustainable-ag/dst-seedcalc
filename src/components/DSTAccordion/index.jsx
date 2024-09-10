import React from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
} from '@mui/material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const DSTAccordion = ({
  expanded, onChange, summary, children,
}) => (
  <Accordion expanded={expanded} onChange={onChange}>
    <AccordionSummary
      expandIcon={(
        <Typography sx={{ textDecoration: 'underline', display: 'flex', alignItems: 'center' }}>
          {expanded ? 'Hide ' : 'Show '}
          Details
          {expanded ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
        </Typography>
      )}
    >
      {summary}
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

export default DSTAccordion;
