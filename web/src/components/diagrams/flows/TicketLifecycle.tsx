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
 * TicketLifecycle — single ticket from submit to resolved.
 *
 * Two lanes:
 *   FLOW   yPct=38   — 6 sequential stages (numbered) left→right
 *   SVC    yPct=72   — owning service for each stage, anchored below
 *
 * The fire-and-forget embed branch is shown above the FLOW lane so it doesn't
 * disrupt the linear timeline — branches off after CREATE, returns nowhere
 * (it's async).
 */
export default function TicketLifecycle() {
  // 6 flow stages: m4 + (w14 + g3) × 5 + w14 + m4 = 4 + 5*17 + 14 + 4 = 107 → too wide
  // Tighter: m4 | w13 g2 w13 g2 w14 g2 w13 g2 w13 g2 w14 | m4 = 4+13+2+13+2+14+2+13+2+13+2+14+4 = 98
  const FLOW = {
    submit:   10.5,  // 4 + 13/2
    inbound:  25.5,  // 10.5 + 13/2 + 2 + 13/2
    create:   40.5,  // 25.5 + 13/2 + 2 + 14/2
    assign:   55.5,  // 40.5 + 14/2 + 2 + 13/2
    resolve:  70.5,  // 55.5 + 13/2 + 2 + 13/2
    notify:   85.5,  // 70.5 + 13/2 + 2 + 14/2
  } as const;

  return (
    <DiagramFrame label="SYS.FLOW / TICKET LIFECYCLE" caption="ONE TICKET · END-TO-END">
      <SvgLayer>
        {/* Linear flow: stage→stage */}
        <Arrow id="t-1" from={{xPct:FLOW.submit  + 7, yPct:38}} to={{xPct:FLOW.inbound - 7, yPct:38}} curve={0} />
        <Arrow id="t-2" from={{xPct:FLOW.inbound + 7, yPct:38}} to={{xPct:FLOW.create  - 7, yPct:38}} curve={0} />
        <Arrow id="t-3" from={{xPct:FLOW.create  + 7, yPct:38}} to={{xPct:FLOW.assign  - 7, yPct:38}} curve={0} />
        <Arrow id="t-4" from={{xPct:FLOW.assign  + 7, yPct:38}} to={{xPct:FLOW.resolve - 7, yPct:38}} curve={0} />
        <Arrow id="t-5" from={{xPct:FLOW.resolve + 7, yPct:38}} to={{xPct:FLOW.notify  - 7, yPct:38}} curve={0} />

        {/* fire-and-forget embed branch (off CREATE, exits up) */}
        <Arrow id="t-embed" from={{xPct:FLOW.create, yPct:34}} to={{xPct:FLOW.create + 12, yPct:14}} curve={0.2} emphasis="highlight" />

        {/* USER kicks off: arrow from USER (svc lane) UP to SUBMIT (flow lane) */}
        <Arrow id="t-user-kick" from={{xPct:FLOW.submit, yPct:67}} to={{xPct:FLOW.submit, yPct:43}} curve={0} emphasis="highlight" />

        {/* Each subsequent stage handed DOWN to its owning service */}
        <Arrow id="t-o-inbound" from={{xPct:FLOW.inbound, yPct:43}} to={{xPct:FLOW.inbound, yPct:67}} curve={0} variant="dashed" />
        <Arrow id="t-o-create"  from={{xPct:FLOW.create,  yPct:43}} to={{xPct:FLOW.create,  yPct:67}} curve={0} variant="dashed" />
        <Arrow id="t-o-assign"  from={{xPct:FLOW.assign,  yPct:43}} to={{xPct:FLOW.assign,  yPct:67}} curve={0} variant="dashed" />
        <Arrow id="t-o-resolve" from={{xPct:FLOW.resolve, yPct:43}} to={{xPct:FLOW.resolve, yPct:67}} curve={0} variant="dashed" />
        <Arrow id="t-o-notify"  from={{xPct:FLOW.notify,  yPct:43}} to={{xPct:FLOW.notify,  yPct:67}} curve={0} variant="dashed" />

        {/* Pulses — sequential walk through pipeline */}
        <PulseDot pathId="t-1"     duration={1.0} begin={0}   />
        <PulseDot pathId="t-2"     duration={1.0} begin={1.0} />
        <PulseDot pathId="t-3"     duration={1.0} begin={2.0} />
        <PulseDot pathId="t-embed" duration={1.6} begin={2.5} />
        <PulseDot pathId="t-4"     duration={1.0} begin={3.4} />
        <PulseDot pathId="t-5"     duration={1.0} begin={4.4} />
      </SvgLayer>

      <Lane label="FLOW · STAGE" yPct={38} />
      <Lane label="OWNING SERVICE" yPct={72} />

      {/* FLOW stages */}
      <ServiceNode xPct={FLOW.submit}  yPct={38} label="SUBMIT"      sublabel="email | web form"      kind="client"   widthPct={13} />
      <ServiceNode xPct={FLOW.inbound} yPct={38} label="INBOUND"     sublabel="parse · shadow user"   widthPct={13} />
      <ServiceNode xPct={FLOW.create}  yPct={38} label="CREATE"      sublabel="row · escalation seed" widthPct={14} highlight />
      <ServiceNode xPct={FLOW.assign}  yPct={38} label="ASSIGN"      sublabel="role-based escalate"   widthPct={13} />
      <ServiceNode xPct={FLOW.resolve} yPct={38} label="RESOLVE"     sublabel="public tech comment"   widthPct={13} />
      <ServiceNode xPct={FLOW.notify}  yPct={38} label="NOTIFY"      sublabel="resolved email"        widthPct={14} />

      {/* Owning services */}
      <ServiceNode xPct={FLOW.submit}  yPct={72} label="USER"           kind="external" widthPct={11} />
      <ServiceNode xPct={FLOW.inbound} yPct={72} label="NOTIFICATION-SVC"             widthPct={17} />
      <ServiceNode xPct={FLOW.create}  yPct={72} label="TICKET-SVC"     widthPct={13} highlight />
      <ServiceNode xPct={FLOW.assign}  yPct={72} label="TICKET-SVC"     widthPct={13} />
      <ServiceNode xPct={FLOW.resolve} yPct={72} label="TICKET-SVC"     widthPct={13} />
      <ServiceNode xPct={FLOW.notify}  yPct={72} label="NOTIFICATION-SVC"             widthPct={17} />

      {/* Embed branch terminus */}
      <ServiceNode xPct={FLOW.create + 12} yPct={10} label="PGVECTOR" sublabel="async embed" kind="data" widthPct={14} highlight />

      <AnnotationPill xPct={FLOW.create + 6} yPct={22} text="FIRE-AND-FORGET · POSTGRES ONLY" tone="accent" />
      <AnnotationPill xPct={50} yPct={94} text="TICKET-SVC OWNS LIFECYCLE · NOTIFICATION-SVC OWNS TRANSPORT" tone="muted" />
    </DiagramFrame>
  );
}
