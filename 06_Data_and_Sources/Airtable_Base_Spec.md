# Airtable Base Spec — Improv Comedy App (ICA)
# Version: 1.0 | Created: 2026-05-06 | Author: The Stage Manager

---

## Base Name
`Improv Comedy App — Community Intelligence`

---

## Table 1: Founding Cast

One row per sign-up from the Tally.so Founding Cast form.

| Field Name | Type | Notes |
|---|---|---|
| ID | Autonumber | Primary key — auto-generated |
| Stage Name | Single line text | Optional — may be blank if anonymous |
| Email | Email | Required for follow-up |
| Anonymous | Checkbox | Tick if no name given — helps filter anon responses |
| Status in Scene | Single select | Options: Troupe Lead / Crafty One / Newblood / Backstage / Just Here for the Laldy |
| Biggest Blocker | Single select | Options: No regular space / No consistent group / Cost barrier / Can't find scene info / Imposter syndrome |
| Weekly Feature Use | Single select | Options: Venue finder / Show listings / Drill library / Troupe directory / Community board |
| Weekly Feature — Other | Single line text | Free text if they specified something outside the 5 options |
| Personality Type | Single select | Options: Pirate / Robot / Ninja |
| What Keeps Them Coming Back | Single select | Options: The people / The craft / The laughs / Nothing yet — still finding it |
| Custom Feature Suggestion | Long text | Optional free text |
| Sign-up Date | Date | Date Tally form was submitted |
| Source | Single select | Options: Tally Form / Manual / Import — for tracking data origin |
| Linked Team | Link to Teams | Optional — if they name a team they belong to |
| Notes | Long text | Internal use — any follow-up notes |

**Key relationships:**
- `Linked Team` → Links to **Teams** table (many-to-one: one person can belong to one team)

---

## Table 2: Responses (Raw)

Raw answer log. Can be used for bulk export/import from Tally without pre-processing. Acts as an audit trail separate from the cleaned Founding Cast records.

| Field Name | Type | Notes |
|---|---|---|
| Response ID | Autonumber | Primary key |
| Submission Date | Date | Timestamp from Tally |
| Raw Email | Email | As submitted |
| Raw Stage Name | Single line text | As submitted |
| Q1 — Status | Single line text | Raw answer text, not forced to select |
| Q2 — Biggest Blocker | Single line text | Raw answer text |
| Q3 — Weekly Feature | Single line text | Raw answer text |
| Q3 — Free Text | Long text | Any additional free-text from Q3 |
| Q4 — Personality Type | Single line text | Pirate / Robot / Ninja raw |
| Q5 — Keeps Coming Back | Single line text | Raw answer text |
| Q6 — Custom Suggestion | Long text | Free text, as submitted |
| Processed | Checkbox | Tick when this response has been cleaned and added to Founding Cast |
| Linked Founding Cast | Link to Founding Cast | Links cleaned record once processed |

**Key relationships:**
- `Linked Founding Cast` → Links to **Founding Cast** table (one-to-one: each raw response maps to one cast record once processed)

---

## Table 3: Venues

Directory of improv-friendly venues in Central Scotland.

| Field Name | Type | Notes |
|---|---|---|
| Venue ID | Autonumber | Primary key |
| Venue Name | Single line text | Full name — e.g. "The Glasgow Improv Theatre" |
| Short Name / Alias | Single line text | e.g. "The GIT", "Blackfriars", "Old Hairdresser's" |
| City | Single line text | Default: Glasgow — include Kirkintilloch, Edinburgh etc as needed |
| Area / Neighbourhood | Single line text | e.g. Merchant City, West End, Finnieston |
| Address | Long text | Full postal address |
| Postcode | Single line text | For map integration later |
| Venue Type | Single select | Options: Dedicated improv space / Pub / Theatre / Community hall / Studio / Pop-up |
| Capacity (approx) | Number | Integer — estimated audience capacity |
| Stage Available | Checkbox | Has a raised stage |
| Tech Available | Single select | Options: None / Basic PA / Full tech / Variable |
| Hire Available | Checkbox | Can be hired for shows/workshops |
| Hire Contact | Single line text | Name or role of booking contact |
| Hire Email | Email | Booking contact email |
| Hire Notes | Long text | Pricing, lead times, restrictions |
| Accessibility | Long text | Step-free, hearing loops, parking notes etc |
| Website | URL | Venue website |
| Status | Single select | Options: Active / Closed / Unconfirmed |
| Notes | Long text | Internal — any scene-specific context |
| Linked Events | Link to Events | All events hosted at this venue |
| Linked Teams | Link to Teams | Teams that use this venue as a home base |

**Key relationships:**
- `Linked Events` → Links to **Events** table (one-to-many: one venue hosts many events)
- `Linked Teams` → Links to **Teams** table (one-to-many: one venue can be home base for multiple teams)

---

## Table 4: Teams

Directory of improv teams active in Central Scotland.

| Field Name | Type | Notes |
|---|---|---|
| Team ID | Autonumber | Primary key |
| Team Name | Single line text | Official team name |
| Status | Single select | Options: Active / Legacy / Inactive / Uncertain |
| Scene Type | Multiple select | Options: Short-form / Long-form / Harold / Musical / Mixed / Sketch-adjacent |
| City | Single line text | Primary base city |
| Home Venue | Link to Venues | Primary venue — links to Venues table |
| Team Size (approx) | Number | Approximate active member count |
| Founded (year) | Number | Year team formed — approximate ok |
| Social / Contact | URL | Website, Facebook page, or Instagram |
| Notes | Long text | Scene context, history, status notes |
| Linked Members | Link to Founding Cast | Cast members who identified with this team |
| Linked Events | Link to Events | Events this team has performed at |

**Seed data (from community intel — verify before publishing):**

| Team | Status | Notes |
|---|---|---|
| Saved By The Beep | Active | |
| With Bits! | Active | |
| tubducky | Active | |
| Smoking Cat | Active | |
| F.L.U.S.H. | Active | |
| Pretty Thistle | Active | |
| English Rose | Active | |
| Bounce House | Active | |
| Couch | Active | |
| Spread | Active | |
| (Legacy teams) | Legacy | To be named and added individually |

**Key relationships:**
- `Home Venue` → Links to **Venues** table (many-to-one)
- `Linked Members` → Links to **Founding Cast** table (one-to-many)
- `Linked Events` → Links to **Events** table (many-to-many)

---

## Table 5: Events

Shows, jams, and workshops. Future use — sketch fields now, populate when event listings feature is built.

| Field Name | Type | Notes |
|---|---|---|
| Event ID | Autonumber | Primary key |
| Event Name | Single line text | e.g. "Tuesday Night Jam", "Harold Night" |
| Event Type | Single select | Options: Show / Jam / Workshop / Festival / Other |
| Format | Single select | Options: Short-form / Long-form / Harold / Mixed / Drop-in Jam / Workshop |
| Date | Date | Event date |
| Time | Single line text | Start time — e.g. "7:30pm" (text until time field needed) |
| Doors | Single line text | Doors time if different from start |
| Venue | Link to Venues | Where it's happening |
| Performing Teams | Link to Teams | Teams on the bill |
| Description | Long text | Public-facing blurb |
| Ticket Price | Currency | Leave blank if free |
| Free Entry | Checkbox | Tick if free — helps filter for sober-friendly / low-cost |
| Booking URL | URL | Ticketing link |
| Pay What You Can | Checkbox | PWYC pricing flag |
| Sober-Friendly | Checkbox | No alcohol-led environment — important filter for CSD/KCH crossover |
| Recurring | Checkbox | Is this a regular event? |
| Recurrence Pattern | Single line text | e.g. "Every 2nd Tuesday" — text field for now |
| Status | Single select | Options: Upcoming / Past / Cancelled / Unconfirmed |
| Source | Single line text | Who submitted / where data came from |
| Notes | Long text | Internal notes |

**Key relationships:**
- `Venue` → Links to **Venues** table (many-to-one)
- `Performing Teams` → Links to **Teams** table (many-to-many)

---

## Relationship Summary

```
Founding Cast ──── (many-to-one) ──── Teams
Founding Cast ──── (one-to-one)  ──── Responses (Raw)
Teams         ──── (many-to-one) ──── Venues
Events        ──── (many-to-one) ──── Venues
Events        ──── (many-to-many)──── Teams
```

---

## Setup Notes

1. Create tables in this order: Venues → Teams → Events → Founding Cast → Responses
   Linked fields require the target table to exist before the link field can be created.

2. Founding Cast and Responses can be merged into a single table if the Tally integration
   writes clean structured data. Keep them separate if Tally output is raw/unprocessed.

3. The `Sober-Friendly` flag on Events is a deliberate design choice — supports future
   KCH Radar integration and aligns with recovery-aware audience targeting.

4. All personally identifiable data (name, email) lives in Founding Cast and Responses only.
   Venues, Teams, and Events contain no PII.

5. Tally → Airtable connection: use Zapier or the native Tally → Airtable integration.
   Map Tally question IDs to Responses fields first. Clean/promote to Founding Cast manually
   or via automation once mapping is confirmed.

6. The `Anonymous` checkbox on Founding Cast allows filtering community intelligence reports
   to exclude or include anonymous entries as needed.

---

*This base is part of the Improv Comedy App community intelligence layer.*
*Creator identity: The Stage Manager. No real name on any public asset.*
