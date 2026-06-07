"use client";

import { useState } from "react";

interface TeamSetupProps {
  onConfirm: (teamName: string) => void;
}

export default function TeamSetup({ onConfirm }: TeamSetupProps) {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    const trimmed = teamName.trim();
    if (!trimmed) {
      setError("TEAM NAME CANNOT BE EMPTY");
      return;
    }
    if (trimmed.length < 3) {
      setError("MINIMUM 3 CHARACTERS");
      return;
    }
    if (trimmed.length > 32) {
      setError("MAXIMUM 32 CHARACTERS");
      return;
    }
    onConfirm(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleConfirm();
    if (error) setError("");
  }

  return (
    <div className="relative z-20 px-6 max-w-xl mx-auto flex flex-col items-center gap-8 py-16 w-full">

      {/* Header badge */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ▶ SEASON SETUP
      </div>

      {/* Story intro */}
      <div
        className="w-full p-5"
        style={{
          border: "3px solid #78350f",
          boxShadow: "4px 4px 0px #1c1000",
          backgroundColor: "#1c1000",
        }}
      >
        <p className="text-amber-300 text-[14px] font-mono leading-relaxed">
          Rararacing is about to go bankrupt. Nobody wants to sail the sinking ship. Your friend from its executives board is begging for a favor — take over team principal's role and lead the boat out of the storm.
        </p>
      </div>

      {/* Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2
          className="text-white text-[20px] tracking-widest"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          NAME YOUR TEAM
        </h2>
        <p className="text-gray-500 text-[15px] font-mono max-w-sm">
          As you name a ship, so it will sail.
        </p>
      </div>

      {/* Input panel */}
      <div
        className="w-full p-6 flex flex-col gap-5"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <label
          className="text-amber-400 text-[16px] tracking-widest"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
          htmlFor="teamNameInput"
        >
          ■ TEAM NAME
        </label>

        <input
          id="teamNameInput"
          type="text"
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          maxLength={32}
          placeholder="e.g. CORAZÓN Y CABEZA"
          className="w-full bg-[#0a0a0a] text-white text-[16px] tracking-widest px-4 py-3 outline-none placeholder-gray-700 focus:ring-0"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: error ? "3px solid #dc2626" : "3px solid #4b5563",
            boxShadow: "inset 2px 2px 0px #000",
          }}
          autoFocus
        />

        {error && (
          <span
            className="text-red-500 text-[14px] tracking-widest"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ⚠ {error}
          </span>
        )}

        <div className="flex items-center">
          <span className="text-gray-700 text-[14px] font-mono">
            {teamName.trim().length} / 32
          </span>
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #f87171",
          boxShadow: "4px 4px 0px #7f1d1d",
        }}
        type="button"
      >
        ▶ CONTINUE TO DRIVER SELECTION →
      </button>

      {/* Starting budget reminder */}
      <p
        className="text-gray-600 text-[14px] tracking-widest"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        STARTING BUDGET: 100M G
      </p>
    </div>
  );
}
