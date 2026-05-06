# MVP v1 Spec — Central Scotland Improv Directory

**Last updated:** 2026-05-06
**Intelligence sources:** Initial spec (Claude Code), Community research + gamified UX (Gemini CLI)

---

## MVP Name
Central Scotland Improv Directory

## Goal
Prove that a curated, community-submitted comedy directory provides enough value to attract regular users before building a full social platform. Use a gamified onboarding journey to collect community intelligence and build a Founding Cast list at the same time.

---

## Recommended First Stack (Confirmed)

| Layer | Choice | Reason |
|---|---|---|
| Database | Airtable | Free tier, easy admin, works with Softr |
| Frontend | Softr | No-code, connects to Airtable, fast to launch |
| Form submissions | Tally | Free, embeds cleanly, no-code |
| Gamified survey | Tally or Typeform | Branching logic for the Journey questionnaire |
| Later build | Next.js + Supabase | When no-code hits limits |
| Hosting (later) | Vercel or Netlify | Standard |
| Auth (later) | Clerk | Already used in KCH |

**Rule:** Airtable + Softr + Tally first. Do not touch custom code until the directory has real users.

---

## MVP Features (In Scope)

| Feature | Description |
|---|---|
| Homepage | Scene intro, featured events, quick search, Founding Cast CTA |
| Event directory | Shows, jams, workshops, festivals — filter by city/date/type |
| Class and workshop directory | Ongoing classes by teacher, location, level |
| Submit event form | Community submission → admin review before publish |
| Team profiles | Group/troupe page — name, bio, members, social links |
| Performer profiles | Individual page — bio, groups, links |
| External ticket links | Eventbrite, Ticketmaster, venue booking — no native payments |
| Search and filter | City, date, event type, experience level |
| Admin approval dashboard | Approve/reject submitted events before they go live |
| Gamified onboarding journey | 4-act questionnaire — see Journey Spec below |
| Founding Cast list | Email capture for early community members |

---

## Gamified Onboarding Journey — "The Improv Scene"

Designed by Gemini CLI from community intelligence. Purpose: collect user type data, surface pain points, and build the Founding Cast list — all while feeling like a game, not a form.

### Structure (4 Acts)

**Act 1 — The Warm-Up (Status Check)**
What is your current status in the Central Scotland scene?
- Troupe Lead / The Crafty One / Newblood / Backstage / Just Here for the Laldy
- Each answer unlocks different content and community context

**Act 2 — The "Yes, And..." Challenge (Pain Points)**
What is the biggest blocker in the scene right now?
- Scavenger Hunt (finding info) / The Jam Drought / Admin Vortex / Wall of Silence / Beginner Confusion

**Act 3 — The Big Suggestion (Feature Vote)**
What would you use every week?
- Master Calendar / Team Directory / Jam Finder / Venue & Teacher Directory / Something else

**Act 4 — Backstage Access (Founding Cast)**
Email capture with Founding Member framing — "Founding Cast" positioning, not a newsletter signup.

### Tone
Glasgow-specific. Uses scene slang as Easter eggs throughout the interface:
- **Gallus** — bold, high-stakes move
- **Haud Yer Wheesht** — stop monologuing
- **Yer bum's out the windae** — denying scene reality
- **Gie it Laldy** — escalate to 100%
- **Pish the bed** — major technical fail

Full journey script: `02_User_Research\Improv_Journey_Script.md`

---

## Community Intelligence Gathered (Gemini)

**Key venues confirmed:**
- The Old Hairdresser's — current home of Glasgow improv scene
- The Griffin — old school, still referenced as a rite of passage
- Blackfriars — Squeaky Bum Time (Sunday jam) home

**Known teams/groups:**
- Bounce House — known for Reddit AITA-style scene work, community lore
- A Horse With Nae Name — active troupe (Alan's group)

**Key events:**
- Glasgow Improv Marathon — 10-hour endurance event, community milestone
- Squeaky Bum Time (Sunday jam at Blackfriars)

**Content intelligence library:** `06_Data_and_Sources\ICA-Content & Intelligence.md`
Includes: YouTube reference videos (UCB, iO Chicago, Showstopper, Austentatious, Men With Coconuts), gamification theory, slang dictionary, scene lore.

---

## Excluded from MVP

- Full social network (feeds, follows, likes)
- Native payment system
- Complex messaging or DMs
- Mobile app store release
- Automated Instagram / Facebook scraping
- Festival application management
- Performer achievement badges (post-MVP — Reputation Points system is planned but not v1)

---

## Success Criteria for MVP

- 20+ events or classes listed at launch
- 5+ team or performer profiles created
- At least 3 community members voluntarily submit content
- At least one teacher or organiser confirms it saves them time
- Founding Cast list has at least 20 emails before public launch
- Journey questionnaire completed by at least 30 community members

---

## Build Sequence

1. Set up Airtable base (events, teams, performers, venues tables)
2. Connect Softr frontend to Airtable
3. Build Tally submission form
4. Build gamified journey questionnaire (Tally or Typeform)
5. Populate with 20+ seed listings manually
6. Soft launch to Founding Cast list
7. Iterate based on community feedback before public launch
