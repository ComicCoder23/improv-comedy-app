export type Choice = {
  key: string;
  label: string;
  rp?: number;
  bonus?: string;
  next?: string;
};

export type Stage = {
  id: string;
  type: "narrative" | "choice" | "input" | "glitch" | "complete";
  rp?: number;
  rpLabel?: string;
  glitch?: string;
  lines: string[];
  choices?: Choice[];
  inputPrompt?: string;
  inputKey?: string;
  next?: string;
};

export const harold: Stage[] = [
  // ── BOOT ──────────────────────────────────────────────────────────────
  {
    id: "boot",
    type: "narrative",
    lines: [
      "",
      "  ✦  ✧    ✦   ✧  ✦    ✧  ✦   ✧  ✦",
      "      ★       ★      ★       ★",
      "   ✦    ✧  ✦    ✧  ✦    ✧  ✦    ✧",
      "",
      "  INITIALISING... STAGE MANAGER SYSTEM v1.0",
      "",
      "  Loading scene intelligence...",
      "  Checking ceiling height at OHD............  LOW",
      "  Verifying SBT stage dimensions............  POSTAGE STAMP",
      "  Scanning Central Station status...........  ONGOING",
      "  Counting available parking spaces.........  0",
      "",
      "  ░░░░░░░░░░░░░░░░░░░░  [  0%]",
      "  ████░░░░░░░░░░░░░░░░  [ 20%]",
      "  ████████░░░░░░░░░░░░  [ 40%]",
      "  ████████████░░░░░░░░  [ 60%]",
      "  ████████████████░░░░  [ 80%]",
      "  ████████████████████  [100%]",
      "",
      "  SYSTEM ONLINE.",
      "",
    ],
    next: "intro",
  },

  // ── INTRO ─────────────────────────────────────────────────────────────
  {
    id: "intro",
    type: "choice",
    lines: [
      "  ┌─────────────────────────────────────────┐",
      "  │   THE CENTRAL SCOTLAND IMPROV SCENE MAP  │",
      "  │         A Harold in Terminal Form         │",
      "  └─────────────────────────────────────────┘",
      "",
      "  Haud yer wheesht and listen up.",
      "",
      "  The Stage Manager is watching.",
      "  We're building the digital home the scene",
      "  deserves — and we need YOUR intel to do it.",
      "",
      "  This will take about 4 minutes.",
      "  You'll earn Reputation Points along the way.",
      "  Complete it and you're Founding Cast.",
      "",
      "  Ready to Gie it Laldy?",
      "",
    ],
    choices: [
      { key: "1", label: "AYE! Let's go.", next: "suggestion_rp" },
      { key: "2", label: "Gies a Scooby first — what even is this?", next: "explainer" },
    ],
  },

  // ── EXPLAINER ─────────────────────────────────────────────────────────
  {
    id: "explainer",
    type: "narrative",
    lines: [
      "",
      "  THE SCENE MAP is a community platform for",
      "  Central Scotland's improv scene.",
      "",
      "  One place for: shows, jams, classes, teams,",
      "  venues, coaches, performers, open spots.",
      "",
      "  This questionnaire IS the opening night.",
      "  You're not filling in a form.",
      "  You're shaping what gets built.",
      "",
    ],
    next: "suggestion_rp",
  },

  // ── THE SUGGESTION ────────────────────────────────────────────────────
  {
    id: "suggestion_rp",
    type: "glitch",
    glitch: "SYSTEM NOTICE: Reputation tracking initiated. The Stage Manager is logging your choices.",
    lines: [],
    next: "suggestion",
  },
  {
    id: "suggestion",
    type: "choice",
    rp: 10,
    rpLabel: "+10 RP — The Suggestion accepted",
    lines: [
      "",
      "  ── THE SUGGESTION ──────────────────────────",
      "",
      "  Every Harold starts here.",
      "  What's your current status in the scene?",
      "",
    ],
    choices: [
      {
        key: "1",
        label: "Troupe Lead — I run the show.",
        next: "beat1_intro",
        bonus: "Producer Intel unlocked",
      },
      {
        key: "2",
        label: "The Crafty One — classes, jams, thick of it.",
        next: "beat1_intro",
      },
      {
        key: "3",
        label: "Newblood — saw a show and I'm hooked.",
        next: "beat1_intro",
        bonus: "Beginner's Guide unlocked",
      },
      {
        key: "4",
        label: "Backstage — I run the room / teach / produce.",
        next: "beat1_intro",
        bonus: "Admin Insights unlocked",
      },
      {
        key: "5",
        label: "Just Here for the Laldy — manifest and hope.",
        next: "beat1_intro",
      },
    ],
  },

  // ── BEAT 1 ────────────────────────────────────────────────────────────
  {
    id: "beat1_intro",
    type: "narrative",
    lines: [
      "",
      "  ── BEAT ONE ────────────────────────────────",
      "",
      "  Scene Map: Scene 1",
      "  The discovery. The establishment.",
      "  We find out what's blocking you.",
      "",
    ],
    next: "beat1_q",
  },
  {
    id: "beat1_q",
    type: "choice",
    rp: 20,
    rpLabel: "+20 RP — Beat 1 complete",
    lines: [
      "  What's the biggest blocker in the scene",
      "  right now?",
      "",
    ],
    choices: [
      {
        key: "1",
        label: "Scavenger Hunt — info scattered across Insta, WhatsApp, FB.",
        next: "gg1_intro",
      },
      {
        key: "2",
        label: "The Jam Drought — desperate for a place to play.",
        next: "gg1_intro",
      },
      {
        key: "3",
        label: "Admin Vortex — more time on calendars than craft.",
        next: "gg1_intro",
      },
      {
        key: "4",
        label: "Wall of Silence — don't know who's doing what.",
        next: "gg1_intro",
      },
      {
        key: "5",
        label: "Is this Beginner Friendly? — confusing class levels.",
        next: "gg1_intro",
      },
    ],
  },

  // ── GROUP GAME 1 — Venue Lore ─────────────────────────────────────────
  {
    id: "gg1_intro",
    type: "glitch",
    glitch: "SYSTEM NOTICE: The stair has claimed another victim. Proceed with care.",
    lines: [],
    next: "gg1",
  },
  {
    id: "gg1",
    type: "choice",
    rp: 30,
    rpLabel: "+30 RP — Group Game 1 cleared (bonus RP for correct lore)",
    lines: [
      "",
      "  ── GROUP GAME 1: VENUE LORE ────────────────",
      "",
      "  The Stage Manager needs to verify your credentials.",
      "  True or False:",
      "",
      '  "The OHD middle floor has a beam so low that',
      "   tall improvisers head-butt it mid-Harold.",
      '   This is known as The OHD Beam Factor."',
      "",
    ],
    choices: [
      { key: "1", label: "TRUE — seen it happen.", next: "gg1_true", rp: 10 },
      { key: "2", label: "FALSE — you're exaggerating.", next: "gg1_false" },
      { key: "3", label: "I plead the fifth.", next: "beat2_intro" },
    ],
  },
  {
    id: "gg1_true",
    type: "narrative",
    lines: [
      "",
      "  CORRECT. +10 BONUS RP.",
      "  The Beam Factor is real.",
      "  The Stage Manager respects your lore.",
      "",
      "  UNLOCKED: Backstage access granted.",
      "",
    ],
    next: "gg1_q2",
  },
  {
    id: "gg1_false",
    type: "narrative",
    lines: [
      "",
      "  INCORRECT. But also: Gallus answer.",
      "  The beam is real. We have medical records.",
      "  (We don't. But we should.)",
      "",
    ],
    next: "gg1_q2",
  },
  {
    id: "gg1_q2",
    type: "choice",
    lines: [
      "",
      "  BONUS ROUND: The SBT Stage.",
      "",
      "  The Blackfriars stage is described internally as:",
      "",
    ],
    choices: [
      { key: "1", label: "A postage stamp.", next: "gg1_q2_correct", rp: 10 },
      { key: "2", label: "Intimate but workable.", next: "gg1_q2_wrong" },
      { key: "3", label: "What stage?", next: "beat2_intro" },
    ],
  },
  {
    id: "gg1_q2_correct",
    type: "narrative",
    lines: [
      "",
      "  PURE DEAD BRILLIANT. +10 BONUS RP.",
      "  The postage stamp. Iconic. The backline",
      "  stands on the floor because there's nae room.",
      "",
    ],
    next: "beat2_intro",
  },
  {
    id: "gg1_q2_wrong",
    type: "narrative",
    lines: [
      "",
      "  \"Intimate but workable.\"",
      "  A generous read. Very polite.",
      "  The Stage Manager is noting your diplomacy.",
      "",
    ],
    next: "beat2_intro",
  },

  // ── BEAT 2 ────────────────────────────────────────────────────────────
  {
    id: "beat2_intro",
    type: "glitch",
    glitch: "WARNING: Low ceiling detected on level 2. Watch your heed.",
    lines: [],
    next: "beat2",
  },
  {
    id: "beat2",
    type: "choice",
    rp: 20,
    rpLabel: "+20 RP — Beat 2 complete",
    lines: [
      "",
      "  ── BEAT TWO ────────────────────────────────",
      "",
      "  The scenes deepen. The patterns emerge.",
      "  What would you use EVERY WEEK on the Scene Map?",
      "",
    ],
    choices: [
      { key: "1", label: "Master Calendar — all shows, jams, workshops.", next: "gg2_intro" },
      { key: "2", label: "Performer Directory — who's who, connect with others.", next: "gg2_intro" },
      { key: "3", label: "Jam Finder — find a place to play right now.", next: "gg2_intro" },
      { key: "4", label: "Venue & Teacher Directory — spaces and coaches.", next: "gg2_intro" },
      { key: "5", label: "Something else entirely — I'll tell you.", next: "beat2_other" },
    ],
  },
  {
    id: "beat2_other",
    type: "input",
    inputPrompt: "  Tell us what you'd actually use → ",
    inputKey: "customFeature",
    lines: [
      "",
      "  The Stage Manager is listening.",
      "",
    ],
    next: "gg2_intro",
  },

  // ── GROUP GAME 2 — Pirate / Robot / Ninja ─────────────────────────────
  {
    id: "gg2_intro",
    type: "glitch",
    glitch: "ALERT: The Jam Drought is real. Community intel required. Proceed.",
    lines: [],
    next: "gg2",
  },
  {
    id: "gg2",
    type: "choice",
    rp: 30,
    rpLabel: "+30 RP — Group Game 2 cleared",
    lines: [
      "",
      "  ── GROUP GAME 2: PERSONALITY DIAGNOSTIC ────",
      "",
      "  The Will Hines Framework.",
      "  Which one are you on a Harold Night?",
      "",
      "  PIRATE  — Chaos-Bringer. High energy. Acts before thinking.",
      "  ROBOT   — Logic-Engine. Structure-obsessed. Tracks everything.",
      "  NINJA   — Invisible Master. Perfect balance. Saves the scene.",
      "",
    ],
    choices: [
      { key: "1", label: "PIRATE — guilty as charged.", next: "beat3_intro" },
      { key: "2", label: "ROBOT — I track the 9-letter word.", next: "beat3_intro" },
      { key: "3", label: "NINJA — I'm saying nothing.", next: "beat3_intro" },
      { key: "4", label: "Depends on the night and the ceiling height.", next: "beat3_intro" },
    ],
  },

  // ── BEAT 3 ────────────────────────────────────────────────────────────
  {
    id: "beat3_intro",
    type: "narrative",
    lines: [
      "",
      "  ── BEAT THREE ──────────────────────────────",
      "",
      "  The convergence. Everything threads together.",
      "  Final question before The Button.",
      "",
    ],
    next: "beat3",
  },
  {
    id: "beat3",
    type: "choice",
    rp: 20,
    rpLabel: "+20 RP — Beat 3 complete",
    lines: [
      "  The Central Scotland scene runs on people",
      "  who show up even when the admin is chaos,",
      "  the venue is freezing, and the parking is",
      "  conceptual.",
      "",
      "  What keeps you coming back?",
      "",
    ],
    choices: [
      { key: "1", label: "The people. The ensemble. The room.", next: "button_intro" },
      { key: "2", label: "The craft. Getting better at the thing.", next: "button_intro" },
      { key: "3", label: "That one moment when it all connects.", next: "button_intro" },
      { key: "4", label: "Honestly? Still figuring that out.", next: "button_intro" },
    ],
  },

  // ── THE BUTTON ────────────────────────────────────────────────────────
  {
    id: "button_intro",
    type: "glitch",
    glitch: "UNLOCKED: Founding Cast status available. The Stage Manager is watching.",
    lines: [],
    next: "button",
  },
  {
    id: "button",
    type: "choice",
    rp: 50,
    rpLabel: "+50 RP — GALLUS STATUS ACHIEVED",
    lines: [
      "",
      "  ── THE BUTTON ──────────────────────────────",
      "",
      "  You've earned your Founding Cast status.",
      "",
      "  The Founding Cast gets:",
      "  → Early access when the Scene Map launches",
      "  → A Founding Member Security Pass (shareable)",
      "  → The smug satisfaction of saying you were here first",
      "  → Permanent GALLUS status in the system",
      "",
      "  Want in?",
      "",
    ],
    choices: [
      { key: "1", label: "AYE! Hook me up — take me to the form.", next: "tally" },
      { key: "2", label: "Haud Yer Wheesht for now — just here for the snacks.", next: "complete_anon" },
    ],
  },

  // ── TALLY REDIRECT ────────────────────────────────────────────────────
  {
    id: "tally",
    type: "narrative",
    lines: [
      "",
      "  REDIRECTING TO FOUNDING CAST REGISTRATION...",
      "",
      "  ██████████████████████████████  [100%]",
      "",
      "  Opening secure channel...",
      "  The Stage Manager is standing by.",
      "",
      "  [TALLY FORM LOADS HERE]",
      "",
    ],
    next: "complete_member",
  },

  // ── COMPLETE — FOUNDING CAST ──────────────────────────────────────────
  {
    id: "complete_member",
    type: "complete",
    rp: 0,
    lines: [
      "",
      "  ┌─────────────────────────────────────────┐",
      "  │                                          │",
      "  │        FOUNDING CAST — CONFIRMED         │",
      "  │                                          │",
      "  │         GALLUS STATUS: ACTIVE            │",
      "  │                                          │",
      "  │   Approved by The Stage Manager          │",
      "  │                                          │",
      "  └─────────────────────────────────────────┘",
      "",
      "  Your Founding Member Security Pass is incoming.",
      "  Screenshot it. Share it. The scene needs the intel.",
      "",
      "  Pass it on. Tell someone.",
      '  "Anyone seen this?"',
      "",
      "  — The Stage Manager",
      "",
    ],
  },

  // ── COMPLETE — ANONYMOUS ──────────────────────────────────────────────
  {
    id: "complete_anon",
    type: "complete",
    lines: [
      "",
      "  Fair enough. The Stage Manager respects a",
      "  Haud Yer Wheesht.",
      "",
      "  Your intel has been logged.",
      "  The scene thanks you.",
      "",
      "  If you change your mind — the link stays open.",
      "  Pass it on. The scene needs the intel.",
      "",
      "  — The Stage Manager",
      "",
    ],
  },
];

export const levels = [
  { min: 0, max: 30, name: "Rookie" },
  { min: 31, max: 80, name: "Apprentice" },
  { min: 81, max: 130, name: "Regular" },
  { min: 131, max: 180, name: "Headliner" },
  { min: 181, max: Infinity, name: "GALLUS" },
];

export function getLevel(rp: number): string {
  return levels.find((l) => rp >= l.min && rp <= l.max)?.name ?? "GALLUS";
}
