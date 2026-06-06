"use client";

import type { Driver } from "@/types/game";
import { DRIVERS } from "@/lib/simulation";

interface Props {
  budget: number;
  onSelect: (driver: Driver) => void;
}

function formatG(n: number): string {
  return (n / 1_000_000).toFixed(0) + "M G";
}

export default function DriverSelectionScreen({ budget, onSelect }: Props) {
  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">
      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #dc2626", boxShadow: "4px 4px 0px #7f1d1d", backgroundColor: "#1c0a0a" }}
      >
        ▶ SELECT YOUR DRIVER
      </div>

      <div
        className="w-full p-3 flex justify-between"
        style={{ border: "3px solid #374151", backgroundColor: "#111111" }}
      >
        <span className="text-gray-500 text-[13px] font-mono uppercase tracking-widest">Budget remaining</span>
        <span className="text-white text-[14px] font-mono font-bold">{formatG(budget)}</span>
      </div>

      <div className="w-full flex flex-col gap-4">
        {DRIVERS.map((driver) => {
          const canAfford = budget >= driver.cost;
          return (
            <button
              key={driver.id}
              onClick={() => canAfford && onSelect(driver)}
              disabled={!canAfford}
              className="w-full p-5 text-left flex flex-col gap-2 transition-colors duration-100 cursor-pointer hover:bg-[#1a1a1a] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
              type="button"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-white text-[15px] tracking-widest uppercase" style={{ fontFamily: "var(--font-pixel), monospace" }}>
                  {driver.name}
                </span>
                <span
                  className="text-[14px] font-mono font-bold"
                  style={{ color: canAfford ? "#f59e0b" : "#dc2626" }}
                >
                  {formatG(driver.cost)}
                </span>
              </div>
              <span className="text-gray-400 text-[13px] font-mono">{driver.description}</span>
              <span className="text-gray-600 text-[12px] font-mono">{driver.riskProfile}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">Driver Index</span>
                <div className="flex-1 h-2 bg-[#1a1a1a]" style={{ border: "1px solid #333" }}>
                  <div
                    style={{
                      width: `${(driver.driverIndex / 10) * 100}%`,
                      backgroundColor: driver.driverIndex >= 8 ? "#22c55e" : driver.driverIndex >= 6 ? "#f59e0b" : "#dc2626",
                      height: "100%",
                    }}
                  />
                </div>
                <span className="text-white text-[12px] font-mono">{driver.driverIndex}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
