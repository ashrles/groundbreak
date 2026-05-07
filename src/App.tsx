import { useMemo, useState } from "react";
import { usePermitData } from "./hooks/usePermitData";
import { StatCard } from "./components/StatCard";
import { YearFilter } from "./components/YearFilter";
import { PermitsByYear } from "./components/PermitsByYear";
import { PermitValueByMonth } from "./components/PermitValueByMonth";
import { PermitsByType } from "./components/PermitsByType";
import { TopBuildingTypes } from "./components/TopBuildingTypes";

function App() {
  const { data, loading, error } = usePermitData();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const years = useMemo(() => {
    const unique = Array.from(new Set(data.map((d) => d.year))).filter(Boolean);
    return unique.sort() as number[];
  }, [data]);

  const filtered = useMemo(() => {
    if (selectedYear === "all") return data;
    return data.filter((d) => d.year === selectedYear);
  }, [data, selectedYear]);

  const stats = useMemo(() => {
    const totalPermits = filtered.length;

    const totalValue = filtered.reduce((sum, d) => sum + (d.value || 0), 0);
    const formattedValue = "$" + (totalValue / 1_000_000).toFixed(1) + "B";

    const wardCounts = filtered.reduce<Record<string, number>>((acc, d) => {
      if (d.ward) acc[d.ward] = (acc[d.ward] || 0) + 1;
      return acc;
    }, {});
    const topWard = Object.entries(wardCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return { totalPermits, formattedValue, topWard };
  }, [filtered]);

  if (loading) return <p style={{ padding: "40px", color: "#8b8fa8" }}>Loading permit data...</p>;
  if (error) return <p style={{ padding: "40px", color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "4px" }}>
          Ground<span style={{ color: "#f0c040" }}>Break</span>
        </h1>
        <p style={{ color: "#8b8fa8", fontSize: "14px" }}>
          Ottawa construction permit analytics · 2020–2024
        </p>
      </div>

      {/* Year Filter */}
      <div style={{ marginBottom: "32px" }}>
        <YearFilter years={years} selected={selectedYear} onChange={setSelectedYear} />
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "40px",
      }}>
        <StatCard label="Total Permits" value={stats.totalPermits.toLocaleString()} />
        <StatCard label="Total Permit Value" value={stats.formattedValue} />
        <StatCard label="Most Active Ward" value={stats.topWard} />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <PermitsByYear data={filtered} />
        <PermitValueByMonth data={filtered} />
        <PermitsByType data={filtered} />
        <TopBuildingTypes data={filtered} />
      </div>

    </div>
  );
}

export default App;