/* eslint-disable */
import React, { useState,useEffect,Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import NumberTextField from '../../../../components/NumberTextField';
import DSTTextField from '../../../../components/DSTTextField';
import DSTSwitch from '../../../../components/Switch';
import NRCSStandards from './NRCSStandards';

import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const ConfirmPlanForm = ({
  nrcsResult, seedsSelected, calculatorResult, options
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();

  const { checkNRCSStandards } = useSelector((state) => state.siteCondition);

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
        {renderStepsForm('Bulk Lbs / Acre', 'Acres', 'Total Pounds')}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Bulk Lbs / Acre'}
            value={result.bulkSeedingRate}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Acres'}
            handleChange={(e) => {
              dispatch(setOptionRedux(seed.label, {...options[seed.label], acres: e.target.value}))
            }}
            value={result.acres}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Total Pounds'}
            disabled
            value={result.totalPounds}
          />
        </Grid>

        <Grid item xs={1} />
      </Grid>

      <Grid container sx={{ p: '0.625rem' }}>
        <Grid item xs={3}>
          {/* <Typography>Cost / Pound</Typography> */}
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={3}>
          <NumberTextField
            label="Cost/Pound"
            disabled
            value={result.costPerPound}
          />
        </Grid>
        <Grid item xs={3}>
          {/* FIXME: investigate usage of the switch */}
          <DSTSwitch
            checked={seed.confirmToggle}
            handleChange={() => {
            }}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ p: '0.625rem' }}>
        {renderStepsForm('Cost/Pound', 'Total Pounds', 'Total Cost')}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Cost/Pound'}
            value={result.costPerPound}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Total Pounds'}
            value={result.totalPounds}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Total Cost'}
            disabled
            value={result.totalCost}
          />
        </Grid>
      </Grid>
    </Grid>
  );
  }

  const renderTotalCostOfMix = () => {
    const totalCostOfMix = seedsSelected.reduce(
      (total, seed) => total + calculatorResult[seed.label].totalCost,
      0,
    );
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography className="step-header">Total Cost of mix:</Typography>
        </Grid>
        
        {seedsSelected.map((seed, i) => {
            return (
              <Fragment key={i}>
                <Grid item xs={3} sx={{ p: '0.625rem' }}>
                  <DSTTextField
                    label={`${seed.label}`}
                    disabled
                    value={`$${calculatorResult[seed.label].totalCost.toFixed(2)}`}
                  />
                  {' '}
                </Grid>
                <Grid item xs={1} sx={{ p: '0.625rem' }}>
                  <Typography className="math-icon">
                    {i !== seedsSelected.length - 1 ? '+' : '='}
                  </Typography>
                </Grid>
              </Fragment>
            );
        })}
        <Grid item xs={6} sx={{ p: '0.625rem' }}>
          <DSTTextField
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
              <Typography className="step-header">{seed.label}</Typography>
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
