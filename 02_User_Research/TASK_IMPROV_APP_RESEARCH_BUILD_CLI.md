# TASK.md — Improv Comedy App Research + Discovery Command File

**Project:** Improv Comedy App  
**Primary local path:** `G:\Improv-Comedy-App`  
**Mirror path:** `D:\Improv-Comedy-App`  
**Created for:** CLI-assisted research, discovery, folder management, and MVP planning  
**Working rule:** `G:\` is the active/source copy. `D:\` is the safe mirrored backup.

---

## 0. Purpose

This file is the operating brief for Codex CLI, Gemini CLI, Claude Code, or another local AI coding/research agent.

The goal is to turn the **Improv Comedy App** from a loose idea into a properly researched, structured, build-ready MVP.

The app should begin as a **Central Scotland improv/comedy directory and community tool**, then later expand to the wider UK comedy scene.

---

## 1. Best-Case End Result

By the end of the discovery sprint, this project folder should contain:

```text
G:\Improv-Comedy-App
├── 00_Inbox
├── 01_Project_Overview
│   └── Improv Comedy App — Master Brief.md
├── 02_User_Research
│   └── Research Questions.md
├── 03_Pain_Points
│   └── Comedy Admin Pain Points.md
├── 04_MVP_Spec
│   └── MVP v1 Spec.md
├── 05_Feature_Backlog
│   └── Feature Backlog.md
├── 06_Data_and_Sources
│   └── Comedy Data Sources.md
├── 07_Legal_Permissions_Risks
│   └── Data Permissions Notes.md
├── 08_Prototype_No_Code
│   └── Prototype Plan.md
├── 09_App_Build
│   └── Technical Discovery Notes.md
├── 10_Marketing_and_Community
│   └── Community Trust Notes.md
├── 11_Handover_Prompts
│   ├── Gemini CLI Handover Prompt.md
│   ├── Codex CLI Folder Setup Prompt.md
│   ├── Claude Code Architecture Prompt.md
│   └── Research Agent Prompt.md
├── TASK.md
├── README.md
└── mirror_to_backup.ps1
```

The `D:\Improv-Comedy-App` mirror should contain the same files and folders after sync.

---

## 2. Core Product Thesis

The improv and comedy scene is fragmented.

Events, classes, workshops, jams, troupe shows, festivals, venue bookings, and collaboration opportunities are scattered across:

- Instagram
- Facebook
- WhatsApp groups
- Eventbrite
- Venue websites
- Comedy school websites
- Personal networks
- Word of mouth

The MVP should not start as a full social network.

The strongest first version is:

```text
Central Scotland Improv Directory
```

Core MVP:

- Events directory
- Classes/workshops directory
- Jams directory
- Performer profiles
- Team/troupe profiles
- Venue/studio listings
- Submit-event form
- External ticket links
- Source links
- Admin approval
- Weekly digest potential

---

## 3. Non-Negotiable Project Rules

### Safety

- Do not delete files.
- Do not overwrite files without creating a timestamped `.bak` first.
- Do not run destructive sync commands by default.
- Do not use `robocopy /MIR` unless the user explicitly approves destructive mirroring.
- Do not scrape Instagram aggressively.
- Do not copy images, posters, bios, or personal data without permission or a clear source/opt-out rule.
- Store links and attribution wherever possible.

### Build Direction

- Web-first, not native app-first.
- Directory-first, not full social network-first.
- Manual validation before automation.
- Use no-code/low-code where it reduces risk.
- Keep GitHub as the long-term source of truth for build assets.
- Keep Drive/Notion as planning/archive spaces if used.
- Build with the comedy community, not on top of it.

---

## 4. Suggested Tool Stack

### Local / CLI Tools

| Tool | Best Use |
|---|---|
| Codex CLI | Local folder setup, Markdown creation, repo hygiene, PowerShell scripts, Git checks, structured file edits |
| Gemini CLI | Large-context project reading, research synthesis, prompt execution, headless/checkpoint workflows |
| Claude Code | Architecture thinking, codebase navigation, feature planning, refactoring, technical design |
| Git | Version control, rollback safety, change tracking |
| PowerShell | Windows file operations, mirroring, verification scripts |
| Robocopy | Safe local drive sync when used with non-destructive flags |

### External Research / Prototype Tools

| Tool | Best Use |
|---|---|
| Google Sheets / Airtable | Early database for events, classes, venues, teams |
| Tally / Google Forms | Event submission form and user research survey |
| Softr / Glide | Quick directory prototype from Sheets/Airtable |
| Lovable / Base44 | AI-generated app prototype after MVP spec is clear |
| Canva | Event/poster/social templates |
| Notion | Project control tower, research dashboard, decisions log |
| GitHub | Canonical code/build repository |
| Eventbrite / venue sites / public calendars | Source discovery and outbound ticket links |

### Official Tool Notes

- OpenAI Codex CLI is a local terminal coding agent that can read, modify, and run code locally with approval modes such as Suggest, Auto Edit, and Full Auto. Official docs note Windows support may be experimental and may require WSL.  
  Source: https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started

- Gemini CLI supports commands, custom commands, headless mode, checkpointing, and tools. Use only official Google/Gemini sources when installing or updating.  
  Source: https://google-gemini.github.io/gemini-cli/docs/cli/

- Claude Code is Anthropic’s terminal-based coding tool. Official setup requires Node.js 18+ and supports Windows through WSL 1, WSL 2, or Git for Windows.  
  Source: https://docs.anthropic.com/en/docs/claude-code/getting-started

- GitHub Copilot coding agent can work on GitHub issues and create pull requests in supported GitHub Copilot plans. Use after the project is in a GitHub repo with clear issues.  
  Source: https://docs.github.com/en/copilot/using-github-copilot/coding-agent/about-assigning-tasks-to-copilot

---

## 5. Research Discovery Needed

### 5.1 Scene Map

Create a map of the current Central Scotland improv/comedy ecosystem.

Research:

- Main improv groups
- Stand-up crossover groups
- Sketch groups
- Comedy schools/classes
- Teachers/coaches
- Jams
- Venues
- Studios
- Festivals
- Regular nights
- Student comedy societies
- Beginner entry points
- Existing Facebook groups
- Instagram pages
- Eventbrite pages
- Venue calendars

Output file:

```text
06_Data_and_Sources\Comedy Data Sources.md
```

---

### 5.2 User Pain Point Research

Interview or survey:

- Beginner improvisers
- Experienced improvisers
- Team/troupe members
- Teachers
- Producers
- Venue/studio people
- Audience members

Core research question:

```text
What is annoying enough that people would actually use this app weekly?
```

Output file:

```text
03_Pain_Points\Comedy Admin Pain Points.md
```

---

### 5.3 Competitor / Alternative Research

Research what people already use instead of this app:

- Instagram
- Facebook groups/pages
- WhatsApp
- Eventbrite
- Meetup
- Dice
- Skiddle
- Venue websites
- Festival websites
- Linktree pages
- Google Calendar
- Discord servers
- Email newsletters

Core question:

```text
Why would someone use this app instead of just checking Instagram?
```

Output file:

```text
06_Data_and_Sources\Comedy Data Sources.md
```

---

### 5.4 MVP Validation

Validate demand for:

- Shared comedy calendar
- Event directory
- Class/workshop directory
- Jam finder
- Performer profiles
- Team profiles
- Venue/studio listings
- Collaboration board
- Weekly digest
- Poster upload → event extraction
- AI promo assistant

Minimum validation target:

```text
20 real event/class examples
10 user pain-point responses
5 organiser/teacher responses
1 ranked MVP feature list
1 safe data/permission rule
1 prototype approach
```

Output file:

```text
04_MVP_Spec\MVP v1 Spec.md
```

---

### 5.5 Data and Permission Research

Research:

- Can public events be listed if linked back to source?
- Can event poster images be used?
- Can bios be copied?
- Should listings require opt-in?
- How should people claim profiles?
- How should removal requests work?
- How will the app handle outdated event details?
- What attribution is required?
- What should moderation rules be?

Output file:

```text
07_Legal_Permissions_Risks\Data Permissions Notes.md
```

---

### 5.6 Prototype Tool Research

Compare the best first prototype options:

| Option | Research Question |
|---|---|
| Google Sheets + simple page | Is this enough for initial validation? |
| Airtable + Softr | Can this create a clean searchable directory quickly? |
| Glide | Is mobile-first useful without app-store complexity? |
| Lovable/Base44 | Can AI create a usable prototype from the MVP spec? |
| GitHub custom app | When is custom build justified? |

Output file:

```text
08_Prototype_No_Code\Prototype Plan.md
```

---

## 6. CLI Agent Roster

Use these as named mini-agents inside Codex/Gemini/Claude. Each agent should work on one output file at a time.

---

### Agent 1 — Project Archivist

**Job:** Keep the folder structure clean and mirrored.

Responsibilities:

- Verify folders exist.
- Verify required Markdown files exist.
- Create missing files.
- Back up before overwriting.
- Keep `G:\` and `D:\` aligned.
- Maintain `README.md`.
- Maintain `TASK.md`.
- Maintain `mirror_to_backup.ps1`.

Best tool:

```text
Codex CLI
```

---

### Agent 2 — Scene Research Scout

**Job:** Find and catalogue Central Scotland comedy/improv sources.

Responsibilities:

- List groups, venues, classes, jams, workshops, festivals.
- Record public source links.
- Capture what information exists and what is missing.
- Do not scrape private or sensitive data.
- Prioritise links and public summaries.

Output:

```text
06_Data_and_Sources\Comedy Data Sources.md
```

Best tools:

```text
Gemini CLI
Web browser
Manual research
```

---

### Agent 3 — User Research Designer

**Job:** Create research questions and surveys.

Responsibilities:

- Generate closed survey questions.
- Generate short interview scripts.
- Create different versions for beginners, teachers, venues, performers, and organisers.
- Keep questions short enough for real people to answer.

Output:

```text
02_User_Research\Research Questions.md
```

Best tools:

```text
ChatGPT
Gemini CLI
Claude Code
```

---

### Agent 4 — Pain Point Synthesizer

**Job:** Turn responses into product insight.

Responsibilities:

- Cluster repeated frustrations.
- Rank problems by severity and frequency.
- Convert pain points into possible features.
- Separate real problems from “nice idea” features.

Output:

```text
03_Pain_Points\Comedy Admin Pain Points.md
```

Best tools:

```text
Gemini CLI
Claude Code
ChatGPT
```

---

### Agent 5 — MVP Product Manager

**Job:** Decide the smallest useful product.

Responsibilities:

- Define MVP v1.
- Define what is excluded.
- Rank features.
- Create success metrics.
- Create user flows.
- Create launch checklist.

Output:

```text
04_MVP_Spec\MVP v1 Spec.md
05_Feature_Backlog\Feature Backlog.md
```

Best tools:

```text
Claude Code
ChatGPT
Codex CLI
```

---

### Agent 6 — Data Permissions Auditor

**Job:** Prevent avoidable data/legal/trust problems.

Responsibilities:

- Identify risks with Instagram, posters, bios, profiles, ticket links.
- Define permission rules.
- Define attribution rules.
- Define opt-out process.
- Define profile claiming policy.

Output:

```text
07_Legal_Permissions_Risks\Data Permissions Notes.md
```

Best tools:

```text
ChatGPT
Gemini CLI
Manual legal/common-sense review
```

Note: This is risk discovery, not legal advice.

---

### Agent 7 — Prototype Architect

**Job:** Decide the quickest build path.

Responsibilities:

- Compare Sheets/Airtable/Softr/Glide/Lovable/Base44/custom build.
- Recommend prototype path.
- Define data schema.
- Define pages/routes.
- Define admin workflow.
- Define what should be manual first.

Output:

```text
08_Prototype_No_Code\Prototype Plan.md
09_App_Build\Technical Discovery Notes.md
```

Best tools:

```text
Claude Code
Codex CLI
Lovable/Base44 after spec is clear
```

---

### Agent 8 — Handover Packager

**Job:** Make the project easy to transfer between tools.

Responsibilities:

- Create handover prompts.
- Summarise current project state.
- Create “read this folder first” instructions.
- Create Gemini/Codex/Claude prompts.
- Keep outputs short, structured, and reusable.

Output:

```text
11_Handover_Prompts\Gemini CLI Handover Prompt.md
11_Handover_Prompts\Codex CLI Folder Setup Prompt.md
11_Handover_Prompts\Claude Code Architecture Prompt.md
11_Handover_Prompts\Research Agent Prompt.md
```

Best tools:

```text
Codex CLI
ChatGPT
Gemini CLI
```

---

## 7. Master Prompt for Codex CLI

Paste this into Codex CLI from inside:

```text
G:\Improv-Comedy-App
```

```text
You are operating inside G:\Improv-Comedy-App.

TASK:
Act as the Project Archivist for the Improv Comedy App.

GOAL:
Prepare this folder as a safe, build-ready project workspace and mirror it to D:\Improv-Comedy-App.

RULES:
- Do not delete anything.
- Do not overwrite any file unless you first create a timestamped .bak backup.
- Treat G:\Improv-Comedy-App as the source.
- Treat D:\Improv-Comedy-App as the mirror.
- Use PowerShell-compatible commands.
- Do not use robocopy /MIR.
- Use robocopy /E /XO for safe non-destructive mirroring.
- If Git is not initialized, ask before running git init.
- Print all planned changes before making them.

CHECK REQUIRED STRUCTURE:
00_Inbox
01_Project_Overview
02_User_Research
03_Pain_Points
04_MVP_Spec
05_Feature_Backlog
06_Data_and_Sources
07_Legal_Permissions_Risks
08_Prototype_No_Code
09_App_Build
10_Marketing_and_Community
11_Handover_Prompts

CHECK REQUIRED FILES:
01_Project_Overview\Improv Comedy App — Master Brief.md
02_User_Research\Research Questions.md
03_Pain_Points\Comedy Admin Pain Points.md
04_MVP_Spec\MVP v1 Spec.md
05_Feature_Backlog\Feature Backlog.md
06_Data_and_Sources\Comedy Data Sources.md
07_Legal_Permissions_Risks\Data Permissions Notes.md
08_Prototype_No_Code\Prototype Plan.md
09_App_Build\Technical Discovery Notes.md
10_Marketing_and_Community\Community Trust Notes.md
11_Handover_Prompts\Gemini CLI Handover Prompt.md
11_Handover_Prompts\Codex CLI Folder Setup Prompt.md
11_Handover_Prompts\Claude Code Architecture Prompt.md
11_Handover_Prompts\Research Agent Prompt.md
TASK.md
README.md
mirror_to_backup.ps1

ACTIONS:
1. Inspect the folder tree.
2. Report what exists and what is missing.
3. Create missing folders.
4. Create missing files with useful starter content.
5. Back up before replacing any existing file.
6. Create or update mirror_to_backup.ps1 using safe robocopy settings:
   robocopy "G:\Improv-Comedy-App" "D:\Improv-Comedy-App" /E /XO /R:2 /W:2 /LOG+:"G:\Improv-Comedy-App\mirror_log.txt"
7. Run a non-destructive mirror to D:\Improv-Comedy-App.
8. Verify folder and file counts.
9. Print final summary:
   - folders checked
   - folders created
   - files created
   - files backed up
   - mirror status
   - next recommended command
```

---

## 8. Master Prompt for Gemini CLI

Paste this into Gemini CLI from inside:

```text
G:\Improv-Comedy-App
```

```text
You are being handed the Improv Comedy App project.

TASK:
Act as a research and discovery agent.

RULES:
- Read the local Markdown files first.
- Do not delete files.
- Do not overwrite files unless asked.
- Do not invent research findings.
- Separate confirmed facts from assumptions.
- Prefer concise, structured Markdown.
- If researching public sources, record source links.
- Do not scrape private communities.
- Do not copy posters, bios, or personal data without permission.

OBJECTIVE:
Turn this project into a build-ready Central Scotland Improv Directory MVP.

READ THESE FILES FIRST:
README.md
TASK.md
01_Project_Overview\Improv Comedy App — Master Brief.md
02_User_Research\Research Questions.md
03_Pain_Points\Comedy Admin Pain Points.md
04_MVP_Spec\MVP v1 Spec.md
05_Feature_Backlog\Feature Backlog.md
06_Data_and_Sources\Comedy Data Sources.md
07_Legal_Permissions_Risks\Data Permissions Notes.md

OUTPUT:
Create a project state summary with:
1. Current project purpose
2. Existing files
3. Current MVP direction
4. Missing research
5. Missing files
6. Recommended next build step
7. Suggested app architecture
8. Data/permission risks
9. Immediate todo list

THEN:
Update or create:
11_Handover_Prompts\Research Agent Prompt.md

The prompt should help any future AI agent continue the research without losing context.
```

---

## 9. Master Prompt for Claude Code

Paste this into Claude Code from inside:

```text
G:\Improv-Comedy-App
```

```text
You are acting as the Technical Discovery and Prototype Architect for the Improv Comedy App.

TASK:
Read the project folder and produce a technical plan. Do not implement code yet unless asked.

RULES:
- Do not delete anything.
- Do not overwrite files without creating a .bak timestamped backup.
- Do not build a full social network.
- Do not start with native mobile.
- Prioritise a web-first, low-cost, directory-first MVP.
- Assume early data may live in Google Sheets or Airtable.
- Assume public source links and manual submissions are safer than scraping.

READ:
TASK.md
README.md
01_Project_Overview\Improv Comedy App — Master Brief.md
04_MVP_Spec\MVP v1 Spec.md
05_Feature_Backlog\Feature Backlog.md
06_Data_and_Sources\Comedy Data Sources.md
07_Legal_Permissions_Risks\Data Permissions Notes.md

OUTPUT FILE:
09_App_Build\Technical Discovery Notes.md

INCLUDE:
1. Recommended MVP architecture
2. Suggested data schema
3. User roles
4. Main pages/routes
5. Admin workflow
6. Submission workflow
7. External ticket-link workflow
8. Search/filter logic
9. Risks and constraints
10. Build phases
11. What should remain manual in v1
12. What can be automated later
13. Recommendation: no-code prototype vs custom app
```

---

## 10. Research Agent Prompt

Use this for any AI research agent.

```text
You are researching the Central Scotland improv/comedy ecosystem for a proposed web app called Improv Comedy App.

MISSION:
Identify real user pain points, existing sources of event/class information, and the smallest useful MVP.

GEOGRAPHY:
Start with Central Scotland:
- Glasgow
- Edinburgh
- Stirling
- Dundee if relevant
Then consider wider Scotland and UK later.

TARGET USERS:
- Beginner improvisers
- Experienced improvisers
- Improv teams/troupes
- Teachers/coaches
- Venues/studios
- Festival organisers
- Audience members

RESEARCH QUESTIONS:
1. Where do people currently find improv/comedy events?
2. Where do people find classes and workshops?
3. What admin tasks are painful for organisers?
4. What makes beginners confused or excluded?
5. What info is scattered across platforms?
6. Would a shared directory/calendar solve a real problem?
7. What features would people actually use weekly?
8. What would make teachers/venues submit listings?
9. What data can safely be listed?
10. What should require permission or opt-in?

OUTPUT FORMAT:
- Confirmed findings
- Assumptions
- Source links
- Pain points
- Feature opportunities
- Risks
- MVP recommendations
- Questions still unanswered

RULES:
- Do not scrape private groups.
- Do not copy personal data.
- Do not copy event poster images unless permission is clear.
- Prefer links and summaries.
- Mark every unverified claim as an assumption.
```

---

## 11. MVP Data Schema Draft

Use this for the first spreadsheet/Airtable prototype.

### Events Table

| Field | Type |
|---|---|
| Event Name | Text |
| Event Type | Select: Show, Jam, Open Mic, Workshop, Class, Festival, Meetup |
| Date | Date |
| Start Time | Time |
| End Time | Time |
| City | Select |
| Venue | Linked record or text |
| Organiser | Linked record or text |
| Ticket Link | URL |
| Source Link | URL |
| Price | Text |
| Beginner Friendly | Checkbox |
| Description | Long text |
| Status | Draft, Approved, Needs Review, Archived |
| Last Checked | Date |

### Classes / Workshops Table

| Field | Type |
|---|---|
| Class Name | Text |
| Level | Beginner, Intermediate, Advanced, All Levels |
| Teacher | Linked record or text |
| Organisation | Text |
| City | Select |
| Start Date | Date |
| Booking Link | URL |
| Source Link | URL |
| Price | Text |
| Description | Long text |
| Status | Draft, Approved, Needs Review, Archived |

### Teams / Troupes Table

| Field | Type |
|---|---|
| Team Name | Text |
| City | Select |
| Comedy Type | Improv, Stand-up, Sketch, Mixed |
| Members | Text |
| Bio | Long text |
| Instagram | URL |
| Website | URL |
| Contact Link | URL |
| Claimed Profile | Checkbox |
| Status | Draft, Approved, Claimed, Archived |

### Venues / Studios Table

| Field | Type |
|---|---|
| Venue Name | Text |
| City | Select |
| Address | Text |
| Website | URL |
| Booking Link | URL |
| Capacity | Text |
| Accessibility Notes | Long text |
| Comedy Friendly | Checkbox |
| Source Link | URL |
| Status | Draft, Approved, Needs Review |

---

## 12. Discovery Sprint Checklist

### Day 1 — Structure

- [ ] Verify folder tree
- [ ] Verify required files
- [ ] Create missing files
- [ ] Set up safe mirror script
- [ ] Create initial README
- [ ] Mirror to D:\

### Day 2 — Source Map

- [ ] List 20 public comedy/improv sources
- [ ] Capture links
- [ ] Add to Comedy Data Sources.md
- [ ] Mark each as group, venue, class, festival, ticketing, or social

### Day 3 — Research Questions

- [ ] Create survey
- [ ] Create interview questions
- [ ] Create 5 audience-specific versions
- [ ] Prepare short DM/email message asking for input

### Days 4–7 — Validation

- [ ] Ask 10–20 people
- [ ] Collect 20 event/class examples
- [ ] Record repeated pain points
- [ ] Rank feature demand
- [ ] Update MVP v1 Spec

### Final Sprint Output

- [ ] MVP direction selected
- [ ] Prototype tool chosen
- [ ] Data permission rules written
- [ ] Backlog ranked
- [ ] Handover prompt updated
- [ ] Mirror synced to D:\

---

## 13. Best First Build Decision

Current recommendation:

```text
Build a Central Scotland Improv Directory first.
```

Do not start with:

- Full social network
- Native mobile app
- Payments
- Automated Instagram scraping
- Complex messaging

Start with:

- Public directory
- Manual submissions
- Admin approval
- External links
- Weekly digest
- Profile claiming later

---

## 14. Next Immediate Command

Run this in Codex CLI from:

```text
G:\Improv-Comedy-App
```

```text
Read TASK.md and act as Agent 1 — Project Archivist. Inspect the project, create missing files safely, create/update mirror_to_backup.ps1, mirror safely to D:\Improv-Comedy-App, and print a final project status report.
```

Then run this after the folder is clean:

```text
Read TASK.md and act as Agent 3 — User Research Designer. Improve 02_User_Research\Research Questions.md into a usable survey and interview pack for Central Scotland improvisers, teachers, organisers, venues, and beginners.
```

Then run this:

```text
Read TASK.md and act as Agent 7 — Prototype Architect. Create 08_Prototype_No_Code\Prototype Plan.md and 09_App_Build\Technical Discovery Notes.md comparing Google Sheets, Airtable, Softr, Glide, Lovable, Base44, and custom GitHub build paths.
```

---

## 15. Working Principle

The app should not be built because it is interesting.

It should be built only if the research proves that real comedy people repeatedly struggle with discovery, admin, visibility, connection, bookings, or trust.

The first product should be small enough to launch quickly and useful enough that real people return weekly.
