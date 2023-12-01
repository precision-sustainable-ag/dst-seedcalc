import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import {
  convertToPercent, twoDigit,
} from '../../../../shared/utils/calculate';
import '../steps.scss';

const MixRatioSteps = ({
  seed, council, handleFormValueChange, calculatorResult,
}) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));

  const renderFormLabel = (label1, label2, label3) => (
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
    step1, step2, step3, step4,
  } = calculatorResult;

  return (
    <Grid container>
      {/* NECCC Step 1:  */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1: </Typography>
          </Grid>
          {renderFormLabel(
            'Mix Seeding Rate PLS',
            'Soil Fertility Modifier',
            'Sum Species Of Group In Mix',
          )}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
              handleChange={(e) => {
                handleFormValueChange(seed, 'singleSpeciesSeedingRate', parseFloat(e.target.value));
              }}
              value={twoDigit(step1.defaultSingleSpeciesSeedingRatePLS)}
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
              value={twoDigit(step1.soilFertilityModifier)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              disabled
              label={matchesMd ? '' : 'Sum Species Of Group In Mix'}
              // TODO: need verification
              // handleChange={(e) => {
              //   handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
              // }}
              value={twoDigit(step1.sumGroupInMix)}
            />
            <Typography>NECCC</Typography>
          </Grid>

          <Grid container p="10px">
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={7}>
              <NumberTextField
                label="Seeding Rate In Mix"
                disabled
                value={twoDigit(step1.seedingRate)}
              />
              <Typography>Lbs / Acre</Typography>
            </Grid>

            <Grid item xs={1} />
          </Grid>
        </>
      )}

      {/* MCCC Step 1:  */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 1:</Typography>
          </Grid>
          {renderFormLabel(
            'Single Species Seeding Rate PLS',
            '% of Single Species Rate',
            'Seeding Rate In Mix',
          )}
          <Grid container>
            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
                handleChange={(e) => {
                  handleFormValueChange(seed, 'singleSpeciesSeedingRate', parseFloat(e.target.value));
                }}
                value={twoDigit(step1.defaultSingleSpeciesSeedingRatePLS)}
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
                  handleFormValueChange(seed, 'percentOfRate', parseFloat(e.target.value) / 100);
                }}
                value={twoDigit(convertToPercent(step1.percentOfRate))}
              />
              <Typography>MCCC</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Seeding Rate In Mix'}
                disabled
                value={twoDigit(step1.seedingRate)}
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
        {renderFormLabel(
          'Single Species Seeding Rate PLS',
          '% of Single Species Rate',
          'Seeding Rate In Mix',
        )}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Seeds / Pound'}
            value={twoDigit(step2.seedsPerPound)}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Seeding Rate In Mix'}
            value={twoDigit(step2.seedingRate)}
          />
          <Typography>Lbs / Acre</Typography>
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">=</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            label={matchesMd ? '' : 'Seeds / Acre'}
            disabled
            value={twoDigit(step2.seedsPerAcre)}
          />
        </Grid>
      </>

      {/* NECCC Step 3: */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 3: </Typography>
          </Grid>
          {renderFormLabel('Seeds/Acre', 'Sq. Ft. / Acres', 'Seeds / Sq. Ft.')}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeds / Acre'}
              disabled
              value={twoDigit(step3.seedsPerAcre)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Sq. Ft./ Acre'}
              disabled
              value={twoDigit(step3.sqftPerAcre)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeds / Sq. Ft.'}
              disabled
              value={twoDigit(step3.seedsPerSqft)}
            />
          </Grid>
        </>
      )}

      {/* MCCC Step 3 & Step 4: */}
      {council === 'MCCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 3: </Typography>
          </Grid>
          {renderFormLabel('Seeds/Acre', '% Survival', 'Plants/Acre')}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeds / Acre'}
              disabled
              value={twoDigit(step3.seedsPerAcre)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Survival'}
              handleChange={(e) => {
                handleFormValueChange(seed, 'percentSurvival', parseFloat(e.target.value) / 100);
              }}
              value={twoDigit(convertToPercent(step3.percentSurvival))}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Plants / Acre'}
              disabled
              value={twoDigit(step3.plantsPerAcre)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className="step-header">Step 4: </Typography>
          </Grid>
          {renderFormLabel(
            'Plants/Acre',
            'Sq.Ft./Acre',
            'Aproximate Plants/Sq.Ft.',
          )}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Plants / Acre'}
              disabled
              value={twoDigit(step4.plantsPerAcre)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Sq. Ft./ Acre'}
              disabled
              value={twoDigit(step4.sqftPerAcre)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Aproximate Plants / Sq.Ft.'}
              disabled
              value={twoDigit(step4.plantsPerSqft)}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};
export default MixRatioSteps;
