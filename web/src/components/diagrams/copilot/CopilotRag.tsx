import React from "react";
import {
  DiagramFrame,
  Lane,
  ServiceNode,
  Arrow,
  SvgLayer,
  PulseDot,
  AnnotationPill,
} from "../primitives";

/**
 * CopilotRag — read + write paths share one pgvector store at center.
 *
 * Lane y-coords: WRITE 24 / STORE 52 / READ 80.
 * SvgLayer placed FIRST so pulse dots render behind node boxes.
 */
export default function CopilotRag() {
  // WRITE row: 4 triggers + EMBED. Layout: m5 | w14 g3 w18 g3 w16 g3 w14 g3 w12 | m5 = 99
  const TRIG = {
    create:  12,    // 5 + 14/2
    edit:    31,    // 12 + 14/2 + 3 + 18/2
    comment: 51,    // 31 + 18/2 + 3 + 16/2
    bump:    69,    // 51 + 16/2 + 3 + 14/2
  } as const;
  const EMBED_X = 86; // 69 + 14/2 + 4 + 12/2

  // READ row: 5 stages, layout: m4 | w20 g3 w13 g3 w14 g3 w13 g3 w14 | m4 = 93
  const READ = {
    open:  14,    // 4 + 20/2
    embed: 34,    // 14 + 20/2 + 3 + 13/2
    topk:  50.5,  // 34 + 13/2 + 3 + 14/2
    rrf:   67,    // 50.5 + 14/2 + 3 + 13/2
    synth: 83.5,  // 67 + 13/2 + 3 + 14/2
  } as const;

  return (
    <DiagramFrame label="SYS.COPILOT / RAG" caption="BGE-SMALL · PGVECTOR · GEMINI">
      <SvgLayer>
        {/* WRITE fan-in: each trigger → EMBED */}
        <Arrow id="w-fan-1" from={{xPct:TRIG.create  + 7, yPct:24}} to={{xPct:EMBED_X - 6, yPct:24}} curve={-0.04} variant="dashed" emphasis="dim" arrowhead={false} />
        <Arrow id="w-fan-2" from={{xPct:TRIG.edit    + 7.5, yPct:24}} to={{xPct:EMBED_X - 6, yPct:24}} curve={-0.03} variant="dashed" emphasis="dim" arrowhead={false} />
        <Arrow id="w-fan-3" from={{xPct:TRIG.comment + 8, yPct:24}} to={{xPct:EMBED_X - 6, yPct:24}} curve={-0.02} variant="dashed" emphasis="dim" arrowhead={false} />
        <Arrow id="w-fan-4" from={{xPct:TRIG.bump    + 7, yPct:24}} to={{xPct:EMBED_X - 6, yPct:24}} curve={-0.01} variant="dashed" emphasis="dim" arrowhead={false} />

        {/* EMBED → PGVECTOR (terminate at top edge of pgvector node) */}
        <Arrow id="w-store" from={{xPct:EMBED_X - 4, yPct:30}} to={{xPct:60, yPct:48}} curve={0.12} emphasis="highlight" />

        {/* READ pipeline */}
        <Arrow id="rag-r-1" from={{xPct:READ.open  + 8, yPct:80}} to={{xPct:READ.embed - 6.5, yPct:80}} curve={0} />
        <Arrow id="rag-r-2" from={{xPct:READ.embed + 6.5, yPct:80}} to={{xPct:READ.topk  - 7, yPct:80}} curve={0} />
        <Arrow id="rag-r-3" from={{xPct:READ.topk  + 7, yPct:80}} to={{xPct:READ.rrf   - 6.5, yPct:80}} curve={0} />
        <Arrow id="rag-r-4" from={{xPct:READ.rrf   + 6.5, yPct:80}} to={{xPct:READ.synth - 7, yPct:80}} curve={0} />

        {/* TOPK ↔ PGVECTOR detour (terminate at pgvector bottom edge yPct=56) */}
        <Arrow id="rag-r-fetch" from={{xPct:READ.topk - 3, yPct:74}} to={{xPct:46, yPct:56}} curve={-0.1} emphasis="highlight" arrowhead={false} />
        <Arrow id="rag-r-back"  from={{xPct:54, yPct:56}} to={{xPct:READ.topk + 3, yPct:74}} curve={-0.1} emphasis="highlight" />

        {/* GEMINI SYNTH → response back to tech (the loop closes) */}
        <Arrow id="rag-r-response" from={{xPct:READ.synth, yPct:86}} to={{xPct:READ.open, yPct:86}} curve={-0.12} emphasis="highlight" />

        {/* WRITE pulses */}
        <PulseDot pathId="w-fan-1" duration={2.4} begin={0}   />
        <PulseDot pathId="w-fan-2" duration={2.4} begin={0.3} />
        <PulseDot pathId="w-fan-3" duration={2.4} begin={0.6} />
        <PulseDot pathId="w-fan-4" duration={2.4} begin={0.9} />
        <PulseDot pathId="w-store" duration={1.8} begin={2.0} />

        {/* READ pulses — chained */}
        <PulseDot pathId="rag-r-1"        duration={1.0} begin={3.5} />
        <PulseDot pathId="rag-r-2"        duration={1.0} begin={4.2} />
        <PulseDot pathId="rag-r-fetch"    duration={1.2} begin={5.0} />
        <PulseDot pathId="rag-r-back"     duration={1.2} begin={6.2} />
        <PulseDot pathId="rag-r-3"        duration={1.0} begin={7.4} />
        <PulseDot pathId="rag-r-4"        duration={1.0} begin={8.0} />
        <PulseDot pathId="rag-r-response" duration={1.4} begin={9.0} />
      </SvgLayer>

      <Lane label="WRITE · SELF-UPDATE" yPct={24} />
      <Lane label="STORE" yPct={52} guide={false} />
      <Lane label="READ · ON DEMAND" yPct={80} />

      {/* WRITE TRIGGERS */}
      <ServiceNode xPct={TRIG.create}  yPct={24} label="TICKET CREATE"     sublabel="every new row"            widthPct={14} />
      <ServiceNode xPct={TRIG.edit}    yPct={24} label="TITLE / DESC EDIT" sublabel="other edits ignored"      widthPct={18} />
      <ServiceNode xPct={TRIG.comment} yPct={24} label="PUBLIC COMMENT"    sublabel="no internal · no requester" widthPct={16} />
      <ServiceNode xPct={TRIG.bump}    yPct={24} label="MODEL BUMP"        sublabel="batch backfill"           widthPct={14} />
      <ServiceNode xPct={EMBED_X}      yPct={24} label="EMBED"             sublabel="bge-small · 384-d"        widthPct={12} highlight />

      {/* STORE */}
      <ServiceNode xPct={50} yPct={52} label="PGVECTOR" sublabel="ticket + kb · ivfflat" kind="data" widthPct={20} highlight />

      {/* READ PIPELINE */}
      <ServiceNode xPct={READ.open}  yPct={80} label="TECH OPENS TICKET" sublabel="GET /resolution-suggestions" kind="client" widthPct={20} />
      <ServiceNode xPct={READ.embed} yPct={80} label="EMBED QUERY"        sublabel="same model"                  widthPct={13} />
      <ServiceNode xPct={READ.topk}  yPct={80} label="TOPK · 5 + 3"       sublabel="ticket + kb pools"           widthPct={14} />
      <ServiceNode xPct={READ.rrf}   yPct={80} label="RRF FUSE"           sublabel="k=60 · top 3"                widthPct={13} highlight />
      <ServiceNode xPct={READ.synth} yPct={80} label="GEMINI SYNTH"       sublabel="titles + handles only"       kind="external" widthPct={14} />

      <AnnotationPill xPct={50} yPct={13} text="FIRE-AND-FORGET · NEVER BLOCKS WRITES" tone="accent" />
      <AnnotationPill xPct={50} yPct={66} text="CACHE KEY · TICKETID + MUTATIONKEY"    tone="muted" />
      <AnnotationPill xPct={50} yPct={94} text="DRAFT REPLY · CITES [t-2341] [kb-outlook-mac-auth] · STREAMED BACK TO TECH" tone="accent"  />
      <AnnotationPill xPct={READ.synth} yPct={70} text="NO PII · TITLES + HANDLES ONLY" tone="warn" />
    </DiagramFrame>
  );
}
