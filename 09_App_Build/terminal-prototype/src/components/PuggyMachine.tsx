"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

const AMBER = "#FFB300";
const AMBER_DIM = "#7A5C00";
const BLACK = "#0A0A00";
const RED = "#FF3333";
const GREEN = "#39FF14";
const YELLOW = "#FFD700";
const CLUNK_DURATION_CSS = "180ms";

type Rarity = "common" | "uncommon" | "rare" | "jackpot";

interface Symbol {
  name: string;
  display: string;
  rarity: Rarity;
  rpValue: number;
  isWild?: boolean;
  isScatter?: boolean;
}

const SYMBOLS: Symbol[] = [
  { name: "The Mask",     display: "🎭", rarity: "common",   rpValue: 10 },
  { name: "The Dram",     display: "🥃", rarity: "common",   rpValue: 15 },
  { name: "The Mic",      display: "🎤", rarity: "common",   rpValue: 10 },
  { name: "The Coo",      display: "🐄", rarity: "uncommon", rpValue: 25 },
  { name: "The Festival", display: "🎪", rarity: "uncommon", rpValue: 35 },
  { name: "The Notes",    display: "📜", rarity: "uncommon", rpValue: 30 },
  { name: "The Jackpot",  display: "⭐", rarity: "rare",     rpValue: 75 },
  { name: "WILD",         display: "🃏", rarity: "rare",     rpValue: 0,  isWild: true    },
  { name: "SCATTER",      display: "💥", rarity: "jackpot",  rpValue: 0,  isScatter: true },
];

const REEL_STRIP: Symbol[] = [
  ...Array(5).fill(SYMBOLS[0]),
  ...Array(5).fill(SYMBOLS[1]),
  ...Array(5).fill(SYMBOLS[2]),
  ...Array(3).fill(SYMBOLS[3]),
  ...Array(3).fill(SYMBOLS[4]),
  ...Array(3).fill(SYMBOLS[5]),
  ...Array(2).fill(SYMBOLS[6]),
  ...Array(2).fill(SYMBOLS[7]),
  ...Array(1).fill(SYMBOLS[8]),
];

interface TrailStage {
  id: string;
  label: string;
  rp: number;
  advanceProb: number;
  isJackpot?: boolean;
}

const HAROLD_TRAIL: TrailStage[] = [
  { id: "opening",     label: "THE OPENING",    rp: 20,  advanceProb: 0.72 },
  { id: "beat1",       label: "BEAT ONE",        rp: 40,  advanceProb: 0.65 },
  { id: "group_game1", label: "GROUP GAME I",    rp: 65,  advanceProb: 0.58 },
  { id: "beat2",       label: "BEAT TWO",        rp: 95,  advanceProb: 0.50 },
  { id: "group_game2", label: "GROUP GAME II",   rp: 130, advanceProb: 0.40 },
  { id: "beat3",       label: "BEAT THREE",      rp: 170, advanceProb: 0.28 },
  { id: "button",      label: "★ THE BUTTON ★",  rp: 250, advanceProb: 0,   isJackpot: true },
];

type WinTier = "none" | "pair" | "line" | "double" | "jackpot";

interface WinResult {
  tier: WinTier;
  rpEarned: number;
  message: string;
  scatterCount: number;
}

type ReelState = "idle" | "spinning" | "stopping" | "stopped";

interface ReelData {
  symbol: Symbol;
  state: ReelState;
  held: boolean;
}

interface PuggyMachineProps {
  tokens?: number;
  onComplete: (rpEarned: number) => void;
  onClose: () => void;
}

interface SparkleParticle {
  id: number;
  char: string;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
}

const SPIN_CHARS = ["🎭","🥃","🎤","🐄","🎪","📜","⭐","🃏","💥","🎭","🥃","🎪"];
const SPARKLE_CHARS = ["✦","★","◈","✸","✺","✦","·","·","✦"];

function randomPosition(): number {
  return Math.floor(Math.random() * REEL_STRIP.length);
}

function evaluateWin(reels: ReelData[]): WinResult {
  const [a, b, c] = reels.map((r) => r.symbol);
  const scatterCount = [a, b, c].filter((s) => s.isScatter).length;

  if (
    scatterCount === 3 ||
    (a.isWild && b.isWild && c.isWild) ||
    (a.name === "The Jackpot" && b.name === "The Jackpot" && c.name === "The Jackpot")
  ) {
    return { tier: "jackpot", rpEarned: 0, message: "SCATTER — THE HAROLD TRAIL OPENS", scatterCount };
  }

  const effectiveMatch = (x: Symbol, y: Symbol): boolean =>
    x.name === y.name || !!x.isWild || !!y.isWild;

  if (effectiveMatch(a, b) && effectiveMatch(b, c) && effectiveMatch(a, c)) {
    const base = [a, b, c].find((s) => !s.isWild) ?? a;
    return { tier: "line", rpEarned: base.rpValue, message: `LINE WIN — ${base.name.toUpperCase()}`, scatterCount };
  }

  if (effectiveMatch(a, b) || effectiveMatch(b, c) || effectiveMatch(a, c)) {
    const base = [a, b, c].find((s) => !s.isWild) ?? a;
    return { tier: "pair", rpEarned: Math.ceil(base.rpValue / 2), message: `PAIR — ${base.name.toUpperCase()}`, scatterCount };
  }

  return { tier: "none", rpEarned: 0, message: "No dice. Spin again.", scatterCount };
}

export default function PuggyMachine({
  tokens: initialTokens = 3,
  onComplete,
  onClose,
}: PuggyMachineProps) {

  const [tokens, setTokens]                 = useState<number>(initialTokens);
  const [totalRpEarned, setTotalRpEarned]   = useState<number>(0);
  const [isSpinning, setIsSpinning]         = useState<boolean>(false);
  const [spinPhase, setSpinPhase]           = useState<"idle"|"spinning"|"stopping"|"result">("idle");
  const [reels, setReels]                   = useState<ReelData[]>([
    { symbol: SYMBOLS[0], state: "idle", held: false },
    { symbol: SYMBOLS[1], state: "idle", held: false },
    { symbol: SYMBOLS[2], state: "idle", held: false },
  ]);
  const [spinFrames, setSpinFrames]         = useState<[string,string,string]>(["🎭","🥃","🎤"]);
  const [winResult, setWinResult]           = useState<WinResult | null>(null);
  const [winVisible, setWinVisible]         = useState<boolean>(false);
  const [jackpotActive, setJackpotActive]   = useState<boolean>(false);
  const [tokenRainActive, setTokenRainActive] = useState<boolean>(false);
  const [sparkles, setSparkles]             = useState<SparkleParticle[]>([]);
  const [holdEligible, setHoldEligible]     = useState<boolean>(false);
  const [nudgeReel, setNudgeReel]           = useState<number | null>(null);
  const [nudgeDir, setNudgeDir]             = useState<"up"|"down">("up");
  const [nudgesRemaining, setNudgesRemaining] = useState<number>(0);
  const [reelClunk, setReelClunk]           = useState<[boolean,boolean,boolean]>([false,false,false]);
  const [gameOver, setGameOver]             = useState<boolean>(false);
  const [rpCounterAnim, setRpCounterAnim]   = useState<boolean>(false);
  const [flashMsg, setFlashMsg]             = useState<string>("");

  // Harold Trail
  const [featureActive, setFeatureActive]       = useState<boolean>(false);
  const [featureStage, setFeatureStage]         = useState<number>(0);
  const [featureRpPool, setFeatureRpPool]       = useState<number>(0);
  const [featureMsg, setFeatureMsg]             = useState<string>("");
  const [featureAdvancing, setFeatureAdvancing] = useState<boolean>(false);

  const spinIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const sparkleIdRef     = useRef<number>(0);
  const reelPositionsRef = useRef<[number,number,number]>([0, 4, 12]);

  useEffect(() => {
    return () => { if (spinIntervalRef.current) clearInterval(spinIntervalRef.current); };
  }, []);

  const spawnSparkles = useCallback((count: number, colors: string[]) => {
    const particles: SparkleParticle[] = Array.from({ length: count }, () => ({
      id: sparkleIdRef.current++,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 400,
      duration: 600 + Math.random() * 800,
    }));
    setSparkles((prev) => [...prev, ...particles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((p) => !particles.find((np) => np.id === p.id)));
    }, 1500);
  }, []);

  const spawnTokenRain = useCallback(() => {
    setTokenRainActive(true);
    const iv = setInterval(() => spawnSparkles(6, [AMBER, YELLOW, AMBER_DIM]), 120);
    setTimeout(() => { clearInterval(iv); setTokenRainActive(false); }, 2400);
  }, [spawnSparkles]);

  const toggleHold = useCallback((i: number) => {
    if (!holdEligible || isSpinning) return;
    setReels((prev) => prev.map((r, idx) => idx === i ? { ...r, held: !r.held } : r));
  }, [holdEligible, isSpinning]);

  const triggerNudge = useCallback((reelIndex: number, dir: "up"|"down") => {
    if (nudgesRemaining <= 0 || isSpinning || !holdEligible) return;
    setNudgesRemaining((n) => n - 1);
    setNudgeReel(reelIndex);
    setNudgeDir(dir);
    const step = dir === "up" ? -1 : 1;
    setTimeout(() => {
      setNudgeReel(null);
      const cur = reelPositionsRef.current;
      const next: [number,number,number] = [...cur] as [number,number,number];
      next[reelIndex] = (cur[reelIndex] + step + REEL_STRIP.length) % REEL_STRIP.length;
      reelPositionsRef.current = next;
      setReels((prev) => {
        const updated = [...prev] as ReelData[];
        updated[reelIndex] = { ...updated[reelIndex], symbol: REEL_STRIP[next[reelIndex]] };
        return updated;
      });
    }, 350);
  }, [nudgesRemaining, isSpinning, holdEligible]);

  const triggerHaroldTrail = useCallback(() => {
    const first = HAROLD_TRAIL[0];
    setFeatureActive(true);
    setFeatureStage(0);
    setFeatureRpPool(first.rp);
    setFeatureMsg(`You've reached ${first.label} — +${first.rp} RP secured`);
  }, []);

  const handleCollectFeature = useCallback(() => {
    const earned = featureRpPool;
    setFeatureActive(false);
    setFeatureStage(0);
    setFeatureRpPool(0);
    setFeatureMsg("");
    setTotalRpEarned((prev) => prev + earned);
    spawnSparkles(12, [GREEN, AMBER, YELLOW]);
  }, [featureRpPool, spawnSparkles]);

  const handleAdvanceFeature = useCallback(() => {
    if (featureAdvancing) return;
    const stage = HAROLD_TRAIL[featureStage];
    if (stage.isJackpot) return;
    setFeatureAdvancing(true);
    setFeatureMsg("Rolling...");
    setTimeout(() => {
      if (Math.random() < stage.advanceProb) {
        const nextIdx = featureStage + 1;
        const next = HAROLD_TRAIL[nextIdx];
        const newPool = featureRpPool + next.rp;
        setFeatureStage(nextIdx);
        setFeatureRpPool(newPool);
        if (next.isJackpot) {
          setFeatureMsg(`★ THE BUTTON — GALLUS! +${next.rp} RP in the pool`);
          spawnSparkles(30, [YELLOW, AMBER, GREEN]);
          spawnTokenRain();
        } else {
          setFeatureMsg(`✦ Advanced to ${next.label} — +${next.rp} RP added`);
          spawnSparkles(8, [GREEN, AMBER]);
        }
      } else {
        const earned = featureRpPool;
        setFeatureMsg(`Dropped — banking +${earned} RP`);
        spawnSparkles(4, [AMBER_DIM, AMBER]);
        setTimeout(() => {
          setFeatureActive(false);
          setFeatureStage(0);
          setFeatureRpPool(0);
          setFeatureMsg("");
          setTotalRpEarned((prev) => prev + earned);
        }, 1800);
      }
      setFeatureAdvancing(false);
    }, 900);
  }, [featureAdvancing, featureStage, featureRpPool, spawnSparkles, spawnTokenRain]);

  const applyWinFeedback = useCallback(async (result: WinResult) => {
    setWinResult(result);
    setWinVisible(true);
    switch (result.tier) {
      case "none":
        setFlashMsg("No dice. Spin again.");
        setTimeout(() => setFlashMsg(""), 1800);
        break;
      case "pair":
        spawnSparkles(4, [AMBER, YELLOW]);
        setFlashMsg(`✦  PAIR — +${result.rpEarned} RP`);
        setTimeout(() => setFlashMsg(""), 2000);
        break;
      case "line":
        spawnSparkles(12, [GREEN, AMBER, YELLOW]);
        setFlashMsg(`✦ ✦ ✦  LINE WIN — +${result.rpEarned} RP`);
        setRpCounterAnim(true);
        setTimeout(() => setRpCounterAnim(false), 1000);
        setTimeout(() => setFlashMsg(""), 2500);
        break;
      case "double":
        spawnSparkles(20, [AMBER, YELLOW, GREEN]);
        setTimeout(() => spawnSparkles(20, [AMBER, YELLOW]), 300);
        setFlashMsg(`✦ ✦ ✦ ✦  DOUBLE — +${result.rpEarned} RP`);
        setRpCounterAnim(true);
        setTimeout(() => setRpCounterAnim(false), 1200);
        setTimeout(() => setFlashMsg(""), 3000);
        break;
      case "jackpot":
        setJackpotActive(true);
        spawnTokenRain();
        spawnSparkles(30, [AMBER, YELLOW, GREEN, RED]);
        setTimeout(() => spawnSparkles(30, [AMBER, YELLOW]), 200);
        setTimeout(() => spawnSparkles(30, [GREEN, AMBER]), 400);
        setTimeout(() => spawnSparkles(30, [YELLOW, RED]), 600);
        setFlashMsg("SCATTER — THE HAROLD TRAIL OPENS");
        setTimeout(() => {
          setJackpotActive(false);
          setFlashMsg("");
          triggerHaroldTrail();
        }, 3500);
        break;
    }
  }, [spawnSparkles, spawnTokenRain, triggerHaroldTrail]);

  const handleSpin = useCallback(async () => {
    if (isSpinning || tokens <= 0 || gameOver || featureActive) return;

    const newTokens = tokens - 1;
    setTokens(newTokens);
    setWinResult(null);
    setWinVisible(false);
    setFlashMsg("");
    setHoldEligible(false);
    setNudgesRemaining(0);
    setIsSpinning(true);
    setSpinPhase("spinning");
    setReels((prev) => prev.map((r) => ({ ...r, state: "spinning" as ReelState })));

    let frame = 0;
    spinIntervalRef.current = setInterval(() => {
      frame++;
      setSpinFrames([
        SPIN_CHARS[frame % SPIN_CHARS.length],
        SPIN_CHARS[(frame + 4) % SPIN_CHARS.length],
        SPIN_CHARS[(frame + 8) % SPIN_CHARS.length],
      ]);
    }, 60);

    const SPIN_DURATION = 900;
    const STOP_GAP      = 350;
    const CLUNK_MS      = 180;

    const curPos = reelPositionsRef.current;
    const newPos: [number,number,number] = reels.map((r, i) =>
      r.held ? curPos[i] : randomPosition()
    ) as [number,number,number];
    const finals: Symbol[] = newPos.map((p) => REEL_STRIP[p]);

    await new Promise<void>((res) => setTimeout(res, SPIN_DURATION));
    setReelClunk([true, false, false]);
    setSpinFrames([finals[0].display, SPIN_CHARS[5], SPIN_CHARS[9]]);
    setTimeout(() => setReelClunk([false, false, false]), CLUNK_MS);

    await new Promise<void>((res) => setTimeout(res, STOP_GAP));
    setReelClunk([false, true, false]);
    setSpinFrames([finals[0].display, finals[1].display, SPIN_CHARS[3]]);
    setTimeout(() => setReelClunk([false, false, false]), CLUNK_MS);

    await new Promise<void>((res) => setTimeout(res, STOP_GAP));
    if (spinIntervalRef.current) { clearInterval(spinIntervalRef.current); spinIntervalRef.current = null; }
    setReelClunk([false, false, true]);
    setSpinFrames([finals[0].display, finals[1].display, finals[2].display]);
    setTimeout(() => setReelClunk([false, false, false]), CLUNK_MS);

    const newReels: ReelData[] = finals.map((sym) => ({ symbol: sym, state: "stopped" as ReelState, held: false }));
    setReels(newReels);
    reelPositionsRef.current = newPos;
    setSpinPhase("result");
    setIsSpinning(false);

    const result = evaluateWin(newReels);
    if (result.rpEarned > 0) {
      setTotalRpEarned((prev) => prev + result.rpEarned);
    }

    // Near-miss nudge award
    if (result.tier === "pair") {
      setNudgesRemaining(Math.random() < 0.5 ? 2 : 1);
    } else if (result.tier === "none" && Math.random() < 0.18) {
      setNudgesRemaining(1);
    }

    await applyWinFeedback(result);
    setHoldEligible(true);

    if (newTokens <= 0) {
      setTimeout(() => setGameOver(true), 2800);
    }
  }, [isSpinning, tokens, gameOver, featureActive, reels, applyWinFeedback]);

  const handleCollect = useCallback(() => {
    onComplete(totalRpEarned);
  }, [totalRpEarned, onComplete]);

  const reelDisplays: string[] = (isSpinning || spinPhase === "spinning")
    ? spinFrames
    : reels.map((r) => r.symbol.display);

  const disableClose = featureActive && featureAdvancing;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "rgba(10,10,0,0.95)",
      fontFamily: '"Courier New","Lucida Console",Courier,monospace',
      color: AMBER, zIndex: 999, overflowY: "auto",
      userSelect: "none", WebkitUserSelect: "none",
    }}>

      {/* Sparkle particles */}
      {sparkles.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          color: p.color, fontSize: "18px", pointerEvents: "none",
          animation: `sparkle ${p.duration}ms ease-out ${p.delay}ms both`, zIndex: 1001,
        }}>{p.char}</div>
      ))}

      {/* Token rain */}
      {tokenRainActive && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1000 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{
              position: "absolute", top: "-10%",
              left: `${i * 5 + Math.random() * 5}%`,
              color: i % 3 === 0 ? YELLOW : AMBER,
              fontSize: i % 4 === 0 ? "24px" : "16px",
              animation: `tokenRain ${1.2 + Math.random() * 0.8}s linear ${i * 0.08}s both`,
              pointerEvents: "none",
            }}>◈</div>
          ))}
        </div>
      )}

      {/* Machine frame */}
      <div style={{
        width: "min(360px, 94vw)",
        border: jackpotActive ? `2px solid ${YELLOW}` : `2px solid ${AMBER_DIM}`,
        background: BLACK,
        boxShadow: jackpotActive ? `0 0 32px ${YELLOW}, 0 0 8px ${AMBER}` : `0 0 16px rgba(255,179,0,0.15)`,
        animation: jackpotActive ? "jackpotPulse 0.4s ease-in-out infinite" : "none",
        position: "relative",
      }}>

        {/* Header stripe */}
        <div style={{
          background: jackpotActive ? YELLOW : AMBER, color: BLACK,
          padding: "6px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: "13px", fontWeight: "bold", letterSpacing: "0.1em",
          animation: jackpotActive ? "jackpotPulse 0.4s ease-in-out infinite" : "none",
        }}>
          <span>▌ GALLUS PUGGY ▐</span>
          <button
            onClick={disableClose ? undefined : onClose}
            disabled={disableClose}
            style={{ background: "transparent", border: "none", color: BLACK, fontSize: "16px", cursor: disableClose ? "not-allowed" : "pointer", lineHeight: 1, padding: "0 2px", fontFamily: "monospace", fontWeight: "bold" }}
            aria-label="Close puggy"
          >×</button>
        </div>

        {/* Status bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 14px 4px", fontSize: "12px",
          borderBottom: `1px solid ${AMBER_DIM}`, color: AMBER_DIM, letterSpacing: "0.06em",
        }}>
          <span>TOKENS: <span style={{ color: tokens > 1 ? AMBER : RED, fontSize: "15px", fontWeight: "bold" }}>◈ {tokens}</span></span>
          <span>RP EARNED: <span style={{
            color: totalRpEarned > 0 ? GREEN : AMBER_DIM, fontSize: "15px", fontWeight: "bold",
            animation: rpCounterAnim ? "rpTick 0.15s step-end 6" : "none",
          }}>{totalRpEarned > 0 ? `+${totalRpEarned}` : "0"}</span></span>
        </div>

        {/* ── HAROLD TRAIL BOARD ── */}
        {featureActive ? (
          <div style={{ padding: "14px" }}>
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <div style={{ color: YELLOW, fontSize: "13px", fontWeight: "bold", letterSpacing: "0.2em" }}>
                ★ THE HAROLD TRAIL ★
              </div>
              <div style={{ color: GREEN, fontSize: "12px", marginTop: "4px" }}>
                Pool: +{featureRpPool} RP
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
              {HAROLD_TRAIL.map((stage, idx) => {
                const isPast    = idx < featureStage;
                const isCurrent = idx === featureStage;
                return (
                  <div key={stage.id} style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "5px 8px",
                    border: isCurrent ? `1px solid ${AMBER}` : `1px solid transparent`,
                    background: isCurrent ? "rgba(255,179,0,0.06)" : "transparent",
                    fontSize: "11px",
                  }}>
                    <span style={{ color: isPast ? GREEN : isCurrent ? YELLOW : AMBER_DIM, width: "14px", textAlign: "center", flexShrink: 0 }}>
                      {isPast ? "✓" : isCurrent ? "▶" : "·"}
                    </span>
                    <span style={{ flex: 1, color: isPast ? GREEN : isCurrent ? AMBER : AMBER_DIM, fontWeight: isCurrent ? "bold" : "normal", letterSpacing: "0.05em" }}>
                      {stage.label}
                    </span>
                    <span style={{ color: isPast ? GREEN : isCurrent ? YELLOW : AMBER_DIM, flexShrink: 0 }}>
                      +{stage.rp}
                    </span>
                  </div>
                );
              })}
            </div>

            {featureMsg && (
              <div style={{ textAlign: "center", fontSize: "11px", color: AMBER, padding: "6px 0", minHeight: "18px" }}>
                {featureMsg}
              </div>
            )}

            {!featureAdvancing && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleCollectFeature} style={{
                  flex: 1, padding: "10px 6px",
                  background: "rgba(57,255,20,0.08)", border: `2px solid ${GREEN}`,
                  color: GREEN, fontFamily: "monospace", fontSize: "11px",
                  letterSpacing: "0.08em", cursor: "pointer", fontWeight: "bold",
                }}>
                  COLLECT<br/>
                  <span style={{ fontSize: "13px" }}>+{featureRpPool} RP</span>
                </button>
                {!HAROLD_TRAIL[featureStage].isJackpot && (
                  <button onClick={handleAdvanceFeature} style={{
                    flex: 1, padding: "10px 6px",
                    background: "rgba(255,179,0,0.08)", border: `2px solid ${AMBER}`,
                    color: AMBER, fontFamily: "monospace", fontSize: "11px",
                    letterSpacing: "0.08em", cursor: "pointer",
                  }}>
                    ADVANCE<br/>
                    <span style={{ fontSize: "10px", color: AMBER_DIM }}>
                      {Math.round(HAROLD_TRAIL[featureStage].advanceProb * 100)}% chance
                    </span>
                  </button>
                )}
              </div>
            )}

            {featureAdvancing && (
              <div style={{ textAlign: "center", color: AMBER_DIM, fontSize: "12px", padding: "12px" }}>
                · · · rolling · · ·
              </div>
            )}

            {/* Collect all & exit from trail */}
            {HAROLD_TRAIL[featureStage].isJackpot && !featureAdvancing && (
              <div style={{ marginTop: "8px", textAlign: "center", fontSize: "10px", color: AMBER_DIM }}>
                You've reached the top. Collect to bank your RP.
              </div>
            )}
          </div>
        ) : (
          /* ── REELS ── */
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", padding: "18px 14px 10px" }}>
              {[0, 1, 2].map((i) => {
                const held     = reels[i].held;
                const clunking = reelClunk[i];
                const spinning = isSpinning && !held;
                const nudging  = nudgeReel === i;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "0.12em", color: held ? AMBER : "transparent", height: "12px" }}>HELD</div>
                    <div style={{
                      width: "72px", height: "72px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "36px", lineHeight: "1",
                      border: clunking ? `2px solid ${YELLOW}` : held ? `2px solid ${AMBER}` : `2px solid ${AMBER_DIM}`,
                      background: held ? "rgba(255,179,0,0.06)" : clunking ? "rgba(255,215,0,0.12)" : "rgba(122,92,0,0.08)",
                      boxShadow: clunking ? `0 0 16px ${YELLOW}, inset 0 0 8px rgba(255,215,0,0.3)` : held ? `0 0 8px ${AMBER_DIM}` : "none",
                      transition: "border-color 0.05s, box-shadow 0.05s, background 0.05s",
                      overflow: "hidden", position: "relative",
                    }}>
                      {spinning && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", animation: "reelSpin 0.06s steps(1) infinite", filter: "blur(1px)" }}>
                          {reelDisplays[i]}
                        </div>
                      )}
                      {nudging && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: nudgeDir === "up" ? "flex-start" : "flex-end", justifyContent: "center", color: YELLOW, fontSize: "20px", animation: `nudge${nudgeDir === "up" ? "Up" : "Down"} 0.35s ease-out`, zIndex: 2 }}>
                          {nudgeDir === "up" ? "▲" : "▼"}
                        </div>
                      )}
                      {!spinning && (
                        <span style={{ animation: clunking ? `reelStop ${CLUNK_DURATION_CSS} ease-out` : "none", display: "block" }}>
                          {reelDisplays[i]}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "9px", color: AMBER_DIM, letterSpacing: "0.08em", textAlign: "center", height: "12px", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {!isSpinning ? reels[i].symbol.name.toUpperCase() : "· · ·"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Win line */}
            <div style={{
              margin: "0 14px", height: "2px",
              background: winResult?.tier && winResult.tier !== "none"
                ? winResult.tier === "jackpot" ? YELLOW : winResult.tier === "line" ? GREEN : AMBER
                : AMBER_DIM,
              boxShadow: winResult?.tier && winResult.tier !== "none"
                ? winResult.tier === "jackpot" ? `0 0 12px ${YELLOW}` : winResult.tier === "line" ? `0 0 8px ${GREEN}` : `0 0 4px ${AMBER}`
                : "none",
              transition: "background 0.2s, box-shadow 0.3s",
            }} />

            {/* Win message */}
            <div style={{
              minHeight: "28px", padding: "6px 14px 4px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", letterSpacing: "0.07em", textAlign: "center",
              color: winResult?.tier === "jackpot" ? YELLOW : winResult?.tier === "line" || winResult?.tier === "double" ? GREEN : winResult?.tier === "pair" ? AMBER : AMBER_DIM,
              animation: winVisible
                ? winResult?.tier === "jackpot" ? "jackpotPulse 0.4s ease-in-out infinite"
                  : winResult?.tier === "none" ? "subtleFlicker 0.12s step-end 4"
                  : "winFlash 0.25s ease-out"
                : "none",
              fontWeight: winResult?.tier === "jackpot" ? "bold" : "normal",
              wordBreak: "break-word",
            }}>
              {winVisible && winResult
                ? winResult.tier !== "none" ? `✦ ${winResult.message} ✦` : winResult.message
                : flashMsg
                ? flashMsg
                : <span style={{ color: AMBER_DIM, fontStyle: "italic" }}>— insert token to spin —</span>
              }
            </div>

            {/* Controls */}
            <div style={{ padding: "8px 14px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={handleSpin}
                disabled={isSpinning || tokens <= 0 || gameOver}
                style={{
                  width: "100%", padding: "12px",
                  background: isSpinning || tokens <= 0 || gameOver ? "rgba(122,92,0,0.15)" : "rgba(255,179,0,0.08)",
                  border: isSpinning || tokens <= 0 || gameOver ? `2px solid ${AMBER_DIM}` : `2px solid ${AMBER}`,
                  color: isSpinning || tokens <= 0 || gameOver ? AMBER_DIM : AMBER,
                  fontFamily: "monospace", fontSize: "16px", letterSpacing: "0.18em",
                  cursor: isSpinning || tokens <= 0 || gameOver ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  animation: isSpinning ? "spinButtonPulse 0.3s ease-in-out infinite" : "none",
                }}
              >
                {isSpinning ? "· · S P I N N I N G · ·" : tokens <= 0 ? "— NO TOKENS —" : gameOver ? "— GAME OVER —" : "▶  S P I N"}
              </button>

              {/* Hold buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[0, 1, 2].map((i) => (
                  <button key={i} onClick={() => toggleHold(i)} disabled={!holdEligible || isSpinning} style={{
                    flex: 1, padding: "7px 4px",
                    background: reels[i].held ? "rgba(255,179,0,0.18)" : "transparent",
                    border: reels[i].held ? `1px solid ${AMBER}` : holdEligible ? `1px solid ${AMBER_DIM}` : `1px dashed rgba(122,92,0,0.3)`,
                    color: reels[i].held ? AMBER : holdEligible ? AMBER_DIM : "rgba(122,92,0,0.4)",
                    fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em",
                    cursor: holdEligible && !isSpinning ? "pointer" : "not-allowed",
                    boxShadow: reels[i].held ? `0 0 6px ${AMBER_DIM}` : "none",
                  }}>
                    {reels[i].held ? "HELD" : `HOLD ${i + 1}`}
                  </button>
                ))}
              </div>

              {/* Nudge controls */}
              {nudgesRemaining > 0 && holdEligible && !isSpinning && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ fontSize: "9px", color: AMBER_DIM, textAlign: "center", letterSpacing: "0.1em" }}>
                    NUDGES: {nudgesRemaining} remaining
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                        <button onClick={() => triggerNudge(i, "up")} style={{ padding: "4px", background: "transparent", border: `1px solid ${AMBER_DIM}`, color: AMBER_DIM, fontFamily: "monospace", fontSize: "10px", cursor: "pointer" }}>▲</button>
                        <button onClick={() => triggerNudge(i, "down")} style={{ padding: "4px", background: "transparent", border: `1px solid ${AMBER_DIM}`, color: AMBER_DIM, fontFamily: "monospace", fontSize: "10px", cursor: "pointer" }}>▼</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Game over collect */}
              {(gameOver || tokens <= 0) && (
                <button onClick={handleCollect} style={{
                  width: "100%", padding: "10px", marginTop: "4px",
                  background: "rgba(57,255,20,0.08)", border: `2px solid ${GREEN}`,
                  color: GREEN, fontFamily: "monospace", fontSize: "13px",
                  letterSpacing: "0.14em", cursor: "pointer", fontWeight: "bold",
                  animation: "winFlash 1s ease-in-out infinite",
                }}>
                  ◈ COLLECT {totalRpEarned > 0 ? `+${totalRpEarned} RP` : "& EXIT"}
                </button>
              )}

              {/* Early exit */}
              {!gameOver && tokens > 0 && totalRpEarned > 0 && !isSpinning && (
                <button onClick={handleCollect} style={{
                  width: "100%", padding: "7px", background: "transparent",
                  border: `1px solid ${AMBER_DIM}`, color: AMBER_DIM,
                  fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer",
                }}>
                  bank +{totalRpEarned} RP and exit early
                </button>
              )}
            </div>
          </>
        )}

        {/* Jackpot ASCII fireworks overlay */}
        {jackpotActive && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 900, padding: "20px" }}>
            {[
              { text: "    ✦ ✸ ✺ ✦ ✸ ✺ ✦",  color: YELLOW, delay: "0ms"   },
              { text: "  ★ ◈ ★ ◈ ★ ◈ ★ ◈",  color: AMBER,  delay: "80ms"  },
              { text: "✺ ✦ ✸ ✦ ✺ ✦ ✸ ✦ ✺",  color: GREEN,  delay: "160ms" },
              { text: "PURE DEAD BRILLIANT",   color: YELLOW, delay: "240ms" },
              { text: "★ THE HAROLD TRAIL ★", color: AMBER,  delay: "320ms" },
              { text: "✺ ✦ ✸ ✦ ✺ ✦ ✸ ✦ ✺",  color: GREEN,  delay: "400ms" },
              { text: "  ★ ◈ ★ ◈ ★ ◈ ★ ◈",  color: AMBER,  delay: "480ms" },
              { text: "    ✦ ✸ ✺ ✦ ✸ ✺ ✦",  color: YELLOW, delay: "560ms" },
            ].map((line, idx) => (
              <div key={idx} style={{
                color: line.color,
                fontSize: idx === 3 || idx === 4 ? "16px" : "13px",
                fontWeight: idx === 3 || idx === 4 ? "bold" : "normal",
                letterSpacing: "0.12em",
                animation: `jackpotLine 0.3s ease-out ${line.delay} both`,
                textShadow: `0 0 12px ${line.color}`,
                whiteSpace: "nowrap", lineHeight: "1.7",
              }}>{line.text}</div>
            ))}
          </div>
        )}
      </div>

      {/* Symbol legend */}
      {!featureActive && (
        <div style={{ marginTop: "10px", width: "min(360px, 94vw)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", fontSize: "9px", color: AMBER_DIM, letterSpacing: "0.06em" }}>
          {SYMBOLS.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "1px 4px", opacity: s.rarity === "jackpot" ? 1 : s.rarity === "rare" ? 0.85 : 0.65 }}>
              <span style={{ fontSize: "11px" }}>{s.display}</span>
              <span>{s.isWild ? "WILD" : s.isScatter ? "SCATTER" : s.name.replace("The ", "")}</span>
              {s.rpValue > 0 && <span style={{ color: s.rarity === "jackpot" ? YELLOW : AMBER, marginLeft: "auto" }}>{s.rpValue}rp</span>}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes reelSpin {
          0%   { opacity: 0.7; transform: translateY(-2px); }
          33%  { opacity: 1;   transform: translateY(0);    }
          66%  { opacity: 0.8; transform: translateY(1px);  }
          100% { opacity: 0.7; transform: translateY(-2px); }
        }
        @keyframes reelStop {
          0%   { transform: scale(1.18); filter: brightness(2.2); }
          40%  { transform: scale(0.96); filter: brightness(1.4); }
          70%  { transform: scale(1.04); filter: brightness(1.1); }
          100% { transform: scale(1.0);  filter: brightness(1.0); }
        }
        @keyframes jackpotPulse {
          0%,100% { box-shadow: 0 0 24px ${YELLOW}, 0 0 8px ${AMBER}; opacity: 1; }
          50%     { box-shadow: 0 0 48px ${YELLOW}, 0 0 24px ${AMBER}, 0 0 4px ${GREEN}; opacity: 0.92; }
        }
        @keyframes sparkle {
          0%   { opacity: 0;   transform: translate(0,0)        scale(0.4); }
          20%  { opacity: 1;   transform: translate(-4px,-8px)  scale(1.1); }
          60%  { opacity: 0.8; transform: translate(6px,-20px)  scale(0.9); }
          100% { opacity: 0;   transform: translate(-2px,-38px) scale(0.5); }
        }
        @keyframes tokenRain {
          0%   { transform: translateY(0)     rotate(0deg);   opacity: 1;   }
          70%  { transform: translateY(90vh)  rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(240deg); opacity: 0;   }
        }
        @keyframes winFlash {
          0%   { opacity: 0; transform: scaleX(0.95); }
          25%  { opacity: 1; transform: scaleX(1.02); }
          70%  { opacity: 1; transform: scaleX(1.0);  }
          100% { opacity: 1; transform: scaleX(1.0);  }
        }
        @keyframes subtleFlicker {
          0%,100% { opacity: 1;   }
          25%     { opacity: 0.4; }
          75%     { opacity: 0.7; }
        }
        @keyframes spinButtonPulse {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 0.8; }
        }
        @keyframes rpTick {
          0%   { color: ${GREEN};  transform: scale(1.0);  }
          50%  { color: ${YELLOW}; transform: scale(1.15); }
          100% { color: ${GREEN};  transform: scale(1.0);  }
        }
        @keyframes jackpotLine {
          0%   { opacity: 0; letter-spacing: 0.4em;  }
          60%  { opacity: 1; letter-spacing: 0.14em; }
          100% { opacity: 1; letter-spacing: 0.12em; }
        }
        @keyframes nudgeUp {
          0%   { opacity: 0; transform: translateY(12px);  }
          30%  { opacity: 1; transform: translateY(0);     }
          80%  { opacity: 1; transform: translateY(-4px);  }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes nudgeDown {
          0%   { opacity: 0; transform: translateY(-12px); }
          30%  { opacity: 1; transform: translateY(0);     }
          80%  { opacity: 1; transform: translateY(4px);   }
          100% { opacity: 0; transform: translateY(10px);  }
        }
        @keyframes heldGlow {
          0%,100% { box-shadow: 0 0 6px ${AMBER_DIM}; }
          50%     { box-shadow: 0 0 12px ${AMBER}, 0 0 4px ${AMBER_DIM}; }
        }
      `}</style>
    </div>
  );
}
