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
 * ReservationFlow — illustrates the cross-service single-writer rule.
 *
 * Two lanes:
 *   FLOW yPct=38 — 6 sequential stages
 *   SVC  yPct=72 — owning service for each
 *
 * The HTTP boundary between reservation-svc and asset-svc is the credibility
 * flex. Pill on the boundary arrow says "HTTP · SELECT FOR UPDATE", and the
 * ASSET.STATUS flip is shown explicitly as a downstream effect.
 */
export default function ReservationFlow() {
  // 6 stages: m3 | w12 g2 w13 g2 w14 g2 w17 g2 w13 g2 w13 | m3 = 96
  const FLOW = {
    request: 9,     // 3 + 12/2
    review:  23.5,  // 9 + 12/2 + 2 + 13/2
    approve: 39,    // 23.5 + 13/2 + 2 + 14/2
    transit: 56.5,  // 39 + 14/2 + 2 + 17/2
    flip:    73.5,  // 56.5 + 17/2 + 2 + 13/2
    notify:  88.5,  // 73.5 + 13/2 + 2 + 13/2
  } as const;

  return (
    <DiagramFrame label="SYS.FLOW / RESERVATION" caption="HTTP BOUNDARY · SINGLE WRITER">
      <SvgLayer>
        {/* Linear flow */}
        <Arrow id="r-1" from={{xPct:FLOW.request + 6, yPct:38}} to={{xPct:FLOW.review  - 6.5, yPct:38}} curve={0} />
        <Arrow id="r-2" from={{xPct:FLOW.review  + 6.5, yPct:38}} to={{xPct:FLOW.approve - 7, yPct:38}} curve={0} />
        <Arrow id="r-3" from={{xPct:FLOW.approve + 7, yPct:38}} to={{xPct:FLOW.transit - 8.5, yPct:38}} curve={0} emphasis="highlight" />
        <Arrow id="r-4" from={{xPct:FLOW.transit + 8.5, yPct:38}} to={{xPct:FLOW.flip   - 6.5, yPct:38}} curve={0} emphasis="highlight" />
        <Arrow id="r-5" from={{xPct:FLOW.flip   + 6.5, yPct:38}} to={{xPct:FLOW.notify - 6.5, yPct:38}} curve={0} />

        {/* USER kicks off flow */}
        <Arrow id="o-user-kick" from={{xPct:FLOW.request, yPct:67}} to={{xPct:FLOW.request, yPct:43}} curve={0} emphasis="highlight" />

        {/* Each stage handed DOWN to its owning service */}
        <Arrow id="o-review"  from={{xPct:FLOW.review,  yPct:43}} to={{xPct:FLOW.review,  yPct:67}} curve={0} variant="dashed" />
        <Arrow id="o-approve" from={{xPct:FLOW.approve, yPct:43}} to={{xPct:FLOW.approve, yPct:67}} curve={0} variant="dashed" />
        <Arrow id="o-transit" from={{xPct:FLOW.transit, yPct:43}} to={{xPct:FLOW.transit, yPct:67}} curve={0} variant="dashed" />
        <Arrow id="o-flip"    from={{xPct:FLOW.flip,    yPct:43}} to={{xPct:FLOW.flip,    yPct:67}} curve={0} variant="dashed" />
        <Arrow id="o-notify"  from={{xPct:FLOW.notify,  yPct:43}} to={{xPct:FLOW.notify,  yPct:67}} curve={0} variant="dashed" />

        {/* Pulses */}
        <PulseDot pathId="r-1" duration={1.0} begin={0} />
        <PulseDot pathId="r-2" duration={1.0} begin={1.0} />
        <PulseDot pathId="r-3" duration={1.0} begin={2.0} />
        <PulseDot pathId="r-4" duration={1.0} begin={3.0} />
        <PulseDot pathId="r-5" duration={1.0} begin={4.0} />
      </SvgLayer>

      <Lane label="FLOW · STAGE" yPct={38} />
      <Lane label="OWNING SERVICE" yPct={72} />

      <ServiceNode xPct={FLOW.request} yPct={38} label="REQUEST" sublabel="cart submit" kind="client" widthPct={12} />
      <ServiceNode xPct={FLOW.review}  yPct={38} label="REVIEW"  sublabel="operator views queue"          widthPct={13} />
      <ServiceNode xPct={FLOW.approve} yPct={38} label="APPROVE" sublabel="operator picks asset"          widthPct={14} highlight />
      <ServiceNode xPct={FLOW.transit} yPct={38} label="HTTP TRANSITION" sublabel="POST /transition" widthPct={17} highlight />
      <ServiceNode xPct={FLOW.flip}    yPct={38} label="STATUS FLIP" sublabel="available → reserved"      widthPct={13} />
      <ServiceNode xPct={FLOW.notify}  yPct={38} label="NOTIFY"  sublabel="confirmation email"            widthPct={13} />

      <ServiceNode xPct={FLOW.request} yPct={72} label="USER"            kind="external" widthPct={10} />
      <ServiceNode xPct={FLOW.review}  yPct={72} label="RESERVATION-SVC"               widthPct={16} />
      <ServiceNode xPct={FLOW.approve} yPct={72} label="RESERVATION-SVC"               widthPct={16} />
      <ServiceNode xPct={FLOW.transit} yPct={72} label="ASSET-SVC"      sublabel="SELECT FOR UPDATE" highlight widthPct={16} />
      <ServiceNode xPct={FLOW.flip}    yPct={72} label="ASSET-SVC"      widthPct={12} />
      <ServiceNode xPct={FLOW.notify}  yPct={72} label="NOTIFICATION-SVC"              widthPct={17} />

      <AnnotationPill xPct={FLOW.transit - 1} yPct={28} text="HTTP BOUNDARY · SINGLE WRITER" tone="accent" />
      <AnnotationPill xPct={50} yPct={94} text="ASSET-SVC IS THE ONLY WRITER OF Asset.status — SERIALIZED VIA SELECT FOR UPDATE" tone="muted" />
    </DiagramFrame>
  );
}
