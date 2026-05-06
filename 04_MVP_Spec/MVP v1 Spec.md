# MVP v1 Spec — Central Scotland Improv Directory

## MVP Name
Central Scotland Improv Directory

## Goal
Prove that a curated, community-submitted comedy directory provides enough value to attract regular users before building a full social platform.

---

## MVP Features (In Scope)

| Feature | Description |
|---|---|
| Homepage | Introduction, featured events, quick search |
| Event directory | Browse shows, jams, workshops, festivals by date/city/type |
| Class and workshop directory | Browse ongoing classes by teacher, location, level |
| Submit event form | Community members submit their own listings for admin review |
| Team profiles | Basic page for improv groups/troupes — name, bio, members, links |
| Performer profiles | Individual performer pages — bio, groups, links |
| External ticket links | Link out to Eventbrite, Ticketmaster, venue booking pages |
| Search and filter | Filter by city, date, event type, experience level |
| Admin approval dashboard | Review and approve/reject submitted events before publishing |
| Social links | Link to group Instagram, Facebook, website |

---

## Excluded from MVP

- Full social network (feeds, follows, likes)
- Native payment system (use external ticket links only)
- Complex messaging or DMs
- Mobile app store release (web-first only)
- Automated Instagram or Facebook scraping
- Festival application and submission management
- Performer achievement or badge systems

---

## Recommended First Stack

| Layer | Option |
|---|---|
| Database (early) | Airtable or Google Sheets |
| Form submissions | Tally or Google Forms |
| Prototype | Notion, Glide, or Softr (no-code) |
| Later build | Next.js or Astro with Supabase/Prisma |
| Hosting | Vercel or Netlify |
| Auth | Clerk (already used in KCH project) |

**Rule:** Start no-code or low-code. Only move to custom build when no-code hits a hard limit.

---

## Success Criteria for MVP
- 20+ events or classes listed at launch
- 5+ team or performer profiles created
- At least 3 community members voluntarily submit their own content
- At least one teacher or organiser confirms it saves them time
