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
 * MasterArchitecture — system overview for AtlasDesk.
 *
 * Lane y-coords: EDGE 22 / SERVICES 50 / DATA 82.
 * Service row widths chosen so the longest label ("RESERVATION", "NOTIFICATION")
 * fits in nowrap. Centers computed from left margin 6 + cumulative width + gaps.
 *
 * SVG layer ordered FIRST in JSX so pulse dots render behind nodes (so a dot
 * traveling into a service box visually "enters" rather than overlays text).
 */
export default function MasterArchitecture() {
  // 6 services. Widths picked so labels fit nowrap (RESERVATION needs ≥14, NOTIFICATION ≥15).
  // Layout: margin 5 | w12 g3 w12 g3 w11 g3 w14 g3 w15 g3 w9 | margin 5 = 100
  const SVC = {
    identity:     11,    // 5 + 12/2
    ticket:       26,    // 11 + 12/2 + 3 + 12/2
    asset:        40.5,  // 26 + 12/2 + 3 + 11/2
    reservation:  56,    // 40.5 + 11/2 + 3 + 14/2
    notification: 73.5,  // 56 + 14/2 + 3 + 15/2
    appt:         89.5,  // 73.5 + 15/2 + 3 + 9/2
  } as const;

  return (
    <DiagramFrame label="SYS.ARCHITECTURE" caption="WOOSTER · ATLASDESK.APP">
      {/* Arrows + pulses FIRST so they render behind nodes */}
      <SvgLayer>
        {/* EDGE → SERVICES (land at top edge of services row, yPct≈43) */}
        <Arrow id="a-web-id"     from={{xPct:48, yPct:26}} to={{xPct:13, yPct:43}} curve={-0.06} />
        <Arrow id="a-web-ticket" from={{xPct:50, yPct:27}} to={{xPct:26, yPct:43}} curve={0} />

        {/* inter-service curves bow ABOVE row, terminate at side edges */}
        {/* reservation→asset (single writer) — bow up high, land on asset right edge */}
        <Arrow id="a-res-asset"    from={{xPct:50, yPct:46}} to={{xPct:46, yPct:46}} curve={-0.6} />
        {/* ticket→notification publish — bow up over the row */}
        <Arrow id="a-ticket-notif" from={{xPct:32, yPct:43}} to={{xPct:67, yPct:43}} curve={-0.32} />

        {/* SERVICES → POSTGRES (land at top edge yPct≈77) */}
        <Arrow id="a-id-pg"     from={{xPct:11, yPct:57}} to={{xPct:18, yPct:77}} curve={0.04} />
        <Arrow id="a-ticket-pg" from={{xPct:26, yPct:57}} to={{xPct:21, yPct:77}} curve={-0.04} />
        <Arrow id="a-asset-pg"  from={{xPct:39, yPct:57}} to={{xPct:25, yPct:77}} curve={-0.08} />

        {/* SERVICES → SQL SERVER (dim dashed, spread arrival points) */}
        <Arrow id="a-id-mssql"     from={{xPct:13, yPct:57}} to={{xPct:42, yPct:77}} curve={0.16} variant="dashed" emphasis="dim" />
        <Arrow id="a-ticket-mssql" from={{xPct:27, yPct:57}} to={{xPct:46, yPct:77}} curve={0.1}  variant="dashed" emphasis="dim" />
        <Arrow id="a-asset-mssql"  from={{xPct:40, yPct:57}} to={{xPct:50, yPct:77}} curve={0.06} variant="dashed" emphasis="dim" />
        <Arrow id="a-res-mssql"    from={{xPct:56, yPct:57}} to={{xPct:54, yPct:77}} curve={0}    variant="dashed" emphasis="dim" />
        <Arrow id="a-notif-mssql"  from={{xPct:73, yPct:57}} to={{xPct:58, yPct:77}} curve={-0.06} variant="dashed" emphasis="dim" />

        {/* ticket → pgvector (postgres-only highlight) */}
        <Arrow id="a-ticket-pgvec" from={{xPct:28, yPct:57}} to={{xPct:80, yPct:77}} curve={0.18} emphasis="highlight" />

        {/* Pulse traffic */}
        <PulseDot pathId="a-web-id"        duration={2.4} begin={0}    />
        <PulseDot pathId="a-web-ticket"    duration={2.4} begin={0.4}  />
        <PulseDot pathId="a-ticket-pg"     duration={2.0} begin={1.2}  />
        <PulseDot pathId="a-ticket-pgvec"  duration={2.8} begin={1.5}  />
        <PulseDot pathId="a-ticket-notif"  duration={2.4} begin={1.8}  />
        <PulseDot pathId="a-res-asset"     duration={1.8} begin={3.2}  />
      </SvgLayer>

      {/* Lanes */}
      <Lane label="EDGE" yPct={22} />
      <Lane label="SERVICES" yPct={50} />
      <Lane label="DATA" yPct={82} />

      {/* EDGE */}
      <ServiceNode xPct={50} yPct={22} label="WEB" sublabel="Next.js 15" kind="client" widthPct={11} />

      {/* SERVICES */}
      <ServiceNode xPct={SVC.identity}     yPct={50} label="IDENTITY"     sublabel="auth · matrix · entra" widthPct={12} />
      <ServiceNode xPct={SVC.ticket}       yPct={50} label="TICKET"       sublabel="lifecycle · copilot"   widthPct={12} highlight />
      <ServiceNode xPct={SVC.asset}        yPct={50} label="ASSET"        sublabel="single-writer status"  widthPct={11} />
      <ServiceNode xPct={SVC.reservation}  yPct={50} label="RESERVATION"  sublabel="cart · approvals"      widthPct={14} />
      <ServiceNode xPct={SVC.notification} yPct={50} label="NOTIFICATION" sublabel="graph · ses · smtp"    widthPct={15} />
      <ServiceNode xPct={SVC.appt}         yPct={50} label="APPT"         sublabel="calendar"              widthPct={9}  />

      {/* DATA */}
      <ServiceNode xPct={21} yPct={82} label="POSTGRES"        sublabel="atlasdesk.app"   kind="data" widthPct={16} />
      <ServiceNode xPct={49} yPct={82} label="SQL SERVER 2022" sublabel="wooster on-prem" kind="data" widthPct={20} />
      <ServiceNode xPct={80} yPct={82} label="PGVECTOR"        sublabel="copilot only"    kind="data" widthPct={14} highlight />

      {/* Annotation pills — positioned to not collide with nodes */}
      <AnnotationPill xPct={30} yPct={32}  text="MATRIX AUTHZ · NO @ROLES" tone="accent" />
      <AnnotationPill xPct={43} yPct={40}  text="HTTP · SELECT FOR UPDATE" tone="accent" />
      <AnnotationPill xPct={66} yPct={40}  text="SINGLE EMAIL TRANSPORT"   tone="accent" />
      <AnnotationPill xPct={68} yPct={72}  text="POSTGRES ONLY · GATED"    tone="warn" />
      <AnnotationPill xPct={50} yPct={96}  text="SAME IMAGE · DB_PROVIDER BUILD ARG · BRANCH = WOOSTER-MAIN | MAIN" tone="muted" />
    </DiagramFrame>
  );
}
