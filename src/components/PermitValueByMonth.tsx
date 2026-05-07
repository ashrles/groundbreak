import {
  LineChart,
  Line,
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

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function PermitValueByMonth({ data }: Props) {
  const chartData = Object.entries(
    data.reduce<Record<string, number>>((acc, d) => {
      if (!d.year || !d.month) return acc;
      const key = `${d.year}-${String(d.month).padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + (d.value || 0);
      return acc;
    }, {})
  )
    .map(([key, total]) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${MONTH_LABELS[Number(month) - 1]} ${year}`,
        total,
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

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
        Total Permit Value by Month
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2d3a"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8b8fa8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fill: "#8b8fa8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
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
              [`$${(Number(v) / 1_000_000).toFixed(1)}M`, "Permit Value"] as any
            }
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#f0c040"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#f0c040" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
