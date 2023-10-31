import { Typography, Grid } from "@mui/material";
import { Square } from "@mui/icons-material";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const DSTPieChart = ({ chartData }) => {
  const PieChartLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={PieChartLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const DSTPieChartLabel = ({ children }) => {
  return (
    <Typography sx={{ textAlign: "center", color: "primary.text" }}>
      {children}
    </Typography>
  );
};

const DSTPieChartLegend = ({ labels, matchesMd }) => {
  {
    /* TODO: need further change to make it on the center */
  }
  return (
    <Grid container sx={{ pt: "1.5rem" }}>
      {labels.map((label, i) => {
        return (
          <Grid container pl={matchesMd ? "1.5rem" : "5rem"} pt={"0.5rem"}>
            <Square sx={{ color: COLORS[i] }}></Square>
            <Typography
              fontSize={matchesMd ? "0.75rem" : "1rem"}
              color={"primary.text"}
            >
              {label}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
  );
};

export { DSTPieChart, DSTPieChartLabel, DSTPieChartLegend };
