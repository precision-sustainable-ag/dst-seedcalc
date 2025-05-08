import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Typography, useTheme, useMediaQuery,
} from '@mui/material';
import { PSASlider } from 'shared-react-components/src';
import { twoDigit, convertToPercent } from '../../../../shared/utils/calculator';
import NumberTextField from '../../../../components/NumberTextField';
import '../steps.scss';

const MixRatioSteps = ({
  council, calculatorResult, options, seed, handleFormValueChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [survival, setSurvival] = useState(0);

  const renderFormLabel = (label1, label2, label3) => (
    isMobile && (
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
    // eslint-disable-next-line no-unused-vars
    step1, step2, step3, step4,
  } = calculatorResult;
  const { soilFertilityModifier } = calculatorResult.step1;

  const percentOfRateNECCC = convertToPercent(options.percentOfRate / soilFertilityModifier || 1 / step1.sumGroupInMix);

  useEffect(() => {
    setSurvival(Math.round(twoDigit(calculatorResult.step3.percentSurvival) * 100));
  }, [calculatorResult]);

  return (
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>
          {renderFormLabel(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            'Soil Fertility Modifier',
            '% of Single Species Rate',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
                disabled
                value={step1.defaultSingleSpeciesSeedingRatePLS}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Soil Fertility Modifier'}
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
                label={isMobile ? '' : '% of Single Species Rate'}
                value={percentOfRateNECCC}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="space-evenly" marginTop={isMobile ? '20px' : 0}>
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

      {/* MCCC Step 1:  */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>
          {renderFormLabel(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            '% of Single Species Rate',
            'Seeding Rate In Mix (Lbs per Acre)',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
                disabled
                value={step1.defaultSingleSpeciesSeedingRatePLS}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : '% of Single Species Rate'}
                disabled
                value={convertToPercent(step1.percentOfRate)}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Seeding Rate In Mix (Lbs per Acre)'}
                disabled
                value={step1.seedingRate}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* SCCC Step 1:  */}
      {council === 'SCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeding Rate in Mix</Typography>
          </Grid>
          {renderFormLabel(
            'Single Species Seeding Rate PLS (Lbs per Acre)',
            '% of Single Species Rate',
            'Planting Time Modifier',
          )}
          <Grid container justifyContent="space-evenly" pb="1rem">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Single Species Seeding Rate PLS (Lbs per Acre)'}
                disabled
                value={step1.defaultSingleSpeciesSeedingRatePLS}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : '% of Single Species Rate'}
                disabled
                value={convertToPercent(step1.percentOfRate)}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={isMobile ? '' : 'Planting Time Modifier'}
                value={step1.plantingTimeModifier}
              />
            </Grid>
          </Grid>

          {renderFormLabel(
            '',
            'Mix Competition Coefficient',
            'Seeding Rate In Mix (Lbs per Acre)',
          )}

          <Grid container justifyContent="space-evenly">
            <Grid item xs={3} />
            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                disabled
                label={isMobile ? '' : 'Mix Competition Coefficient'}
                value={step1.mixCompetitionCoefficient}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Seeding Rate In Mix (Lbs per Acre)'}
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
          <Typography variant="stepHeader" data-test="seeds_per_acre">Seeds per Acre</Typography>
        </Grid>
        {renderFormLabel(
          'Seeds per Pound',
          'Seeding Rate In Mix (Lbs per Acre)',
          'Seeds per Acre',
        )}
        <Grid container justifyContent="space-evenly">
          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={isMobile ? '' : 'Seeds per Pound'}
              value={step2.seedsPerPound}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={isMobile ? '' : 'Seeding Rate In Mix (Lbs per Acre)'}
              value={step2.seedingRate}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography variant="mathIcon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={isMobile ? '' : 'Seeds per Acre'}
              disabled
              value={step2.seedsPerAcre}
            />
          </Grid>
        </Grid>
      </>

      {/* NECCC Step 3: */}
      {(council === 'SCCC' || council === 'NECCC') && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Seeds per SqFt</Typography>
          </Grid>
          {renderFormLabel('Seeds per Acre', 'SqFt per Acre', 'Seeds per SqFt')}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Seeds per Acre'}
                disabled
                value={step3.seedsPerAcre}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">÷</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'SqFt per Acre'}
                disabled
                value={step3.sqftPerAcre}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Seeds per SqFt'}
                disabled
                value={step3.seedsPerSqft}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* MCCC Step 3 & Step 4: */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography variant="stepHeader">Plants per Acre</Typography>
          </Grid>

          <Grid container justifyContent="center" pb="1rem">
            <Grid item xs={8}>
              <Typography>
                {`% Survival: ${survival}%`}
              </Typography>
              <PSASlider
                min={0}
                max={100}
                value={survival}
                valueLabelDisplay="auto"
                onChange={(e) => setSurvival(e.target.value)}
                onChangeCommitted={(_, value) => handleFormValueChange(seed, 'percentSurvival', parseFloat(value) / 100)}
                data-test={`${seed.label}-slider_survival`}
              />
            </Grid>
          </Grid>

          {renderFormLabel('Seeds per Acre', '% Survival', 'Plants per Acre')}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Seeds per Acre'}
                disabled
                value={step3.seedsPerAcre}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">&#215;</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : '% Survival'}
                disabled
                value={convertToPercent(step3.percentSurvival)}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Plants per Acre'}
                disabled
                value={step3.plantsPerAcre}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="stepHeader">Approximate Plants per SqFt</Typography>
          </Grid>
          {renderFormLabel(
            'Plants per Acre',
            'SqFt per Acre',
            'Aproximate Plants per SqFt',
          )}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Plants per Acre'}
                disabled
                value={step4.plantsPerAcre}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">÷</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'SqFt per Acre'}
                disabled
                value={step4.sqftPerAcre}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="mathIcon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={isMobile ? '' : 'Aproximate Plants per SqFt'}
                disabled
                value={step4.plantsPerSqft}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};
export default MixRatioSteps;
