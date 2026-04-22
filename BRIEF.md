# Tasin's Portfolio Website — Kickoff Brief

> **Status:** Scheduled for the weekend of 2026-04-18/19 (or whenever you start it).
> **Origin:** Discussed and scoped during AtlasDesk brand work, 2026-04-17.
> **Move this file** into the new portfolio repo as `BRIEF.md` (or similar) when you create it. That makes it the source of truth for that project.

---

## Why this exists

You're building AtlasDesk to use as a portfolio / hiring artifact. Hiring managers will see your portfolio website FIRST, before they ever click through to atlasdesk.app. Your portfolio site needs to clear the same craft bar AtlasDesk does — anything less and the polished product reads as a fluke.

This brief is the kickoff plan for redesigning your personal portfolio from scratch using **Claude Design + Claude Code** in tandem. Target: 1–2 days of focused weekend work.

---

## Pre-session homework (15 min, before opening Claude)

Have these answers in your head BEFORE the kickoff session — they're the inputs that drive every other decision:

1. **Audience exact:** "Hiring managers at [what kind of companies]?" — early-stage startups? Mid-size product companies (Linear, Vercel)? FAANG-tier infra? Each implies a different visual register.
2. **One-sentence walkaway:** what single sentence do you want a visitor to leave with? ("This person can ship complex backends" / "This person designs and builds end-to-end" / etc.) Not a tagline — what they should *think* after closing the tab.
3. **Project list (3–5):** which projects represent you best? AtlasDesk is one. What else? For each: one-sentence pitch, what tech, what role, what outcome.
4. **Tone reference:** pick 2–3 personal sites whose vibe you want to land near. Examples to evaluate (don't have to pick from these):
   - Lee Robinson (warm, technical, blog-forward) — leerob.io
   - Rauno Freiberg (abstract, designed, motion-rich) — rauno.me
   - Linear engineering blog (polished, product-y, restrained) — linear.app/blog
   - Cassidy Williams (personable, content-heavy) — cassidoo.co
   - Brian Lovin (typography-led, calm) — brianlovin.com
5. **Constraints:** single page or hub + project pages? Dark mode required? Blog/newsletter? RSS? Open-source the source?

---

## The session arc (1-2 day weekend)

### Saturday morning — Brainstorm + brief (this chat or a fresh one)

Open Claude Code in the new portfolio directory. Paste this brief. Walk through the 5 homework answers. We resolve:
- Brand brief (1 page)
- Sitemap (single page vs. hub + project pages vs. blog)
- Stack pick (recommended: **Astro** — see below)
- Content inventory (every piece of text that needs to exist)

**Output:** `docs/brand-brief.md` + `docs/sitemap.md` + `docs/content-inventory.md`

### Saturday afternoon — Brand assets in Claude Design (~1 hr)

Open Claude Design. Generate a brand identity for the portfolio (separate from AtlasDesk's Meridian — this is YOUR brand, not a product's):
- Personal mark or wordmark (probably wordmark-led for a personal site)
- 1 palette + 1 type pair
- Treatment for "the project card" — the unit that will appear repeatedly

Iterate until you'd ship it. "Send to Claude Code" → assets land in `public/brand/`.

### Saturday evening — Hub page in Claude Design (~1 hr)

Single most-important screen. Hero + project list + "about" + contact. Pre-load CD with the brand assets you just locked. Iterate. "Send to Claude Code."

### Sunday morning — Project page template (~45 min)

Design ONE project page template (use AtlasDesk as the trial subject — you have screenshots and architecture artifacts ready). This template gets instantiated for every project.

### Sunday afternoon — Implementation (~3-4 hr)

Fresh Claude Code session in the portfolio repo:
1. Scaffold Astro project
2. Set up content collection for projects (MDX)
3. Translate Claude Design hub HTML → Astro components
4. Translate Claude Design project page HTML → MDX layout
5. Write AtlasDesk project page as the first content
6. Write 1-paragraph stubs for the other 2-4 projects (fill in later)

### Sunday evening — Ship

- `pnpm build`
- Deploy to Vercel (Astro deploys cleanly there)
- Custom domain (do you own `tasin.dev`? `tasin.io`? Buy if not)
- Post first public link

---

## Stack recommendation

**Astro.** Reasons:
- Static, fast (~5KB JS shipped). Lighthouse 100s by default.
- MDX for project writeups — write content like prose, embed React/Svelte islands when you need interactivity.
- Trivial to deploy on Vercel.
- Far better fit than Next.js for a content-led personal site. Next.js shines for apps; Astro shines for sites.
- Easy to evolve later: add a blog, add an RSS feed, add view-transitions animations — all built-in.

Skip Astro only if you have a strong reason to use something else (e.g., you want to build an interactive demo into the portfolio that needs Next.js's RSC).

## What this is NOT

- **Not** a redesign of AtlasDesk's app or marketing site. Those have their own brand (Meridian) and live in the AtlasDesk repo.
- **Not** a CMS-backed site. MDX in the repo is fine. You're not blogging at scale.
- **Not** a chance to ship a SaaS — you're shipping a calling card. Resist the urge to over-engineer.

## When to break out of this plan

- If during Saturday morning the brand brief reveals you actually want a *blog-first* site (not a portfolio-first one), stop and re-plan. The structure is different.
- If Claude Design's first hub-page output feels generic, push back hard and iterate before moving on. The hub page sets the bar for everything else.
- If implementation drags into Monday, ship what you have. Done > perfect for a personal site.

---

## When you're ready

Paste this brief into a fresh Claude Code session opened in the new portfolio directory. Say "let's start the portfolio kickoff." The session uses this document as the source of truth.

If you want a parallel brainstorm before then (e.g., to lock the audience + walkaway sentence), reply in the AtlasDesk session — we can do that prep without leaving the AtlasDesk context.
