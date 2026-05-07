interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div style={{
      background: "#1a1d27",
      border: "1px solid #2a2d3a",
      borderRadius: "8px",
      padding: "20px 24px",
    }}>
      <p style={{ fontSize: "13px", color: "#8b8fa8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: "700", color: "#f0c040" }}>
        {value}
      </p>
    </div>
  );
}