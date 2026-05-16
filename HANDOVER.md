# HANDOVER — Improv Comedy App + Stage Manager Instagram — 2026-05-07

## Agent handing over
Claude Code (Sonnet 4.6)

## Agent taking over
Claude Code (next session)

## Current task
Two parallel workstreams active this session:
1. ICA app build — PuggyMachine feature completion
2. The Stage Manager Instagram project — planning and setup

---

## Progress

### STREAM 1 — ICA App Build

**DONE this session:**
- PuggyMachine.tsx — complete rewrite. Harold Trail feature board, working nudge position tracking via reelPositionsRef, near-miss detection. Committed to GitHub (commit: 75467a3)

**NOT DONE — next priorities:**
- Wire PuggyMachine into MobileTerminal.tsx (showPuggy state + questionCount counter + trigger after every 5 choices + JSX overlay)
- Replace TALLY_FORM_ID placeholder in MobileTerminal.tsx with real Tally form ID
- Airtable base setup (5-table schema designed, not built)
- Quiz engine with leaderboard (designed, not built)
- Alan to complete Memory Palace Questionnaire (D:\Improv-Comedy-App\02_User_Research\Memory_Palace_Questionnaire.md)

### STREAM 2 — The Stage Manager Instagram

**DONE this session (planning only — no files created):**
- Full project plan approved: folder structure, file names, content for each file
- 7-day launch plan designed
- NotebookLM cleanup plan: delete list, untick list, add list, ideal source stack
- Batch 1 (ideas 1–50) triaged: green/amber/red, duplicates flagged, sources verified
- Batch 3 (ideas 101–150) triaged: Scottish content prioritised for first 3 months
- 3-month Scottish content calendar designed
- Bounce House (GIT house team) verified as real — AITA format, last show Oct 2025
- MC Hammersmith verified as real — comic improv rapper, EIIF workshop
- Instagram account created: @th3.st4ge.manag3r
- Switched to Creator account — category: Performance & Fiction
- Bio selected: Option B — "The Scottish improv scene, catalogued. Theory · Shows · Drills · Jams / Central Scotland."

**BLOCKED — needs user action:**
- Facebook Page connection (required for Meta Graph API / n8n / Zapier)
- User deciding: Option A (separate FB account) or Option B (blank Page from existing FB)
- Once FB Page connected: Meta Developer App setup → then Zapier workflow build

**NOT DONE — next priorities:**
- Create folder structure at D:\Improv-Comedy-App\10_Stage_Manager_Instagram\
- Populate all planned files (README, brand rules, source map, content pillars, etc.)
- Build Zapier posting workflow (blocked on FB Page connection)
- Install n8n on ALAN-STUDIO for full pipeline (after Zapier is working)

---

## Last action
Stop point called. PuggyMachine.tsx committed. HANDOVER.md written.

## Next action
On resume — confirm which stream to pick up first:
- A: Wire PuggyMachine into MobileTerminal.tsx (app build)
- B: Create Stage Manager Instagram file structure (Day 2 of launch plan)
- C: Facebook Page setup for Zapier/n8n (Instagram automation)

## Decisions pending
- Facebook Page: separate account (A) or blank page from existing FB (B)?
- Stage Manager visual style: terminal cards (A) or designed cards (B)? — NOT YET ANSWERED

## Files modified this session
- D:\Improv-Comedy-App\09_App_Build\terminal-prototype\src\components\PuggyMachine.tsx (rewritten)
- D:\Improv-Comedy-App\HANDOVER.md (this file)

## GitHub status
- Commit: 75467a3
- Message: feat: PuggyMachine — Harold Trail feature board, working nudge position tracking, near-miss detection
- Branch: master
- Repo: ComicCoder23/improv-comedy-app

## Rules in effect
- Stage Manager identity anonymous — @th3.st4ge.manag3r handle known but creator not named in any public file
- No files created for Stage Manager Instagram project yet (user instruction: planning only)
- No posts generated
- Memory Palace Questionnaire must be completed before ICA MVP build work begins

## Timestamp
2026-05-07 UTC
