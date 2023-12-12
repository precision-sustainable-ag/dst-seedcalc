import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import {
  convertToPercent,
} from '../../../../shared/utils/calculate';
import '../steps.scss';

const ReviewMixSteps = ({
  council,
  seed,
  handleFormValueChange,
  calculatorResult,
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const renderStepsForm = (label1, label2, label3) => (
    matchesMd && (
    <Grid container justifyContent="space-evenly">
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '0.5rem' }}>
          {label1}
        </Typography>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '0.5rem' }}>
          {label2}
        </Typography>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={3}>
        <Typography sx={{ fontSize: '0.75rem', pb: '0.5rem' }}>
          {label3}
        </Typography>
      </Grid>
    </Grid>
    )
  );

  const {
    step1, step2, step3, step4, step5,
  } = calculatorResult;

  return (
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1: </Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS',
            'Soil Fertility Modifier',
            'Sum Species Of Group In Mix',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
                handleChange={(e) => {
                  handleFormValueChange(seed, 'singleSpeciesSeedingRate', parseFloat(e.target.value));
                }}
                value={step1.singleSpeciesSeedingRate}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Soil Fertility Modifier'}
                disabled
                value={step1.soilFertilityModifer}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">÷</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Sum Species Of Group In Mix'}
                value={step1.sumGroupInMix}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>{council === 'MCCC' ? 'MCCC' : 'NECCC'}</Typography>
            </Grid>
          </Grid>
          <Grid container p="10px">
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={7}>
              <NumberTextField
                label={matchesMd ? '' : 'Seeding Rate In Mix'}
                disabled
                value={step1.seedingRate}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1} />
          </Grid>
        </>
      )}

      {/* MCCC Step 1: */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1:</Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS',
            '% of Single Species Rate',
            'Seeding Rate in Mix',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
                value={step1.singleSpeciesSeedingRate}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : '% of Single Species Rate'}
                handleChange={(e) => {
                  handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
                }}
                value={convertToPercent(step1.percentOfRate)}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>
                {council === 'MCCC' && 'MCCC Recommendation'}
              </Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Seeding Rate in Mix'}
                disabled
                value={step1.seedingRate}
              />
              <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
            </Grid>

          </Grid>
        </>
      )}

      {/* Step 2: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 2: </Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix',
          'Planting Method',
          'Seeding Rate in Mix',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              value={step2.seedingRate}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Planting Method'}
              value={step2.plantingMethodModifier ?? 1}
              handleChange={(e) => {
                handleFormValueChange(seed, 'plantingMethodModifier', parseFloat(e.target.value));
              }}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              disabled
              value={step2.seedingRateAfterPlantingMethodModifier}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>
        </Grid>
      </>

      {/* Step 3: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 3: </Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix',
          'Management impact on Mix',
          'Seeding Rate in Mix',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              disabled
              value={step3.seedingRate}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Management Impact on Mix'}
              disabled
              value={step3.managementImpactOnMix ?? 1}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              disabled
              value={step3.seedingRateAfterManagementImpact}
            />
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </>

      {/* Step 4: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 4: </Typography>
        </Grid>
        {renderStepsForm('Seeding Rate in Mix', '% Germination', '% Purity')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              disabled
              value={step4.seedingRateAfterManagementImpact}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Germination'}
              handleChange={(e) => {
                handleFormValueChange(seed, 'germination', parseFloat(e.target.value) / 100);
              }}
              value={convertToPercent(step4.germination)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Purity'}
              handleChange={(e) => {
                handleFormValueChange(seed, 'purity', parseFloat(e.target.value) / 100);
              }}
              value={convertToPercent(step4.purity)}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>
        </Grid>
        <Grid container p="10px">
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={7}>
            <NumberTextField
              label={matchesMd ? '' : 'Bulk Seeding Rate'}
              disabled
              value={step4.bulkSeedingRate}
            />
          </Grid>

          <Grid item xs={1} />
        </Grid>
      </>

      {/* Step 5: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 5: </Typography>
        </Grid>
        {renderStepsForm('Bulk Seeding Rate', 'Acres', 'Pounds for Purchase')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Bulk Seeding Rate'}
              disabled
              value={step5.bulkSeedingRate}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Acres'}
              disabled
              value={step5.acres}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Pounds for Purchase'}
              disabled
              value={step5.poundsForPurchase}
            />
            <Typography fontSize={matchesMd ? '0.75rem' : '1rem'}>Lbs / Acre</Typography>
          </Grid>

        </Grid>
      </>
    </Grid>
  );
};
export default ReviewMixSteps;
