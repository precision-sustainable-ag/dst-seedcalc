import React from 'react';
import { useTheme } from '@emotion/react';
import { useMediaQuery, Grid } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  Bar,
  YAxis,
  LabelList,
} from 'recharts';
import { twoDigit } from '../../shared/utils/calculator';

const DSTBarChart = ({ seed, calculatorResult }) => {
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

  const labels = [
    {
      label: 'Single Species Seeding Rate',
      caption: 'Initial seeding rate',
      val: calculatorResult[seed.label].step1.singleSpeciesSeedingRate,
    },
    {
      label: 'Added to Mix',
      caption: 'Mix proportion',
      val: calculatorResult[seed.label].step2.seedingRate,
    },
    {
      label: 'Drilled or Broadcast with Cultipack',
      caption: 'Seeding method',
      val: calculatorResult[seed.label].step2.seedingRateAfterPlantingMethodModifier,
    },
    {
      label: `Management Impacts on Mix (${calculatorResult[seed.label].step3.managementImpactOnMix})`,
      caption: 'Management',
      val: calculatorResult[seed.label].step3.seedingRateAfterManagementImpact,
    },
    {
      label: 'Bulk Germination and Purity',
      caption: 'Bulk Germination and Purity',
      val: calculatorResult[seed.label].step4.bulkSeedingRate,
    },
  ];

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        fill="#666"
        x={0}
        y={10}
        style={{ fill: '#4f5f30', whiteSpace: 'normal' }}
      >
        {`${payload.value}`}
      </text>
    </g>
  );

  return (
    <Grid container>
      {!matchesSm
      && (
      <Grid item xs={12}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={labels}
            barCategoryGap="25%"
            margin={{
              top: 15, right: 30, bottom: 15, left: 15,
            }}
          >
            <XAxis
              dataKey="caption"
              interval={0}
              tick={<CustomTick />}
            />
            <YAxis />
            <Bar dataKey="val" fill="#4f5f30">
              <LabelList dataKey="val" position="top" color="white" style={{ fill: '#4f5f30' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      )}

      {labels.map((l, i) => (
        <Grid
          container
          sx={{ backgroundColor: !(i % 2) && '#e3e5d3' }}
          key={i}
        >
          <Grid item xs={1} />
          <Grid item sx={{ textAlign: 'justify' }} xs={9} pl={1}>
            {l.caption}
          </Grid>
          <Grid item xs={2}>
            {twoDigit(l.val)}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default DSTBarChart;
