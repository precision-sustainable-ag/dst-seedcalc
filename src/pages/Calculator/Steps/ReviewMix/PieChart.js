import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import "./../steps.css";

const PieChartComponent = ({
  type,
  plantsPerAcreArray,
  seedsPerAcreArray,
  poundsOfSeedArray,
  COLORS,
  renderCustomizedLabel,
}) => {
  let chartData;
  if (type === "plantsPerAcre") {
    chartData = plantsPerAcreArray;
  }
  if (type === "seedsPerAcre") {
    chartData = seedsPerAcreArray;
  }
  if (type === "poundsOfSeed") {
    chartData = poundsOfSeedArray;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
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

export default PieChartComponent;
