import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { calculatePieChartData, twoDigit } from '../../../../shared/utils/calculator';
import DSTPieChart from '../../../../components/DSTPieChart';
import { pieChartUnits } from '../../../../shared/data/units';
import '../steps.scss';

const defaultPieChartData = {
  seedingRateArray: [],
  plantsPerSqftArray: [],
  seedsPerSqftArray: [],
};

const ConfirmPlanChip = ({ label, value }) => (
  <>
    <Typography sx={{ fontWeight: 600, minHeight: '45px' }}>
      {label}
    </Typography>
    <Box
      sx={{
        bgcolor: '#e7885f',
        borderRadius: '50%',
        width: '5rem',
        height: '5rem',
        margin: '0 auto 10px auto',
      }}
    >
      <Typography sx={{ pt: '30px', color: 'white' }}>{value}</Typography>
    </Box>
  </>
);

const ConfirmPlanCharts = ({ council, calculator, calculatorResult }) => {
  const [piechartData, setPieChartData] = useState(defaultPieChartData);

  const { acres } = useSelector((state) => state.siteCondition);
  const { seedsSelected, options, mixSeedingRate } = useSelector((state) => state.calculator);

  useEffect(() => {
    // calculate piechart data
    const {
      seedingRateArray,
      plantsPerSqftArray,
      seedsPerSqftArray,
    } = calculatePieChartData(seedsSelected, calculator, options);
    setPieChartData({ seedingRateArray, plantsPerSqftArray, seedsPerSqftArray });
  }, []);

  const calculateTotalPricePerAcre = () => {
    const totalCost = seedsSelected.reduce((total, seed) => total + calculatorResult[seed.label].totalCost, 0);
    return twoDigit(totalCost / acres);
  };

  return (
    <Grid container sx={{ padding: '0.5rem' }}>
      <Grid
        item
        xs={6}
        sx={{
          borderRight: '1px solid #CCCCCC',
          borderBottom: '1px solid #CCCCCC',
        }}
      >
        <ConfirmPlanChip
          label={`Amount of Mix for ${acres} Acres`}
          value={`${mixSeedingRate * acres}lbs`}
        />
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          borderBottom: '1px solid #CCCCCC',
        }}
      >
        <ConfirmPlanChip label="Price per Acre" value={`$${calculateTotalPricePerAcre()}`} />
      </Grid>

      <Grid
        item
        xs={6}
        md={6}
        sx={{
          borderRight: '1px solid #CCCCCC',
          borderBottom: '1px solid #CCCCCC',
          textAlign: 'justify',
        }}
      >
        <DSTPieChart
          chartData={piechartData.seedingRateArray}
          label={pieChartUnits.poundsOfSeedPerAcre}
        />
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        sx={{
          borderBottom: '1px solid #CCCCCC',
          textAlign: 'justify',
        }}
      >
        {council === 'MCCC' && (
          <DSTPieChart
            chartData={piechartData.plantsPerSqftArray}
            label={pieChartUnits.plantsPerSqft}
          />
        )}
        {(council === 'NECCC' || council === 'SCCC') && (
        <DSTPieChart
          chartData={piechartData.seedsPerSqftArray}
          label={pieChartUnits.seedsPerSqft}
        />
        )}
      </Grid>
    </Grid>
  );
};
export default ConfirmPlanCharts;
