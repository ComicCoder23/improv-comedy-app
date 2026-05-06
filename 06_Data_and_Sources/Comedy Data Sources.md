# Comedy Data Sources

## Potential Data Sources

| Source | Type | Risk Level |
|---|---|---|
| Instagram pages (public) | Event posters, announcements | Medium — do not scrape, link only |
| Facebook events (public) | Event listings | Medium — link only |
| Eventbrite | Event and ticket listings | Low — public API available |
| Venue websites | Class and show schedules | Low — manual or with permission |
| Comedy school websites | Class timetables | Low — manual or with permission |
| Festival websites | Programme listings, deadlines | Low — manual or with permission |
| Google Calendar links | Publicly shared calendars | Low — direct link or embed |
| Manual submissions | Community-submitted events | Very low — source of truth |
| Performer / team submissions | Self-submitted profiles | Very low — consent given |
| Public ticket links | Eventbrite, venue booking pages | Low — link only |

---

## Safe Data Strategy

### Principles
- **Prefer user-submitted data** — community submissions are the cleanest source
- **Store public links, not copied content** — link to Instagram post, Eventbrite page, venue site
- **Manual approval before publishing** — admin reviews all submissions
- **Attribute sources** — display where information came from
- **Allow opt-out** — any person or group can request removal
- **Allow people to claim profiles** — performers and teams can verify and take ownership
- **Avoid aggressive scraping** — do not automate bulk extraction from any platform

### What We Store
- Event title, date, time, location, description
- External ticket/booking URL
- Category and tags
- Submitter contact (not public-facing)
- Source attribution link

### What We Do Not Store
- Full bios or images copied from other platforms without permission
- Personal contact details (phone numbers, home addresses)
- Private event information
- DM content or private social media posts
