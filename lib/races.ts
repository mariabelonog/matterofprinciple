// races.ts — Статический календарь сезона: 8 гонок по маршруту «Восточный экспресс».
// Баллы соперников (opponentScores) постепенно растут от гонки к гонке, отражая усиление конкуренции.
// Кризисные гонки (isCrisis: true) — раунды 2, 5, 8; в них показывается CrisisPanel.

import type { Race } from "@/types/game";

// Полный список гонок сезона в хронологическом порядке (индекс 0 = раунд 1).
export const RACES: Race[] = [
  {
    round: 1,
    city: "Paris",
    isCrisis: false,
    opponentScores: [1.5, 2.0, 2.2, 2.5, 2.8, 3.0, 3.3, 3.6, 4.0],
    atmosphereText: "\"If you are lucky enough to have lived in Paris as a young man, then wherever you go for the rest of your life, it stays with you.\" — Ernest Hemingway",
  },
  {
    round: 2,
    city: "Strassburg",
    isCrisis: true,
    opponentScores: [1.7, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.5],
    atmosphereText: "\"Strasbourg is the key to Germany.\" — Napoleon Bonaparte",
  },
  {
    round: 3,
    city: "Stuttgart",
    isCrisis: false,
    opponentScores: [1.9, 2.4, 2.7, 3.0, 3.3, 3.6, 4.0, 4.4, 4.8],
    atmosphereText: "Cradle of the automobile.",
  },
  {
    round: 4,
    city: "Vienna",
    isCrisis: false,
    opponentScores: [2.0, 2.5, 2.9, 3.2, 3.5, 3.9, 4.2, 4.6, 5.0],
    atmosphereText: "\"The streets of Vienna are paved with culture, the streets of other cities with asphalt.\" — Karl Kraus",
  },
  {
    round: 5,
    city: "Budapest",
    isCrisis: true,
    opponentScores: [2.2, 2.7, 3.1, 3.5, 3.8, 4.2, 4.6, 5.0, 5.5],
    atmosphereText: "\"Budapest is a prime site for dreams: the East's exuberant vision of the West, the West's uneasy hallucination of the East.\"",
  },
  {
    round: 6,
    city: "Bucharest",
    isCrisis: false,
    opponentScores: [2.3, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.7],
    atmosphereText: "Little Paris of the East.",
  },
  {
    round: 7,
    city: "Sinaia",
    isCrisis: false,
    opponentScores: [2.5, 3.0, 3.4, 3.8, 4.2, 4.6, 5.0, 5.5, 6.0],
    atmosphereText: "\"The mountains are calling and I must go.\" — John Muir",
  },
  {
    round: 8,
    city: "Istanbul",
    isCrisis: true,
    opponentScores: [2.7, 3.2, 3.7, 4.1, 4.5, 5.0, 5.5, 6.0, 6.5],
    atmosphereText: "\"If the Earth were a single state, Istanbul would be its capital.\" — Napoleon Bonaparte",
  },
];
