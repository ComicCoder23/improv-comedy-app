# Questionnaire UX — Terminal Experience Spec

**Version:** 1.0
**Date:** 2026-05-06
**Source:** Gemini CLI brief + Claude Code integration
**Status:** Planned — script complete, technical build pending

---

## Concept

A web-based terminal emulator that feels like a performance, not a form.
Users open a single shared link (WhatsApp-safe) and enter a gamified improv journey
that captures community intelligence while being genuinely fun to do.

The script running inside it is structured as a Harold.

---

## Technical Stack

| Layer | Tool | Why |
|---|---|---|
| Terminal emulator | Xterm.js | Browser-based, looks like a real terminal |
| Hosting | Vercel | One link, instant deploy, free tier |
| Data capture (final step) | Tally.so | Embeds cleanly, no-code, free |
| Thumbnail / share image | Nano Banana (already generated) | WhatsApp preview image |
| Security pass image | Nano Banana | End-reward for Founding Cast members |

---

## Gamification Layer

### Reputation Points (RP)
Awarded at each stage. Displayed in the terminal as the user progresses.
- Completing The Suggestion: +10 RP
- Completing Beat 1: +20 RP
- Completing Group Game 1: +30 RP (bonus for "correct" venue lore answers)
- Completing Beat 2: +20 RP
- Completing Group Game 2: +30 RP
- Completing Beat 3: +20 RP
- Joining the Founding Cast: +50 RP

### Leveling System
- 0–30 RP: Rookie
- 31–80 RP: Apprentice
- 81–130 RP: Regular
- 131–180 RP: Headliner
- Founding Cast signup: Gallus status (permanent)

### Glitch Messages
Short insider messages triggered at stage transitions.
Injected as terminal "system errors" that are actually Easter eggs.
Examples:
- "SYSTEM NOTICE: The stair has claimed another victim. Proceed with care."
- "WARNING: Low ceiling detected on level 2. Watch your heed."
- "ALERT: The Jam Drought is real. Community intel required."
- "UNLOCKED: Backstage access granted. The Stage Manager is watching."
- "ERROR: Central Station fire detected. Scene suspended for 7 days. Resuming..."

### End Reward
A generated "Founding Member Security Pass" image delivered at completion.
Personalised with their stage name if provided.
Shareable — designed to spread through the WhatsApp group organically.

---

## Visual Elements

- ASCII art fireworks on load (opening)
- Terminal-style progress bar between stages
- "Scene Schematic" — a simple ASCII map of the Harold structure that fills in as they complete each beat
- Blinking cursor throughout for authenticity
- Colour: green on black (classic terminal) or amber on black (warmer)

---

## Content Source

The full script (Harold structure) lives at:
`02_User_Research\Improv_Journey_Script.md`

This is v1 — locked. Do not overwrite. Branch or create v2 if changes needed.

---

## Data Flow

1. User opens WhatsApp link → Vercel-hosted terminal loads
2. Journey runs in Xterm.js — answers logged to browser session
3. At The Button (Founding Cast step) → Tally.so form embeds or opens
4. Tally captures: name, email, role in scene, what they'd use weekly
5. Data lands in Tally dashboard → exported to Airtable later

---

## Sharing Strategy

- Single link shared in WhatsApp group(s)
- WhatsApp preview shows thumbnail image (already generated)
- End screen says: "Pass it on. The scene needs the intel."
- Security pass image is designed to be screenshotted and shared

---

## Build Sequence

1. Scaffold Xterm.js project on Vercel (Next.js wrapper)
2. Implement terminal loop — display text, capture keypress/selection
3. Map Harold script into terminal state machine (one beat per state)
4. Add RP counter and level display
5. Add glitch messages at transitions
6. Integrate Tally form at The Button
7. Generate and integrate Founding Cast security pass image
8. Test on mobile (WhatsApp link must work on phone)
9. Share

---

## Pending Before Build

- User to review Harold script and add personal jokes / specific bits
- YouTube channel analysis (voice/humour tone) — was pending from Gemini session
- Decision: green-on-black or amber-on-black terminal colour
- Decision: stage name on security pass — yes or no

---

## Version History

| Version | What | Where |
|---|---|---|
| v1 — Script (Harold) | Full Harold-structured questionnaire | 02_User_Research\Improv_Journey_Script.md |
| v1 — Terminal Spec | This document | 08_Prototype_No_Code\Terminal_UX_Spec.md |
