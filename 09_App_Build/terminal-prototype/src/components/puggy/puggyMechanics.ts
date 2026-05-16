// ============================================================
// PUGGY — Hold, Nudge, and Assist Mechanics
// ============================================================
//
// UK AWP MECHANICS REFERENCE
//
// HOLD MECHANIC
//   After a spin, the machine evaluates the result and may offer
//   holds on one or two reels. Holds let the player keep those
//   reels in place and spin the remaining reel(s) again.
//   Real UK machines use holds to:
//     1. Reward genuine near-misses (2 matching reels)
//     2. Create "temptation holds" where 2 unrelated reels are
//        offered, and the machine knows the next spin will miss —
//        this is the assist system being mischievous
//     3. Never offer all 3 holds (that would be a guaranteed win
//        after a win — instead the win pays out directly)
//
//   Our implementation offers holds in two scenarios:
//   - "Genuine hold": 2 matching reels, offering the player a
//     real chance to complete the 3-of-a-kind
//   - "Temptation hold": 2 reels offered but not matching — the
//     machine creates false hope. Disclosed in info panel.
//
// NUDGE MECHANIC
//   Nudges move a reel one stop up or down from its current
//   position. They're awarded after certain non-winning spins
//   as a consolation prize. 1–3 nudges awarded at a time.
//   The player chooses which reel to nudge and which direction.
//   On real UK machines, the nudge eval is done by the ROM and
//   the machine often "helpfully" indicates which way to nudge
//   (via flashing arrows). We implement this as direction "choice"
//   in most cases, with the hint embedded in nudgeEvaluation.eligibleReels.
//
// FEATURE TRAIL
//   The Harold Trail (see puggyFeature.ts) is triggered by
//   specific combinations. The feature is a separate mini-game
//   state machine, not a reel mechanic.
//
// GAMBLE MECHANIC
//   After any win, the player can gamble the RP on a 50/50.
//   "Higher" or "Lower" based on a random number 1–10.
//   Win: double the RP. Lose: lose all RP from that win.
//   Cap: cannot gamble if already at session RP cap.
//   A "coin flip" variant (heads/tails) is used for smaller wins
//   to maintain the improv theme.
//
// ASSIST SYSTEM
//   The "assist" (called various things by manufacturers — "the
//   streak", "the bank", "stepper logic") is a probability
//   adjustment layer. In real UK AWPs, the machine tracks cumulative
//   payouts and adjusts win probability to maintain target RTP.
//   Our version is simpler: a "session bias" that nudges the random
//   outcomes slightly based on how many tokens remain and how much
//   RP has been won. If the player hasn't won anything after 2
//   tokens, the third spin has boosted near-miss / nudge award
//   probability. This is disclosed in the info panel.
// ============================================================

import type { Symbol, HoldEvaluation, NudgeEvaluation } from "./puggyTypes";
import { REEL_STRIPS, symbolAt } from "./puggyReels";
import { evaluateWinLine } from "./puggyWins";

// -----------------------------------------------------------
// HOLD EVALUATION
// -----------------------------------------------------------

/**
 * Evaluate whether to offer holds after a spin result.
 *
 * Rules:
 * 1. Never offer holds if the spin was a win (the win pays out directly)
 * 2. Offer holds if exactly 2 reels match a common symbol
 * 3. With 15% probability, offer "temptation holds" on non-matching reels
 * 4. Never offer all 3 holds
 * 5. Never offer holds on the last token (no spin remaining to use them)
 */
export function evaluateHolds(
  result: [Symbol, Symbol, Symbol],
  tokensRemaining: number
): HoldEvaluation | null {
  // No holds if already won
  if (evaluateWinLine(result) !== null) return null;

  // No holds if this was the last token
  if (tokensRemaining <= 0) return null;

  const [r1, r2, r3] = result;

  // ---- GENUINE HOLDS ----

  // Two matching on reels 1 and 2
  if (r1 === r2 && r1 !== "scatter" && r1 !== "wild") {
    return {
      holdsOffered: [true, true, false],
      reason: `2 ${r1.toUpperCase()}S — HOLD AND SPIN`,
    };
  }

  // Two matching on reels 2 and 3
  if (r2 === r3 && r2 !== "scatter" && r2 !== "wild") {
    return {
      holdsOffered: [false, true, true],
      reason: `2 ${r2.toUpperCase()}S — HOLD AND SPIN`,
    };
  }

  // Two matching on reels 1 and 3 (less common — sandwich pattern)
  if (r1 === r3 && r1 !== "scatter" && r1 !== "wild") {
    return {
      holdsOffered: [true, false, true],
      reason: `OUTER ${r1.toUpperCase()}S — HOLD AND SPIN`,
    };
  }

  // ---- TEMPTATION HOLDS (assist system) ----
  // Triggered ~15% of remaining losing spins to keep engagement up
  const temptationRoll = Math.random();
  if (temptationRoll < 0.15) {
    // Offer 2 reels that share a common symbol category (not matching)
    // Pick a pair: 0+1, 1+2, or 0+2
    const pair = Math.random() < 0.33 ? [0, 1] : Math.random() < 0.5 ? [1, 2] : [0, 2];
    const offered: [boolean, boolean, boolean] = [false, false, false];
    offered[pair[0]] = true;
    offered[pair[1]] = true;

    // Find something compelling to say
    const heldSymbol = result[pair[0]];
    const isCommon = ["bell", "mask"].includes(heldSymbol);
    const reason = isCommon
      ? `${heldSymbol.toUpperCase()} FEELING LUCKY — HOLD AND TRY?`
      : `ALMOST THERE — HOLD AND SPIN`;

    return { holdsOffered: offered, reason };
  }

  return null;
}

// -----------------------------------------------------------
// NUDGE EVALUATION
// -----------------------------------------------------------

/**
 * Evaluate whether to award nudges after a losing spin.
 *
 * UK AWP logic: nudges are awarded as consolation after
 * certain losing outcomes. The machine awards 1–3 nudges
 * with probability that depends on how far the spin was
 * from a win.
 *
 * Our rules:
 * - 20% of losing spins award 1 nudge
 * - 8% of losing spins award 2 nudges
 * - 3% of losing spins award 3 nudges
 * - Nudges always awarded when win line symbols match on 2 reels
 *   with the third reel just 1-2 stops away from completing
 * - Nudge direction hint: if nudging reel 3 one stop would complete
 *   a win, direction is "choice" but eligibleReels flags reel 3
 *
 * Only awarded if holds were NOT offered this spin.
 */
export function evaluateNudges(
  result: [Symbol, Symbol, Symbol],
  stops: [number, number, number],
  holdsOffered: boolean
): NudgeEvaluation | null {
  if (holdsOffered) return null;

  // Check if a nudge on reel 3 would complete a win
  const reel3Up = symbolAt(REEL_STRIPS[2], stops[2] - 1);
  const reel3Down = symbolAt(REEL_STRIPS[2], stops[2] + 1);

  const testUp: [Symbol, Symbol, Symbol] = [result[0], result[1], reel3Up];
  const testDown: [Symbol, Symbol, Symbol] = [result[0], result[1], reel3Down];

  if (evaluateWinLine(testUp) !== null || evaluateWinLine(testDown) !== null) {
    // One nudge on reel 3 would win — award it
    return {
      nudgesAwarded: 1,
      eligibleReels: [2], // highlight reel 3 in UI
      direction: "choice",
    };
  }

  // Check reel 1
  const reel1Up = symbolAt(REEL_STRIPS[0], stops[0] - 1);
  const testR1Up: [Symbol, Symbol, Symbol] = [reel1Up, result[1], result[2]];
  if (evaluateWinLine(testR1Up) !== null) {
    return {
      nudgesAwarded: 1,
      eligibleReels: [0],
      direction: "choice",
    };
  }

  // Standard probability nudge award
  const roll = Math.random();
  if (roll < 0.03) {
    return {
      nudgesAwarded: 3,
      eligibleReels: [0, 1, 2],
      direction: "choice",
    };
  } else if (roll < 0.11) {
    return {
      nudgesAwarded: 2,
      eligibleReels: [0, 1, 2],
      direction: "choice",
    };
  } else if (roll < 0.31) {
    return {
      nudgesAwarded: 1,
      eligibleReels: [0, 1, 2],
      direction: "choice",
    };
  }

  return null;
}

// -----------------------------------------------------------
// NUDGE APPLICATION
// -----------------------------------------------------------

/**
 * Apply a nudge to a reel — move one stop up or down.
 * Returns the new stop index.
 * Up = reel strip moves up = symbol below comes into view on win line.
 * Down = reel strip moves down = symbol above comes into view on win line.
 *
 * Convention (matches physical fruit machine):
 *   "Up nudge" → stop index decreases by 1 (reel scrolls up,
 *                next symbol from above drops onto win line)
 *   "Down nudge" → stop index increases by 1 (reel scrolls down,
 *                 symbol below rises onto win line)
 */
export function applyNudge(
  reelLength: number,
  currentStop: number,
  direction: "up" | "down"
): number {
  if (direction === "up") {
    return ((currentStop - 1) % reelLength + reelLength) % reelLength;
  }
  return (currentStop + 1) % reelLength;
}

/**
 * Apply a nudge and return the new stop + new symbol.
 */
export function applyNudgeToReel(
  reelIndex: 0 | 1 | 2,
  currentStop: number,
  direction: "up" | "down"
): { newStop: number; newSymbol: Symbol } {
  const reel = REEL_STRIPS[reelIndex];
  const newStop = applyNudge(reel.length, currentStop, direction);
  const newSymbol = symbolAt(reel, newStop);
  return { newStop, newSymbol };
}

// -----------------------------------------------------------
// GAMBLE MECHANIC
// -----------------------------------------------------------

/**
 * Resolve a hi-lo gamble.
 * The machine picks a number 1–10. Player guesses higher or lower
 * relative to 5 (midpoint). Numbers 1–5 = lower, 6–10 = higher.
 * True 50/50 — no assist here. If tied at 5, player loses (house edge).
 */
export function resolveHiLoGamble(guess: "higher" | "lower"): {
  won: boolean;
  roll: number;
  outcome: "higher" | "lower";
} {
  const roll = Math.ceil(Math.random() * 10);
  const outcome = roll >= 6 ? "higher" : "lower";
  const won = guess === outcome;
  return { won, roll, outcome };
}

/**
 * Resolve a coin-flip gamble (heads/tails).
 * Used for smaller wins to keep the improv theme.
 */
export function resolveCoinGamble(guess: "heads" | "tails"): {
  won: boolean;
  result: "heads" | "tails";
} {
  const result = Math.random() < 0.5 ? "heads" : "tails";
  return { won: guess === result, result };
}

// -----------------------------------------------------------
// SESSION ASSIST SYSTEM
// -----------------------------------------------------------

/**
 * The session assist evaluates the player's current session
 * and applies a "sympathy boost" if the player has had a bad run.
 *
 * Returns a bias multiplier applied to the near-miss / nudge
 * probability. Range: 1.0 (no boost) to 2.0 (max boost after
 * 2 empty-token losing session).
 *
 * This is disclosed fully in the info panel.
 */
export function getAssistBias(
  tokensUsed: number,
  rpEarned: number,
  totalTokens: number
): number {
  const fractionUsed = tokensUsed / totalTokens;
  const hasWonNothing = rpEarned === 0;

  // Late in session with nothing won — apply sympathy boost
  if (fractionUsed >= 0.67 && hasWonNothing) {
    return 1.8;
  }
  if (fractionUsed >= 0.33 && hasWonNothing) {
    return 1.3;
  }

  return 1.0;
}

/**
 * Decide whether to show a near-miss on a losing spin.
 * Called by the main spin resolver.
 *
 * At base rate: 25% of losing spins.
 * With assist bias: up to 45% of losing spins.
 */
export function shouldShowNearMiss(assistBias: number): boolean {
  const baseRate = 0.25;
  return Math.random() < baseRate * assistBias;
}
