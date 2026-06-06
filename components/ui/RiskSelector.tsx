"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

function getRiskLabel(v: number): string {
  if (v <= 2) return "CONSERVATIVE";
  if (v <= 5) return "BALANCED";
  if (v <= 8) return "AGGRESSIVE";
  return "RECKLESS";
}

function getRiskColor(v: number): string {
  if (v <= 3) return "#22c55e";
  if (v <= 6) return "#f59e0b";
  return "#dc2626";
}

export default function RiskSelector({ value, onChange }: Props) {
  const color = getRiskColor(value);
  const label = getRiskLabel(value);

  return (
    <div
      className="w-full p-5 flex flex-col gap-4"
      style={{
        border: "3px solid #374151",
        boxShadow: "4px 4px 0px #111827",
        backgroundColor: "#111111",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="text-amber-400 text-[14px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ RISK WILLINGNESS
        </span>
        <span
          className="text-[28px] font-mono font-bold"
          style={{ color }}
        >
          {value}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-red-500"
      />

      <div className="flex items-center justify-between">
        <span className="text-[13px] font-mono text-gray-500">0 — SAFE</span>
        <span
          className="text-[14px] tracking-widest font-mono font-bold"
          style={{ color }}
        >
          {label}
        </span>
        <span className="text-[13px] font-mono text-gray-500">10 — WILD</span>
      </div>

      <p className="text-[13px] font-mono text-gray-500">
        Low risk: conservative strategy, steady points. High risk: bolder calls, bigger swings — can win or crash out.
      </p>
    </div>
  );
}
