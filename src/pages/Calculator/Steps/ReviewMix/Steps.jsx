/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import {
  Typography, useTheme, useMediaQuery,
} from '@mui/material';
import { PSADropdown, PSASlider } from 'shared-react-components/src';
import NumberTextField from '../../../../components/NumberTextField';
import { convertToPercent } from '../../../../shared/utils/calculator';
import { seedingMethodsMCCC, seedingMethodsNECCC, seedingMethodsSCCC } from '../../../../shared/data/dropdown';
import '../steps.scss';
import { setOptionRedux } from '../../../../features/calculatorSlice/actions';

const ReviewMixSteps = ({
  council,
  seed,
  handleFormValueChange,
  calculatorResult,
  options,
}) => {
  // TODO: the scrollable seeding rate only works for SCCC for now
  const baseSeedingRate = council === 'SCCC' ? seed.attributes.Planting['Base Seeding Rate'].values[0] : 0;
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { seedsSelected, seedingMethods } = useSelector((state) => state.calculator);

  const renderStepsForm = (label1, label2, label3) => (
    <>
      {matchesMd && (
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
      )}
      <Grid item xs={12} p="0.5rem" />
    </>
  );

  const {
    step1, step2, step3, step4, step5,
  } = calculatorResult;

  const { soilFertilityModifier } = calculatorResult.step1;

  const FormSlider = ({
    range, label, val, onChangeCommitted, unit, step = 1, testId,
  }) => {
    const [value, setValue] = useState(val);

    useEffect(() => {
      setValue(val);
    }, [val]);

    return (
      <Grid container>
        <Grid item xs={2} md={3} />
        <Grid item xs={8} md={6}>
          <Typography>
            {`${label}: ${value} ${unit}`}
          </Typography>
        </Grid>
        <Grid item xs={2} md={3} />
        <Grid item xs={2} md={3} />
        <Grid item xs={8} md={6}>
          <PSASlider
            min={range[0]}
            max={range[1]}
            step={step}
            value={value}
            valueLabelDisplay="auto"
            onChange={(e, v) => {
              if (v !== undefined) setValue(v);
              else setValue(e.target.value);
            }}
            onChangeCommitted={() => {
              onChangeCommitted(value);
            }}
            dataTestId={testId}
          />
        </Grid>
        <Grid item xs={2} md={6} />
      </Grid>
    );
  };

  const getSeedingMethods = () => {
    switch (council) {
      case 'MCCC':
        return seedingMethodsMCCC;
      case 'NECCC':
        return seedingMethodsNECCC;
      case 'SCCC':
        return seedingMethodsSCCC;
      default:
        return [];
    }
  };

  const percentOfRateNECCC = convertToPercent(options.percentOfRate / soilFertilityModifier || 1 / step1.sumGroupInMix);

  return (
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>

          <FormSlider
            range={[0, 100]}
            label="% of Single Species Rate"
            val={percentOfRateNECCC}
            onChangeCommitted={(val) => {
              // the percent of rate need to multiply by soil fertility modifier
              handleFormValueChange(seed, 'percentOfRate', (soilFertilityModifier * parseFloat(val)) / 100);
            }}
            unit="%"
            testId="percent_slider"
          />
          <Grid item xs={12} p="0.5rem" />

          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            'Soil Fertility Modifier',
            '% of Single Species Rate',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
                disabled
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
                value={step1.soilFertilityModifier}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : '% of Single Species Rate'}
                value={percentOfRateNECCC}
              />
            </Grid>
          </Grid>
          <Grid container p="1rem 0 0 0" justifyContent="space-evenly">
            <Grid item xs={3}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={3}>
              <NumberTextField
                label="Seeding Rate In Mix (Lbs per Acre)"
                disabled
                value={step1.seedingRate}
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={3} />
          </Grid>
        </>
      )}

      {/* MCCC Step 1: */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>

          <FormSlider
            range={[0, 100]}
            label="% of Single Species Rate"
            val={convertToPercent(options.percentOfRate)}
            onChangeCommitted={(val) => {
              handleFormValueChange(seed, 'percentOfRate', parseFloat(val) / 100);
            }}
            unit="%"
            testId="percent_slider"
          />

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
                testId="single_rate"
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : '% of Single Species Rate'}
                disabled
                // handleChange={(e) => {
                //   handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
                // }}
                value={convertToPercent(step1.percentOfRate)}
                testId="percent_rate"
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
                testId="mix_rate"
              />
            </Grid>

          </Grid>
        </>
      )}

      {/* SCCC Step 1: */}
      {council === 'SCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>

          <FormSlider
            range={[baseSeedingRate * 0.5, baseSeedingRate * 1.5]}
            label="Single Species Seeding Rate PLS"
            val={options.singleSpeciesSeedingRate ?? step1.singleSpeciesSeedingRate}
            onChangeCommitted={(val) => {
              handleFormValueChange(seed, 'singleSpeciesSeedingRate', val);
            }}
            unit="Lbs per Acre"
            step={0.1}
            testId="seeding_rate_slider"
          />

          <FormSlider
            range={[0, 100]}
            label="% of Single Species Rate"
            val={convertToPercent(options.percentOfRate)}
            onChangeCommitted={(val) => {
              handleFormValueChange(seed, 'percentOfRate', parseFloat(val) / 100);
            }}
            unit="%"
            testId="percent_slider"
          />
          <Grid item xs={12} p="0.5rem" />

          {renderStepsForm(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            'Percent Of Rate',
            'Planting Time Modifier',
          )}
          <Grid container justifyContent="space-evenly" pb="1rem">
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
                label={matchesMd ? '' : 'Percent Of Rate'}
                disabled
                value={convertToPercent(step1.percentOfRate)}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Planting Time Modifier'}
                disabled
                value={step1.plantingTimeModifier}
              />
            </Grid>

          </Grid>

          {renderStepsForm(
            '',
            'Mix Competition Coefficient',
            'Seeding Rate In Mix (Lbs per Acre)',
          )}

          <Grid container p="1rem 0 0 0" justifyContent="space-evenly">
            <Grid item xs={3} />
            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={matchesMd ? '' : 'Mix Competition Coefficient'}
                value={step1.mixCompetitionCoefficient}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label="Seeding Rate In Mix (Lbs per Acre)"
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
          <Typography variant="stepHeader" data-test="adjustment_from_seeding_method">Adjustment from Seeding Method</Typography>
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={6} paddingLeft="1rem" paddingBottom="1rem">
          <PSADropdown
            label="Seeding Method: "
            items={getSeedingMethods().map((method) => ({ label: method.label, value: method.label }))}
            formSx={{ minWidth: '100%' }}
            SelectProps={{
              value: options.plantingMethod ?? '',
              onChange: (e) => {
                seedsSelected.forEach((s) => {
                  dispatch(
                    setOptionRedux(s.label, {
                      ...options,
                      plantingMethod: e.target.value,
                      plantingMethodModifier: seedingMethods[seed.label][e.target.value],
                    }),
                  );
                });
              },
              MenuProps: {
                style: { color: '#4F5F30' },
              },
              'data-test': 'seeding_method_selection',
            }}
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

        <FormSlider
          range={[0, 100]}
          label="% Germination"
          val={convertToPercent(options.germination)}
          onChangeCommitted={(val) => {
            handleFormValueChange(seed, 'germination', parseFloat(val) / 100);
          }}
          unit="%"
          testId="germination_slider"
        />
        <FormSlider
          range={[0, 100]}
          label="% Purity"
          val={convertToPercent(options.purity)}
          onChangeCommitted={(val) => {
            handleFormValueChange(seed, 'purity', parseFloat(val) / 100);
          }}
          unit="%"
          testId="purity_slider"
        />
        <Grid item xs={12} p="0.5rem" />

        {renderStepsForm('Seeding Rate in Mix (Lbs per Acre)', '% Germination', '% Purity')}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeding Rate in Mix (Lbs per Acre)'}
              disabled
              value={step4.seedingRateAfterManagementImpact}
              testId="seeding_rate_in_mix"
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Germination'}
              disabled
              // handleChange={(e) => {
              //   handleFormValueChange(seed, 'germination', parseFloat(e.target.value) / 100);
              // }}
              value={convertToPercent(step4.germination)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Purity'}
              disabled
              // handleChange={(e) => {
              //   handleFormValueChange(seed, 'purity', parseFloat(e.target.value) / 100);
              // }}
              value={convertToPercent(step4.purity)}
            />
          </Grid>
        </Grid>
        <Grid container p="1rem 0 0 0" justifyContent="space-evenly">
          <Grid item xs={3}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>
          <Grid item xs={1} />

          <Grid item xs={3}>
            <NumberTextField
              label="Bulk Seeding Rate (Lbs per Acre)"
              disabled
              value={step4.bulkSeedingRate}
              testId="bulk_seeding_rate"
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={3} />

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
