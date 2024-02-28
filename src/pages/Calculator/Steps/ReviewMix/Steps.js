import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import { convertToPercent } from '../../../../shared/utils/calculator';
import Dropdown from '../../../../components/Dropdown';
import { seedingMethods, seedingMethodsNECCC } from '../../../../shared/data/dropdown';
import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const ReviewMixSteps = ({
  council,
  seed,
  handleFormValueChange,
  calculatorResult,
}) => {
  const [methods, setMethods] = useState({});

  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { options } = useSelector((state) => state.calculator);

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

  useEffect(() => {
    const coefficients = seed.attributes.Coefficients;
    const plantingMethods = council === 'MCCC' ? {
      Drilled: 1,
      Precision: parseFloat(coefficients['Precision Coefficient']?.values[0]) || null,
      Broadcast: parseFloat(coefficients['Broadcast Coefficient']?.values[0]) || null,
      Aerial: parseFloat(coefficients['Aerial Coefficient']?.values[0]) || null,
    } : {
      Drilled: 1,
      'Broadcast(With Cultivation)':
      parseFloat(coefficients['Broadcast with Cultivation Coefficient']?.values[0]) || null,
      'Broadcast(With No Cultivation)':
      parseFloat(coefficients['Broadcast without Cultivation Coefficient']?.values[0]) || null,
      Aerial: parseFloat(coefficients['Aerial Coefficient']?.values[0]) || null,
    };
    setMethods(plantingMethods);
  }, []);

  return (
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            'Soil Fertility Modifier',
            'Sum Species of Group In Mix',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
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
                label={matchesMd ? '' : 'Sum Species of Group In Mix'}
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
                label="Seeding Rate In Mix (Lbs per Acre)"
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
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>
          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            '% of Single Species Rate',
            'Seeding Rate in Mix (Lbs per Acre)',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
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
                label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
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
          <Typography variant="stepHeader">Adjustment from Seeding Method</Typography>
        </Grid>
        <Grid item xs={6} margin="1rem">
          <Dropdown
            value={options[seed.label].plantingMethod ?? ''}
            label="Seeding Method: "
            handleChange={(e) => {
              dispatch(
                setOptionRedux(seed.label, {
                  ...options[seed.label],
                  plantingMethod: e.target.value,
                  plantingMethodModifier: methods[e.target.value],
                }),
              );
            }}
            items={council === 'MCCC' ? seedingMethods : seedingMethodsNECCC}
          />
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix (Lbs per Acre)',
          'Planting Method',
          'Seeding Rate in Mix (Lbs per Acre)',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
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
              disabled
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
              disabled
              value={step2.seedingRateAfterPlantingMethodModifier}
            />
          </Grid>
        </Grid>
      </>

      {/* Step 3: */}
      <>
        <Grid item xs={12}>
          <Typography variant="stepHeader">Adjustment from Management Goals</Typography>
        </Grid>
        {renderStepsForm(
          'Seeding Rate in Mix (Lbs per Acre)',
          'Management impact on Mix',
          'Seeding Rate in Mix (Lbs per Acre)',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
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
              disabled
              value={step3.managementImpactOnMix ?? 1}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
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
          <Typography variant="stepHeader">Bulk Seeding Rate</Typography>
        </Grid>
        {renderStepsForm('Seeding Rate in Mix (Lbs per Acre)', '% Germination', '% Purity')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
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
              label="Bulk Seeding Rate (Lbs per Acre)"
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
          <Typography variant="stepHeader">Pounds for Purchase</Typography>
        </Grid>
        {renderStepsForm('Bulk Seeding Rate (Lbs per Acre)', 'Acres', 'Pounds for Purchase')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Bulk Seeding Rate (Lbs per Acre)'}
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
