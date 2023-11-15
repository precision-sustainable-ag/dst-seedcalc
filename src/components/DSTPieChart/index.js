import { Typography, Box, useMediaQuery } from "@mui/material";
import { Square } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "@emotion/react";
import { convertToPercent, roundToDecimal } from "../../shared/utils/calculate";

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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
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
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
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
    <Typography
      sx={{
        textAlign: "center",
        textDecoration: "underline #cccccc",
        textUnderlineOffset: "0.5rem",
        fontWeight: 600,
      }}
    >
      {children}
    </Typography>
  );
};

const DSTPieChartLegend = ({ chartData }) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ p: "1rem 0" }}>
      {chartData.map((chartData, i) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: matchesMd ? "0.25rem 2%" : "0.25rem 15%",
            }}
            key={i}
          >
            <Typography
              fontSize={matchesMd ? "0.75rem" : "1rem"}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Square sx={{ color: COLORS[i] }}></Square>
              {chartData.name}
            </Typography>
            <Typography
              fontSize={matchesMd ? "0.75rem" : "1rem"}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {chartData.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export { DSTPieChart, DSTPieChartLabel, DSTPieChartLegend };
