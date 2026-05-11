"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { harold, getLevel, Stage, Choice } from "@/data/harold";
import SecurityPass from "@/components/SecurityPass";
import PuggyMachine from "@/components/PuggyMachine";

const AMBER = "#FFB300";
const AMBER_DIM = "#7A5C00";
const BLACK = "#0A0A00";
const RED = "#FF3333";
const GREEN = "#39FF14";
const YELLOW = "#FFD700";

type DisplayLine = {
  text: string;
  color: string;
  id: number;
};

let lineId = 0;
const mkLine = (text: string, color: string = AMBER): DisplayLine => ({
  text,
  color,
  id: lineId++,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function findStage(id: string): Stage | undefined {
  return harold.find((s) => s.id === id);
}

export default function MobileTerminal() {
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [rp, setRp] = useState(0);
  const [level, setLevel] = useState("Rookie");
  const [showPass, setShowPass] = useState(false);
  const [showPuggy, setShowPuggy] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [inputMode, setInputMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputKey, setInputKey] = useState("");

  const rpRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runningRef = useRef(false);

  const addLine = useCallback((text: string, color: string = AMBER) => {
    setLines((prev) => [...prev, mkLine(text, color)]);
  }, []);

  const addLines = useCallback(
    async (texts: string[], color: string = AMBER, delay = 45) => {
      for (const text of texts) {
        await sleep(delay);
        setLines((prev) => [...prev, mkLine(text, color)]);
      }
    },
    []
  );

  // Auto-scroll to bottom whenever lines change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, choices]);

  const updateRp = useCallback((newRp: number) => {
    rpRef.current = newRp;
    setRp(newRp);
    setLevel(getLevel(newRp));
  }, []);

  const runStage = useCallback(
    async (stage: Stage) => {
      if (!stage) return;

      // Glitch — fire message then auto-advance
      if (stage.type === "glitch" && stage.glitch) {
        await sleep(200);
        addLine(`⚠  ${stage.glitch}`, RED);
        await sleep(600);
        addLine("", AMBER_DIM);
        const next = stage.next ? findStage(stage.next) : null;
        if (next) await runStage(next);
        return;
      }

      // Write lines with typewriter delay
      if (stage.lines.length > 0) {
        await addLines(stage.lines, AMBER, 40);
      }

      // Award RP on display
      if (stage.rp && stage.rp > 0) {
        const newRp = rpRef.current + stage.rp;
        updateRp(newRp);
        await sleep(100);
        addLine(
          `  ✦ ${stage.rpLabel ?? `+${stage.rp} RP`} — Level: ${getLevel(newRp)}`,
          GREEN
        );
        addLine("", AMBER);
      }

      // Complete
      if (stage.type === "complete") {
        addLine(`  Final RP: ${rpRef.current} — ${getLevel(rpRef.current)}`, GREEN);
        if (stage.id === "complete_member") {
          setTimeout(() => setShowPass(true), 900);
        }
        return;
      }

      // Choice — show buttons and wait
      if (stage.type === "choice" && stage.choices) {
        setChoices(stage.choices);
        setIsWaiting(true);
        return;
      }

      // Text input
      if (stage.type === "input") {
        setInputKey(stage.inputKey ?? "input");
        setInputMode(true);
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      // Narrative — auto-advance
      if (stage.next) {
        await sleep(350);

        // Tally popup at the button step
        if (stage.id === "tally") {
          const tally = (window as unknown as Record<string, unknown>).Tally as
            | { openPopup: (id: string, opts: unknown) => void }
            | undefined;
          try {
            tally?.openPopup?.("TALLY_FORM_ID", { layout: "modal", autoClose: 4000 });
          } catch (_) {}
        }

        const next = findStage(stage.next);
        if (next) await runStage(next);
      }
    },
    [addLine, addLines, updateRp]
  );

  const handleChoice = useCallback(
    async (choice: Choice) => {
      if (!isWaiting) return;
      setChoices([]);
      setIsWaiting(false);

      setQuestionCount((prev) => {
        const next = prev + 1;
        if (next % 5 === 0) setShowPuggy(true);
        return next;
      });

      addLine(`  ▶ ${choice.label}`, AMBER_DIM);

      if (choice.rp && choice.rp > 0) {
        const newRp = rpRef.current + choice.rp;
        updateRp(newRp);
        addLine(`  ✦ +${choice.rp} BONUS RP — Level: ${getLevel(newRp)}`, GREEN);
      }
      if (choice.bonus) {
        addLine(`  ★ ${choice.bonus}`, YELLOW);
      }
      addLine("", AMBER);

      const nextId = choice.next;
      if (nextId) {
        const next = findStage(nextId);
        if (next) await runStage(next);
      }
    },
    [isWaiting, addLine, updateRp, runStage]
  );

  const handleTextSubmit = useCallback(
    async (stageId?: string) => {
      const val = inputValue.trim();
      setInputMode(false);
      setInputValue("");

      if (val) {
        addLine(`  ▶ ${val}`, AMBER_DIM);
        addLine("  ✦ Noted. The Stage Manager is logging that.", GREEN);
        addLine("", AMBER);
      }

      // Find which input stage we're on and advance
      const currentStage = harold.find((s) => s.type === "input" && s.inputKey === inputKey);
      if (currentStage?.next) {
        const next = findStage(currentStage.next);
        if (next) await runStage(next);
      }
    },
    [inputValue, inputKey, addLine, runStage]
  );

  // Boot on mount
  useEffect(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    runStage(harold[0]);
  }, [runStage]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Courier New", "Lucida Console", Courier, monospace',
        background: BLACK,
        color: AMBER,
        userSelect: "none",
        WebkitUserSelect: "none",
        overflowY: "hidden",
      }}
    >
      {/* Security pass overlay */}
      {showPass && (
        <SecurityPass rp={rp} level={level} onClose={() => setShowPass(false)} />
      )}

      {/* Puggy Machine overlay — fires every 5th choice */}
      {showPuggy && (
        <PuggyMachine
          tokens={3}
          onComplete={(rpEarned) => {
            if (rpEarned > 0) updateRp(rpRef.current + rpEarned);
            setShowPuggy(false);
          }}
          onClose={() => setShowPuggy(false)}
        />
      )}

      {/* Status bar */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 12px",
          fontSize: "11px",
          borderBottom: `1px solid ${AMBER_DIM}`,
          color: AMBER_DIM,
          background: BLACK,
          letterSpacing: "0.05em",
        }}
      >
        <span>STAGE MANAGER // SCENE MAP</span>
        <span>
          RP: <span style={{ color: AMBER }}>{rp}</span>
          {"  "}
          <span style={{ color: rp >= 131 ? GREEN : AMBER_DIM }}>{level}</span>
        </span>
      </div>

      {/* Scrollable terminal output */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px",
          minHeight: 0,
        }}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              color: line.color,
              fontSize: "13px",
              lineHeight: "1.55",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              minHeight: "1.55em",
            }}
          >
            {line.text || " "}
          </div>
        ))}
        {/* Blinking cursor at end */}
        {!isWaiting && !inputMode && (
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "14px",
              background: AMBER,
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }}
          />
        )}
      </div>

      {/* Text input mode */}
      {inputMode && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            gap: "8px",
            padding: "12px",
            borderTop: `1px solid ${AMBER_DIM}`,
          }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Type your answer..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: AMBER,
              borderBottom: `1px solid ${AMBER_DIM}`,
              caretColor: AMBER,
            }}
          />
          <button
            onClick={() => handleTextSubmit()}
            className="text-xs px-3 py-1"
            style={{ border: `1px solid ${AMBER}`, color: AMBER }}
          >
            SEND
          </button>
        </div>
      )}

      {/* Choice buttons */}
      {isWaiting && choices.length > 0 && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "12px",
            borderTop: `1px solid ${AMBER_DIM}`,
            background: "#050500",
          }}
        >
          {choices.map((c) => (
            <button
              key={c.key}
              onClick={() => handleChoice(c)}
              className="text-left text-xs py-2.5 px-3 active:opacity-60 transition-opacity"
              style={{
                border: `1px solid ${AMBER_DIM}`,
                color: AMBER,
                background: BLACK,
                borderRadius: "2px",
                lineHeight: 1.4,
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            >
              <span style={{ color: YELLOW, marginRight: "8px" }}>[{c.key}]</span>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
