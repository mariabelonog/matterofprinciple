// mockData.ts — Статические тестовые данные для разработки и демонстрации.
// Все значения вымышлены; реальные команды Ф1, пилоты и трассы не упоминаются.
// Эти данные не используются в игровом процессе — только для ручного тестирования.

// Пример состояния команды в середине сезона (после 1 гонки, бюджет 82M G).
// Все индексы ограничены диапазоном 0–10 согласно игровой спецификации.
export const teamState = {
  teamName: "Vortex Motorsport",
  budget: 82_000_000,          // in Geld (G); starts at 100M
  carDevelopment: 4.0,         // 0–10
  staffQuality: 3.5,           // 0–10
  publicImage: 5.0,            // 0–10
  driverIndex: 7.0,            // 0–10 — fixed at driver selection
  riskWillingness: 6,          // 0–10 — chosen before each race
  currentRace: 2,              // 1–8
};

// Тестовые пилоты (отличаются от игровых DRIVERS в lib/simulation.ts).
export const drivers = [
  { name: "Lev Cassian",   driverIndex: 9.0, cost: 15_000_000 },
  { name: "Mira Solande",  driverIndex: 6.5, cost:  8_000_000 },
  { name: "Otto Vael",     driverIndex: 5.0, cost:  4_000_000 },
];

export const raceCalendar = [
  { round: 1, city: "Paris",      isCrisis: false },
  { round: 2, city: "Strassburg", isCrisis: true  },
  { round: 3, city: "Stuttgart",  isCrisis: false },
  { round: 4, city: "Vienna",     isCrisis: false },
  { round: 5, city: "Budapest",   isCrisis: true  },
  { round: 6, city: "Bucharest",  isCrisis: false },
  { round: 7, city: "Sinaia",     isCrisis: false },
  { round: 8, city: "Istanbul",   isCrisis: true  },
];

export const crisisEvent = {
  city: "Strassburg",
  description:
    "Your lead engineer threatens to walk after a heated dispute over technical direction. The rest of the department is watching. You have hours to decide.",
  choices: [
    {
      id: "pay_bonus",
      label: "Pay a retention bonus",
      description: "Lock them in with a 5M G one-time payment.",
      budgetDelta: -5_000_000,
      staffQualityDelta: 1,
      publicImageDelta: 0,
    },
    {
      id: "promote",
      label: "Promote from within",
      description: "Elevate a junior engineer and absorb the disruption.",
      budgetDelta: 0,
      staffQualityDelta: -0.5,
      publicImageDelta: 0.5,
    },
    {
      id: "ignore",
      label: "Let them go",
      description: "Restructure quietly and cut costs elsewhere.",
      budgetDelta: 0,
      staffQualityDelta: -1.5,
      publicImageDelta: -0.5,
    },
  ],
};

// Пример итога сезона для тестирования экрана FinalSeasonResult.
export const seasonResult = {
  outcome: "survived" as "survived" | "bankrupt",
  summary:
    "Against all odds, your team crossed the finish line. Disciplined investment and two fortunate sponsor payouts kept the budget alive through Istanbul. A season survived is a foundation built.",
  stats: {
    racesCompleted: 8,
    avgPosition: 4,
    budgetRemaining: 11_500_000,
    publicImageFinal: 6.5,
  },
};
