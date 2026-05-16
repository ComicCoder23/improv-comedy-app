// ============================================================
// PUGGY — The Harold Trail Feature Board
// ============================================================
//
// THE HAROLD is the classic long-form improv structure:
//   Opening → Beat 1 → Group Game 1 → Beat 2 →
//   Group Game 2 → Beat 3 → The Button
//
// Our feature trail maps each Harold stage to a puggy mini-game.
// It's triggered by scatter×3 or star×3 on the win line.
//
// DESIGN PRINCIPLES
//
// The Harold Trail is a state machine with 7 stages (indexed 0–6).
// The player starts at stage 0 (Opening) and tries to advance
// to stage 6 (The Button — jackpot).
//
// At most stages, the player faces a choice:
//   COLLECT: take the RP on offer and end the feature
//   ADVANCE: risk it to try for the next stage
//
// Advancing is probabilistic. Probability of advancing DECREASES
// as the player gets closer to The Button (the jackpot), because
// the potential reward increases. This creates a genuine risk/reward
// tension that is the heart of the UK feature trail.
//
// "ADVANCE PROBABILITY" DESIGN:
//   Stage 0 → 1 (Opening → Beat 1):   90% chance of advancing
//   Stage 1 → 2 (Beat 1 → Group 1):   75% chance
//   Stage 2 → 3 (Group 1 → Beat 2):   60% chance
//   Stage 3 → 4 (Beat 2 → Group 2):   50% chance
//   Stage 4 → 5 (Group 2 → Beat 3):   40% chance
//   Stage 5 → 6 (Beat 3 → The Button):30% chance
//   Stage 6 = THE BUTTON: collect jackpot immediately
//
// RP AWARDS AT EACH STAGE:
//   Balanced so collecting early is always meaningful (not punishing)
//   but The Button is the big reward.
//
// STAGE ACTIONS:
//   "auto"             — stage auto-resolves (used for Opening)
//   "collect_or_advance" — player picks: take RP or risk next stage
//   "spin_to_advance"  — player hits SPIN to see if they advance
//   "gamble"           — mini hi-lo determines whether they advance
// ============================================================

import type { FeatureStage } from "./puggyTypes";

// -----------------------------------------------------------
// THE HAROLD TRAIL — 7 STAGES
// -----------------------------------------------------------

export const HAROLD_TRAIL: FeatureStage[] = [
  {
    id: "opening",
    label: "THE OPENING",
    rp_on_collect: 20,
    advance_probability: 0.9,
    action: "auto",
    flavour_text:
      "The scene begins. Everyone steps forward. The audience is warmed. Keep going?",
  },
  {
    id: "beat_1",
    label: "BEAT 1",
    rp_on_collect: 40,
    advance_probability: 0.75,
    action: "collect_or_advance",
    flavour_text:
      "First scenes are running. Characters emerging. Take 40 RP now — or push deeper into the Harold?",
  },
  {
    id: "group_game_1",
    label: "GROUP GAME 1",
    rp_on_collect: 65,
    advance_probability: 0.6,
    action: "spin_to_advance",
    flavour_text:
      "The group game ignites. Patterns forming. 65 RP in your pocket — or spin for the second beat?",
  },
  {
    id: "beat_2",
    label: "BEAT 2",
    rp_on_collect: 95,
    advance_probability: 0.5,
    action: "collect_or_advance",
    flavour_text:
      "Second beat. Themes are colliding beautifully. Collect 95 RP — or risk it for Group Game 2?",
  },
  {
    id: "group_game_2",
    label: "GROUP GAME 2",
    rp_on_collect: 140,
    advance_probability: 0.4,
    action: "gamble",
    flavour_text:
      "Second group game blazing. The crowd is with you. Gamble 140 RP on the final beat?",
  },
  {
    id: "beat_3",
    label: "BEAT 3",
    rp_on_collect: 200,
    advance_probability: 0.3,
    action: "collect_or_advance",
    flavour_text:
      "Third beat. Everything converging. 200 RP sitting there. One more step to THE BUTTON — do you dare?",
  },
  {
    id: "the_button",
    label: "THE BUTTON",
    rp_on_collect: 500,
    advance_probability: 0,    // terminal stage — collect only
    action: "collect_or_advance",
    terminal_label: "THE BUTTON",
    flavour_text:
      "THE BUTTON. The Harold complete. The crowd explodes. 500 RP — YOU PUSHED IT TO THE END.",
  },
];

// -----------------------------------------------------------
// FEATURE STATE MACHINE LOGIC
// -----------------------------------------------------------

export type FeatureResult = "advanced" | "collected" | "knocked_back";

/**
 * Attempt to advance from the current stage to the next.
 * Returns:
 *   "advanced"     — player moves to next stage (or collects jackpot at terminal)
 *   "knocked_back" — advance attempt failed, player loses RP from current stage
 *                    (harsh but fair — disclosed in rules)
 */
export function attemptAdvance(stageIndex: number): FeatureResult {
  const stage = HAROLD_TRAIL[stageIndex];

  if (!stage) throw new Error(`Invalid stage index: ${stageIndex}`);

  // Terminal stage — just collect
  if (stageIndex === HAROLD_TRAIL.length - 1) {
    return "collected";
  }

  const roll = Math.random();

  if (roll < stage.advance_probability) {
    return "advanced";
  }

  return "knocked_back";
}

/**
 * Get the RP earned at a given stage.
 * If stageIndex is out of bounds, returns 0.
 */
export function getStageRP(stageIndex: number): number {
  return HAROLD_TRAIL[stageIndex]?.rp_on_collect ?? 0;
}

/**
 * Get a stage by index, with bounds checking.
 */
export function getStage(stageIndex: number): FeatureStage | null {
  return HAROLD_TRAIL[stageIndex] ?? null;
}

/**
 * Check if a stage is the terminal (jackpot) stage.
 */
export function isTerminalStage(stageIndex: number): boolean {
  return stageIndex === HAROLD_TRAIL.length - 1;
}

/**
 * Resolve the Opening stage (auto-advance).
 * The Opening always advances — it's a free entry into the trail.
 */
export function resolveOpening(): FeatureResult {
  return "advanced";
}

/**
 * Resolve a "spin to advance" stage.
 * Used for Group Game 1 — player spins a mini-wheel.
 * The result is probabilistic but visually tied to a spin animation.
 */
export function resolveSpinToAdvance(stageIndex: number): FeatureResult {
  return attemptAdvance(stageIndex);
}

/**
 * Resolve a gamble stage (Group Game 2).
 * Player makes a hi-lo guess to determine advance.
 * If they guess correctly, they advance; otherwise knocked back.
 */
export function resolveGambleStage(
  stageIndex: number,
  guessCorrect: boolean
): FeatureResult {
  if (guessCorrect) {
    return "advanced";
  }
  // Even on wrong guess, use the stage probability to give a
  // consolation chance (the Harold is merciful sometimes)
  const consolationRoll = Math.random();
  if (consolationRoll < 0.2) {
    return "advanced"; // Consolation advance (20%)
  }
  return "knocked_back";
}

// -----------------------------------------------------------
// FEATURE TRAIL SUMMARY
// Used to display trail progress in the UI
// -----------------------------------------------------------

export type TrailPosition = {
  stageIndex: number;
  label: string;
  rp_on_collect: number;
  isActive: boolean;
  isComplete: boolean;
};

export function getTrailMap(currentStageIndex: number): TrailPosition[] {
  return HAROLD_TRAIL.map((stage, index) => ({
    stageIndex: index,
    label: stage.label,
    rp_on_collect: stage.rp_on_collect,
    isActive: index === currentStageIndex,
    isComplete: index < currentStageIndex,
  }));
}
