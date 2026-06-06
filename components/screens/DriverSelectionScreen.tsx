"use client";

import { useState } from "react";
import type { Driver } from "@/types/game";
import { DRIVERS } from "@/lib/simulation";

interface Props {
  budget: number;
  onSelect: (driver: Driver) => void;
}

function formatG(n: number): string {
  return (n / 1_000_000).toFixed(1) + "M G";
}

function DriverIndexBar({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  const color = value >= 8 ? "#22c55e" : value >= 6 ? "#f59e0b" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#1a1a1a]" style={{ border: "1px solid #333" }}>
        <div style={{ width: `${pct}%`, backgroundColor: color, height: "100%" }} />
      </div>
      <span className="text-[12px] font-mono w-8 text-right" style={{ color }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function DriverSelectionScreen({ budget, onSelect }: Props) {
  const [selected, setSelected] = useState<Driver | null>(null);

  const remaining = selected ? budget - selected.cost : budget;
  const canConfirm = selected !== null && remaining >= 0;

  return (
    <div className="relative z-20 px-6 max-w-3xl mx-auto flex flex-col items-center gap-8 py-16 w-full">

      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ▶ DRIVER SELECTION
      </div>

      {/* Budget display */}
      <div
        className="w-full p-4 flex items-center justify-between gap-4 flex-wrap"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <span className="text-gray-400 text-[13px] font-mono tracking-widest uppercase">BUDGET</span>
        <div className="flex items-center gap-4">
          <span className="text-white text-[15px] font-mono">{formatG(budget)}</span>
          {selected && (
            <>
              <span className="text-gray-600 font-mono">→</span>
              <span
                className="text-[15px] font-mono"
                style={{ color: remaining >= 0 ? "#22c55e" : "#dc2626" }}
              >
                {formatG(remaining)} remaining
              </span>
            </>
          )}
        </div>
      </div>

      {/* Driver cards */}
      <div className="w-full flex flex-col gap-4">
        {DRIVERS.map((driver) => {
          const isSelected = selected?.id === driver.id;
          return (
            <button
              key={driver.id}
              onClick={() => setSelected(isSelected ? null : driver)}
              className="w-full text-left transition-colors duration-100 cursor-pointer"
              style={{
                border: isSelected ? "3px solid #f87171" : "3px solid #374151",
                boxShadow: isSelected ? "4px 4px 0px #7f1d1d" : "4px 4px 0px #111827",
                backgroundColor: isSelected ? "#1c0a0a" : "#111111",
                padding: "20px",
              }}
              type="button"
            >
              <div className="flex flex-col gap-3">
                {/* Name & cost row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className="text-white text-[17px] tracking-widest"
                    style={{ fontFamily: "var(--font-pixel), monospace" }}
                  >
                    {isSelected ? "▶ " : "■ "}{driver.name}
                  </span>
                  <span
                    className="text-amber-400 text-[15px] font-mono"
                  >
                    {formatG(driver.cost)}
                  </span>
                </div>

                {/* Driver index bar */}
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">Driver Index</span>
                  <DriverIndexBar value={driver.driverIndex} />
                </div>

                {/* Description */}
                <p className="text-gray-300 text-[14px] font-mono">{driver.description}</p>

                {/* Risk profile */}
                <p className="text-gray-500 text-[13px] font-mono italic">{driver.riskProfile}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!canConfirm}
        className="px-10 py-4 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          backgroundColor: canConfirm ? "#dc2626" : "#333",
          border: `3px solid ${canConfirm ? "#f87171" : "#555"}`,
          boxShadow: canConfirm ? "4px 4px 0px #7f1d1d" : "4px 4px 0px #222",
        }}
        type="button"
      >
        {selected ? `▶ SIGN ${selected.name.toUpperCase()} →` : "SELECT A DRIVER FIRST"}
      </button>
    </div>
  );
}
