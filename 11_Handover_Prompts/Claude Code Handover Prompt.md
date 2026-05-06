# Claude Code Handover Prompt — Improv Comedy App

## Date
2026-05-06

## Agents who have worked on this project
- Claude Code — initial folder structure, GitHub repo, planning docs
- Gemini CLI — community intelligence, gamified UX design, journey script, research agent prompt
- Claude Code — file rescue, MVP spec update, this handover doc

---

## Current Project State

### What is built
- Full folder structure at D:\Improv-Comedy-App (12 folders)
- GitHub repo live: ComicCoder23/improv-comedy-app (main branch)
- Mirror: G:\My Drive\Alan-App-Lab\04-Live-Products\Comedy-Tools\Improv-Comedy-App

### Key files and their status

| File | Location | Status |
|---|---|---|
| Master Brief | 01_Project_Overview\ | Complete |
| Research Questions | 02_User_Research\ | Complete (base version) |
| Improv Journey Script | 02_User_Research\ | Complete — Gemini-authored gamified questionnaire |
| Pain Points | 03_Pain_Points\ | Complete |
| MVP v1 Spec | 04_MVP_Spec\ | Updated with Gemini community intel |
| Feature Backlog | 05_Feature_Backlog\ | Complete |
| Comedy Data Sources | 06_Data_and_Sources\ | Complete (base version) |
| ICA-Content & Intelligence | 06_Data_and_Sources\ | Complete — Gemini community intelligence database |
| Data Permissions Notes | 07_Legal_Permissions_Risks\ | Complete |
| Research Agent Prompt | 11_Handover_Prompts\ | Complete — for future research agent |
| Gemini CLI Handover Prompt | 11_Handover_Prompts\ | Complete |
| Codex CLI Folder Setup Prompt | 11_Handover_Prompts\ | Complete |
| This file | 11_Handover_Prompts\ | Complete |

### Empty folders (no work started)
- 08_Prototype_No_Code
- 09_App_Build
- 10_Marketing_and_Community

---

## What Gemini Discovered

### Community intelligence
- Key venues: The Old Hairdresser's (current home), The Griffin (old school), Blackfriars (Sunday jam)
- Known teams: Bounce House (Reddit AITA scene work), A Horse With Nae Name
- Key events: Glasgow Improv Marathon (10 hours), Squeaky Bum Time (Sunday jam)
- Glasgow slang Easter eggs confirmed for UI: Gallus, Haud Yer Wheesht, Yer bum's out the windae, Gie it Laldy, Pish the bed

### Gamified UX design
- 4-act questionnaire ("The Improv Scene Journey") designed and written
- Reputation Points system planned (post-MVP)
- Founding Cast list as email capture mechanism (not "newsletter signup" framing)
- Full script: 02_User_Research\Improv_Journey_Script.md

### Stack confirmed
- Airtable + Softr + Tally for no-code MVP
- Custom build path: Next.js + Supabase (later)

---

## What Is Still Pending

- YouTube channel analysis (Alan's channel @alangray7930) — Gemini started but did not complete
- Scene Map: 20+ public comedy/improv sources in Central Scotland — Research Agent Prompt exists but research not done
- Airtable base setup
- Softr frontend build
- Gamified journey questionnaire build (Tally or Typeform)
- Seed data (20+ listings)
- Founding Cast launch

---

## Next Build Step

The planning layer is complete. Next action is:

1. Set up Airtable base with tables: Events, Teams, Performers, Venues
2. Connect Softr frontend
3. Build Tally submission form
4. Deploy gamified journey questionnaire
5. Manually seed 20+ listings
6. Soft launch to Founding Cast

---

## Rules
- Do not delete or overwrite files without backup
- Do not scrape private communities or copy personal data
- Keep Glasgow slang as Easter eggs — do not over-explain them in the UI
- Founding Cast list = community positioning, not a marketing list
- GitHub is the source of truth for all files
