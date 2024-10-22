/// ///////////////////////////////////////////////////////
//                     Imports                          //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { PSAButton } from 'shared-react-components/src';
import NumberTextField from '../../../../components/NumberTextField';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';
import '../steps.scss';
import { validateForms } from '../../../../shared/utils/format';
import { historyStates } from '../../../../features/userSlice/state';
import { setAlertStateRedux, setHistoryStateRedux } from '../../../../features/userSlice/actions';
import DSTAccordion from '../../../../components/DSTAccordion';
import pirschAnalytics from '../../../../shared/utils/analytics';

const LeftGrid = styled(Grid)({
  '&.MuiGrid-item': {
    height: '50px',
    paddingTop: '8px',
    paddingLeft: '15px',
    paddingRight: '20px',
    textAlign: 'left',
    '& p': {
      fontWeight: 'bold',
    },
  },
});

const SeedTagNumField = styled(NumberTextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
    backgroundColor: 'white',
  },
  '& .MuiInputBase-input': {
    fontSize: 16,
    width: 'auto',
    padding: '10px 10px',
  },
});

const SeedTagInfo = ({
  completedStep, setCompletedStep, alertState,
}) => {
  const dispatch = useDispatch();
  const { council } = useSelector((state) => state.siteCondition);
  const { seedsSelected, options } = useSelector((state) => state.calculator);
  const { historyState } = useSelector((state) => state.user);

  const [accordionState, setAccordionState] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = true;
      return res;
    }, {}),
  );

  const [haveSeedTagInfo, setHaveSeedTagInfo] = useState(false);

  const updateGermination = (seedLabel, value) => {
    dispatch(setAlertStateRedux({
      ...alertState,
      open: true,
      type: 'success',
      message: 'You can also edit this information in furthur steps.',
    }));
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], germination: value }));
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
  };

  const updatePurity = (seedLabel, value) => {
    dispatch(setAlertStateRedux({
      ...alertState,
      open: true,
      type: 'success',
      message: 'You can also edit this information in furthur steps.',
    }));
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], purity: value }));
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
  };

  const updateSeedsPerPound = (seedLabel, value) => {
    dispatch(setOptionRedux(seedLabel, { ...options[seedLabel], seedsPerPound: value }));
    if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
  };

  const seedsPerPound = (seed) => {
    if (options[seed.label].seedsPerPound) return options[seed.label].seedsPerPound;
    if (council === 'MCCC') return seed.attributes['Planting Information']['Seed Count'].values[0];
    if (council === 'NECCC') return seed.attributes.Planting['Seeds Per lb'].values[0];
    if (council === 'SCCC') return seed.attributes.Planting['Seeds per Pound'].values[0];
    return '';
  };

  const handleExpandAccordion = (label) => {
    const open = accordionState[label];
    setAccordionState({ ...accordionState, [label]: !open });
  };

  const handleHaveSeedTagInfo = (selection) => {
    setHaveSeedTagInfo(selection);
    pirschAnalytics('Seed Tag Info', { meta: { 'Have Seed Tag Info': true } });
  };

  // initially set germination and purity
  useEffect(() => {
    seedsSelected.forEach((seed) => {
      // not set default value if redux value already exist
      if (options[seed.label].germination && options[seed.label].purity) return;
      // FIXME: use 0.85 and 0.95 as default value(applies to NECCC)
      const germination = parseFloat(
        seed.attributes.Coefficients['% Live Seed to Emergence']?.values[0] ?? 0.85,
      );
      const purity = parseFloat(
        seed.attributes.Coefficients['Precision Coefficient']?.values[0] ?? 0.95,
      );
      dispatch(setOptionRedux(seed.label, { ...options[seed.label], germination, purity }));
    });
  }, []);

  useEffect(() => {
    if (haveSeedTagInfo) {
      dispatch(setAlertStateRedux({
        ...alertState,
        open: true,
        type: 'success',
        message: 'These are starting values. Adjust as needed based on your seed tag info.',
      }));
    }
    validateForms(haveSeedTagInfo, 5, completedStep, setCompletedStep);
  }, [haveSeedTagInfo]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">{haveSeedTagInfo ? 'Enter seed tag info' : 'Do you have seed tag info?'}</Typography>
      </Grid>
      {haveSeedTagInfo === false
        && (
        <Grid container sx={{ padding: '1rem' }}>
          <Grid item xs={12} display="flex" justifyContent="center" gap="1rem">
            <PSAButton
              buttonType=""
              variant="outlined"
              onClick={() => handleHaveSeedTagInfo(true)}
              data-test="selection_yes"
              title={(
                <>
                  Yes
                  <CheckIcon color="primary.dark" />
                </>
)}
            />
            <PSAButton
              buttonType=""
              variant="outlined"
              onClick={() => handleHaveSeedTagInfo(true)}
              data-test="selection_no"
              title={(
                <>
                  No
                  <CloseIcon color="error" />
                </>
)}
            />
          </Grid>
        </Grid>
        )}
      {haveSeedTagInfo === true
        && (seedsSelected.map((seed, i) => (
          <Grid item xs={12} key={i}>
            <DSTAccordion
              expanded={accordionState[seed.label]}
              onChange={() => handleExpandAccordion(seed.label)}
              summary={<Typography>{seed.label}</Typography>}
            >
              <Grid container>
                <LeftGrid item xs={4} lg={2} xl={2}>
                  <Typography>% Germination: </Typography>
                </LeftGrid>
                <Grid item xs={2} lg={1} xl={1}>
                  <SeedTagNumField
                    value={(options[seed.label].germination ?? 0.85) * 100}
                    onChange={(val) => {
                      updateGermination(seed.label, val / 100);
                    }}
                    testId={`${seed.label}-germination`}
                  />
                </Grid>
                <Grid item xs={6} lg={1} xl={1} />

                <LeftGrid item xs={4} lg={2} xl={2}>
                  <Typography>% Purity: </Typography>
                </LeftGrid>
                <Grid item xs={2} lg={1} xl={1}>
                  <SeedTagNumField
                    value={(options[seed.label].purity ?? 0.9) * 100}
                    onChange={(val) => {
                      updatePurity(seed.label, val / 100);
                    }}
                    testId={`${seed.label}-purity`}
                  />
                </Grid>
                <Grid item xs={6} lg={1} xl={1} />

                <LeftGrid item xs={4} lg={2} xl={2}>
                  <Typography>Seeds per Pound </Typography>
                </LeftGrid>
                <Grid item xs={2} lg={1} xl={1}>
                  <SeedTagNumField
                    value={parseFloat(seedsPerPound(seed))}
                    onChange={(val) => {
                      updateSeedsPerPound(seed.label, val);
                    }}
                    testId={`${seed.label}-seedsPerPound`}
                  />
                </Grid>
                <Grid item xs={6} lg={1} xl={1} />
              </Grid>
            </DSTAccordion>

          </Grid>
        )))}
    </Grid>
  );
};
export default SeedTagInfo;
