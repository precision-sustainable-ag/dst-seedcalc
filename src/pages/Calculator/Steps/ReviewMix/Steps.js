import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import { convertToPercent } from '../../../../shared/utils/calculator';
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
            <Typography variant="stepHeader">Step 1: Seeding Rate in Mix</Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs / Acre)',
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
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Soil Fertility Modifier'}
                disabled
                value={step1.soilFertilityModifer}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">÷</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Sum Species Of Group In Mix'}
                value={step1.sumGroupInMix}
              />
            </Grid>
          </Grid>
          <Grid container p="10px">
            <Grid item xs={4}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={7}>
              <NumberTextField
                label="Seeding Rate In Mix (Lbs / Acre)"
                disabled
                value={step1.seedingRate}
              />
            </Grid>

            <Grid item xs={1} />
          </Grid>
        </>
      )}

      {/* MCCC Step 1: */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Step 1: Seeding Rate in Mix</Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs / Acre)',
            '% of Single Species Rate',
            'Seeding Rate in Mix (Lbs / Acre)',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS (Lbs / Acre)'}
                value={step1.singleSpeciesSeedingRate}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : '% of Single Species Rate'}
                handleChange={(e) => {
                  handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
                }}
                value={convertToPercent(step1.percentOfRate)}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs / Acre)'}
                disabled
                value={step1.seedingRate}
              />
            </Grid>

          </Grid>
        </>
      )}

      {/* Step 2: */}
      <>
        <Grid item xs={12}>
          <Typography variant="stepHeader">Step 2: Adjust By Seeding Method</Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix (Lbs / Acre)',
          'Planting Method',
          'Seeding Rate in Mix (Lbs / Acre)',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs / Acre)'}
              value={step2.seedingRate}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
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
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs / Acre)'}
              disabled
              value={step2.seedingRateAfterPlantingMethodModifier}
            />
          </Grid>
        </Grid>
      </>

      {/* Step 3: */}
      <>
        <Grid item xs={12}>
          <Typography variant="stepHeader">Step 3: Adjust By Management Impact</Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix (Lbs / Acre)',
          'Management impact on Mix',
          'Seeding Rate in Mix (Lbs / Acre)',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs / Acre)'}
              disabled
              value={step3.seedingRate}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Management Impact on Mix'}
              handleChange={(e) => handleFormValueChange(seed, 'managementImpactOnMix', parseFloat(e.target.value))}
              value={step3.managementImpactOnMix ?? 1}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs / Acre)'}
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
          <Typography variant="stepHeader">Step 4: Bulk Seeding Rate</Typography>
        </Grid>
        {renderStepsForm('Seeding Rate in Mix (Lbs / Acre)', '% Germination', '% Purity')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix'}
              disabled
              value={step4.seedingRateAfterManagementImpact}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">÷</Typography>
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
            <Typography variant="mathIcon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Purity'}
              handleChange={(e) => {
                handleFormValueChange(seed, 'purity', parseFloat(e.target.value) / 100);
              }}
              value={convertToPercent(step4.purity)}
            />
          </Grid>
        </Grid>
        <Grid container p="10px">
          <Grid item xs={4}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={7}>
            <NumberTextField
              label="Bulk Seeding Rate (Lbs / Acre)"
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
          <Typography variant="stepHeader">Step 5: Pounds for Purchase</Typography>
        </Grid>
        {renderStepsForm('Bulk Seeding Rate (Lbs / Acre)', 'Acres', 'Pounds for Purchase')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Bulk Seeding Rate (Lbs / Acre)'}
              disabled
              value={step5.bulkSeedingRate}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Acres'}
              disabled
              value={step5.acres}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Pounds for Purchase'}
              disabled
              value={step5.poundsForPurchase}
            />
          </Grid>

        </Grid>
      </>
    </Grid>
  );
};
export default ReviewMixSteps;
