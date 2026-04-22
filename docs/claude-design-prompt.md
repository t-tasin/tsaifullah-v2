# Claude Design — Portfolio Brief for Tasin

> **How to use:** Paste this entire file into Claude Design as the opening message. Claude Design should respond by confirming the positioning, then begin Phase 1 (brand exploration — three directions).

---

## Who this is for

A hiring manager at an **early-stage startup or mid-size product company** (Linear, Vercel, Raycast, Figma tier). Secondary: **FAANG-tier** hiring managers evaluating infra/backend depth. They open the site, spend ~90 seconds, close the tab. The single sentence they should think on close:

> *"This person solves problems he's witnessed. Strong product instinct plus engineering chops, uses AI efficiently, and has shipped enterprise software with 3000+ real users and real enterprise auth."*

The site's job is to earn that thought.

---

## About Tasin (the subject)

- **Name on the site:** "Tasin" (lowercase-friendly for wordmark). Full legal name on research papers is K.M. Khalid Saifullah; portfolio uses the short form.
- **What he is:** generalist product engineer — strong product instinct + engineering chops + AI-leveraged workflow + research track record.
- **What he does that most candidates don't:** ships end-to-end enterprise software with real users, real auth, real auth complexity. He built AtlasDesk solo; it's in production.

---

## Proof artifacts (what the site must foreground)

These numbers and names are the currency. Do not hide them behind adjectives.

### Project 1 — AtlasDesk (headliner)

Production ITSM platform for higher-ed / mid-market institutions. Live at **Wooster College, 3000+ users**.

- **Stack:** NestJS microservices (identity, ticket, asset, reservation, notification) · Next.js app · PostgreSQL + SQL Server 2022 (dual-DB) · Prisma · Docker
- **Enterprise auth:** SAML SSO with Microsoft Entra ID, JIT provisioning, nightly Graph delta sync, password + mandatory OTP (argon2id), refresh-token rotation with breach detection, 90-day absolute re-auth ceiling
- **No-code permission matrix:** hierarchy tiers, multi-role union semantics (max hierarchy, OR booleans, most-permissive scope), wildcard grants, runtime-editable status machines per category
- **AI Resolution Copilot:** pgvector + transformers.js BGE-small local embeddings + Gemini 2.5 Flash, RAG over past tickets, provider-agnostic LLM abstraction
- **Email pipeline:** Microsoft Graph polling for inbound, Message-ID / In-Reply-To header threading, delta-link persistence, shadow-user creation for external reporters, auto-reply loop prevention
- **Cross-database correctness:** application-layer `SELECT ... FOR UPDATE` + validation triggers, works on both Postgres and SQL Server
- **Status:** in production. Multi-tenant SaaS tier (`atlasdesk.app`) shipping next.

Candidate "proof chips" for the project card (designer picks wording/layout):
`3000+ users` · `production at Wooster` · `SAML + OTP + argon2id` · `pgvector RAG` · `solo build`

### Project 2 — T.A.R.S

Personal AI assistant, self-hosted on Tasin's apartment server. Continuously running. Handles ambient automation across his life — his "second brain." In active development; used daily.

(Detailed content is being authored separately — treat this card as a shorter companion to the AtlasDesk card.)

### Research (compact section, not cards)

1. **Multi-Agent Coordination in Autonomous Vehicle Routing: A Simulation-Based Study** — 2025, under review. Author: KM Khalid Saifullah. Keywords: Autonomous Vehicles, Multi-Agent Systems, V2V Communication, Dynamic Rerouting. Link: `/documents/ksaifullah_multiAgent.pdf`.
2. **Sentiment Analysis in Software Engineering: Evaluating Generative Pre-trained Transformers** — NCUR 2024, published. Benchmarks GPT-4o-mini vs BERT on GitHub / Stack Overflow / Jira. Link: `https://arxiv.org/pdf/2505.14692`.

### Experience

Internships (sourced from resume — use the resume PDF as reference, one line each on the hub, full detail on `/resume`).

### Leadership (one line each, understated)

- **Google Developer Student Club** — Co-Lead, The College of Wooster, 2023–2025. Led workshops + hackathons for 100+ student developers.
- **Stanford TreeHacks 2024** — Participant, 36-hour hackathon.
- **Residential Assistant** — The College of Wooster, 2022–2024. Mentored 50+ residents.

---

## Sitemap

- **`/`** — hub. Hero · Projects (grid, 2 cards) · Research · Experience · Leadership · About teaser · Contact.
- **`/projects/atlasdesk`** — dedicated deep-dive page. Hero, problem, what it does, architecture, stack, outcome, gallery.
- **`/projects/tars`** — same template, shorter content for now.
- **`/resume`** — web view + PDF download.
- **`/about`** — longer bio, small B&W photo, personal context.

Single-domain, no subdomains. Hosted at **`tsaifullah.com`**.

---

## Hard design constraints

1. **Dark mode required.** It is the default on systems preferring dark; light mode is a first-class peer, not an afterthought.
2. **No illustrated avatars.** No Notion-style cartoon portraits. No Memoji. The user has explicitly ruled this out.
3. **No generic-dev-portfolio aesthetic.** No neon-gradient hero. No "Hi, I'm X 👋". No emojis in body copy. No unnecessary 3D.
4. **No Rauno Freiberg / Linear pastiche.** Those are references the user has already considered and ruled out. Please land somewhere genuinely different.
5. **Creative but subtle.** The site should read as *designed*, but never *designy-for-its-own-sake*. A FAANG hiring manager must be able to take it seriously.
6. **The proof artifacts are the decoration.** Stack names, user counts, architectural choices — these are the content that makes the page feel designed. Not stock illustrations. Not abstract shapes. If the page is visually empty without them, you're doing it right.
7. **Typography-led over image-led.** The user will not have high-production photography or 3D renders ready. The design must earn its weight from type, layout, and motion — not from imagery.
8. **Lighthouse ≥ 95 achievable.** The design should be implementable as static HTML/CSS with minimal JS. No heavy motion libraries on the hub.

---

## Phase 1 — Brand exploration (generate three directions)

Produce **three candidate aesthetic directions**. Each is a complete proposal the user can visually choose between. They should feel genuinely different from each other — don't just re-skin the same layout.

### Direction A — Editorial / publication

Mood: NYT Magazine meets Dropbox Design meets IEEE Spectrum. Serif display type, asymmetric grid, calm density, quiet confidence. A real human wrote and cared about the layout. Reads as *"this person thinks like a designer and also writes research."*

### Direction B — Technical / schematic

Mood: **oxide.computer** · Fly.io · SpaceX press kits. Precision-industrial. Monospace accents, blueprint-like dividers, technical drawings as decoration, schematic glyphs. Reads as *"this person ships real systems. Here are the schematics."* Given Tasin's proof artifacts are *architectural* (microservices, dual-DB, pgvector, SAML pipelines), this direction may be the strongest natural fit — but let the render make the case.

### Direction C — Physical / material (restrained)

Mood: Muji-adjacent · Field Notes notebooks · Apple early-hardware pages. Subtle depth, paper-like surfaces, soft shadows, deliberate weight. Reads as *"taste without try-hard."* Restraint is the aesthetic. Avoid skeuomorphism — we want *material sensitivity*, not *fake leather*.

**Explicitly not allowed for Phase 1:** zine / brutalist / chaotic-typography direction. Too risky for the FAANG secondary audience.

### For each direction, deliver

1. **Palette** — full ramp for light + dark mode. Primary, secondary, accent, neutrals, semantic (success/warning/error).
2. **Type pair** — display (hero + section headings) and body (paragraph + captions + monospace if the direction uses it). Include a specimen showing a full hero line + a paragraph + an inline-code snippet.
3. **Wordmark treatment for "Tasin"** — propose 2 cuts per direction (e.g., one all-lowercase, one cased; or one with a glyph, one without). Real type, not a single decorative flourish.
4. **Monogram / identity mark options** — 2–3 per direction. `T`, `ts`, or `tsa` as single / bigram / trigram letterforms. Also permissible: one abstract schematic glyph (especially in Direction B). **No illustrated avatars.** These marks must work at favicon scale (16–32px) and OG-card scale (1200×630).
5. **Hub-page mockup** — full render of `/`, using real copy from the "Proof artifacts" section above. Hero, both project cards, research, experience, leadership, about teaser, contact. Include both light and dark mode.
6. **Project-card treatment** — pulled from the hub but shown in isolation so the repeating unit is clear. Apply AtlasDesk copy verbatim; the card must accommodate the long technical proof chips without feeling cramped.

After all three directions are presented, the user will pick **one direction** (which may include choosing specific wordmark + monogram combinations from within that direction). Phase 2 begins after the pick.

---

## Phase 2 — Locked direction, full screens

After the user locks a direction, produce:

1. **Project-page template** — using AtlasDesk as the trial subject. Sections, in order:
   - **Hero** with an **animated demo slot** as the focal point (see "Animated demos" below). Above or beside the demo: project title, one-sentence pitch, and a meta row (role, stack chips, status, users, external link).
   - **Problem** — one short paragraph.
   - **What it does** — feature list with proof-chip treatment; each feature gets a stack chip cluster (e.g., "SAML SSO · Entra · JIT · argon2id").
   - **Architecture** — a dedicated band. Diagram placeholder (16:9) labeled "replace with real diagram" + spec callouts around it. In Direction B (Technical / schematic), this band is a natural home for schematic dividers.
   - **Stack deep-dive** — grouped by layer (identity / data / app / AI / ops). Real stack names only; no logos soup.
   - **Outcome** — numbers. "3000+ users · N tickets resolved · N assets tracked."
   - **Gallery** — 3–5 screenshot placeholders (16:9).
2. **Animated demos for project pages** (the interactive heart of the site):
   - **AtlasDesk demo — AI Resolution Copilot scripted loop.** Beat structure: user types a natural-language ticket ("laptop won't connect to campus wifi after update") → ticket fields auto-populate (~3s) → Copilot card slides in: "89% similar to #2341 — fix: reinstall MDM profile. Draft ready." → technician clicks "Send reply" → user's reply arrives ("that worked, thanks") → ticket auto-closes. End frame: "45 min → 14 seconds." Total loop: ~14s, autoplay on visible, respects `prefers-reduced-motion`. This animation already exists in the AtlasDesk marketing repo — Claude Design should match its layout and pacing while re-theming for whichever aesthetic direction was locked.
   - **T.A.R.S demo — ambient-automation scripted loop.** Original animation in a similar structural register. Suggested beat structure (designer may refine): ambient trigger arrives (e.g., "3:45 PM · calendar: meeting with advisor") → T.A.R.S card interprets: "Drafting prep notes based on last email thread" → action panel fills with a bullet list of prep points → side panel confirms: "Sent to Things. 2 tabs opened. Lights set to focus." End frame: "Second brain, always on." Similar ~14s loop. Final copy to be finalized in a later session; design the demo container so it can accept the final script without layout rework.
   - Both demos should be designed as **self-contained panels** that dominate the project-page hero — the layout around them should be quiet so the animation is unambiguously the focal point.
   - Deliver both demos as **scene-by-scene storyboards** in Phase 2 output: 5–8 frames per loop, with motion cues labeled (enter, pause, exit, timing). Claude Code will port them to Framer Motion in implementation.
3. **`/resume` layout** — web-readable resume view + prominent "Download PDF" CTA. Scannable typography; no timeline gimmick.
4. **`/about` layout** — 2–3 paragraphs of longer-form writing, single small B&W photo slot, optional "currently / previously" list. Warm but restrained.

### Motion budget — hard rules

- **Hub page:** no heavy animation. CSS transitions and the browser's View Transitions API only. The hub must hit Lighthouse ≥ 95 across all axes.
- **Project pages:** Framer Motion is loaded as a lazy client-side island, allowed only on the demo panel. The rest of the project page is static with CSS-only subtle motion.
- All animations respect `prefers-reduced-motion: reduce` — fall back to a static poster frame of the final state.
- No parallax on hero. No scroll-jacking anywhere.

---

## Tone of voice (for any copy you generate)

The user has written his own proof-artifact copy (above) — preserve it verbatim when it appears on screens. For any copy you need to generate (section headings, microcopy, captions), match this register:

- **Declarative.** "I built X. It ships Y to Z users."
- **Specific.** Numbers and stack names beat adjectives.
- **Calm.** No exclamation marks. No "passionate" / "driven" / "rockstar." No emojis in body copy.
- **Tight.** Cut any word that doesn't earn its place.
- **Honest about stage.** "In production at X" / "In active development" / "Prototype."

A good line: *"3000+ users. SAML SSO, mandatory OTP, argon2id. PostgreSQL and SQL Server in production."*
A banned line: *"Passionate full-stack developer building scalable solutions."*

---

## Handoff (back to Claude Code)

When each phase is approved, use Claude Design's "Send to Claude Code" to export HTML + CSS + assets. Target destinations:

- Brand assets → `public/brand/`
- Hub page HTML → translated by Claude Code into Astro components
- Project-page template HTML → translated into an Astro MDX layout
- `/resume` + `/about` → Astro pages

Implementation stack: **Astro + Tailwind CSS + MDX content collections, with React islands via `@astrojs/react` for the Framer Motion demos on project pages. Deployed on Vercel.** Keep generated CSS implementable in Tailwind where feasible; custom CSS is fine where it earns distinctiveness. The project-page demo panels should be designed so they can be rebuilt as Framer Motion components — prefer animation descriptions that map cleanly to `motion.div` with `animate` / `variants` / `AnimatePresence`, not bespoke SVG morph timings.

---

## Start here

Please confirm you've internalized the positioning and the hard constraints, then begin **Phase 1 — three brand directions**. Present all three before the user picks one.
