/// ///////////////////////////////////////////////////////
//                      Imports                         //
/// ///////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';

import { handleDownload } from '../../../../shared/utils/exportExcel';
import ConfirmPlanCharts from './charts';
import '../steps.scss';
import ConfirmPlanForm from './form';
import { checkNRCS, confirmPlan } from '../../../../shared/utils/calculator';

const defaultResult = {
  bulkSeedingRate: 0,
  acres: 0,
  totalPounds: 0,
  costPerPound: 0,
  totalCost: 0,
};

const ConfirmPlan = ({ calculator }) => {
  const theme = useTheme();
  const matchesUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const siteCondition = useSelector((state) => state.siteCondition);
  const calculatorRedux = useSelector((state) => state.calculator);
  const { council, checkNRCSStandards } = siteCondition;
  const { seedsSelected, options, bulkSeedingRate } = calculatorRedux;

  const [prevOptions, setPrevOptions] = useState({});

  const [calculatorResult, setCalculatorResult] = useState(
    seedsSelected.reduce((res, seed) => {
      res[seed.label] = defaultResult;
      return res;
    }, {}),
  );
  // console.log('calculatorResult', calculatorResult);

  const [nrcsResult, setNrcsResult] = useState({});

  /// ///////////////////////////////////////////////////////
  //                     useEffect                        //
  /// ///////////////////////////////////////////////////////

  useEffect(() => {
    seedsSelected.forEach((seed) => {
      if (options[seed.label] !== prevOptions[seed.label]) {
        const result = confirmPlan(
          bulkSeedingRate[seed.label],
          options[seed.label].acres,
          // FIXME: initializa cost per pound, this value is not defined
          options[seed.label].costPerPound ?? 0.42,
        );
        setCalculatorResult((prev) => ({ ...prev, [seed.label]: result }));
      }
    });
    setPrevOptions(options);
  }, [options]);

  // SDK NRCS calculated here
  useEffect(() => {
    if (checkNRCSStandards) {
      setNrcsResult(checkNRCS(seedsSelected, calculator, options));
    }
  }, []);

  /// ///////////////////////////////////////////////////////
  //                      Render                          //
  /// ///////////////////////////////////////////////////////

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h2">Confirm your plan</Typography>

        {/* Export */}
        <Grid container sx={{ marginTop: '5px' }}>
          <Grid item xs={matchesUpMd ? 11 : 9} />
          <Grid item xs={matchesUpMd ? 1 : 3}>
            <Button
              sx={{
                bgcolor: '#e7885f',
                color: 'white',
                padding: '7px',
                width: '83px',
                margin: '3px',
                fontSize: '12px',
                borderRadius: '26px',
              }}
              onClick={() => {
                handleDownload(
                  [
                    {
                      label: 'SITE-CONDITION',
                      extData: JSON.stringify(siteCondition),
                    },
                    {
                      label: 'CALCULATOR',
                      extData: JSON.stringify(calculatorRedux),
                    },
                  ],
                  council,
                );
              }}
            >
              Export
            </Button>
          </Grid>
        </Grid>

        {/* Charts */}

        <ConfirmPlanCharts
          council={council}
          calculator={calculator}
        />

        <ConfirmPlanForm
          nrcsResult={nrcsResult}
          seedsSelected={seedsSelected}
          calculatorResult={calculatorResult}
          options={options}
        />
      </Grid>
    </Grid>
  );
};
export default ConfirmPlan;
