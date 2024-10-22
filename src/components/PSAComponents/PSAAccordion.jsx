/*
  This file contains the Accordion component
*/
import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';

const StyledAccordion = styled(Accordion)(({ type }) => ({
  ...(type === 'SheetReferences' && {
    border: '1px solid #2b7b79',
    boxShadow: 'none',
  }),

}));

const StyledAccordionSummary = styled(AccordionSummary)(({ type, theme }) => ({
  ...(type === 'NRCSAccordionSummary' && {
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
  }),
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ type, theme }) => ({
  ...(type === 'NRCSAccordionDetails' && {
    '&.MuiAccordionDetails-root': {
      padding: ' 2%',
      'th,td': {
        color: theme.palette.primary.text,
      },
    },
  }),
}));

const PSAAccordion = ({
  accordionType, defaultExpanded, expanded, accordionDataTest, onChange,
  summaryContent, summaryExpandIcon, summarySx, summaryDataTest, summaryType, summaryTheme,
  divider,
  detailsContent, detailsDataTest, detailsType, detailsTheme,
}) => (
  <StyledAccordion
    type={accordionType}
    defaultExpanded={defaultExpanded}
    expanded={expanded || undefined}
    data-test={accordionDataTest}
    onChange={onChange}
  >
    <StyledAccordionSummary
      sx={summarySx}
      expandIcon={summaryExpandIcon}
      data-test={summaryDataTest}
      type={summaryType}
      theme={summaryTheme}
    >
      {summaryContent}
    </StyledAccordionSummary>
    {divider && divider}
    <StyledAccordionDetails
      data-test={detailsDataTest}
      type={detailsType}
      theme={detailsTheme}
    >
      {detailsContent}
    </StyledAccordionDetails>
  </StyledAccordion>
);

// PropTypes for better type checking
PSAAccordion.propTypes = {
  accordionType: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  summaryContent: PropTypes.node,
  summaryExpandIcon: PropTypes.node,
  detailsContent: PropTypes.node,
  divider: PropTypes.node,
};

// Default props
PSAAccordion.defaultProps = {
  accordionType: PropTypes.string,
  defaultExpanded: false,
  summaryContent: null,
  summaryExpandIcon: null,
  detailsContent: null,
  divider: null,
};

export default PSAAccordion;
