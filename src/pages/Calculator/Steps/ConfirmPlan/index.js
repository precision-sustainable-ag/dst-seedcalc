import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ConfirmPlanCharts from './charts';
import '../steps.scss';
import ConfirmPlanForm from './form';
import { checkNRCS, confirmPlan } from '../../../../shared/utils/calculator';
import ExportModal from './ExportModal';

const defaultResult = {
  bulkSeedingRate: 0,
  acres: 0,
  totalPounds: 0,
  costPerPound: 0,
  totalCost: 0,
};

const ConfirmPlan = ({ calculator, token }) => {
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
          options[seed.label].costPerPound ?? 0,
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
        <Typography variant="h2">Confirm Plan and Enter Costs Below</Typography>

        {/* Export Button */}
        <Grid item xs={12} display="flex" justifyContent="flex-end" pt="5px">
          <ExportModal token={token} />
        </Grid>

        {/* Charts */}

        <ConfirmPlanCharts
          council={council}
          calculator={calculator}
          calculatorResult={calculatorResult}
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
