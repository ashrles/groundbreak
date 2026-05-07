import type { Permit } from "../hooks/usePermitData";

interface Props {
  data: Permit[];
  selectedYear: number | "all";
  selectedType: string | "all";
}

export function SummaryBar({ data, selectedYear, selectedType }: Props) {
  const totalPermits = data.length;

  const totalValue = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const formattedValue = `$${(totalValue / 1_000_000).toFixed(1)}M`;

  const wardCounts = data.reduce<Record<string, number>>((acc, d) => {
    if (d.ward) acc[d.ward] = (acc[d.ward] || 0) + 1;
    return acc;
  }, {});
  const topWard =
    Object.entries(wardCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const yearLabel = selectedYear === "all" ? "2020–2024" : String(selectedYear);
  const typeLabel =
    selectedType === "all"
      ? "all permit types"
      : selectedType.toLowerCase() + " permits";

  const sentence = `In ${yearLabel}, Ottawa issued ${totalPermits.toLocaleString()} ${typeLabel} worth ${formattedValue}, with ${topWard} being the most active ward.`;

  return (
    <div
      style={{
        background: "#1a1d27",
        border: "1px solid #2a2d3a",
        borderRadius: "8px",
        padding: "16px 24px",
        marginBottom: "32px",
      }}
    >
      <p style={{ color: "#e8eaf0", fontSize: "15px", lineHeight: "1.6" }}>
        Summary: {sentence}
      </p>
    </div>
  );
}
