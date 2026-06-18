"use client";

// RiskSelector — ползунок выбора уровня риска перед гонкой (0–10).
// Значение сохраняется в GameState.riskWillingness и влияет на стратегию, DNF и вероятность аварии.

// Пропсы компонента выбора риска.
interface Props {
  value: number;               // текущий уровень риска: 0–10
  onChange: (v: number) => void; // обновляет riskWillingness в GameState
}

// Возвращает текстовую метку уровня риска для отображения рядом со значением.
function riskLabel(v: number): string {
  if (v <= 2) return "CONSERVATIVE";
  if (v <= 4) return "MEASURED";
  if (v <= 6) return "BALANCED";
  if (v <= 8) return "AGGRESSIVE";
  return "RECKLESS";
}

function riskColor(v: number): string {
  if (v <= 2) return "#22c55e";
  if (v <= 4) return "#86efac";
  if (v <= 6) return "#f59e0b";
  if (v <= 8) return "#f87171";
  return "#dc2626";
}

export default function RiskSelector({ value, onChange }: Props) {
  const color = riskColor(value);
  return (
    <div
      className="w-full p-5 flex flex-col gap-4"
      style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="text-amber-400 text-[13px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ RISK WILLINGNESS
        </span>
        <span className="text-[14px] font-mono font-bold" style={{ color }}>
          {value} — {riskLabel(value)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-red-600"
      />

      <div className="flex justify-between text-[11px] font-mono text-gray-600">
        <span>0 SAFE</span>
        <span>5 BALANCED</span>
        <span>10 MAX RISK</span>
      </div>
    </div>
  );
}
