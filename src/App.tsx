import { useMemo, useState } from "react";
import { usePermitData } from "./hooks/usePermitData";
import { StatCard } from "./components/StatCard";
import { YearFilter } from "./components/YearFilter";
import { PermitsByYear } from "./components/PermitsByYear";
import { PermitValueByMonth } from "./components/PermitValueByMonth";
import { PermitsByType } from "./components/PermitsByType";
import { TopBuildingTypes } from "./components/TopBuildingTypes";
import { SummaryBar } from "./components/SummaryBar";

function App() {
  const { data, loading, error } = usePermitData();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedType, setSelectedType] = useState<string | "all">("all");

  const years = useMemo(() => {
    const unique = Array.from(new Set(data.map((d) => d.year))).filter(Boolean);
    return unique.sort() as number[];
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
    if (selectedYear !== "all") result = result.filter((d) => d.year === selectedYear);
    if (selectedType !== "all") result = result.filter((d) => d.appl_type === selectedType);
    return result;
  }, [data, selectedYear, selectedType]);

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
      {/* Type Filter */}
      {selectedType !== "all" && (
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => setSelectedType("all")}
          style={{
            padding: "6px 16px",
            borderRadius: "6px",
            border: "1px solid #2a2d3a",
            background: "#f0c040",
            color: "#0f1117",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          ✕ Clear type filter: {selectedType}
        </button>
      </div>
    )}
      <SummaryBar
        data={filtered}
        selectedYear={selectedYear}
        selectedType={selectedType}
      />
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
        <PermitsByYear data={filtered} onYearClick={(year) => setSelectedYear(year)} />
        <PermitValueByMonth data={filtered} />
        <PermitsByType data={filtered} onTypeClick={(type) => setSelectedType(type)} />
        <TopBuildingTypes data={filtered} />
      </div>

    </div>
  );
}

export default App;