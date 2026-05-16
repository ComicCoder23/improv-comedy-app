// ============================================================
// PUGGY — The Stage Manager Fruit Machine
// Type definitions for the complete game system
// ============================================================

// -----------------------------------------------------------
// SYMBOLS
// -----------------------------------------------------------

export type Symbol =
  | "wild"      // Substitute for any symbol — rare, 1-2 per reel
  | "scatter"   // Triggers feature — 1-2 per reel, any position
  | "star"      // High value — rare, 2-3 per reel
  | "mask"      // Common — 8-10 per reel
  | "dram"      // Uncommon — 4-6 per reel (wee dram = Scottish whisky)
  | "tent"      // Uncommon — 4-6 per reel (improv tent/venue)
  | "thistle"   // Uncommon — 4-6 per reel (Scottish thistle)
  | "lightning" // Rare — 2-3 per reel (inspiration/energy)
  | "bell";     // Common — 8-10 per reel (classic fruit machine)

// -----------------------------------------------------------
// WIN TABLE
// -----------------------------------------------------------

export type WinEffect =
  | "none"
  | "hold_offered"
  | "nudge_awarded"
  | "feature_triggered"
  | "jackpot";

export type WinLine = {
  combination: [Symbol, Symbol, Symbol]; // what shows on reels 1, 2, 3
  name: string;                          // display name
  rp_payout: number;                     // RP awarded
  effect: WinEffect;
  visual_effect: string;                 // description for the UI layer
};

// -----------------------------------------------------------
// HOLD / NUDGE EVALUATION RESULTS
// -----------------------------------------------------------

export type HoldEvaluation = {
  holdsOffered: [boolean, boolean, boolean]; // which reels can be held
  reason: string;                             // e.g. "2 MASKS — HOLD AND SPIN"
};

export type NudgeEvaluation = {
  nudgesAwarded: number;       // 1–3
  eligibleReels: number[];     // indices 0, 1, 2
  direction: "up" | "down" | "choice";
};

// -----------------------------------------------------------
// FEATURE TRAIL — THE HAROLD
// -----------------------------------------------------------

export type FeatureAction =
  | "auto"              // advances automatically, no player choice
  | "collect_or_advance" // player picks: take RP now, or risk advancing
  | "spin_to_advance"   // player spins a mini-wheel to try to advance
  | "gamble";           // hi-lo gamble to double or bust

export type FeatureStage = {
  id: string;
  label: string;              // display name in UI
  rp_on_collect: number;      // RP if player collects here
  advance_probability: number;// 0.0–1.0, chance of reaching next stage
  action: FeatureAction;
  terminal_label?: string;    // only on final stage
  flavour_text: string;       // improv-themed copy shown to player
};

// -----------------------------------------------------------
// GAMBLE STATE
// -----------------------------------------------------------

export type GambleState = {
  currentAmount: number;
  guessOptions: ["higher", "lower"] | ["heads", "tails"];
  mode: "hi_lo" | "coin";
};

// -----------------------------------------------------------
// MAIN GAME STATE
// -----------------------------------------------------------

export type PuggyPhase =
  | "idle"          // waiting for player to start
  | "spinning"      // reels animating
  | "result"        // spin resolved — checking wins
  | "hold_offer"    // machine offering holds to player
  | "nudge"         // player using nudges
  | "feature"       // Harold Trail mini-game active
  | "gamble"        // hi-lo gamble on current win
  | "complete";     // all tokens spent — session ends

export type PuggyState = {
  phase: PuggyPhase;
  reels: [Symbol, Symbol, Symbol];        // currently displayed symbols
  reelStops: [number, number, number];    // current stop positions on virtual reels
  heldReels: [boolean, boolean, boolean]; // which reels are held this spin
  tokens: number;                          // remaining spins (3 per session)
  nudgesRemaining: number;                 // nudges available to use
  rpEarned: number;                        // total RP won this puggy session
  featureStage: number | null;             // null = not in feature; 0–6 = Harold stage index
  winMessage: string | null;               // displayed win copy
  lastWin: WinLine | null;                 // last resolved win line
  holdEvaluation: HoldEvaluation | null;   // populated when hold_offer phase
  nudgeEvaluation: NudgeEvaluation | null; // populated when nudge phase
  gambleState: GambleState | null;         // populated during gamble phase
  sessionComplete: boolean;                // true when tokens = 0 and feature done
  nearMissShown: boolean;                  // tracking — did last spin show a near-miss?
};

// -----------------------------------------------------------
// ACTION TYPES (for the hook's dispatch / exposed functions)
// -----------------------------------------------------------

export type PuggyAction =
  | { type: "SPIN" }
  | { type: "HOLD_REEL"; index: 0 | 1 | 2 }
  | { type: "CONFIRM_HOLD" }
  | { type: "APPLY_NUDGE"; reelIndex: number; direction: "up" | "down" }
  | { type: "SKIP_NUDGE" }
  | { type: "COLLECT_FEATURE" }
  | { type: "ADVANCE_FEATURE" }
  | { type: "GAMBLE"; guess: "higher" | "lower" | "heads" | "tails" }
  | { type: "COLLECT_WIN" }
  | { type: "RESET" };
