// ============================================================
// PUGGY — Win Table and Payout Structure
// ============================================================
//
// PAYOUT DESIGN PHILOSOPHY
//
// Target: roughly 1 in 5 spins returns *something*. Actual UK
// AWP machines aim for 70–80% RTP (return to player) but we
// don't need to hit that precisely — this is RP tokens, not
// real money. Our targets:
//
//   - 1 in 5 spins: minor win (10–30 RP)
//   - 1 in 12 spins: mid win (40–100 RP)
//   - 1 in 20 spins: feature trigger
//   - 1 in 100 spins: jackpot (500 RP)
//
// The maths behind this:
//   32^3 = 32,768 possible stop combinations.
//   Bell appears 9/32 on reel 1, 8/32 on reel 2, 9/32 on reel 3.
//   P(3 bells) = (9/32) × (8/32) × (9/32) = 648/32768 ≈ 1 in 51.
//   This lands nicely between "not trivial" and "happens often".
//
// Wild substitution: wild appears 1/32 per reel.
//   Wild + bell + bell on win line = wild subs for bell →
//   P ≈ (1/32) × (8/32) × (9/32) = 72/32768 ≈ 1 in 455.
//   Two-wild wins are extremely rare (1 in ~21,000).
//   Three-wild (jackpot) = (1/32)^3 = 1 in 32,768.
//
// NEAR-MISS ENGINEERING
//
// UK AWP machines are permitted to show more near-misses than
// true random would produce. The "assist system" does this by
// biasing stop selection when the machine decides a near-miss
// is appropriate (roughly 1 in 4 losing spins). Our implementation
// uses engineerNearMiss() to nudge reel 3 one stop away from a
// matching symbol, creating the illusion of "just missed it."
// This is disclosed in the info panel (Output 7).
// ============================================================

import type { Symbol, WinLine, WinEffect } from "./puggyTypes";

// -----------------------------------------------------------
// WILD RESOLUTION
// Resolve a symbol considering wild substitution.
// Wild can substitute for any symbol except scatter.
// -----------------------------------------------------------
export function resolveSymbol(sym: Symbol, target: Symbol): boolean {
  if (sym === target) return true;
  if (sym === "wild" && target !== "scatter") return true;
  return false;
}

/**
 * Check if three symbols form a winning combination,
 * accounting for wild substitution.
 */
export function isWinningCombo(
  reels: [Symbol, Symbol, Symbol],
  combo: [Symbol, Symbol, Symbol]
): boolean {
  return (
    resolveSymbol(reels[0], combo[0]) &&
    resolveSymbol(reels[1], combo[1]) &&
    resolveSymbol(reels[2], combo[2])
  );
}

// -----------------------------------------------------------
// WIN TABLE
// -----------------------------------------------------------

export const WIN_TABLE: WinLine[] = [
  // ---- JACKPOT ----
  {
    combination: ["wild", "wild", "wild"],
    name: "THE BUTTON",
    rp_payout: 500,
    effect: "jackpot",
    visual_effect: "FULL AMBER FLASH — screen shakes — 'THE SCENE MANAGER ARRIVES'",
  },

  // ---- HIGH VALUE 3-OF-A-KIND ----
  {
    combination: ["star", "star", "star"],
    name: "STANDING OVATION",
    rp_payout: 150,
    effect: "feature_triggered",
    visual_effect: "Gold star burst — 'STANDING OVATION — THE HAROLD AWAITS'",
  },
  {
    combination: ["lightning", "lightning", "lightning"],
    name: "YES AND!",
    rp_payout: 100,
    effect: "nudge_awarded",
    visual_effect: "Lightning crackle across reels — 'YES AND! — 3 NUDGES AWARDED'",
  },

  // ---- FEATURE TRIGGER (scatter wins) ----
  // Scatter pays regardless of position — checked separately in evaluateScatter()
  {
    combination: ["scatter", "scatter", "scatter"],
    name: "FULL HOUSE",
    rp_payout: 75,
    effect: "feature_triggered",
    visual_effect: "Reels pulse amber — 'FULL HOUSE — THE HAROLD TRAIL OPENS'",
  },

  // ---- MID VALUE 3-OF-A-KIND ----
  {
    combination: ["mask", "mask", "mask"],
    name: "THE MASK KING",
    rp_payout: 60,
    effect: "hold_offered",
    visual_effect: "Three masks glow — 'THE MASK KING — HOLD OFFERED'",
  },
  {
    combination: ["bell", "bell", "bell"],
    name: "CURTAIN CALL",
    rp_payout: 50,
    effect: "hold_offered",
    visual_effect: "Bells ring — 'CURTAIN CALL — HOLD OFFERED'",
  },
  {
    combination: ["dram", "dram", "dram"],
    name: "LAST ORDERS",
    rp_payout: 40,
    effect: "none",
    visual_effect: "Drams clink — 'LAST ORDERS — 40 RP'",
  },

  // ---- LOWER VALUE 3-OF-A-KIND ----
  {
    combination: ["thistle", "thistle", "thistle"],
    name: "PRICKLY",
    rp_payout: 30,
    effect: "nudge_awarded",
    visual_effect: "Thistles bloom — 'PRICKLY — 2 NUDGES AWARDED'",
  },
  {
    combination: ["tent", "tent", "tent"],
    name: "POP-UP SHOW",
    rp_payout: 25,
    effect: "none",
    visual_effect: "Tent poles rise — 'POP-UP SHOW — 25 RP'",
  },

  // ---- WILD SUBSTITUTION WINS (2 wilds) ----
  {
    combination: ["wild", "wild", "star"],
    name: "DOUBLE WILD STAR",
    rp_payout: 200,
    effect: "feature_triggered",
    visual_effect: "Two wilds blaze — 'DOUBLE WILD — THE HAROLD TRAIL OPENS'",
  },
  {
    combination: ["wild", "wild", "mask"],
    name: "DOUBLE WILD MASK",
    rp_payout: 120,
    effect: "hold_offered",
    visual_effect: "Double wild — 'DOUBLE WILD MASK — 120 RP'",
  },
  {
    combination: ["wild", "wild", "bell"],
    name: "DOUBLE WILD BELL",
    rp_payout: 100,
    effect: "none",
    visual_effect: "Double wild — 'DOUBLE WILD BELL — 100 RP'",
  },

  // ---- WILD SUBSTITUTION WINS (1 wild on reel 1) ----
  {
    combination: ["wild", "star", "star"],
    name: "WILD STAR",
    rp_payout: 80,
    effect: "feature_triggered",
    visual_effect: "Wild lights up — 'WILD STAR — FEATURE TRIGGERED'",
  },
  {
    combination: ["wild", "lightning", "lightning"],
    name: "WILD LIGHTNING",
    rp_payout: 70,
    effect: "nudge_awarded",
    visual_effect: "Wild crackle — 'WILD LIGHTNING — 2 NUDGES'",
  },
  {
    combination: ["wild", "mask", "mask"],
    name: "WILD MASK",
    rp_payout: 40,
    effect: "none",
    visual_effect: "Wild subs in — 'WILD MASK — 40 RP'",
  },
  {
    combination: ["wild", "bell", "bell"],
    name: "WILD BELL",
    rp_payout: 30,
    effect: "none",
    visual_effect: "Wild rings in — 'WILD BELL — 30 RP'",
  },
  {
    combination: ["wild", "dram", "dram"],
    name: "WILD DRAM",
    rp_payout: 25,
    effect: "none",
    visual_effect: "Wild dram — 'WILD DRAM — 25 RP'",
  },

  // ---- MINOR WINS — MIXED COMBOS ----
  {
    combination: ["bell", "bell", "mask"],
    name: "CLOSE BUT AYE",
    rp_payout: 15,
    effect: "hold_offered",
    visual_effect: "Two bells glow — 'CLOSE BUT AYE — HOLD AND SPIN?'",
  },
  {
    combination: ["mask", "mask", "bell"],
    name: "MASKING IT",
    rp_payout: 15,
    effect: "hold_offered",
    visual_effect: "Two masks — 'MASKING IT — HOLD AND SPIN?'",
  },
  {
    combination: ["bell", "mask", "bell"],
    name: "SANDWICHED",
    rp_payout: 10,
    effect: "nudge_awarded",
    visual_effect: "Outer bells — 'SANDWICHED — 1 NUDGE'",
  },
  {
    combination: ["mask", "bell", "mask"],
    name: "DOUBLE MASKED",
    rp_payout: 10,
    effect: "nudge_awarded",
    visual_effect: "Outer masks — 'DOUBLE MASKED — 1 NUDGE'",
  },
];

// -----------------------------------------------------------
// SCATTER EVALUATION
// Scatter pays any position — 2 scatters = 20 RP,
// 3 scatters = jackpot of feature. Evaluated separately
// from the win line because scatter ignores position.
// -----------------------------------------------------------

export type ScatterResult = {
  count: number;
  payout: number;
  featureTriggered: boolean;
  message: string;
};

export function evaluateScatter(
  reels: [Symbol, Symbol, Symbol]
): ScatterResult | null {
  const scatterCount = reels.filter((s) => s === "scatter").length;

  if (scatterCount === 0) return null;

  if (scatterCount === 1) {
    return {
      count: 1,
      payout: 5,
      featureTriggered: false,
      message: "SCATTER — 5 RP BONUS",
    };
  }

  if (scatterCount === 2) {
    return {
      count: 2,
      payout: 20,
      featureTriggered: false,
      message: "DOUBLE SCATTER — 20 RP BONUS",
    };
  }

  // 3 scatters — this is the primary feature trigger
  return {
    count: 3,
    payout: 75,
    featureTriggered: true,
    message: "FULL HOUSE — THE HAROLD TRAIL OPENS",
  };
}

// -----------------------------------------------------------
// WIN LINE EVALUATION
// Checks reels against all entries in WIN_TABLE.
// Returns the highest-value match, or null if no win.
// -----------------------------------------------------------

export function evaluateWinLine(
  reels: [Symbol, Symbol, Symbol]
): WinLine | null {
  // Iterate WIN_TABLE in order (highest payout first)
  for (const win of WIN_TABLE) {
    if (isWinningCombo(reels, win.combination)) {
      return win;
    }
  }
  return null;
}

// -----------------------------------------------------------
// NEAR-MISS ENGINEERING
//
// Called when the spin result is a loss AND the assist system
// decides to show a near-miss (triggered ~25% of losing spins).
//
// The technique: after a genuine random spin that loses, we check
// if reel 3 is one stop away from completing a 2-match scenario
// on reels 1 and 2. If so, we use that real stop — it's already
// a near-miss by chance. If not, we bias reel 3 to be exactly
// one stop above or below a matching symbol.
//
// ETHICAL NOTE: The near-miss doesn't change the outcome — the
// player has already lost. It just controls how the loss looks.
// This is standard in UK AWP design and disclosed in our info panel.
// -----------------------------------------------------------

export function wouldWinAtStop(
  reelIndex: 0 | 1 | 2,
  stop: number,
  otherReels: [Symbol | null, Symbol | null, Symbol | null],
  reelStrip: Symbol[]
): boolean {
  const sym = reelStrip[((stop % 32) + 32) % 32];
  const testReels: [Symbol, Symbol, Symbol] = [
    otherReels[0] ?? sym,
    otherReels[1] ?? sym,
    otherReels[2] ?? sym,
  ];
  testReels[reelIndex] = sym;
  return evaluateWinLine(testReels) !== null;
}

/**
 * engineerNearMiss — given a losing spin result, optionally adjust
 * reel 3's stop to be one step away from a win, creating a near-miss.
 *
 * Returns the (possibly adjusted) reel 3 stop.
 * This is called AFTER the genuine random spin has resolved as a loss.
 */
export function engineerNearMiss(
  stops: [number, number, number],
  reel3Strip: Symbol[]
): number {
  const reel3CurrentStop = stops[2];

  // Check if stop+1 on reel 3 would have been a win
  const aboveStop = ((reel3CurrentStop + 1) % 32 + 32) % 32;
  const belowStop = ((reel3CurrentStop - 1) % 32 + 32) % 32;

  // We just want to display the near-miss VISUALLY by returning
  // the stop that is one away from a win. The engine will show
  // that stop as the "above" or "below" symbol in the reel window,
  // making it look like "one nudge away."
  //
  // Since we show 3 symbols per reel (above/on/below win line),
  // the winning symbol being one stop away will appear in the
  // reel window — that IS the near-miss effect.
  //
  // For this implementation: we bias toward showing a high-value
  // symbol one stop above the win line (the player "just missed it").

  const sym1 = reel3Strip[stops[0] % 32] as Symbol;
  const sym2 = reel3Strip[stops[1] % 32] as Symbol;

  // If reels 1 and 2 match, put the matching symbol one stop above reel 3's win line
  if (sym1 === sym2 && sym1 !== "scatter") {
    // Find nearest stop on reel 3 that has sym1
    for (let delta = 1; delta <= 4; delta++) {
      const candidateStop = ((reel3CurrentStop - delta) % 32 + 32) % 32;
      if (reel3Strip[candidateStop] === sym1) {
        // Shift reel 3 so the winning symbol is just above the win line
        // i.e. adjust reel 3 stop to candidateStop + 1
        return (candidateStop + 1) % 32;
      }
    }
  }

  return reel3CurrentStop; // No adjustment — show genuine random result
}
