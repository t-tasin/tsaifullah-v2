---
name: portfolio-redesign-design
description: Validated design spec for Tasin's personal portfolio website — positioning, content, sitemap, stack, brand-exploration approach, and session arc for a weekend build using Claude Design + Claude Code.
type: project-spec
status: draft-awaiting-user-review
owner: tasin
last-updated: 2026-04-18
---

# Tasin's Portfolio — Design Spec

## 0. Purpose

This doc is the source of truth for the portfolio redesign kicked off 2026-04-18. It captures every decision made during the brainstorming session so the Claude Design handoff prompt and the implementation plan have a stable set of inputs to pull from. When this doc and the original `BRIEF.md` disagree, **this doc wins** — the brief was the pre-session plan; this spec reflects the actual decisions.

Companion artifact: `docs/claude-design-prompt.md` — the pasteable brief for Claude Design. That doc contains no decisions this spec doesn't; it's a rephrasing targeted at a design tool.

## 1. Audience & positioning

**Primary audience:** hiring managers at early-stage startups and mid-size product companies (Linear-, Vercel-, Raycast-tier).
**Secondary audience:** FAANG-tier hiring managers evaluating infra/backend depth.

These three cohorts overlap on one axis: they reward *visible craft evidence*. Their register differs — startups tolerate personality, FAANG expects restraint — so the site lands in the middle: **polished, technical, not cutesy, no adjectival bragging.**

**Internal positioning (how we think about Tasin):**

> Rare generalist who turns observed problems into shipped products — product instinct, engineering chops, AI-leveraged — and has done it at enterprise scale with 3000+ real users and real enterprise authentication.

**External surface (what appears on the site):** proof artifacts, not adjectives. Numbers, stack names, screenshots, architecture. The positioning sentence never appears verbatim.

## 2. Walkaway sentence

When a hiring manager closes the tab after 90 seconds, they should think:

> "This person solves problems he's witnessed. Strong product instinct + engineering chops, uses AI efficiently, and has shipped enterprise software with 3000+ real users and real enterprise auth."

This is the yardstick for every content decision. If a section doesn't advance this sentence, it gets cut.

## 3. Content inventory

| Section | Items | Treatment |
|---|---|---|
| **Hero** | Name + short positioning line + primary CTA (project deep-dives) | High-attention, above the fold |
| **Projects** (grid of cards) | AtlasDesk (headliner), T.A.R.S | 2 cards is fine — quality > count |
| **Research** | Multi-Agent AV Routing (2025, under review); Sentiment Analysis in SE (NCUR 2024, published) | Compact section; titles link to PDFs |
| **Experience** | Internships (sourced from resume) | Résumé-style compact list |
| **Leadership / Activities** | GDSC Co-Lead (Wooster, 2023–2025); Stanford TreeHacks 2024; RA (Wooster, 2022–2024) | Understated; one line each |
| **About** | 2–3 short paragraphs + small B&W photo | On About surface only, not on hub hero |
| **Resume** | Dedicated `/resume` page | Web view + PDF download |
| **Contact** | Email, LinkedIn, GitHub, X | Plain text, no form |

### 3.1 Project-card content

**AtlasDesk (headliner):**

> Production ITSM platform for higher-ed + mid-market institutions. Live at Wooster College — 3000+ users. NestJS microservices on PostgreSQL + SQL Server, Next.js app, Docker. No-code permission matrix with hierarchy tiers, multi-role union semantics, and runtime-editable status machines. Enterprise auth: SAML SSO with Entra ID, JIT + nightly Graph delta sync, password + mandatory OTP, argon2id, refresh-token rotation with breach detection. AI Resolution Copilot — pgvector + transformers.js BGE-small embeddings + Gemini 2.5 Flash RAG over past tickets. Solo build. Shipping multi-tenant SaaS tier next.

Proof artifacts to surface on the card: **"3000+ users · production at Wooster · SAML + OTP + argon2id · pgvector RAG"** (or similar — Claude Design decides layout).

**T.A.R.S:**

> Personal AI assistant, self-hosted on my apartment server. Continuously running, handling ambient automation across my life — my "second brain." In active development; I use it daily.

(Detailed content for the T.A.R.S project page will be written in a later session; current repo context can be fetched from `~/Desktop/Codebase.nosync/T.A.R.S` when the project page is authored.)

### 3.3 Animated demos on project pages

Each project page carries a **scripted-loop animation** as its hero demo, built with Framer Motion.

- **AtlasDesk:** port the existing AI Resolution Copilot loop from AtlasDesk's landing page (see `marketing/components/` in the AtlasDesk repo). Beat structure: NL ticket text types in → fields populate → Copilot card slides in with "89% similar to #2341" → suggested fix renders → "Send reply" button clicks → ticket transitions to closed. ~14-second loop, autoplay on `client:visible`, respects `prefers-reduced-motion` (shows a static final-frame poster instead).
- **T.A.R.S:** original loop in a similar register but telling T.A.R.S's story. Suggested beat structure (designer to refine): ambient trigger arrives (calendar event, email, sensor ping) → T.A.R.S interprets via LLM → takes an action (sends a message, schedules a task, adjusts home state) → confirms to the user. Same technical constraints as AtlasDesk's loop: Framer Motion island, autoplay on visible, respects reduced-motion.

Both animations are *content*, not chrome — they show the product working, using real (or real-seeming) data. The design should make the animation the focal point of the project page above the fold.

### 3.2 Research-section content

Already written in the user's current site source — preserve verbatim from the data the user provided during brainstorm (two papers, years, venues, abstracts, keywords, PDF links).

## 4. Sitemap

```
/               Hub — hero + projects + research + experience + leadership + about-teaser + contact
/projects/atlasdesk   Project deep-dive — hero, problem, what it does, stack, architecture diagram, screenshots, outcome
/projects/tars        Project deep-dive — same template, written in a later session
/resume               Web resume + PDF download
/about                Longer bio + photo (small, B&W) + personal context
/                     404 falls back to hub
```

**No `/writing` in v1.** Astro + content collections makes adding it a config-level change; we'll turn it on in a Phase 2 once the portfolio is live and stable.

**No contact form.** Plain text links (mailto, LinkedIn, GitHub, X).

## 5. Stack

- **Framework:** Astro (per BRIEF recommendation).
  - Static output, ~5KB shipped JS on the hub.
  - MDX content collection for project deep-dives → write prose, embed interactive islands where they earn their weight.
  - View Transitions API for page-to-page motion.
- **React islands:** `@astrojs/react` integration, used only where interactive animation is required (i.e., the scripted demos on project pages). The hub does not ship React.
- **Animation:** **Framer Motion** (modern package: `motion` / `motion/react`), loaded only as a client-side island on project pages. Used for:
  - **AtlasDesk project page** — port the AI Resolution Copilot scripted loop already built for AtlasDesk's landing page (NL ticket creation → embedding retrieval → suggested fix → draft reply → ticket closed). This becomes the project-page hero demo.
  - **T.A.R.S project page** — original scripted loop in a similar structural register, showing ambient automation (a daily-life event arriving → T.A.R.S interprets → takes action).
  - **Hub page** — no Framer Motion. Any motion on the hub uses CSS transitions + View Transitions API only. This preserves the Lighthouse target.
- **Styling:** Tailwind CSS + CSS variables for theme tokens (light + dark). Dark mode required.
- **Deployment:** Vercel (static + edge). Domain: **`tsaifullah.com`** (already owned).
- **Source:** public GitHub repo from day one — transparency is itself a proof artifact. `README.md` includes a stack tour.
- **Analytics:** Vercel Web Analytics (minimal, no cookie banner needed). No heavy tracking.
- **Performance target:** Lighthouse 100/100/100/100 on the hub. Project pages may drop on LCP/TBT due to the Framer Motion island; target ≥ 90 across the board and optimize (lazy-load the island on `client:visible`, respect `prefers-reduced-motion`, pause animation when tab is backgrounded).

## 6. Brand direction — *exploration*, not decision

**We are not locking an aesthetic in this doc.** Claude Design will generate multiple aesthetic directions; the user will choose visually after seeing each rendered.

### 6.1 Rejected directions

- "Tier-1 safe pair" (Rauno Freiberg · Linear engineering) — user explicitly wanted **creative and different**.
- Illustrated/cartoon avatars (Notion-style) — generic, overused, clashes with "creative but subtle."

### 6.2 Mood axes Claude Design should explore

Claude Design should generate **three candidate directions**, each with its own palette, type pair, wordmark treatment, and a matching hub-page mockup. The three are chosen to span the viable creative space:

1. **Editorial / publication** — serif display type, asymmetric grid, calm density, quiet confidence. Mood reference: NYT Magazine meets Dropbox Design meets IEEE Spectrum. Reads as *"this person thinks like a designer and also writes research."*
2. **Technical / schematic** — precision-industrial, monospace accents, blueprint-like dividers, technical drawings as decoration. Mood reference: **oxide.computer**, Fly.io, SpaceX press kits. Reads as *"this person ships real systems; here are the schematics."*
3. **Physical / material (restrained)** — subtle depth, paper-like surfaces, soft shadows, deliberate weight. Mood reference: Muji-adjacent, Field Notes, Apple early-hardware. Reads as *"taste without try-hard."*

**Explicitly out of scope for exploration:** zine / brutalist / chaotic typography. Too risky for the FAANG secondary audience.

### 6.3 Deliverables per direction

For each of the three directions, Claude Design produces:

- 1 color palette (light + dark mode pairs)
- 1 type pair (display + body; at least one weight used distinctively)
- 1 wordmark treatment ("Tasin" — lowercase / mixed / wordmark with glyph)
- 2–3 monogram / mark options (for favicon + OG card use — *no illustrated avatars*)
- 1 hub-page mockup (hero + projects + research + experience + about-teaser + contact)
- 1 project-card treatment (the repeating unit — applied to AtlasDesk with real copy)

After the user picks one direction, Claude Design does a second pass:
- 1 project-page template (using AtlasDesk as the trial subject — hero, problem, what-it-does, architecture diagram placeholder, stack, outcome, gallery)
- 1 `/resume` layout
- 1 `/about` layout

## 7. Avatar / identity mark

**Strategy:** strong wordmark + monogram-led identity + small B&W photo **only on `/about`**. No illustrated avatars anywhere.

**Claude Design should explore** (within each of the 3 directions):

- Pure type wordmark (no accompanying mark)
- Wordmark + monogram glyph (T / ts / tsa — single letterform or bigram, custom)
- Wordmark + abstract identity symbol (only if the direction naturally supports it — e.g., a schematic glyph in direction #2)

User picks visually. Photo for `/about` is a separate asset the user will source/shoot later.

## 8. Tone & voice

Writing across the site is:

- **Declarative.** "I built X. It ships Y to Z users."
- **Specific.** Numbers, stack names, tradeoffs. Never adjectives where a number works.
- **Calm.** No exclamation marks. No hype. No "passionate" / "driven" / "rockstar." No emojis in body copy.
- **Tight.** If a sentence can lose a word without losing meaning, it loses it.
- **Honest about stage.** "In production at X" · "In active development" · "Prototype" — labels are explicit.

Good line: *"3000+ users. SAML SSO, mandatory OTP, argon2id. PostgreSQL and SQL Server in production."*
Bad line: *"Passionate full-stack developer with a drive to build scalable solutions."* ← never.

## 9. Open-source posture

- Portfolio repo **public from day one**.
- `README.md` includes: 60-second intro to the site, stack tour, how to run locally, a link to the live domain.
- The repo itself is evidence. Well-organized commits, clean branch history, small PRs — these read to engineers.
- Content (MDX project pages) is in the repo; no CMS.

## 10. Out of scope (v1)

- Blog / `/writing` section — deferred to Phase 2.
- Newsletter / RSS — deferred with blog.
- Analytics beyond Vercel Web Analytics.
- CMS. All content lives in-repo as MDX.
- Contact form. Plain mailto is fine.
- Illustrated avatars of any kind.
- i18n.
- Comments.

## 11. Session arc (weekend)

Mapped to the kickoff brief. Updated with decisions from this spec.

- **Saturday morning (brainstorm)** — ✅ complete. This doc is the output.
- **Saturday afternoon (brand in Claude Design, ~1h)** — paste `docs/claude-design-prompt.md` into Claude Design. Receive 3 brand directions. Iterate until one lands. "Send to Claude Code" → assets land in `public/brand/`.
- **Saturday evening (hub in Claude Design, ~1h)** — with locked brand, generate the hub page. Iterate. "Send to Claude Code."
- **Sunday morning (project-page template, ~45min)** — Claude Design generates the project-page template using AtlasDesk as trial subject. Also `/resume` and `/about` layouts in the same session.
- **Sunday afternoon (implementation, 3–4h)** — fresh Claude Code session. Scaffold Astro, wire content collection for projects, translate CD HTML → Astro components + MDX layouts, write AtlasDesk project-page content, stub T.A.R.S for later.
- **Sunday evening (ship)** — `pnpm build`, deploy to Vercel, point `tsaifullah.com` at the deployment, post the first public link.

## 12. Contact surface

- Email: (user-provided; not in this spec for privacy — pulled at implementation time)
- LinkedIn: (user-provided)
- GitHub: (user-provided)
- X: (user-provided, optional — include only if active)

These are plain text links in the contact section. No form.

## 13. Success criteria

The portfolio ships successfully when:

1. `tsaifullah.com` resolves to the hub page with Lighthouse ≥ 95 across all axes on the hub.
2. AtlasDesk deep-dive page exists and reads as a real case study (architecture, stack, outcome).
3. T.A.R.S card and stub page exist (even if the deep-dive is incomplete — labeled "in progress").
4. Resume is downloadable as PDF from `/resume`.
5. All research papers link out correctly.
6. Dark mode works and is the default on systems preferring it.
7. The repo is public, with a serious README.
8. The first LinkedIn post announcing the site is published.

## 14. Open questions (tracked, not blocking)

- **X handle:** include if active; omit if dormant.
- **Photo for /about:** user sources a B&W headshot before implementation or uses a placeholder.
- **Custom monogram glyph:** decided after Claude Design delivers direction options.
- **View Transitions:** wire in implementation phase if time; non-blocking.
- **Analytics opt-out:** Vercel Analytics is GDPR-friendly without cookie banner — confirm before enabling.
- **AtlasDesk Copilot loop port:** confirm the source component lives at `~/Desktop/Codebase.nosync/AtlasDesk/marketing/components/` (or wherever it lands post-S13) before Sunday's implementation — we'll lift it with minimal diffs, re-theming only.
- **T.A.R.S loop authoring:** the original animation script + the "what does T.A.R.S actually do" copy needs a mini-session before the loop is built — schedule separately.
