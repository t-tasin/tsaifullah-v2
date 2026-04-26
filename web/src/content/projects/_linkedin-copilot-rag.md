# LinkedIn post — AtlasDesk Resolution Copilot (RAG self-update)

Voice: first-person reflection on what I learned. Not advice. ~280 words.
Pair with the engineering-variant MP4 (~25s, dark+green palette).

---

I built a RAG copilot inside an enterprise IT helpdesk product I've been shipping over the past few months. The interesting engineering wasn't the LLM call — it was getting the search index to stay current without a nightly batch job.

Here's how it works.

When a tech opens a ticket, the system has already drafted a reply for them, citing past tickets and KB articles that solved similar issues. The retrieval runs against pgvector, embeddings are generated locally via BGE-small (no external API), and Gemini does the synthesis.

The fresh-corpus part is where I had to slow down and rethink. My first instinct was a nightly cron — embed everything that changed in the last 24 hours. It would have worked, but it would have meant the copilot's memory always lagged by a day. So I changed direction. Three triggers re-embed a ticket the moment its content meaningfully changes:

1. New ticket — embedded immediately after the row commits.
2. Edited title or description — re-embedded only if those specific fields changed. Status changes, assignment, scheduling — none of those move retrieval quality, so I stopped paying for them.
3. Public tech comment — re-embedded so resolutions flow into the corpus. Internal notes are filtered out (they're discussion, not knowledge). Replies from the original requester are also filtered out — that surprised me at first, but I realized the model wants to learn fixes, not confusion.

A few things I learned along the way:

→ Fire-and-forget is non-negotiable on the write path. The first version blocked the ticket-create response while the embedding ran. A 1.5s tail latency for nothing the user could see. Never again.
→ Sending less to the LLM than I thought I needed turned out to be the right call. Only titles and source handles leave the box. Descriptions, comment bodies, user PII — none of it goes to Gemini. The model cites handles, and the tech opens the ticket in the existing UI to read details. PII review with the customer's compliance team got a lot easier.


The code is part of a larger system I've been documenting on my portfolio. The full RAG architecture is animated there.

---

## Notes for posting

- Replace `[link]` placeholder with portfolio URL once it's live.
- Attach the engineering-variant MP4 (Phase E hand-off prompt). LinkedIn auto-plays MP4s muted on hover — works in feed.
- First sentence is the hook; the algorithm cuts at ~210 chars. Current draft cuts at "...index to stay current without a nightly batch job." → strong hook on its own.
- Don't reformat into emoji-bullets or "🚀 here's what I learned 👇" framing. Engineers see that and scroll past. Stay conversational.
- Tags I'd consider: #softwareengineering #rag #postgres #pgvector. Skip #ai #ml — too saturated, low signal.
