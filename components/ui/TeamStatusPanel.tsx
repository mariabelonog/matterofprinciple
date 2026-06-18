"use client";

// TeamStatusPanel — панель текущего состояния команды: бюджет, пилот и четыре индекса.
// Отображается на экране настройки перед гонкой (фаза "setup" в RaceScreen).

import type { GameState } from "@/types/game";

// Пропсы панели состояния команды.
interface Props {
  state: GameState; // полное игровое состояние для отображения всех показателей
}

// Горизонтальный прогресс-бар одного индекса с цветовым кодированием.
// Зелёный >=7, жёлтый >=4, красный <4.
function StatBar({ label, value }: { label: string; value: number }) {
  const color = value >= 7 ? "#22c55e" : value >= 4 ? "#f59e0b" : "#dc2626";
  const pct = (value / 10) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
        <span className="text-[13px] font-mono" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="w-full h-2 bg-[#1a1a1a]" style={{ border: "1px solid #333" }}>
        <div style={{ width: `${pct}%`, backgroundColor: color, height: "100%", transition: "width 0.2s" }} />
      </div>
    </div>
  );
}

export default function TeamStatusPanel({ state }: Props) {
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
          ■ TEAM STATUS
        </span>
        <span className="text-white text-[14px] font-mono font-bold">
          {(state.budget / 1_000_000).toFixed(1)}M G
        </span>
      </div>

      {state.driver && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#222]">
          <span className="text-gray-400 text-[12px] font-mono uppercase tracking-widest">DRIVER</span>
          <span className="text-white text-[13px] font-mono">{state.driver.name}</span>
        </div>
      )}

      <StatBar label="Car Development" value={state.carDevelopment} />
      <StatBar label="Staff Quality" value={state.staffQuality} />
      <StatBar label="Public Image" value={state.publicImage} />
      <StatBar label="Reliability" value={state.carReliability} />
    </div>
  );
}
