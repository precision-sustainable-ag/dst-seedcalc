import React, { useState } from 'react';
import {
  Grid, Typography,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  Bar,
  YAxis,
  LabelList,
  Cell,
} from 'recharts';
import { PSAButton } from 'shared-react-components/src';
import { twoDigit } from '../../shared/utils/calculator';
import useIsMobile from '../../shared/hooks/useIsMobile';

const DSTBarChart = ({ seed, calculatorResult }) => {
  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile('sm');

  const labels = [
    {
      caption: 'Initial Seeding Rate',
      val: calculatorResult[seed.label].step1.singleSpeciesSeedingRate,
    },
    {
      caption: 'Mix Ratios',
      val: calculatorResult[seed.label].step2.seedingRate,
    },
    {
      caption: 'Seeding Method',
      val: calculatorResult[seed.label].step2.seedingRateAfterPlantingMethodModifier,
    },
    {
      // label: `Management Impacts on Mix (${calculatorResult[seed.label].step3.managementImpactOnMix})`,
      caption: 'Management',
      val: calculatorResult[seed.label].step3.seedingRateAfterManagementImpact,
    },
    {
      caption: 'Germination and Purity',
      val: calculatorResult[seed.label].step4.bulkSeedingRate,
    },
  ];

  const maxValue = labels.reduce((prev, curr) => (prev.val > curr.val ? prev : curr), labels[0]).val;

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
      <Grid item xs={12}>
        <Typography fontWeight="bold">Seeding Rate Impact From Your Decisions (Lbs per Acre)</Typography>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" aria-hidden>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={isMobile ? [labels[index]] : labels}
            barCategoryGap="35%"
            margin={{
              top: 15, right: 50, bottom: 15, left: 15,
            }}
            maxBarSize={50}
          >
            <XAxis
              dataKey="caption"
              interval={0}
              tick={<CustomTick />}
            />
            <YAxis
              domain={[0, Math.round(maxValue * 1.1)]}
            />
            <Bar dataKey="val" fill="#4f5f30">
              <LabelList dataKey="val" position="top" style={{ fill: '#4f5f30' }} />
              {!isMobile
              && labels.map((l, i) => (<Cell key={i} fill={index === i ? '#98FB98' : '#4f5f30'} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={12} aria-hidden>
        <PSAButton
          buttonType=""
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
          data-test="barchart_back"
          title={(
            <>
              <ArrowBackIosNewIcon />
              Back
            </>
)}
        />
        <Typography display="inline-block" padding="0 1rem">
          {`${index + 1} / 5`}
        </Typography>
        <PSAButton
          onClick={() => setIndex((index + 1) % 5)}
          disabled={index === 4}
          data-test="barchart_next"
          buttonType=""
          title={(
            <>
              Next
              <ArrowForwardIosIcon />
            </>
)}
        />
      </Grid>

      <Grid container data-test="list_container">
        {/* list under barchart */}
        {labels.map((l, i) => (
          <Grid
            container
            sx={{
              backgroundColor: !(i % 2) && 'main.background1',
              color: 'text.primary',
            }}
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
    </Grid>
  );
};

export default DSTBarChart;
