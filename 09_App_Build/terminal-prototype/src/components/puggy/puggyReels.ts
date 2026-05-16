// ============================================================
// PUGGY — Reel Weighting Tables
// ============================================================
//
// UK AWP PRIMER — HOW REEL WEIGHTING WORKS
//
// A real UK pub fruit machine does NOT spin truly random symbols.
// Instead it uses a "virtual reel strip" — an array of N positions
// (typically 32, 64, or 128 stops). Each stop maps to a symbol.
// The machine picks a random stop number; the symbol at that stop
// is what shows. Because common symbols appear at MORE stops,
// they come up more often. Rare symbols occupy fewer stops.
//
// This is fundamentally different from Vegas-style slots where each
// symbol has its own independent probability. On a UK AWP, the
// complete symbol frequency is baked into the reel strip layout,
// and the house edge comes from the ratio of win-line combinations
// to total possible stop combinations (32 × 32 × 32 = 32,768
// possible outcomes for a 3-reel 32-stop machine).
//
// FREQUENCY TARGETS (per reel, 32 stops total):
//   bell      — 8–10 stops (very common)
//   mask      — 8–10 stops (very common)
//   dram      — 5–6 stops  (uncommon)
//   thistle   — 4–5 stops  (uncommon)
//   tent      — 4–5 stops  (uncommon)
//   lightning — 2–3 stops  (rare)
//   star      — 2–3 stops  (rare)
//   scatter   — 1–2 stops  (very rare — feature trigger)
//   wild      — 1–2 stops  (very rare — substitution)
//
// REEL STRIP DESIGN NOTES:
//   - Reels are NOT identical. Different weights per reel control
//     where aligned wins are possible.
//   - The win-line jackpot (wild/wild/wild) is astronomically rare
//     because wild appears only once on reel 1 and once on reel 3.
//   - Near-miss engineering: high-value symbols cluster near each
//     other on the strip so when two land, the third is "almost" there.
//   - Scatter is placed at stops that rarely align with high-value
//     symbols on other reels, keeping feature triggers independent.
// ============================================================

import type { Symbol } from "./puggyTypes";

// -----------------------------------------------------------
// REEL 1 — 32 stops
// bell×9, mask×9, dram×5, thistle×4, tent×4, lightning×2,
// star×2, scatter×1, wild×1 (totals = 37 — trim to 32 by
// reducing bell and mask each by ~2 to balance)
// Final: bell×8, mask×8, dram×5, thistle×4, tent×3,
//        lightning×2, star×2, scatter×1, wild×1 = 34 → trim tent to 2 = 32
// -----------------------------------------------------------
export const REEL_1: Symbol[] = [
  "bell",     // 0
  "mask",     // 1
  "bell",     // 2
  "dram",     // 3
  "bell",     // 4
  "mask",     // 5
  "thistle",  // 6
  "bell",     // 7
  "mask",     // 8
  "dram",     // 9
  "bell",     // 10
  "mask",     // 11
  "tent",     // 12
  "bell",     // 13
  "lightning",// 14
  "mask",     // 15
  "bell",     // 16
  "dram",     // 17
  "mask",     // 18
  "thistle",  // 19
  "bell",     // 20
  "mask",     // 21
  "dram",     // 22
  "star",     // 23
  "bell",     // 24
  "mask",     // 25
  "thistle",  // 26
  "dram",     // 27
  "lightning",// 28
  "mask",     // 29
  "scatter",  // 30
  "wild",     // 31
  // Total: bell×8, mask×8, dram×5, thistle×3, tent×1, lightning×2, star×1, scatter×1, wild×1 = 30
  // Pad to 32:
  "tent",     // 32 — already index 32 in a 0-based 33-item array? Let's be explicit.
  "star",     // 33
];
// NOTE: Arrays have 34 entries above — final real reel strips below are trimmed to exactly 32.

// -----------------------------------------------------------
// CANONICAL 32-STOP REELS
// -----------------------------------------------------------

export const REEL_STRIP_1: Symbol[] = [
  "bell",      // 0
  "mask",      // 1
  "bell",      // 2
  "dram",      // 3
  "bell",      // 4
  "mask",      // 5
  "thistle",   // 6
  "bell",      // 7
  "mask",      // 8
  "dram",      // 9
  "bell",      // 10
  "mask",      // 11
  "tent",      // 12
  "bell",      // 13
  "lightning", // 14
  "mask",      // 15
  "bell",      // 16
  "dram",      // 17
  "mask",      // 18
  "thistle",   // 19
  "bell",      // 20
  "mask",      // 21
  "dram",      // 22
  "star",      // 23
  "bell",      // 24
  "mask",      // 25
  "thistle",   // 26
  "dram",      // 27
  "lightning", // 28
  "mask",      // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×8, mask×9, dram×5, thistle×3, tent×1, lightning×2, star×1, scatter×1, wild×1 = 31 — add tent:
// Rebalanced final:

export const REEL_1_STRIP: Symbol[] = [
  "bell",      // 0
  "mask",      // 1
  "bell",      // 2
  "dram",      // 3
  "bell",      // 4
  "mask",      // 5
  "thistle",   // 6
  "bell",      // 7
  "mask",      // 8
  "dram",      // 9
  "bell",      // 10
  "tent",      // 11
  "mask",      // 12
  "bell",      // 13
  "lightning", // 14
  "mask",      // 15
  "bell",      // 16
  "dram",      // 17
  "mask",      // 18
  "thistle",   // 19
  "bell",      // 20
  "mask",      // 21
  "dram",      // 22
  "star",      // 23
  "bell",      // 24
  "mask",      // 25
  "thistle",   // 26
  "dram",      // 27
  "lightning", // 28
  "tent",      // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×9, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×1, scatter×1, wild×1 = 32 ✓

// -----------------------------------------------------------
// REEL 2 — 32 stops
// Middle reel. Slightly higher bell/mask density for better
// "2 in a row" appearance. Star moved up to 2 stops.
// Wild is slightly more frequent (still 1 stop) but positioned
// to align with near-miss scenarios on reels 1 and 3.
// -----------------------------------------------------------
export const REEL_2_STRIP: Symbol[] = [
  "bell",      // 0
  "mask",      // 1
  "bell",      // 2
  "mask",      // 3
  "dram",      // 4
  "bell",      // 5
  "thistle",   // 6
  "mask",      // 7
  "bell",      // 8
  "dram",      // 9
  "mask",      // 10
  "bell",      // 11
  "tent",      // 12
  "mask",      // 13
  "bell",      // 14
  "dram",      // 15
  "lightning", // 16
  "mask",      // 17
  "bell",      // 18
  "thistle",   // 19
  "mask",      // 20
  "bell",      // 21
  "dram",      // 22
  "star",      // 23
  "mask",      // 24
  "bell",      // 25
  "tent",      // 26
  "dram",      // 27
  "star",      // 28
  "thistle",   // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×9, mask×9, dram×5, thistle×3, tent×2, lightning×1, star×2, scatter×1, wild×1 = 33
// Remove one mask → mask×8: remove index 3 substitute:
// Rebalanced:

export const REEL_2_FINAL: Symbol[] = [
  "bell",      // 0
  "mask",      // 1
  "bell",      // 2
  "dram",      // 3  ← was mask
  "bell",      // 4
  "mask",      // 5
  "thistle",   // 6
  "bell",      // 7
  "mask",      // 8
  "dram",      // 9
  "bell",      // 10
  "tent",      // 11
  "mask",      // 12
  "bell",      // 13
  "dram",      // 14
  "lightning", // 15
  "mask",      // 16
  "bell",      // 17
  "thistle",   // 18
  "mask",      // 19
  "bell",      // 20
  "dram",      // 21
  "star",      // 22
  "mask",      // 23
  "bell",      // 24
  "tent",      // 25
  "dram",      // 26
  "star",      // 27
  "thistle",   // 28
  "lightning", // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×9, mask×8, dram×6, thistle×3, tent×2, lightning×2, star×2, scatter×1, wild×1 = 34 → -2
// Final trim: remove one dram and one bell

export const REEL_2_STRIP_FINAL: Symbol[] = [
  "bell",      // 0   bell count target: 8
  "mask",      // 1   mask count target: 8
  "bell",      // 2
  "dram",      // 3
  "bell",      // 4
  "mask",      // 5
  "thistle",   // 6
  "bell",      // 7
  "mask",      // 8
  "dram",      // 9
  "tent",      // 10
  "mask",      // 11
  "bell",      // 12
  "dram",      // 13
  "lightning", // 14
  "mask",      // 15
  "bell",      // 16
  "thistle",   // 17
  "mask",      // 18
  "bell",      // 19
  "dram",      // 20
  "star",      // 21
  "mask",      // 22
  "bell",      // 23
  "tent",      // 24
  "dram",      // 25
  "star",      // 26
  "thistle",   // 27
  "lightning", // 28
  "mask",      // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×8, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×2, scatter×1, wild×1 = 32 ✓

// -----------------------------------------------------------
// REEL 3 — 32 stops
// Third reel. Wild is placed at stop 31, scatter at 30 —
// matching positions on reel 1 to create a genuine jackpot
// alignment path (wild/wild/wild at stop 31 on all three reels).
// Star reduced to 1 stop (making 3-star very rare).
// Bell and mask slightly lower to compensate for more thisle/tent.
// -----------------------------------------------------------
export const REEL_3_STRIP_FINAL: Symbol[] = [
  "bell",      // 0
  "mask",      // 1
  "bell",      // 2
  "thistle",   // 3
  "bell",      // 4
  "mask",      // 5
  "dram",      // 6
  "bell",      // 7
  "mask",      // 8
  "bell",      // 9
  "tent",      // 10
  "mask",      // 11
  "bell",      // 12
  "dram",      // 13
  "mask",      // 14
  "lightning", // 15
  "bell",      // 16
  "thistle",   // 17
  "mask",      // 18
  "dram",      // 19
  "bell",      // 20
  "tent",      // 21
  "mask",      // 22
  "dram",      // 23
  "thistle",   // 24
  "bell",      // 25
  "mask",      // 26
  "dram",      // 27
  "star",      // 28
  "lightning", // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×8, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×1, scatter×1, wild×1 = 31
// Add one more mask to hit 32:
// mask at index 3 (swap thistle):

export const REEL_3: Symbol[] = [
  "bell",      // 0   bell×8
  "mask",      // 1   mask×9
  "bell",      // 2
  "mask",      // 3   (extra mask)
  "bell",      // 4
  "mask",      // 5
  "dram",      // 6
  "bell",      // 7
  "mask",      // 8
  "bell",      // 9
  "tent",      // 10
  "mask",      // 11
  "bell",      // 12
  "dram",      // 13
  "mask",      // 14
  "lightning", // 15
  "bell",      // 16
  "thistle",   // 17
  "mask",      // 18
  "dram",      // 19
  "bell",      // 20
  "tent",      // 21
  "mask",      // 22
  "dram",      // 23
  "thistle",   // 24
  "bell",      // 25
  "dram",      // 26
  "thistle",   // 27
  "star",      // 28
  "lightning", // 29
  "scatter",   // 30
  "wild",      // 31
];
// bell×8, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×1, scatter×1, wild×1 = 31 still
// One more: add mask at 26 instead of dram:

// -----------------------------------------------------------
// CANONICAL EXPORT — THE THREE REELS USED BY THE ENGINE
// -----------------------------------------------------------

/**
 * REEL_STRIPS[0], [1], [2] — the three virtual reel strips.
 * Each has exactly 32 stops. The engine picks a random stop
 * index for each reel; the symbol at that index is displayed.
 *
 * Frequency analysis:
 *
 * Reel 1: bell×9, mask×8, dram×5, thistle×3, tent×2,
 *         lightning×2, star×1, scatter×1, wild×1 = 32
 *
 * Reel 2: bell×8, mask×8, dram×5, thistle×3, tent×2,
 *         lightning×2, star×2, scatter×1, wild×1 = 32
 *
 * Reel 3: bell×8, mask×8, dram×5, thistle×3, tent×2,
 *         lightning×2, star×1, scatter×1, wild×1 = 31 + 1 padding = 32
 */
export const REEL_STRIPS: [Symbol[], Symbol[], Symbol[]] = [
  // ---- REEL 1 ----
  [
    "bell",      // 0
    "mask",      // 1
    "bell",      // 2
    "dram",      // 3
    "bell",      // 4
    "mask",      // 5
    "thistle",   // 6
    "bell",      // 7
    "mask",      // 8
    "dram",      // 9
    "bell",      // 10
    "tent",      // 11
    "mask",      // 12
    "bell",      // 13
    "lightning", // 14
    "mask",      // 15
    "bell",      // 16
    "dram",      // 17
    "mask",      // 18
    "thistle",   // 19
    "bell",      // 20
    "mask",      // 21
    "dram",      // 22
    "star",      // 23
    "bell",      // 24
    "mask",      // 25
    "thistle",   // 26
    "dram",      // 27
    "lightning", // 28
    "tent",      // 29
    "scatter",   // 30
    "wild",      // 31
    // bell×9, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×1, scatter×1, wild×1 = 32 ✓
  ],
  // ---- REEL 2 ----
  [
    "bell",      // 0
    "mask",      // 1
    "bell",      // 2
    "dram",      // 3
    "bell",      // 4
    "mask",      // 5
    "thistle",   // 6
    "bell",      // 7
    "mask",      // 8
    "dram",      // 9
    "tent",      // 10
    "mask",      // 11
    "bell",      // 12
    "dram",      // 13
    "lightning", // 14
    "mask",      // 15
    "bell",      // 16
    "thistle",   // 17
    "mask",      // 18
    "bell",      // 19
    "dram",      // 20
    "star",      // 21
    "mask",      // 22
    "bell",      // 23
    "tent",      // 24
    "dram",      // 25
    "star",      // 26
    "thistle",   // 27
    "lightning", // 28
    "mask",      // 29
    "scatter",   // 30
    "wild",      // 31
    // bell×8, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×2, scatter×1, wild×1 = 32 ✓
  ],
  // ---- REEL 3 ----
  [
    "bell",      // 0
    "mask",      // 1
    "bell",      // 2
    "mask",      // 3
    "bell",      // 4
    "dram",      // 5
    "mask",      // 6
    "bell",      // 7
    "tent",      // 8
    "mask",      // 9
    "bell",      // 10
    "dram",      // 11
    "mask",      // 12
    "bell",      // 13
    "lightning", // 14
    "mask",      // 15
    "bell",      // 16
    "thistle",   // 17
    "dram",      // 18
    "bell",      // 19
    "mask",      // 20
    "tent",      // 21
    "dram",      // 22
    "thistle",   // 23
    "mask",      // 24
    "bell",      // 25
    "dram",      // 26
    "star",      // 27
    "thistle",   // 28
    "lightning", // 29
    "scatter",   // 30
    "wild",      // 31
    // bell×9, mask×8, dram×5, thistle×3, tent×2, lightning×2, star×1, scatter×1, wild×1 = 32 ✓
  ],
];

/**
 * Pick a random stop index for one reel.
 * Uses Math.random() — cryptographic randomness is unnecessary
 * and would add overhead. For a non-gambling RP token game
 * this is perfectly adequate.
 */
export function pickStop(): number {
  return Math.floor(Math.random() * 32);
}

/**
 * Read the symbol at a given stop, with wrapping.
 * The reel is circular — stop 32 wraps back to 0.
 */
export function symbolAt(reel: Symbol[], stop: number): Symbol {
  return reel[((stop % reel.length) + reel.length) % reel.length];
}

/**
 * Get the symbol one stop above (visually above the win line).
 * Used to display the reel window (3 visible symbols per reel).
 */
export function symbolAbove(reel: Symbol[], stop: number): Symbol {
  return symbolAt(reel, stop - 1);
}

/**
 * Get the symbol one stop below (visually below the win line).
 */
export function symbolBelow(reel: Symbol[], stop: number): Symbol {
  return symbolAt(reel, stop + 1);
}

/**
 * Spin all three reels and return the resulting stops and symbols.
 * If heldReels[i] is true, that reel keeps its current stop.
 */
export function spinReels(
  currentStops: [number, number, number],
  heldReels: [boolean, boolean, boolean]
): {
  stops: [number, number, number];
  symbols: [Symbol, Symbol, Symbol];
} {
  const stops: [number, number, number] = [
    heldReels[0] ? currentStops[0] : pickStop(),
    heldReels[1] ? currentStops[1] : pickStop(),
    heldReels[2] ? currentStops[2] : pickStop(),
  ];
  const symbols: [Symbol, Symbol, Symbol] = [
    symbolAt(REEL_STRIPS[0], stops[0]),
    symbolAt(REEL_STRIPS[1], stops[1]),
    symbolAt(REEL_STRIPS[2], stops[2]),
  ];
  return { stops, symbols };
}
