interface YearFilterProps {
  years: number[];
  selected: number | "all";
  onChange: (year: number | "all") => void;
}

export function YearFilter({ years, selected, onChange }: YearFilterProps) {
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 16px",
    borderRadius: "6px",
    border: "1px solid #2a2d3a",
    background: active ? "#f0c040" : "#1a1d27",
    color: active ? "#0f1117" : "#8b8fa8",
    cursor: "pointer",
    fontWeight: active ? "700" : "400",
    fontSize: "14px",
  });

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <button style={buttonStyle(selected === "all")} onClick={() => onChange("all")}>
        All Years
      </button>
      {years.map((y) => (
        <button key={y} style={buttonStyle(selected === y)} onClick={() => onChange(y)}>
          {y}
        </button>
      ))}
    </div>
  );
}