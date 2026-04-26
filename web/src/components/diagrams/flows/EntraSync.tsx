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
 * EntraSync — nightly Entra → identity-svc reconciliation.
 *
 * Single horizontal flow:
 *   CRON → identity-svc → Microsoft Graph → diff → User table writes (3
 *   variants: ADD / UPDATE / DEACTIVATE) → audit log.
 *
 * The diff fan-out is shown as 3 parallel arrows from the diff node → the
 * three User-table outcomes, then converging into a single audit-log node.
 */
export default function EntraSync() {
  // Flow row: m4 | w12 g3 w16 g3 w15 g3 w12 + (fan-out) + g3 w13 | m4 = 81 + fan-region
  // Use 5 main stages on yPct=38, with fan-out variants on yPct=22 / 50 / 65.
  const FLOW = {
    cron:    10,    // 4 + 12/2
    identity: 25,   // 10 + 12/2 + 3 + 16/2
    graph:    44,   // 25 + 16/2 + 3 + 15/2
    diff:     61,   // 44 + 15/2 + 3 + 12/2
  } as const;
  const WRITE_X = 78;
  const AUDIT_X = 92;

  return (
    <DiagramFrame label="SYS.FLOW / ENTRA SYNC" caption="NIGHTLY · 02:00 · DELTA QUERY">
      <SvgLayer>
        <Arrow id="e-1" from={{xPct:FLOW.cron     + 6, yPct:38}} to={{xPct:FLOW.identity - 8, yPct:38}} curve={0} />
        <Arrow id="e-2" from={{xPct:FLOW.identity + 8, yPct:38}} to={{xPct:FLOW.graph    - 7.5, yPct:38}} curve={0} />
        <Arrow id="e-3" from={{xPct:FLOW.graph    + 7.5, yPct:38}} to={{xPct:FLOW.diff     - 6, yPct:38}} curve={0} />

        {/* Fan-out from diff to 3 user-table outcomes */}
        <Arrow id="e-add"        from={{xPct:FLOW.diff + 6, yPct:36}} to={{xPct:WRITE_X - 7, yPct:22}} curve={-0.05} emphasis="highlight" />
        <Arrow id="e-update"     from={{xPct:FLOW.diff + 6, yPct:38}} to={{xPct:WRITE_X - 7, yPct:38}} curve={0}     emphasis="highlight" />
        <Arrow id="e-deactivate" from={{xPct:FLOW.diff + 6, yPct:40}} to={{xPct:WRITE_X - 7, yPct:54}} curve={0.05}  emphasis="highlight" />

        {/* All 3 outcomes converge into audit log */}
        <Arrow id="e-audit-add"        from={{xPct:WRITE_X + 7, yPct:22}} to={{xPct:AUDIT_X, yPct:36}} curve={0.05} arrowhead={false} variant="dashed" emphasis="dim" />
        <Arrow id="e-audit-update"     from={{xPct:WRITE_X + 7, yPct:38}} to={{xPct:AUDIT_X, yPct:38}} curve={0}    arrowhead={false} variant="dashed" emphasis="dim" />
        <Arrow id="e-audit-deactivate" from={{xPct:WRITE_X + 7, yPct:54}} to={{xPct:AUDIT_X, yPct:40}} curve={-0.05} arrowhead={false} variant="dashed" emphasis="dim" />

        {/* Pulses */}
        <PulseDot pathId="e-1" duration={1.0} begin={0} />
        <PulseDot pathId="e-2" duration={1.0} begin={1.0} />
        <PulseDot pathId="e-3" duration={1.0} begin={2.0} />
        <PulseDot pathId="e-add"        duration={1.0} begin={3.2} />
        <PulseDot pathId="e-update"     duration={1.0} begin={3.4} />
        <PulseDot pathId="e-deactivate" duration={1.0} begin={3.6} />
      </SvgLayer>

      <Lane label="NIGHTLY PIPELINE" yPct={38} />

      <ServiceNode xPct={FLOW.cron}     yPct={38} label="CRON 02:00" sublabel="systemd timer"        kind="external" widthPct={12} />
      <ServiceNode xPct={FLOW.identity} yPct={38} label="IDENTITY-SVC" sublabel="entra.sync()"      widthPct={16} highlight />
      <ServiceNode xPct={FLOW.graph}    yPct={38} label="MS GRAPH" sublabel="delta query · users"    kind="external" widthPct={15} />
      <ServiceNode xPct={FLOW.diff}     yPct={38} label="DIFF" sublabel="add | update | deactivate" widthPct={12} highlight />

      {/* Three write outcomes */}
      <ServiceNode xPct={WRITE_X} yPct={22} label="ADD"        sublabel="new User row"  kind="data" widthPct={13} />
      <ServiceNode xPct={WRITE_X} yPct={38} label="UPDATE"     sublabel="diff fields"   kind="data" widthPct={13} />
      <ServiceNode xPct={WRITE_X} yPct={54} label="DEACTIVATE" sublabel="set inactive" kind="data" widthPct={13} />

      {/* Audit log */}
      <ServiceNode xPct={AUDIT_X} yPct={38} label="AUDIT" sublabel="every change" kind="data" widthPct={9} />

      <AnnotationPill xPct={36} yPct={26} text="DELTA TOKEN · ONLY CHANGES SINCE LAST RUN" tone="accent" />
      <AnnotationPill xPct={50} yPct={75} text="SHADOW USERS NEVER OVERWRITTEN — sync_source=ENTRA UPSERTS DON'T TOUCH EXTERNAL_EMAIL_SHADOW" tone="warn" />
    </DiagramFrame>
  );
}
