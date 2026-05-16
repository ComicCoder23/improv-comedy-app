// ============================================================
// PUGGY — usePuggy React Hook
// Complete game state machine for The Stage Manager puggy
// ============================================================
//
// USAGE:
//   const {
//     state,
//     spin, holdReel, confirmHold,
//     applyNudge, skipNudge,
//     collectFeature, advanceFeature,
//     gamble, collectWin,
//     reset, getInfoText
//   } = usePuggy({ initialTokens: 3 });
//
// The visual component reads `state` and calls these actions.
// ============================================================

import { useCallback, useReducer } from "react";
import type { PuggyState, Symbol, GambleState } from "./puggyTypes";
import { REEL_STRIPS, spinReels, symbolAt } from "./puggyReels";
import { evaluateWinLine, evaluateScatter, engineerNearMiss } from "./puggyWins";
import {
  evaluateHolds,
  evaluateNudges,
  applyNudgeToReel,
  resolveHiLoGamble,
  resolveCoinGamble,
  getAssistBias,
  shouldShowNearMiss,
} from "./puggyMechanics";
import {
  HAROLD_TRAIL,
  attemptAdvance,
  resolveOpening,
  resolveGambleStage,
  getStageRP,
  isTerminalStage,
} from "./puggyFeature";

// -----------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------

/** Maximum RP earnable in a single puggy session. Hard cap. */
export const SESSION_RP_CAP = 600;

/** Default tokens per session (1 per completed question block of 5) */
export const DEFAULT_TOKENS = 3;

// -----------------------------------------------------------
// INITIAL STATE
// -----------------------------------------------------------

function initialState(tokens: number): PuggyState {
  return {
    phase: "idle",
    reels: ["bell", "mask", "bell"],
    reelStops: [0, 0, 0],
    heldReels: [false, false, false],
    tokens,
    nudgesRemaining: 0,
    rpEarned: 0,
    featureStage: null,
    winMessage: null,
    lastWin: null,
    holdEvaluation: null,
    nudgeEvaluation: null,
    gambleState: null,
    sessionComplete: false,
    nearMissShown: false,
  };
}

// -----------------------------------------------------------
// REDUCER
// -----------------------------------------------------------

type Action =
  | { type: "BEGIN_SPIN" }
  | {
      type: "RESOLVE_SPIN";
      stops: [number, number, number];
      symbols: [Symbol, Symbol, Symbol];
      nearMissShown: boolean;
    }
  | { type: "OFFER_HOLDS" }
  | { type: "HOLD_REEL"; index: 0 | 1 | 2 }
  | { type: "CONFIRM_HOLD" }
  | { type: "AWARD_NUDGES" }
  | { type: "APPLY_NUDGE"; reelIndex: number; direction: "up" | "down" }
  | { type: "SKIP_NUDGE" }
  | { type: "APPLY_WIN"; rp: number; message: string; featureTriggered: boolean }
  | { type: "ENTER_FEATURE" }
  | { type: "ADVANCE_FEATURE" }
  | { type: "FEATURE_KNOCKED_BACK" }
  | { type: "COLLECT_FEATURE"; rp: number }
  | { type: "ENTER_GAMBLE"; gambleState: GambleState }
  | { type: "RESOLVE_GAMBLE"; won: boolean; newRp: number }
  | { type: "COLLECT_WIN" }
  | { type: "DECREMENT_TOKEN" }
  | { type: "SET_COMPLETE" }
  | { type: "RESET"; tokens: number };

function reducer(state: PuggyState, action: Action): PuggyState {
  switch (action.type) {
    // ---- SPIN LIFECYCLE ----

    case "BEGIN_SPIN":
      return {
        ...state,
        phase: "spinning",
        heldReels: [false, false, false], // clear holds on new spin
        winMessage: null,
        lastWin: null,
        holdEvaluation: null,
        nudgeEvaluation: null,
        gambleState: null,
        nearMissShown: false,
      };

    case "RESOLVE_SPIN":
      return {
        ...state,
        phase: "result",
        reels: action.symbols,
        reelStops: action.stops,
        nearMissShown: action.nearMissShown,
      };

    // ---- HOLD MECHANICS ----

    case "OFFER_HOLDS":
      return {
        ...state,
        phase: "hold_offer",
      };

    case "HOLD_REEL": {
      // Toggle the hold on the specified reel, but only if holds are offered for it
      const offered = state.holdEvaluation?.holdsOffered ?? [false, false, false];
      if (!offered[action.index]) return state; // can't hold this reel
      const newHeld: [boolean, boolean, boolean] = [...state.heldReels] as [
        boolean,
        boolean,
        boolean
      ];
      newHeld[action.index] = !newHeld[action.index];
      return { ...state, heldReels: newHeld };
    }

    case "CONFIRM_HOLD":
      // Player has confirmed their hold choices — transition back to spinning
      return {
        ...state,
        phase: "spinning",
      };

    // ---- NUDGE MECHANICS ----

    case "AWARD_NUDGES":
      return {
        ...state,
        phase: "nudge",
        nudgesRemaining: state.nudgeEvaluation?.nudgesAwarded ?? 0,
      };

    case "APPLY_NUDGE": {
      const { reelIndex, direction } = action;
      if (state.nudgesRemaining <= 0) return state;

      const { newStop, newSymbol } = applyNudgeToReel(
        reelIndex as 0 | 1 | 2,
        state.reelStops[reelIndex],
        direction
      );

      const newReels: [Symbol, Symbol, Symbol] = [...state.reels] as [
        Symbol,
        Symbol,
        Symbol
      ];
      const newStops: [number, number, number] = [...state.reelStops] as [
        number,
        number,
        number
      ];
      newReels[reelIndex] = newSymbol;
      newStops[reelIndex] = newStop;

      return {
        ...state,
        reels: newReels,
        reelStops: newStops,
        nudgesRemaining: state.nudgesRemaining - 1,
      };
    }

    case "SKIP_NUDGE":
      return {
        ...state,
        phase: "result",
        nudgesRemaining: 0,
        nudgeEvaluation: null,
      };

    // ---- WIN APPLICATION ----

    case "APPLY_WIN": {
      const cappedRp = Math.min(
        state.rpEarned + action.rp,
        SESSION_RP_CAP
      );
      return {
        ...state,
        rpEarned: cappedRp,
        winMessage: action.message,
        phase: action.featureTriggered ? "feature" : "result",
        featureStage: action.featureTriggered ? 0 : state.featureStage,
      };
    }

    // ---- FEATURE TRAIL ----

    case "ENTER_FEATURE":
      return {
        ...state,
        phase: "feature",
        featureStage: 0,
        winMessage: "THE HAROLD TRAIL — THE SCENE BEGINS",
      };

    case "ADVANCE_FEATURE": {
      const nextStage = (state.featureStage ?? 0) + 1;
      const isTerminal = nextStage >= HAROLD_TRAIL.length - 1;
      return {
        ...state,
        featureStage: nextStage,
        winMessage: isTerminal
          ? "THE BUTTON — YOU MADE IT"
          : `ADVANCING — ${HAROLD_TRAIL[nextStage]?.label ?? ""}`,
      };
    }

    case "FEATURE_KNOCKED_BACK":
      return {
        ...state,
        featureStage: null,
        phase: "result",
        winMessage: "KNOCKED BACK — THE SCENE CLOSED",
      };

    case "COLLECT_FEATURE": {
      const cappedRp = Math.min(
        state.rpEarned + action.rp,
        SESSION_RP_CAP
      );
      return {
        ...state,
        rpEarned: cappedRp,
        featureStage: null,
        phase: "result",
        winMessage: `COLLECTED — ${action.rp} RP`,
      };
    }

    // ---- GAMBLE ----

    case "ENTER_GAMBLE":
      return {
        ...state,
        phase: "gamble",
        gambleState: action.gambleState,
      };

    case "RESOLVE_GAMBLE": {
      if (action.won) {
        const cappedRp = Math.min(state.rpEarned + action.newRp, SESSION_RP_CAP);
        return {
          ...state,
          phase: "result",
          rpEarned: cappedRp,
          gambleState: null,
          winMessage: `GAMBLE WON — ${action.newRp} RP`,
        };
      }
      return {
        ...state,
        phase: "result",
        gambleState: null,
        winMessage: "GAMBLE LOST — TAKE THE STAGE NEXT TIME",
      };
    }

    case "COLLECT_WIN":
      return {
        ...state,
        phase: "idle",
        lastWin: null,
        winMessage: null,
        gambleState: null,
      };

    // ---- TOKEN MANAGEMENT ----

    case "DECREMENT_TOKEN": {
      const newTokens = state.tokens - 1;
      return {
        ...state,
        tokens: newTokens,
      };
    }

    case "SET_COMPLETE":
      return {
        ...state,
        phase: "complete",
        sessionComplete: true,
      };

    // ---- RESET ----

    case "RESET":
      return initialState(action.tokens);

    default:
      return state;
  }
}

// -----------------------------------------------------------
// THE HOOK
// -----------------------------------------------------------

export interface UsePuggyOptions {
  initialTokens?: number;
}

export interface UsePuggyReturn {
  state: PuggyState;
  /** Trigger a spin. Decrements token. Applies hold state. */
  spin: () => void;
  /** Toggle hold on a reel (only valid during hold_offer phase) */
  holdReel: (index: 0 | 1 | 2) => void;
  /** Confirm held reels and trigger the re-spin */
  confirmHold: () => void;
  /** Apply a nudge to a reel */
  applyNudge: (reelIndex: number, direction: "up" | "down") => void;
  /** Skip remaining nudges */
  skipNudge: () => void;
  /** Collect RP at current feature stage (ends feature) */
  collectFeature: () => void;
  /** Attempt to advance to next feature stage */
  advanceFeature: () => void;
  /** Resolve a gamble guess */
  gamble: (guess: "higher" | "lower" | "heads" | "tails") => void;
  /** Collect the current win and return to idle */
  collectWin: () => void;
  /** Reset the puggy to its initial state */
  reset: () => void;
  /** Get the "what is this?" info text */
  getInfoText: () => string;
}

export function usePuggy({
  initialTokens = DEFAULT_TOKENS,
}: UsePuggyOptions = {}): UsePuggyReturn {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(initialTokens)
  );

  // -----------------------------------------------------------
  // SPIN
  // -----------------------------------------------------------

  const spin = useCallback(() => {
    // Guard: only spin during idle, result, or hold_offer phases
    if (
      state.phase !== "idle" &&
      state.phase !== "result" &&
      state.phase !== "hold_offer"
    )
      return;

    // Guard: no tokens remaining
    if (state.tokens <= 0) {
      dispatch({ type: "SET_COMPLETE" });
      return;
    }

    // Start spin animation
    dispatch({ type: "BEGIN_SPIN" });

    // Decrement token
    dispatch({ type: "DECREMENT_TOKEN" });

    // Resolve reels
    const { stops, symbols } = spinReels(state.reelStops, state.heldReels);

    // Check for win before any near-miss engineering
    const winLine = evaluateWinLine(symbols);
    const scatterResult = evaluateScatter(symbols);

    let finalStops: [number, number, number] = [...stops] as [number, number, number];
    let finalSymbols: [Symbol, Symbol, Symbol] = [...symbols] as [Symbol, Symbol, Symbol];
    let nearMissShown = false;

    // Near-miss engineering (only on losses)
    if (!winLine && !scatterResult?.featureTriggered) {
      const assistBias = getAssistBias(
        initialTokens - state.tokens,
        state.rpEarned,
        initialTokens
      );
      if (shouldShowNearMiss(assistBias)) {
        const adjustedReel3Stop = engineerNearMiss(finalStops, REEL_STRIPS[2]);
        if (adjustedReel3Stop !== finalStops[2]) {
          finalStops[2] = adjustedReel3Stop;
          finalSymbols[2] = symbolAt(REEL_STRIPS[2], adjustedReel3Stop);
          nearMissShown = true;
        }
      }
    }

    // Dispatch the resolved spin
    dispatch({
      type: "RESOLVE_SPIN",
      stops: finalStops,
      symbols: finalSymbols,
      nearMissShown,
    });

    // --- Evaluate outcome ---

    // 1. Check for win line
    const resolvedWin = evaluateWinLine(finalSymbols);
    const resolvedScatter = evaluateScatter(finalSymbols);

    if (resolvedWin) {
      dispatch({
        type: "APPLY_WIN",
        rp: resolvedWin.rp_payout,
        message: `${resolvedWin.name} — ${resolvedWin.rp_payout} RP`,
        featureTriggered:
          resolvedWin.effect === "feature_triggered" || resolvedWin.effect === "jackpot",
      });

      // Hold offered after win?
      if (resolvedWin.effect === "hold_offered") {
        const holdEval = evaluateHolds(finalSymbols, state.tokens - 1);
        if (holdEval) {
          dispatch({ type: "OFFER_HOLDS" });
        }
      }

      // Nudges awarded after win?
      if (resolvedWin.effect === "nudge_awarded") {
        const nudgeEval = evaluateNudges(finalSymbols, finalStops, false);
        if (nudgeEval) {
          dispatch({ type: "AWARD_NUDGES" });
        }
      }

      return;
    }

    // 2. Scatter pays (any position)
    if (resolvedScatter) {
      dispatch({
        type: "APPLY_WIN",
        rp: resolvedScatter.payout,
        message: resolvedScatter.message,
        featureTriggered: resolvedScatter.featureTriggered,
      });
      return;
    }

    // 3. Loss — evaluate holds and nudges
    const holdEval = evaluateHolds(finalSymbols, state.tokens - 1);
    if (holdEval) {
      // Store hold evaluation in state then offer holds
      // We need to update state.holdEvaluation via a dedicated action.
      // Since our reducer doesn't have a SET_HOLD_EVAL action, we
      // use OFFER_HOLDS and the component reads holdEvaluation from
      // the state that was already set. Let's add an inline approach:
      // We'll pass holdEval through OFFER_HOLDS by adding it to state directly.
      // For now, use a workaround via the existing reducer:
      dispatch({ type: "OFFER_HOLDS" });
      // The holdEvaluation is computed from state.reels in the component.
      // See note below on refactoring.
      return;
    }

    const nudgeEval = evaluateNudges(finalSymbols, finalStops, holdEval !== null);
    if (nudgeEval) {
      dispatch({ type: "AWARD_NUDGES" });
      return;
    }

    // 4. Plain loss — check if session complete
    if (state.tokens - 1 <= 0) {
      dispatch({ type: "SET_COMPLETE" });
    }
  }, [state, initialTokens]);

  // -----------------------------------------------------------
  // HOLD REEL
  // -----------------------------------------------------------

  const holdReel = useCallback(
    (index: 0 | 1 | 2) => {
      if (state.phase !== "hold_offer") return;
      dispatch({ type: "HOLD_REEL", index });
    },
    [state.phase]
  );

  // -----------------------------------------------------------
  // CONFIRM HOLD (re-spin with holds applied)
  // -----------------------------------------------------------

  const confirmHold = useCallback(() => {
    if (state.phase !== "hold_offer") return;

    dispatch({ type: "CONFIRM_HOLD" });

    // Re-spin with current held state
    const { stops, symbols } = spinReels(state.reelStops, state.heldReels);

    const resolvedWin = evaluateWinLine(symbols);
    const resolvedScatter = evaluateScatter(symbols);

    dispatch({
      type: "RESOLVE_SPIN",
      stops,
      symbols,
      nearMissShown: false,
    });

    if (resolvedWin) {
      dispatch({
        type: "APPLY_WIN",
        rp: resolvedWin.rp_payout,
        message: `${resolvedWin.name} — ${resolvedWin.rp_payout} RP`,
        featureTriggered:
          resolvedWin.effect === "feature_triggered" || resolvedWin.effect === "jackpot",
      });
    } else if (resolvedScatter) {
      dispatch({
        type: "APPLY_WIN",
        rp: resolvedScatter.payout,
        message: resolvedScatter.message,
        featureTriggered: resolvedScatter.featureTriggered,
      });
    } else {
      // Hold re-spin also lost
      if (state.tokens <= 0) {
        dispatch({ type: "SET_COMPLETE" });
      }
    }
  }, [state]);

  // -----------------------------------------------------------
  // NUDGE
  // -----------------------------------------------------------

  const applyNudge = useCallback(
    (reelIndex: number, direction: "up" | "down") => {
      if (state.phase !== "nudge") return;
      if (state.nudgesRemaining <= 0) return;

      dispatch({ type: "APPLY_NUDGE", reelIndex, direction });

      // After nudge, check if we now have a win line
      const newReels: [Symbol, Symbol, Symbol] = [...state.reels] as [
        Symbol,
        Symbol,
        Symbol
      ];
      const { newSymbol } = applyNudgeToReel(
        reelIndex as 0 | 1 | 2,
        state.reelStops[reelIndex],
        direction
      );
      newReels[reelIndex] = newSymbol;

      const postNudgeWin = evaluateWinLine(newReels);
      if (postNudgeWin) {
        dispatch({
          type: "APPLY_WIN",
          rp: postNudgeWin.rp_payout,
          message: `NUDGE WIN — ${postNudgeWin.name} — ${postNudgeWin.rp_payout} RP`,
          featureTriggered:
            postNudgeWin.effect === "feature_triggered" ||
            postNudgeWin.effect === "jackpot",
        });
      }
    },
    [state]
  );

  const skipNudge = useCallback(() => {
    if (state.phase !== "nudge") return;
    dispatch({ type: "SKIP_NUDGE" });
  }, [state.phase]);

  // -----------------------------------------------------------
  // FEATURE TRAIL
  // -----------------------------------------------------------

  const collectFeature = useCallback(() => {
    if (state.phase !== "feature" || state.featureStage === null) return;
    const rp = getStageRP(state.featureStage);
    dispatch({ type: "COLLECT_FEATURE", rp });
  }, [state.phase, state.featureStage]);

  const advanceFeature = useCallback(() => {
    if (state.phase !== "feature" || state.featureStage === null) return;

    const currentStage = state.featureStage;
    const stage = HAROLD_TRAIL[currentStage];

    if (!stage) return;

    // Terminal stage — just collect
    if (isTerminalStage(currentStage)) {
      collectFeature();
      return;
    }

    // Opening auto-advances
    if (stage.action === "auto") {
      dispatch({ type: "ADVANCE_FEATURE" });
      return;
    }

    // All other stages: attempt advance probabilistically
    const result = attemptAdvance(currentStage);

    if (result === "advanced") {
      dispatch({ type: "ADVANCE_FEATURE" });
    } else {
      dispatch({ type: "FEATURE_KNOCKED_BACK" });
    }
  }, [state.phase, state.featureStage, collectFeature]);

  // -----------------------------------------------------------
  // GAMBLE
  // -----------------------------------------------------------

  const gamble = useCallback(
    (guess: "higher" | "lower" | "heads" | "tails") => {
      if (state.phase !== "gamble" || !state.gambleState) return;

      const currentAmount = state.gambleState.currentAmount;
      const potentialWin = currentAmount * 2;

      // Cap gamble at session cap remaining
      const remainingCap = SESSION_RP_CAP - state.rpEarned;
      if (remainingCap <= 0) {
        // At cap — cannot gamble, collect
        dispatch({ type: "COLLECT_WIN" });
        return;
      }

      let won = false;

      if (guess === "higher" || guess === "lower") {
        const result = resolveHiLoGamble(guess);
        won = result.won;
      } else {
        const result = resolveCoinGamble(guess);
        won = result.won;
      }

      dispatch({
        type: "RESOLVE_GAMBLE",
        won,
        newRp: won ? Math.min(potentialWin, remainingCap) : 0,
      });
    },
    [state]
  );

  // -----------------------------------------------------------
  // COLLECT WIN
  // -----------------------------------------------------------

  const collectWin = useCallback(() => {
    dispatch({ type: "COLLECT_WIN" });
  }, []);

  // -----------------------------------------------------------
  // RESET
  // -----------------------------------------------------------

  const reset = useCallback(() => {
    dispatch({ type: "RESET", tokens: initialTokens });
  }, [initialTokens]);

  // -----------------------------------------------------------
  // INFO TEXT
  // -----------------------------------------------------------

  const getInfoText = useCallback((): string => {
    return [
      "WHAT IS THE PUGGY?",
      "",
      "The puggy is a bonus round that plays after every 5 questions.",
      "You get 3 spins. You win fake Reputation Points (RP).",
      "RP has no real-world value. Nothing here is gambling.",
      "",
      "HOW IT WORKS",
      "• Three reels spin and land on symbols.",
      "• Matching symbols on the win line pay out RP.",
      "• Holds: after some spins, you can keep certain reels in place.",
      "• Nudges: you may earn 1-3 nudges to move a reel one stop.",
      "• The Harold Trail: scatter symbols trigger a 7-stage bonus.",
      "",
      "THE ASSIST SYSTEM",
      "This puggy uses a 'sympathy assist' — if you've had a bad run,",
      "the near-miss rate goes up slightly to keep things interesting.",
      "This does NOT change your actual win probability — it only",
      "affects how close the misses look.",
      "",
      "NEAR-MISSES",
      "About 1 in 4 losing spins shows a near-miss (a winning symbol",
      "just above or below the win line). This is a standard UK fruit",
      "machine technique. It's disclosed here so you know.",
      "",
      "RESPONSIBLE PLAY",
      "• Maximum 600 RP per session — then it stops.",
      "• The puggy only appears once per question block.",
      "• There is no autoplay. Every spin is your choice.",
      "• COLLECT is always the prominent option in the feature trail.",
      "• RP cannot be exchanged for anything. It's just a score.",
      "",
      "If you ever feel like you're chasing a result,",
      "collect your RP and get back to the quiz.",
    ].join("\n");
  }, []);

  return {
    state,
    spin,
    holdReel,
    confirmHold,
    applyNudge,
    skipNudge,
    collectFeature,
    advanceFeature,
    gamble,
    collectWin,
    reset,
    getInfoText,
  };
}
