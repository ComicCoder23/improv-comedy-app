"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { harold, getLevel, Stage } from "@/data/harold";
import SecurityPass from "@/components/SecurityPass";

const AMBER = "#FFB300";
const AMBER_DIM = "#996800";
const BLACK = "#0A0A00";
const GREEN = "#39FF14";

const THEME = {
  background: BLACK,
  foreground: AMBER,
  cursor: AMBER,
  cursorAccent: BLACK,
  selectionBackground: AMBER_DIM,
  black: BLACK,
  brightBlack: "#333300",
  red: "#FF4444",
  brightRed: "#FF6666",
  green: GREEN,
  brightGreen: "#66FF44",
  yellow: AMBER,
  brightYellow: "#FFD700",
  blue: "#AA8800",
  brightBlue: "#CCAA00",
  magenta: "#FF9900",
  brightMagenta: "#FFBB00",
  cyan: "#DDAA00",
  brightCyan: "#FFD700",
  white: "#FFCC44",
  brightWhite: "#FFE066",
};

type TerminalState = {
  stageIndex: number;
  rp: number;
  answers: Record<string, string>;
  waitingForInput: boolean;
  inputBuffer: string;
  inputKey: string;
};

function findStageById(id: string): Stage | undefined {
  return harold.find((s) => s.id === id);
}
function findStageIndex(id: string): number {
  return harold.findIndex((s) => s.id === id);
}

export default function HaroldTerminal() {
  const termRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fit = useRef<FitAddon | null>(null);
  const stateRef = useRef<TerminalState>({
    stageIndex: 0,
    rp: 0,
    answers: {},
    waitingForInput: false,
    inputBuffer: "",
    inputKey: "",
  });
  const [rpDisplay, setRpDisplay] = useState(0);
  const [levelDisplay, setLevelDisplay] = useState("Rookie");
  const [showPass, setShowPass] = useState(false);

  const updateRP = useCallback((rp: number) => {
    setRpDisplay(rp);
    setLevelDisplay(getLevel(rp));
    stateRef.current.rp = rp;
  }, []);

  const writeLines = useCallback(
    (t: Terminal, lines: string[], delay = 30): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        function next() {
          if (i >= lines.length) {
            resolve();
            return;
          }
          t.writeln(lines[i]);
          i++;
          setTimeout(next, delay);
        }
        next();
      });
    },
    []
  );

  const writeTyped = useCallback(
    (t: Terminal, text: string, charDelay = 18): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        function next() {
          if (i >= text.length) {
            t.writeln("");
            resolve();
            return;
          }
          t.write(text[i]);
          i++;
          setTimeout(next, charDelay);
        }
        next();
      });
    },
    []
  );

  const writeGlitch = useCallback(
    async (t: Terminal, msg: string) => {
      t.writeln("");
      t.write(`\x1b[31m  ⚠ ${msg}\x1b[0m`);
      await new Promise((r) => setTimeout(r, 80));
      t.writeln("");
      t.writeln("");
    },
    []
  );

  const showChoices = useCallback((t: Terminal, choices: Stage["choices"]) => {
    if (!choices) return;
    choices.forEach((c) => {
      t.writeln(`  \x1b[93m[${c.key}]\x1b[0m  ${c.label}`);
    });
    t.writeln("");
    t.write(`  \x1b[90m▶ Enter choice: \x1b[0m`);
  }, []);

  const showStage = useCallback(
    async (t: Terminal, stage: Stage) => {
      const state = stateRef.current;

      if (stage.type === "glitch" && stage.glitch) {
        await writeGlitch(t, stage.glitch);
        const nextStage = stage.next ? findStageById(stage.next) : null;
        if (nextStage) {
          state.stageIndex = findStageIndex(nextStage.id);
          await showStage(t, nextStage);
        }
        return;
      }

      if (stage.lines.length > 0) {
        await writeLines(t, stage.lines, 35);
      }

      if (stage.rp && stage.rp > 0) {
        const newRp = state.rp + stage.rp;
        updateRP(newRp);
        t.writeln(
          `  \x1b[32m✦ ${stage.rpLabel ?? `+${stage.rp} RP`} — Level: ${getLevel(newRp)}\x1b[0m`
        );
        t.writeln("");
      }

      if (stage.type === "complete") {
        t.writeln(
          `  \x1b[32mFinal RP: ${state.rp} — ${getLevel(state.rp)}\x1b[0m`
        );
        t.writeln("");
        if (stage.id === "complete_member") {
          setTimeout(() => setShowPass(true), 800);
        }
        return;
      }

      if (stage.type === "choice" && stage.choices) {
        showChoices(t, stage.choices);
        state.waitingForInput = true;
        state.inputBuffer = "";
        state.inputKey = "";
        return;
      }

      if (stage.type === "input") {
        t.write(stage.inputPrompt ?? "  → ");
        state.waitingForInput = true;
        state.inputBuffer = "";
        state.inputKey = stage.inputKey ?? "input";
        return;
      }

      if (stage.type === "narrative" && stage.next) {
        await new Promise((r) => setTimeout(r, 400));

        // Tally popup triggered at the "tally" stage
        if (stage.id === "tally") {
          const tally = (window as unknown as Record<string, unknown>).Tally as
            | { openPopup: (id: string, opts: unknown) => void }
            | undefined;
          if (tally?.openPopup) {
            tally.openPopup("TALLY_FORM_ID", {
              layout: "modal",
              autoClose: 4000,
            });
          }
        }

        const nextStage = findStageById(stage.next);
        if (nextStage) {
          state.stageIndex = findStageIndex(nextStage.id);
          await showStage(t, nextStage);
        }
      }
    },
    [writeLines, writeGlitch, showChoices, updateRP]
  );

  const handleChoice = useCallback(
    async (t: Terminal, stage: Stage, key: string) => {
      const state = stateRef.current;
      const choice = stage.choices?.find((c) => c.key === key);
      if (!choice) {
        t.writeln("");
        t.writeln("  \x1b[31mInvalid choice. Try again.\x1b[0m");
        t.write(`  \x1b[90m▶ Enter choice: \x1b[0m`);
        return;
      }

      t.writeln(key);
      if (choice.rp) {
        const newRp = state.rp + choice.rp;
        updateRP(newRp);
        t.writeln(
          `  \x1b[32m✦ +${choice.rp} BONUS RP — Level: ${getLevel(newRp)}\x1b[0m`
        );
      }
      if (choice.bonus) {
        t.writeln(`  \x1b[33m★ ${choice.bonus}\x1b[0m`);
      }
      t.writeln("");

      state.answers[stage.id] = choice.label;
      state.waitingForInput = false;

      const nextId = choice.next ?? stage.next;
      if (nextId) {
        const nextStage = findStageById(nextId);
        if (nextStage) {
          state.stageIndex = findStageIndex(nextStage.id);
          await showStage(t, nextStage);
        }
      }
    },
    [showStage, updateRP]
  );

  const handleTextInput = useCallback(
    async (t: Terminal, stage: Stage, data: string) => {
      const state = stateRef.current;

      if (data === "\r") {
        const text = state.inputBuffer.trim();
        t.writeln("");
        if (text) {
          state.answers[state.inputKey] = text;
          t.writeln(`  \x1b[32m✦ Noted. The Stage Manager is logging that.\x1b[0m`);
          t.writeln("");
        }
        state.waitingForInput = false;
        state.inputBuffer = "";
        const nextId = stage.next;
        if (nextId) {
          const nextStage = findStageById(nextId);
          if (nextStage) {
            state.stageIndex = findStageIndex(nextStage.id);
            await showStage(t, nextStage);
          }
        }
        return;
      }

      if (data === "\x7f") {
        if (state.inputBuffer.length > 0) {
          state.inputBuffer = state.inputBuffer.slice(0, -1);
          t.write("\b \b");
        }
        return;
      }

      if (data.charCodeAt(0) >= 32) {
        state.inputBuffer += data;
        t.write(data);
      }
    },
    [showStage]
  );

  useEffect(() => {
    if (!termRef.current) return;

    const t = new Terminal({
      fontFamily: '"Courier New", "Lucida Console", monospace',
      fontSize: 14,
      lineHeight: 1.4,
      theme: THEME,
      cursorBlink: true,
      cursorStyle: "block",
      scrollback: 2000,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    t.loadAddon(fitAddon);
    t.open(termRef.current);
    fitAddon.fit();

    term.current = t;
    fit.current = fitAddon;

    const state = stateRef.current;

    t.onData(async (data) => {
      if (!state.waitingForInput) return;
      const stage = harold[state.stageIndex];
      if (!stage) return;

      if (stage.type === "choice") {
        await handleChoice(t, stage, data.trim());
      } else if (stage.type === "input") {
        await handleTextInput(t, stage, data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    showStage(t, harold[0]);

    return () => {
      window.removeEventListener("resize", handleResize);
      t.dispose();
    };
  }, [showStage, handleChoice, handleTextInput]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black">
      {showPass && (
        <SecurityPass
          rp={rpDisplay}
          level={levelDisplay}
          onClose={() => setShowPass(false)}
        />
      )}
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-1 text-xs font-mono border-b"
        style={{ color: AMBER_DIM, borderColor: AMBER_DIM, background: BLACK }}
      >
        <span>THE STAGE MANAGER // SCENE MAP v1.0</span>
        <span>
          RP:{" "}
          <span style={{ color: AMBER }}>
            {rpDisplay}
          </span>{" "}
          — LEVEL:{" "}
          <span style={{ color: rpDisplay >= 131 ? GREEN : AMBER }}>
            {levelDisplay}
          </span>
        </span>
      </div>

      {/* Terminal */}
      <div ref={termRef} className="flex-1 p-2" />
    </div>
  );
}
