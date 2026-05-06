"use client";

import { useState, useEffect, useRef } from "react";

const AMBER = "#FFB300";
const AMBER_DIM = "#996800";
const BLACK = "#0A0A00";
const RED = "#FF2222";
const GREEN = "#39FF14";

const FOUNDING_COUNT = 1; // increment manually as signups come in

const LORE_LINES = [
  "> RESTRICTED CHANNEL — STAGE MANAGER SYSTEM",
  "> ACCESS GRANTED. WELCOME, FOUNDING CAST.",
  "",
  "> You weren't supposed to find this.",
  "> Or maybe you were.",
  "> The Stage Manager doesn't make mistakes.",
  "",
  "> CURRENT INTEL:",
  `> Founding Cast members logged: ${FOUNDING_COUNT}`,
  "> Scene Map status: BUILDING",
  "> Launch window: WHEN WE HAVE ENOUGH.",
  "> Parking situation: STILL 0 SPACES.",
  "",
  "> THE SCENE MAP WILL GIVE YOU:",
  "> — One place for every show, jam, workshop",
  "> — Every team, performer, venue in one directory",
  "> — A Jam Finder. Finally.",
  "> — No more WhatsApp scavenger hunts.",
  "> — No more 'is this beginner friendly?' panic.",
  "",
  "> Your intel is logged. The map is being drawn.",
  "> The Stage Manager is watching.",
  "> Stay ready.",
];

const GAME_SCENES = [
  {
    scene: `"I've been waiting here for seventeen years.
I'm not sure the council knows I exist anymore."`,
    options: ["Beat 1 — Status", "Beat 2 — Deepening", "Group Game", "The Button"],
    answer: 1,
    note: "Classic Beat 2 energy. The pattern is clear, the stakes are higher.",
  },
  {
    scene: `"So you're telling me this is the form
for BOTH the show AND the rehearsal room booking?"`,
    answer: 0,
    options: ["Beat 1 — Discovery", "Beat 2 — Deepening", "Group Game", "The Button"],
    note: "Pure Beat 1. The problem is being established. The pain is fresh.",
  },
  {
    scene: `"Aye, every Tuesday. Different team every week.
Same ceiling. Same beam. Same exact forehead."`,
    answer: 2,
    options: ["Beat 1 — Discovery", "Beat 2 — Deepening", "Group Game — Pattern", "The Button"],
    note: "Group Game. The pattern has repeated enough to be the game itself.",
  },
  {
    scene: `"I'm in. Whatever this is. I'm in.
Just tell me where to show up."`,
    answer: 3,
    options: ["Beat 1 — Discovery", "Beat 2 — Deepening", "Group Game — Pattern", "The Button"],
    note: "The Button. Commitment. The Harold earns this moment.",
  },
];

export default function Backstage() {
  const [phase, setPhase] = useState<"access" | "lore" | "game" | "end">("access");
  const [loreIndex, setLoreIndex] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "lore" && loreIndex < LORE_LINES.length) {
      const t = setTimeout(() => setLoreIndex((i) => i + 1), 60);
      return () => clearTimeout(t);
    }
  }, [phase, loreIndex]);

  function handleAccess(e: React.FormEvent) {
    e.preventDefault();
    const val = accessCode.trim().toUpperCase();
    if (val === "GALLUS" || val === "AYE" || val === "FOUNDING" || val === "SCENE" || val === "STAGEMANAGER" || val === "HAROLD") {
      setPhase("lore");
    } else {
      setAccessError(true);
      setTimeout(() => setAccessError(false), 1500);
    }
  }

  function handlePick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = GAME_SCENES[gameIndex].answer === i;
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (gameIndex + 1 >= GAME_SCENES.length) {
      setGameComplete(true);
    } else {
      setGameIndex((i) => i + 1);
      setPicked(null);
    }
  }

  const currentScene = GAME_SCENES[gameIndex];

  return (
    <div
      className="min-h-screen font-mono p-4 md:p-8"
      style={{ background: BLACK, color: AMBER }}
    >
      {/* Header */}
      <div
        className="text-center py-3 mb-8 text-xs tracking-widest border-b"
        style={{ borderColor: AMBER_DIM, color: AMBER_DIM }}
      >
        THE STAGE MANAGER // BACKSTAGE CHANNEL // RESTRICTED
      </div>

      {/* ACCESS GATE */}
      {phase === "access" && (
        <div className="max-w-md mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl" style={{ color: AMBER }}>
              ⚠ ACCESS REQUIRED
            </div>
            <div className="text-sm" style={{ color: AMBER_DIM }}>
              This channel is for Founding Cast only.
              <br />
              Enter your clearance word to proceed.
            </div>
          </div>

          <form onSubmit={handleAccess} className="space-y-4">
            <input
              ref={inputRef}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="CLEARANCE WORD"
              autoFocus
              className="w-full bg-transparent border text-center text-lg p-3 outline-none tracking-widest uppercase placeholder:opacity-30"
              style={{
                borderColor: accessError ? RED : AMBER_DIM,
                color: accessError ? RED : AMBER,
                caretColor: AMBER,
              }}
            />
            <button
              type="submit"
              className="w-full py-3 text-sm tracking-widest transition-colors"
              style={{
                background: AMBER_DIM,
                color: BLACK,
              }}
            >
              GIE IT LALDY →
            </button>
          </form>

          {accessError && (
            <div style={{ color: RED }} className="text-sm animate-pulse">
              ⚠ CLEARANCE DENIED. TRY AGAIN.
            </div>
          )}

          <div className="text-xs" style={{ color: AMBER_DIM }}>
            Hint: You already know it.
            <br />
            It's what you are.
          </div>
        </div>
      )}

      {/* LORE DUMP */}
      {phase === "lore" && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-1 text-sm leading-relaxed">
            {LORE_LINES.slice(0, loreIndex).map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith(">") ? AMBER : AMBER_DIM,
                  opacity: line === "" ? 1 : 1,
                }}
              >
                {line || " "}
              </div>
            ))}
            {loreIndex < LORE_LINES.length && (
              <span
                className="inline-block w-2 h-4 ml-1 animate-pulse"
                style={{ background: AMBER }}
              />
            )}
          </div>

          {loreIndex >= LORE_LINES.length && (
            <div className="space-y-4 border-t pt-6" style={{ borderColor: AMBER_DIM }}>
              <div className="text-sm" style={{ color: AMBER_DIM }}>
                The Stage Manager has one more test.
                <br />
                Prove you understand the Harold.
              </div>
              <button
                onClick={() => setPhase("game")}
                className="px-6 py-3 text-sm tracking-widest"
                style={{ border: `1px solid ${AMBER}`, color: AMBER }}
              >
                ENTER THE HAROLD DIAGNOSTIC →
              </button>
            </div>
          )}
        </div>
      )}

      {/* HAROLD GAME */}
      {phase === "game" && !gameComplete && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div
            className="text-xs tracking-widest text-center py-2"
            style={{ color: AMBER_DIM, borderBottom: `1px solid ${AMBER_DIM}` }}
          >
            HAROLD DIAGNOSTIC — SCENE {gameIndex + 1} OF {GAME_SCENES.length} — SCORE: {score}
          </div>

          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest" style={{ color: AMBER_DIM }}>
              Identify which part of the Harold this scene belongs to:
            </div>

            <div
              className="p-4 text-sm leading-relaxed italic"
              style={{
                border: `1px solid ${AMBER_DIM}`,
                color: AMBER,
                whiteSpace: "pre-line",
              }}
            >
              {currentScene.scene}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {currentScene.options.map((opt, i) => {
                const isCorrect = i === currentScene.answer;
                const isSelected = i === picked;
                let borderColor = AMBER_DIM;
                let textColor = AMBER;
                if (picked !== null) {
                  if (isCorrect) { borderColor = GREEN; textColor = GREEN; }
                  else if (isSelected) { borderColor = RED; textColor = RED; }
                  else { borderColor = "#333300"; textColor = "#333300"; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handlePick(i)}
                    className="text-left px-4 py-3 text-sm transition-all"
                    style={{ border: `1px solid ${borderColor}`, color: textColor }}
                  >
                    [{i + 1}] {opt}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="space-y-3 pt-2">
                <div
                  className="text-sm p-3"
                  style={{
                    border: `1px solid ${picked === currentScene.answer ? GREEN : RED}`,
                    color: picked === currentScene.answer ? GREEN : RED,
                  }}
                >
                  {picked === currentScene.answer ? "✦ CORRECT." : "✗ NOT QUITE."}{" "}
                  {currentScene.note}
                </div>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm tracking-widest"
                  style={{ border: `1px solid ${AMBER}`, color: AMBER }}
                >
                  {gameIndex + 1 >= GAME_SCENES.length ? "SEE RESULTS →" : "NEXT SCENE →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME COMPLETE */}
      {phase === "game" && gameComplete && (
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div
            className="py-6 space-y-3"
            style={{ border: `1px solid ${AMBER}` }}
          >
            <div className="text-xl" style={{ color: AMBER }}>
              HAROLD DIAGNOSTIC — COMPLETE
            </div>
            <div className="text-4xl font-bold" style={{ color: score >= 3 ? GREEN : AMBER }}>
              {score}/{GAME_SCENES.length}
            </div>
            <div className="text-sm" style={{ color: AMBER_DIM }}>
              {score === 4 && "Pure dead brilliant. You know the Harold."}
              {score === 3 && "Solid. The Stage Manager is noting your pattern recognition."}
              {score === 2 && "Two out of four. Keep watching the backline."}
              {score <= 1 && "The Harold is a muscle. It grows."}
            </div>
          </div>

          <div className="space-y-4 text-sm" style={{ color: AMBER_DIM }}>
            <p>The Scene Map goes live when we have enough intel.</p>
            <p>
              You are Founding Cast. You were here first.
              <br />
              <span style={{ color: AMBER }}>That matters.</span>
            </p>
            <p>
              Pass the terminal link to someone in the scene.
              <br />
              Tell them nothing. Let them find their own way in.
            </p>
            <div
              className="mt-6 p-4 text-xs"
              style={{ border: `1px solid ${AMBER_DIM}` }}
            >
              <div style={{ color: AMBER }} className="mb-2">
                — THE STAGE MANAGER
              </div>
              <div>
                The map is being drawn.
                <br />
                The scene is the intel.
                <br />
                Stay ready.
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-block px-6 py-3 text-sm tracking-widest"
            style={{ border: `1px solid ${AMBER_DIM}`, color: AMBER_DIM }}
          >
            ← RETURN TO THE TERMINAL
          </a>
        </div>
      )}

      {/* Footer */}
      <div
        className="text-center mt-16 text-xs"
        style={{ color: AMBER_DIM, opacity: 0.4 }}
      >
        STAGE MANAGER SYSTEM // PILOT 2026 // CENTRAL SCOTLAND
      </div>
    </div>
  );
}
