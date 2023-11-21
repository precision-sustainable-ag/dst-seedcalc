import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, useTheme, useMediaQuery } from '@mui/material';

import NumberTextField from '../../../../components/NumberTextField';
import {
  convertToPercent,
  convertToDecimal,
} from '../../../../shared/utils/calculate';
import '../steps.scss';

const MixRatioSteps = ({
  seed, council, updateSeed, seedsSelected,
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

  const generatePercentInGroup = (seedData) => {
    const group = seedData.group.label;
    let count = 0;
    seedsSelected.map((s) => {
      if (s.group.label === group) count += 1;
      return null;
    });
    return 1 / count;
  };

  const percentInGroup = generatePercentInGroup(seed);

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
            '% in Group',
            '% of Single Species Seeding Rate',
          )}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
              handleChange={(e) => {
                updateSeed(e.target.value, 'singleSpeciesSeedingRatePLS', seed);
              }}
              value={seed.singleSpeciesSeedingRatePLS}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% in Group'}
              disabled
              value={Math.round(convertToPercent(percentInGroup))}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% of Single Species Rate'}
              handleChange={(e) => {
                updateSeed(e.target.value, 'percentOfSingleSpeciesRate', seed);
              }}
              value={Math.round(seed.percentOfSingleSpeciesRate)}
            />
            <Typography>NECCC</Typography>
          </Grid>

          <Grid container p="10px">
            <Grid item xs={4}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={7}>
              <NumberTextField
                label="Mix Seeding Rate"
                disabled
                value={seed.mixSeedingRate}
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
            'Mix Seeding Rate',
          )}
          <Grid container>
            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Single Species Seeding Rate PLS'}
                handleChange={(e) => {
                  updateSeed(
                    e.target.value,
                    'singleSpeciesSeedingRatePLS',
                    seed,
                  );
                }}
                value={seed.singleSpeciesSeedingRatePLS}
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
                }}
                value={seed.percentOfSingleSpeciesRate}
              />
              <Typography>MCCC</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography className="math-icon">=</Typography>
            </Grid>

            <Grid item xs={3}>
              <NumberTextField
                label={matchesMd ? '' : 'Mix Seeding Rate'}
                disabled
                value={seed.mixSeedingRate}
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
          'Mix Seeding Rate',
        )}
        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Seeds / Pound'}
            handleChange={(e) => {
              updateSeed(e.target.value, 'seedsPerPound', seed);
            }}
            value={seed.seedsPerPound}
          />
        </Grid>

        <Grid item xs={1}>
          <Typography className="math-icon">&#215;</Typography>
        </Grid>

        <Grid item xs={3}>
          <NumberTextField
            disabled
            label={matchesMd ? '' : 'Mix Seeding Rate'}
            value={seed.mixSeedingRate}
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
            value={seed.seedsPerAcre}
          />
        </Grid>
      </>

      {/* NECCC Step 3: */}
      {council === 'NECCC' && (
        <>
          <Grid item xs={12}>
            <Typography className="step-header">Step 3: </Typography>
          </Grid>
          {renderFormLabel('Seeds/Acre', 'Sq. Ft. / Acres', 'Plants/Acre')}
          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeds / Acre'}
              disabled
              value={seed.seedsPerAcre}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Sq. Ft./ Acre'}
              disabled
              value={seed.sqFtAcre}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Seeds / Sq. Ft.'}
              disabled
              value={seed.aproxPlantsSqFt}
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
              value={seed.seedsPerAcre}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">&#215;</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : '% Survival'}
              handleChange={(e) => {
                updateSeed(
                  convertToDecimal(e.target.value),
                  'percentChanceOfWinterSurvival',
                  seed,
                );
              }}
              value={convertToPercent(seed.percentChanceOfWinterSurvival)}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Plants / Acre'}
              disabled
              value={seed.plantsPerAcre}
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
              value={seed.plantsPerAcre}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">÷</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Sq. Ft./ Acre'}
              disabled
              value={seed.sqFtAcre}
            />
          </Grid>

          <Grid item xs={1}>
            <Typography className="math-icon">=</Typography>
          </Grid>

          <Grid item xs={3}>
            <NumberTextField
              label={matchesMd ? '' : 'Aproximate Plants  / Sq. Ft.'}
              disabled
              value={seed.aproxPlantsSqFt}
            />
            <Typography>Lbs / Acre</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};
export default MixRatioSteps;
