import type { CrisisEvent } from "@/types/game";

export const CRISIS_EVENTS: Record<string, CrisisEvent> = {
  Strassburg: {
    city: "Strassburg",
    title: "FUEL SMUGGLER",
    description:
      "A shady supplier shows up at the garage with an offer: performance fuel that sits in a grey area of the regulations. Undetectable — probably. The stewards are already suspicious of your car.",
    choices: [
      {
        id: "run_it",
        label: "Run the fuel",
        description: "Pump it in. The car will fly — unless the stewards come knocking.",
        carDevelopmentDelta: 3,
        budgetDelta: -8_000_000,
        publicImageDelta: -2,
        riskModifier: 3,
        crashLossMultiplier: 2,
        narrative:
          "The car screams down the straight. The stewards are watching. Every lap could be your last clean one.",
      },
      {
        id: "decline",
        label: "Send him away",
        description: "Too risky. Keep it clean and race on what you have.",
        budgetDelta: -2_000_000,
        publicImageDelta: 1,
        riskModifier: -1,
        narrative:
          "You sleep better. The car is slow. The car is legal.",
      },
      {
        id: "tip_stewards",
        label: "Tip off the stewards",
        description: "Report the supplier. Free PR — but someone in the paddock will know it was you.",
        budgetDelta: 5_000_000,
        publicImageDelta: 3,
        staffQualityDelta: -1,
        riskModifier: -2,
        narrative:
          "Rivals get investigated. Your team picks up an unexpected sponsorship from a clean-fuel brand. The garage hates you for it.",
      },
    ],
  },
  Budapest: {
    city: "Budapest",
    title: "THE GAMBLE UPGRADE",
    description:
      "Your lead engineer storms in at midnight with a radical floor redesign. Wind tunnel says it could be the fastest car on the grid. Or it could fall apart on lap one. There is no time to test it properly.",
    choices: [
      {
        id: "full_send",
        label: "Bolt it on — run the full upgrade",
        description: "All or nothing. The data looks incredible. The risk is total.",
        carDevelopmentDelta: 4,
        budgetDelta: -25_000_000,
        riskModifier: 4,
        crashLossMultiplier: 3,
        narrative:
          "The car is a rocket. The crew holds their breath every corner. One mistake and it is over — for the race and possibly the season.",
      },
      {
        id: "partial",
        label: "Run only the safe sections",
        description: "Half the performance, half the risk.",
        carDevelopmentDelta: 1.5,
        budgetDelta: -10_000_000,
        riskModifier: 1,
        narrative:
          "Compromised, but alive. The car is faster than before and still in one piece.",
      },
      {
        id: "shelve",
        label: "Shelve it — race the old spec",
        description: "Save the upgrade for the next race when it can be properly validated.",
        carDevelopmentDelta: 0.5,
        staffQualityDelta: 1,
        budgetDelta: -3_000_000,
        riskModifier: -2,
        narrative:
          "The engineer is furious. The car is boring. It finishes.",
      },
    ],
  },
  Istanbul: {
    city: "Istanbul",
    title: "MATTER OF PRINCIPLE",
    description:
      "The board has found a buyer. A sovereign wealth fund will take over the team — full financial rescue, zero debt, unlimited budget. All they ask is that you resign publicly and endorse the new regime. Your name, your credibility, their money.",
    choices: [
      {
        id: "take_the_money",
        label: "Take the money and walk",
        description: "Sign the papers. The team survives without you.",
        budgetDelta: 60_000_000,
        publicImageDelta: -4,
        staffQualityDelta: -2,
        driverBoost: -1,
        narrative:
          "The team is saved. You are not part of it anymore. The garage empties out. The car runs without a soul.",
      },
      {
        id: "refuse_and_attack",
        label: "Refuse — and go public against them",
        description: "Blow the whole thing up in the press. Rally the paddock. Win or die here.",
        budgetDelta: -20_000_000,
        publicImageDelta: 5,
        driverBoost: 3,
        carDevelopmentDelta: 1,
        riskModifier: 3,
        crashLossMultiplier: 2,
        narrative:
          "The story explodes. Half the paddock is behind you, half wants you gone. The driver is electrified. The car either wins or doesn't come back.",
      },
      {
        id: "stall",
        label: "Stall — negotiate for time",
        description: "Buy yourself one more race. No deal, no rejection. Just survive today.",
        staffQualityDelta: 0.5,
        publicImageDelta: 1,
        riskModifier: 1,
        narrative:
          "You say nothing. You race. Whatever happens next is someone else's problem tomorrow.",
      },
    ],
  },
};
