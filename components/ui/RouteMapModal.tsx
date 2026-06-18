"use client";

// RouteMapModal — модальное окно с интерактивной картой маршрута Orient Express.
// Отображает все 8 городов на SVG-холсте, выделяет текущий и пройденные города,
// и показывает экономические показатели выбранного города.

import { useState } from "react";
import { CITY_ECONOMICS } from "@/data/cityEconomics";

// ─── Geographic city positions on the SVG map ────────────────────────────────
// Координаты рассчитаны по реальным lon/lat и спроецированы на холст 560×220.
// Диапазон долготы: 1.5°E–30°E → x; широты: 40.5°N–49.5°N → y (север = верх)

const MAP_W = 560; // ширина SVG-холста в пикселях
const MAP_H = 220; // высота SVG-холста в пикселях

// Переводит географические координаты (lon, lat) в пиксельные (x, y) на SVG-холсте.
// Формула линейно масштабирует диапазон и оставляет 20px отступ по краям.
function geoToSvg(lon: number, lat: number): [number, number] {
  const x = ((lon - 1.5) / 28.5) * (MAP_W - 40) + 20;  // масштабирование по долготе
  const y = ((49.5 - lat) / 9) * (MAP_H - 30) + 15;     // инвертировано: чем севернее, тем меньше y
  return [x, y];
}

// Все 8 городов маршрута с реальными координатами (порядок соответствует RACES).
const CITIES: { name: string; lon: number; lat: number }[] = [
  { name: "Paris",      lon: 2.35,  lat: 48.86 },
  { name: "Strassburg", lon: 7.75,  lat: 48.57 },
  { name: "Stuttgart",  lon: 9.18,  lat: 48.78 },
  { name: "Vienna",     lon: 16.37, lat: 48.21 },
  { name: "Budapest",   lon: 19.04, lat: 47.50 },
  { name: "Sinaia",     lon: 25.55, lat: 45.35 },
  { name: "Bucharest",  lon: 26.10, lat: 44.43 },
  { name: "Istanbul",   lon: 28.98, lat: 41.01 },
];

// Словарь: имя города → [x, y] на SVG-холсте; вычисляется один раз при загрузке модуля.
const CITY_POSITIONS = Object.fromEntries(
  CITIES.map(({ name, lon, lat }) => [name, geoToSvg(lon, lat)]),
) as Record<string, [number, number]>;

// Упрощённые прямоугольники стран как подложка под маршрут (не точные границы).
const COUNTRIES = [
  { label: "FRANCE",  x: 10,  y: 12,  w: 148, h: 80 },
  { label: "GERMANY", x: 145, y: 8,   w: 88,  h: 75 },
  { label: "AUSTRIA", x: 250, y: 10,  w: 112, h: 60 },
  { label: "HUNGARY", x: 315, y: 35,  w: 100, h: 62 },
  { label: "ROMANIA", x: 380, y: 62,  w: 148, h: 90 },
  { label: "TURKEY",  x: 468, y: 100, w: 85,  h: 108 },
];

// ─── Trend arrow ─────────────────────────────────────────────────────────────

// TrendArrow — иконка направления тренда экономического показателя.
function TrendArrow({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up")     return <span style={{ color: "#22c55e" }}>▲</span>; // рост
  if (trend === "down")   return <span style={{ color: "#dc2626" }}>▼</span>; // спад
  return <span style={{ color: "#6b7280" }}>◆</span>; // стабильно
}

// ─── Main modal ──────────────────────────────────────────────────────────────

// Пропсы модального окна карты маршрута.
interface Props {
  currentRound: number;  // номер текущего раунда 1–8, определяет подсвеченный город
  onClose: () => void;   // закрыть модальное окно
}

export default function RouteMapModal({ currentRound, onClose }: Props) {
  const currentCityName = CITIES[currentRound - 1]?.name ?? "Paris"; // имя текущего города
  const [selectedCity, setSelectedCity]           = useState<string>(currentCityName);   // выбранный город для показа экономики
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);       // раскрытый экономический показатель

  const economics = CITY_ECONOMICS[selectedCity]; // данные выбранного города
  const activeIndicator = economics?.indicators.find((i) => i.id === selectedIndicator); // раскрытый индикатор

  // Строим точки ломаной линии маршрута для SVG polyline (все 8 городов)
  const routePoints = CITIES.map(({ name }) => {
    const [x, y] = CITY_POSITIONS[name];
    return `${x},${y}`;
  }).join(" ");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-4 top-[52px] bottom-4 z-50 flex flex-col overflow-hidden"
        style={{
          border: "3px solid #dc2626",
          boxShadow: "6px 6px 0px #7f1d1d",
          backgroundColor: "#0a0600",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "2px solid #3d2408" }}
        >
          <span
            className="text-amber-400 text-[13px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ▶ ORIENT EXPRESS ROUTE — ECONOMIC DASHBOARD
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-[18px] font-mono cursor-pointer leading-none"
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-0">

          {/* ── SVG MAP ── */}
          <div className="w-full px-4 pt-4 pb-2 shrink-0">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="w-full"
              style={{ backgroundColor: "#060400", border: "2px solid #2a1800" }}
            >
              {/* Country backdrops */}
              {COUNTRIES.map((c) => (
                <g key={c.label}>
                  <rect
                    x={c.x} y={c.y} width={c.w} height={c.h}
                    fill="#0e0a04" stroke="#2a1800" strokeWidth={1}
                  />
                  <text
                    x={c.x + c.w / 2} y={c.y + 10}
                    textAnchor="middle" fill="#2a1800"
                    fontSize={7} fontFamily="monospace" letterSpacing={2}
                  >
                    {c.label}
                  </text>
                </g>
              ))}

              {/* Route line — completed portion */}
              <polyline
                points={CITIES.slice(0, currentRound).map(({ name }) => {
                  const [x, y] = CITY_POSITIONS[name];
                  return `${x},${y}`;
                }).join(" ")}
                fill="none" stroke="#92400e" strokeWidth={2}
              />
              {/* Route line — upcoming portion */}
              <polyline
                points={CITIES.slice(currentRound - 1).map(({ name }) => {
                  const [x, y] = CITY_POSITIONS[name];
                  return `${x},${y}`;
                }).join(" ")}
                fill="none" stroke="#3d2408" strokeWidth={2} strokeDasharray="4 3"
              />

              {/* City dots */}
              {CITIES.map(({ name }, i) => {
                const [cx, cy] = CITY_POSITIONS[name];
                const isSelected = name === selectedCity;   // кликнутый пользователем город
                const isCurrent  = i + 1 === currentRound; // текущая гонка (жёлтый)
                const isDone     = i + 1 < currentRound;   // уже пройденная гонка (тёмный)

                // Цвет точки: текущий — жёлтый, выбранный — красный, пройденный — коричневый, будущий — тёмный
                const dotColor = isCurrent
                  ? "#f59e0b"
                  : isSelected
                  ? "#dc2626"
                  : isDone
                  ? "#92400e"
                  : "#2a1800";
                const dotR = isSelected || isCurrent ? 6 : 4;

                return (
                  <g
                    key={name}
                    onClick={() => { setSelectedCity(name); setSelectedIndicator(null); }}
                    className="cursor-pointer"
                  >
                    <circle cx={cx} cy={cy} r={dotR + 4} fill="transparent" />
                    <circle
                      cx={cx} cy={cy} r={dotR}
                      fill={dotColor}
                      stroke={isSelected ? "#f59e0b" : isCurrent ? "#fbbf24" : "#3d2408"}
                      strokeWidth={isSelected || isCurrent ? 2 : 1}
                    />
                    <text
                      x={cx} y={cy - dotR - 4}
                      textAnchor="middle"
                      fill={isSelected ? "#f59e0b" : isCurrent ? "#f59e0b" : isDone ? "#78350f" : "#3d2408"}
                      fontSize={7} fontFamily="monospace" letterSpacing={1}
                    >
                      {name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-[10px] font-mono text-[#3d2408] mt-1 text-right tracking-widest">
              TAP A CITY TO VIEW ITS ECONOMIC PROFILE
            </p>
          </div>

          {/* ── CITY HEADER ── */}
          {economics && (
            <div className="px-4 pt-2 pb-3 flex flex-col gap-1 shrink-0" style={{ borderBottom: "1px solid #2a1800" }}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="text-amber-400 text-[16px] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  {selectedCity}
                </span>
                <span className="text-gray-600 text-[12px] font-mono">{economics.country}</span>
              </div>
              <p className="text-gray-500 text-[11px] font-mono">{economics.population}</p>
              <p className="text-gray-600 text-[11px] font-mono italic">{economics.regionNote}</p>
            </div>
          )}

          {/* ── INDICATOR LIST ── */}
          {economics && (
            <div className="px-4 pt-3 flex flex-col gap-2">
              <span
                className="text-amber-700 text-[10px] tracking-widest uppercase mb-1"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                ■ ECONOMIC INDICATORS — tap to expand
              </span>

              {economics.indicators.map((ind) => {
                const isOpen = selectedIndicator === ind.id; // этот показатель раскрыт
                // Цвет бара индикатора: зелёный >=65, жёлтый >=35, красный <35
                const barColor = ind.raw >= 65 ? "#22c55e" : ind.raw >= 35 ? "#f59e0b" : "#dc2626";

                return (
                  <div key={ind.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedIndicator(isOpen ? null : ind.id)}
                      className="w-full text-left flex flex-col gap-1.5 p-3 cursor-pointer transition-colors"
                      style={{
                        border: isOpen ? "2px solid #78350f" : "2px solid #1e1208",
                        backgroundColor: isOpen ? "#120a00" : "#0e0800",
                        boxShadow: isOpen ? "3px 3px 0px #1c0a00" : "none",
                      }}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 text-[12px] font-mono uppercase tracking-widest flex-1">
                          {ind.label}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <TrendArrow trend={ind.trend} />
                          <span className="text-white text-[13px] font-mono font-bold">
                            {ind.value}
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full h-[3px]" style={{ backgroundColor: "#1e1208" }}>
                        <div
                          style={{
                            width: `${ind.raw}%`,
                            height: "100%",
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </button>

                    {/* Explanation panel */}
                    {isOpen && activeIndicator && (
                      <div
                        className="px-4 py-3"
                        style={{
                          backgroundColor: "#0a0600",
                          border: "2px solid #78350f",
                          borderTop: "none",
                        }}
                      >
                        <p className="text-gray-300 text-[13px] font-mono leading-relaxed">
                          {activeIndicator.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="h-4" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
