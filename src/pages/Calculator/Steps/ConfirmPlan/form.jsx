import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import NumberTextField from '../../../../components/NumberTextField';
import NRCSStandards from './NRCSStandards';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';
import { setAcresRedux } from '../../../../features/siteConditionSlice/actions';
import { historyStates } from '../../../../features/userSlice/state';
import { setHistoryStateRedux } from '../../../../features/userSlice/actions';
import '../steps.scss';

const ConfirmPlanForm = ({
  nrcsResult, seedsSelected, calculatorResult, options,
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const { checkNRCSStandards } = useSelector((state) => state.siteCondition);
  const { historyState } = useSelector((state) => state.user);

  const renderStepsForm = (label1, label2, label3) => (
    matchesMd && (
    <Grid container>
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '1rem' }}>
          {label1}
        </Typography>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '1rem' }}>
          {label2}
        </Typography>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '1rem' }}>
          {label3}
        </Typography>
      </Grid>
    </Grid>
    )
  );

  const renderConfirmPlanForm = (seed) => {
    const result = calculatorResult[seed.label];
    return (
      <Grid container>
        <Grid container sx={{ p: '0.625rem' }}>
          {renderStepsForm('Bulk Lbs per Acre', 'Acres', 'Total Pounds')}
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Bulk Lbs per Acre'}
              value={result.bulkSeedingRate}
              testId={`${seed.label}-bulk-seeding-rate`}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Acres'}
              value={result.acres}
              onChange={(val) => {
                dispatch(setAcresRedux(val));
                seedsSelected.forEach((s) => {
                  dispatch(setOptionRedux(s.label, { ...options[s.label], acres: val }));
                });
                if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
              }}
              testId={`${seed.label}-acres`}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Total Pounds'}
              disabled
              value={result.totalPounds}
              testId={`${seed.label}-total-pounds`}
            />
          </Grid>

          <Grid item xs={1} />
        </Grid>

        <Grid container sx={{ p: '0.625rem' }}>
          <Grid item xs={3} />
          <Grid item xs={1} />
          <Grid item xs={3}>
            <NumberTextField
              label="Cost per Pound"
              value={result.costPerPound}
              onChange={(val) => {
                dispatch(
                  setOptionRedux(seed.label, { ...options[seed.label], costPerPound: val }),
                );
                if (historyState === historyStates.imported) dispatch(setHistoryStateRedux(historyStates.updated));
              }}
              testId={`${seed.label}-cost-per-pound`}
            />
          </Grid>
          <Grid item xs={3} />
        </Grid>

        <Grid container sx={{ p: '0.625rem' }}>
          {renderStepsForm('Cost per Pound', 'Total Pounds', 'Total Cost')}
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Cost per Pound'}
              value={result.costPerPound}
              testId={`${seed.label}-cost-per-pound-disabled`}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Total Pounds'}
              value={result.totalPounds}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Total Cost'}
              disabled
              value={result.totalCost}
              testId={`${seed.label}-total-cost`}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderTotalCostOfMix = () => {
    const totalCostOfMix = seedsSelected.reduce(
      (total, seed) => total + calculatorResult[seed.label].totalCost,
      0,
    );
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="stepHeader">Total Cost of mix:</Typography>
        </Grid>

        {seedsSelected.map((seed, i) => (
          <Fragment key={i}>
            <Grid item xs={3} sx={{ p: '0.625rem' }}>
              <NumberTextField
                label={`${seed.label}`}
                disabled
                value={`$${calculatorResult[seed.label].totalCost.toFixed(2)}`}
              />
              {' '}
            </Grid>
            <Grid item xs={1} sx={{ p: '0.625rem' }}>
              <Typography variant="mathIcon">
                {i !== seedsSelected.length - 1 ? '+' : '='}
              </Typography>
            </Grid>
          </Fragment>
        ))}
        <Grid item xs={6} sx={{ p: '0.625rem' }}>
          <NumberTextField
            label="Total Cost of Mix"
            disabled
            value={`$${totalCostOfMix.toFixed(2)}`}
          />
          {' '}
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container color="primary.text">
      {/* NRCS Standards */}
      {checkNRCSStandards && <NRCSStandards nrcsResult={nrcsResult} />}
      <Grid item xs={12}>
        {seedsSelected.map((seed, i) => (
          <Grid container key={i}>
            <Grid item xs={12}>
              <Typography variant="stepHeader">{seed.label}</Typography>
            </Grid>
            <Grid item xs={12}>
              {renderConfirmPlanForm(seed)}
            </Grid>
          </Grid>
        ))}
        {renderTotalCostOfMix()}
      </Grid>
    </Grid>
  );
};

export default ConfirmPlanForm;
