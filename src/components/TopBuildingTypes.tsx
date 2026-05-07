import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Permit } from "../hooks/usePermitData";

interface Props {
  data: Permit[];
}

export function TopBuildingTypes({ data }: Props) {
  const chartData = Object.entries(
    data.reduce<Record<string, number>>((acc, d) => {
      if (d.blg_type) acc[d.blg_type] = (acc[d.blg_type] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div style={{
      background: "#1a1d27",
      border: "1px solid #2a2d3a",
      borderRadius: "8px",
      padding: "24px",
    }}>
      <h2 style={{ fontSize: "16px", marginBottom: "24px", color: "#e8eaf0" }}>
        Top Building Types
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 16 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#8b8fa8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="type"
            tick={{ fill: "#8b8fa8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={140}
          />
          <Tooltip
            contentStyle={{ background: "#0f1117", border: "1px solid #2a2d3a", borderRadius: "6px" }}
            labelStyle={{ color: "#e8eaf0", marginBottom: "4px" }}
            itemStyle={{ color: "#f0c040" }}
            formatter={(v: unknown) => [
              Number(v).toLocaleString(),
              "Permits",
            ] as any}
          />
          <Bar dataKey="count" fill="#f0c040" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}