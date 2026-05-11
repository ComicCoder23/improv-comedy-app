# Stage Manager — Zapier Auto-Posting Workflow Spec

**Status: BLOCKED — pending B5 (Facebook Page connection)**

This file specifies the intended Zapier workflow for automating Instagram posts from The Stage Manager account. Do not build the workflow until B5 is resolved.

---

## Why this is blocked

Instagram posting via Zapier requires:
1. A Facebook Page connected to the Instagram Creator account
2. The Facebook Page linked to a Meta Developer App
3. The Meta Developer App granting Zapier posting permissions

**B5 decision needed:** Create a new separate Facebook account (A) or create a blank Page from existing Facebook account (B)?  
Until this is resolved, no workflow can be built.

---

## Intended workflow (once unblocked)

### Source: Google Sheets or Airtable content queue
- Content drafted and approved in a spreadsheet/Airtable base
- Row structure: Date | Pillar | Caption | Image path | Status (draft/ready/posted)
- Only rows with Status = "ready" are picked up by the trigger

### Zapier trigger
- New row in Google Sheets / Airtable with Status = "ready"
- OR: Scheduled trigger — fire at posting time (Mon/Wed/Fri, time TBD)

### Zapier action chain
1. Get row data (caption, image path)
2. Upload image to Instagram via Meta Graph API (requires Facebook Page connection)
3. Post with caption
4. Update row status to "posted" + add timestamp
5. Optional: send confirmation to Slack/Notion log

---

## Fallback (before Zapier is live)

Manual posting direct to Instagram. Use content calendar for scheduling. Batch-draft captions weekly.

---

## n8n alternative

After Zapier is working, evaluate installing n8n on ALAN-STUDIO for:
- Full pipeline ownership (no Zapier monthly cost)
- Custom scheduling logic
- Integration with Airtable base for ICA data

n8n install planned for after Zapier proof-of-concept works.

---

## Content queue spec (Airtable or Sheets)

| Field | Type | Notes |
|---|---|---|
| Date | Date | Scheduled post date |
| Pillar | Single select | Theory / Drill / Show / Jam / News |
| Caption | Long text | Final approved caption |
| Image path | Text | Path or Google Drive link to image file |
| Status | Single select | draft / ready / posted |
| Posted at | Datetime | Auto-filled by Zapier on post |
| Notes | Text | Any editorial notes |
