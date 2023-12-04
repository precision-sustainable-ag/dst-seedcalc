import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import {
  convertToPercent,
  convertToDecimal,
} from '../../../../shared/utils/calculate';
import '../steps.scss';

const ReviewMixSteps = ({
  council,
  updateSeed,
  seed,
  handleFormValueChange,
  calculatorResult,
}) => {
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

  const {
    // eslint-disable-next-line no-unused-vars
    step1, step2, step3, step4, step5,
  } = calculatorResult;

  console.log('calculatorResult', calculatorResult);

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
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
              handleChange={(e) => {
                updateSeed(e.target.value, 'singleSpeciesSeedingRatePLS', seed);
                handleFormValueChange(seed, 'singleSpeciesSeedingRate', parseFloat(e.target.value));
              }}
              value={step1.singleSpeciesSeedingRate}
            />
            <Typography>Lbs / Acre</Typography>
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
              label={matchesMd ? '' : 'Sum Species Of Group In Mix'}
              // handleChange={(e) => {
              //   updateSeed(e.target.value, 'percentOfSingleSpeciesRate', seed);
              // }}
              value={step1.sumGroupInMix}
            />
            <Typography>{council === 'MCCC' ? 'MCCC' : 'NECCC'}</Typography>
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
              <Typography>Lbs / Acre</Typography>
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
          <Grid container>
            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
                value={step1.singleSpeciesSeedingRate}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : '% of Single Species Rate'}
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    'percentOfSingleSpeciesRate',
                    seed,
                  );
                  handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
                }}
                value={step1.percentOfRate}
              />
              <Typography>
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
              <Typography>Lbs / Acre</Typography>
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
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Seeding Rate in Mix'}
            value={step2.seedingRate}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Planting Method'}
            value={step2.plantingMethodModifier}
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
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </>

      {/* Step 3: */}
      <>
        <Grid item xs={12}>
          <Typography className="step-header">Step 3: </Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix',
          'Seeding Rate in Mix',
          'Management impact on mix',
        )}
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Seeding Rate in Mix'}
            disabled
            value={step3.seedingRate}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">+</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography className="math-icon">(</Typography>
        </Grid>

        <Grid item xs={2}>
          <NumberTextField
            label={matchesMd ? '' : 'Seeding Rate in Mix'}
            disabled
            value={step3.seedingRate}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={2}>
          <NumberTextField
            label={matchesMd ? '' : 'Management Impact on Mix'}
            disabled
            value={step3.managementImpactOnMix}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">)</Typography>
        </Grid>

        <Grid item xs={1} />

        <Grid container p="10px">
          <Grid item xs={4}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={7}>
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
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Seeding Rate in Mix'}
            disabled
            value={step4.seedingRateAfterManagementImpact}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">÷</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : '% Germination'}
            handleChange={(e) => {
              updateSeed(
                convertToDecimal(e.target.value),
                'germinationPercentage',
                seed,
              );
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
              updateSeed(
                convertToDecimal(e.target.value),
                'purityPercentage',
                seed,
              );
              handleFormValueChange(seed, 'purity', parseFloat(e.target.value) / 100);
            }}
            value={convertToPercent(step4.purity)}
          />
          <Typography>Lbs / Acre</Typography>
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
        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Bulk Seeding Rate'}
            disabled
            value={step5.bulkSeedingRate}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Acres'}
            disabled
            handleChange={(e) => {
              updateSeed(e.target.value, 'acres', seed);
            }}
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
          <Typography>Lbs / Acre</Typography>
        </Grid>
      </>
    </Grid>
  );
};
export default ReviewMixSteps;
