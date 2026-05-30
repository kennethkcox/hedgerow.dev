# Hedgerow — Project Instructions

## Always reference the style guide

Full style guide: `C:\Users\cczin\OneDrive\Desktop\brand\graphics\styleguide.md`

Read it before making any design, copy, or branding decision. The rules below are a working summary. When in doubt, read the full guide.

---

## Brand in one line

Hedgerow is a calm, premium, technically credible security brand. Editorial restraint. Warm natural surfaces. Strong typographic core. Visual language built on structure and quiet protection.

---

## Colour palette

| Name | Hex | Use |
|---|---|---|
| Midnight | `#013D5A` | Primary — text, headings, nav, footer, dark panels |
| Lionsmane | `#FCF3E3` | Background — warm paper tone, card surfaces |
| Celeste | `#B0D3CE` | Secondary surface — cards, callout backgrounds |
| Herb | `#708C69` | Main accent — section labels, buttons, active states |
| Marigold | `#F4A25B` | Highlight only — use rarely, micro-accents only |

Current CSS variables in `hedgerow.css`:
- `--midnight: #013D5A` → `--navy`
- `--lionsmane: #FCF3E3` → `--card` (bg surface)
- `--moss-shadow: #374A30` → `--sage` (section labels)
- `--clay-warmth: #BA7650` → `--amber / --marigold`
- `--stone-grey: #8A857E` → `--faint / --muted`

The site should feel like Midnight + Lionsmane. Herb/Moss Shadow is the accent. Marigold/Clay Warmth is used sparingly.

---

## Typography

**Primary font stack:** `'Avenir Next', 'Avenir', 'Century Gothic', 'Montserrat', sans-serif`

Montserrat is loaded from Google Fonts as the web fallback.

**Rules:**
- One font family throughout — no decorative serifs, no Cormorant Garamond, no display fonts
- Weight and spacing contrast do the work, not multiple typefaces
- Headlines: bold (`700`), tight tracking (`-.04em`)
- Body: regular (`400`) or medium (`500`)
- Labels: uppercase, wide tracking (`.12–.14em`), small size (`.65–.7rem`)

**Logo mark:** `hr█.` in Avenir Next bold — this is a separate typographic object, not subject to the body font rule.

---

## Writing rules

**Always:**
- Specific over vague
- Direct over inflated
- Technical over trendy
- Describe behavior, scope, and operating model — not emotional outcomes
- Start with the claim, then support it
- 3–10 words in headlines when possible

**Never:**
- "Next-generation", "cutting-edge", "revolutionary", "seamless", "powerful"
- "Unlock the future", "AI security, reimagined", "empowering" language
- Generic cybersecurity fear copy
- Founder-myth storytelling in product materials
- Startup cliché phrasing

**Vocabulary to prefer:** runtime, enforcement, deterministic, auditable, source-level, explainable, on-premise, codebase, attack path, controls, exposure, regulated

**Messaging order for any page:**
1. What it is
2. What it does
3. Who it is for
4. Why it is different
5. Why it can be trusted

---

## Visual / design rules

- Left-align most content
- Generous spacing — let sections breathe
- No gradients, no glassmorphism, no glows
- No rounded bubbly UI (border-radius ≤ 6px is fine)
- No icon-in-circle feature grids
- Dark sections sparingly — for emphasis only
- Flat or near-flat surfaces, minimal shadows, subtle borders
- No shields, locks, padlocks, or security clichés in visuals

---

## Products

**Thicket** — Runtime security for AI applications. Four enforcement layers. Deterministic. No external API. No AI making blocking decisions. Works in air-gapped environments.

**Rowan** — Source code analysis for AI infrastructure. Cross-file taint analysis, AI-specific sink models, reachability-aware SCA, agentic hunt mode.

**Both:** Do not label either as "production-ready" or "in beta". Do not restrict to enterprise — any team can get in touch.

---

## Repository

- GitHub: `kennethkcox/hedgerow.dev`
- Firebase project: `hedgerow-acc` (acceptance)
- Contact: `hello@hedgerow.dev`

---

## Deployment

### How to deploy

**Every push to `master` deploys automatically.** No manual steps needed once a commit lands on master.

```bash
git add .
git commit -m "your message"
git push
# → GitHub Actions runs deploy-acc.yml (~30 seconds)
# → Live at https://hedgerow-acc.web.app
```

### Environment

| Environment | Firebase project | URL | Trigger |
|---|---|---|---|
| Acceptance | `hedgerow-acc` | `https://hedgerow-acc.web.app` | push to `master` |

### Check deployment status

```bash
# List recent runs
gh run list --repo kennethkcox/hedgerow.dev --limit 5

# Watch a specific run live
gh run watch <run-id> --repo kennethkcox/hedgerow.dev

# View logs if something failed
gh run view <run-id> --repo kennethkcox/hedgerow.dev --log
```

### How the workflow works

- File: `.github/workflows/deploy-acc.yml`
- Action: `FirebaseExtended/action-hosting-deploy@v0`
- Secret required: `FIREBASE_SERVICE_ACCOUNT_HEDGEROW_ACC` (already added to the GitHub repo)
- Deploys to the `live` channel on `hedgerow-acc`
- Node 24 opt-in set to suppress deprecation warnings

### Firebase config files

- `firebase.json` — defines the public directory (`.`), security headers, clean URLs, and ignore list
- `.firebaserc` — maps `acc` and `default` aliases to `hedgerow-acc`

### If a deploy fails

1. Run `gh run list --repo kennethkcox/hedgerow.dev --limit 3` to get the run ID
2. Run `gh run view <id> --repo kennethkcox/hedgerow.dev --log` to read the error
3. Common causes: secret missing/expired, `firebase.json` syntax error, file too large

### To add a production environment later

1. Create a new Firebase project (e.g. `hedgerow-prod`)
2. Add its service account as `FIREBASE_SERVICE_ACCOUNT_HEDGEROW_PROD` in GitHub secrets
3. Copy `.github/workflows/deploy-acc.yml` to `deploy-prod.yml`, update `projectId` and secret name
4. Add `"prod": "hedgerow-prod"` to `.firebaserc`

---

## Key files

- `hedgerow.css` — shared design system (colours, typography, components)
- `home.css` — homepage-specific styles
- `thicket/product.css` — Thicket page styles
- `rowan/rowan.css` — Rowan page styles
- `nav.js` — shared nav toggle (no inline onclick anywhere)
- `.github/workflows/deploy-acc.yml` — Firebase deploy workflow
- `firebase.json` / `.firebaserc` — Firebase Hosting config
