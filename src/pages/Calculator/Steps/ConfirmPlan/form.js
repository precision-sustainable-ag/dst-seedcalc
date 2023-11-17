import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import NumberTextField from '../../../../components/NumberTextField';
import DSTTextField from '../../../../components/DSTTextField';
import DSTSwitch from '../../../../components/Switch';

import NRCSStandards from './NRCSStandards';
import '../steps.scss';

const ConfirmPlanForm = ({ updateSeed, data }) => {
  const { seedsSelected } = data.speciesSelection;
  const { NRCS } = data;

  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

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

  const renderConfirmPlanForm = (seed) => (
    <Grid container>
      <Grid container sx={{ p: '0.625rem' }}>
        {renderStepsForm('Bulk Lbs / Acre', 'Acres', 'Total Pounds')}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Bulk Lbs / Acre'}
            handleChange={(e) => {
              updateSeed(e.target.value, 'bulkSeedingRate', seed);
            }}
            value={seed.bulkSeedingRate}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Acres'}
            handleChange={(e) => {
              updateSeed(e.target.value, 'acres', seed);
            }}
            value={seed.acres}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Total Pounds'}
            disabled
            value={seed.totalPounds}
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
            value={seed.costPerPound}
          />
        </Grid>
        <Grid item xs={3}>
          {' '}
          <DSTSwitch
            checked={seed.confirmToggle}
            handleChange={() => {
              updateSeed(!seed.confirmToggle, 'confirmToggle', seed);
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
            handleChange={(e) => {
              updateSeed(e.target.value, 'costPerPound', seed);
            }}
            value={seed.costPerPound}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Total Pounds'}
            value={seed.totalPounds}
          />
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>
        <Grid item xs={3}>
          <DSTTextField
            label={matchesMd ? '' : 'Total Cost'}
            disabled
            value={`$${seed.totalCost.toFixed(2)}`}
          />
        </Grid>
      </Grid>
    </Grid>
  );

  const renderTotalCostOfMix = () => {
    const totalCostOfMix = seedsSelected.reduce(
      (sum, a) => sum + a.totalCost,
      0,
    );
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography className="step-header">Total Cost of mix:</Typography>
        </Grid>
        <Grid item xs={3} sx={{ p: '0.625rem' }}>
          <DSTTextField
            label={`${seedsSelected[0].label}`}
            //
            disabled
            value={`$${seedsSelected[0].totalCost.toFixed(2)}`}
          />
          {' '}
        </Grid>
        <Grid item xs={1} sx={{ p: '0.625rem' }}>
          <Typography className="math-icon">+</Typography>
        </Grid>
        {seedsSelected.map((s, i) => {
          if (i !== 0) {
            return (
              <Fragment key={i}>
                <Grid item xs={3} sx={{ p: '0.625rem' }}>
                  <DSTTextField
                    label={`${s.label}`}
                    disabled
                    value={`$${s.totalCost.toFixed(2)}`}
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
          }
          return null;
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
      {NRCS.enabled && <NRCSStandards NRCS={NRCS} />}
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
        {renderTotalCostOfMix(data)}
      </Grid>
    </Grid>
  );
};

export default ConfirmPlanForm;
