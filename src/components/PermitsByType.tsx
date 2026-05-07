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
  onTypeClick: (type: string) => void;
}

export function PermitsByType({ data, onTypeClick }: Props) {
  const chartData = Object.entries(
    data.reduce<Record<string, number>>((acc, d) => {
      if (d.appl_type) acc[d.appl_type] = (acc[d.appl_type] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (barData: any) => {
    if (barData?.type) onTypeClick(barData.type);
  };

  return (
    <div
      style={{
        background: "#1a1d27",
        border: "1px solid #2a2d3a",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <h2 style={{ fontSize: "16px", marginBottom: "24px", color: "#e8eaf0" }}>
        Permits by Type
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barSize={64}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2d3a"
            vertical={false}
          />
          <XAxis
            dataKey="type"
            tick={{ fill: "#8b8fa8", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8b8fa8", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              background: "#0f1117",
              border: "1px solid #2a2d3a",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "#e8eaf0", marginBottom: "4px" }}
            itemStyle={{ color: "#f0c040" }}
             
            formatter={(v: unknown) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              [Number(v).toLocaleString(), "Permits"] as any
            }
          />
          <Bar
            dataKey="count"
            fill="#f0c040"
            radius={[4, 4, 0, 0]}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
