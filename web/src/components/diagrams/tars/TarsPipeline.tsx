import React, { useEffect, useState } from "react";
import {
  DiagramFrame,
  ServiceNode,
  Arrow,
  SvgLayer,
  PulseDot,
  AnnotationPill,
  THEME,
} from "../primitives";

/**
 * TarsPipeline — trace → issue → gated PR.
 *
 * Visual grammar: blue pulses are deterministic code, green pulses are the
 * model. That carries "the LLM extracts, the code judges" without a caption.
 *
 * Every dot shares one 9.2s loop (`cycle`) so the story plays in order:
 * code triages, the model splits into an issue and a fix, the fix reaches the
 * approval gate and waits. Only when the human pulse arrives does it continue.
 * The stall is the point of the diagram.
 */

const CYCLE = 9.2;
const CODE = "#8fb8ff";
const HUMAN = "#f5c46b";

// Gate wait window (seconds into the loop)
const WAIT_START = 5.4;
const APPROVED_AT = 7.4;

function GateBeat() {
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  if (!motion) return null;

  const t = (s: number) => (s / CYCLE).toFixed(4);
  const x = 91 * 16;
  const y = 62 * 9;
  const textProps = {
    x,
    y,
    textAnchor: "end" as const,
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    fontSize: 20,
    letterSpacing: 3,
    opacity: 0,
  };

  return (
    <g>
      <text {...textProps} fill={HUMAN}>
        WAITING FOR APPROVAL
        <animate
          attributeName="opacity"
          dur={`${CYCLE}s`}
          repeatCount="indefinite"
          values="0;0;1;0.35;1;0.35;1;0;0"
          keyTimes={`0;${t(WAIT_START)};${t(WAIT_START + 0.2)};${t(WAIT_START + 0.7)};${t(WAIT_START + 1.1)};${t(WAIT_START + 1.5)};${t(APPROVED_AT - 0.2)};${t(APPROVED_AT)};1`}
        />
      </text>
      <text {...textProps} fill={THEME.accent}>
        APPROVED
        <animate
          attributeName="opacity"
          dur={`${CYCLE}s`}
          repeatCount="indefinite"
          values="0;0;1;1;0;0"
          keyTimes={`0;${t(APPROVED_AT)};${t(APPROVED_AT + 0.15)};${t(APPROVED_AT + 1.1)};${t(APPROVED_AT + 1.4)};1`}
        />
      </text>
    </g>
  );
}

export default function TarsPipeline() {
  return (
    <DiagramFrame label="TRACE → ISSUE → GATED PR" caption="21s TRACE TO ISSUE">
      <SvgLayer>
        {/* Code path */}
        <Arrow id="t-ad-fp"   from={{ xPct: 15.5, yPct: 50 }} to={{ xPct: 18.5, yPct: 50 }} />
        <Arrow id="t-fp-sev"  from={{ xPct: 31.5, yPct: 50 }} to={{ xPct: 34.5, yPct: 50 }} />
        <Arrow id="t-sev-llm" from={{ xPct: 47.5, yPct: 50 }} to={{ xPct: 50.5, yPct: 50 }} />

        {/* Model splits */}
        <Arrow id="t-llm-issue" from={{ xPct: 63.5, yPct: 45 }} to={{ xPct: 68.5, yPct: 28 }} curve={-0.12} emphasis="highlight" />
        <Arrow id="t-llm-fix"   from={{ xPct: 63.5, yPct: 55 }} to={{ xPct: 68.5, yPct: 72 }} curve={0.12} emphasis="highlight" />

        {/* Fix → gate → PR */}
        <Arrow id="t-fix-gate"  from={{ xPct: 83.5, yPct: 74 }} to={{ xPct: 86.5, yPct: 74 }} />
        <Arrow id="t-human"     from={{ xPct: 77, yPct: 94 }} to={{ xPct: 90, yPct: 81 }} curve={-0.15} variant="dashed" />
        <Arrow id="t-gate-pr"   from={{ xPct: 93, yPct: 67 }} to={{ xPct: 93, yPct: 45 }} emphasis="highlight" />

        <PulseDot pathId="t-ad-fp"     cycle={CYCLE} begin={0}   duration={0.9} color={CODE} />
        <PulseDot pathId="t-fp-sev"    cycle={CYCLE} begin={0.9} duration={0.9} color={CODE} />
        <PulseDot pathId="t-sev-llm"   cycle={CYCLE} begin={1.8} duration={0.9} color={CODE} />
        <PulseDot pathId="t-llm-issue" cycle={CYCLE} begin={3.3} duration={1.1} />
        <PulseDot pathId="t-llm-fix"   cycle={CYCLE} begin={3.3} duration={1.1} />
        <PulseDot pathId="t-fix-gate"  cycle={CYCLE} begin={4.5} duration={0.9} />
        <PulseDot pathId="t-human"     cycle={CYCLE} begin={6.5} duration={0.9} color={HUMAN} />
        <PulseDot pathId="t-gate-pr"   cycle={CYCLE} begin={APPROVED_AT + 0.1} duration={1.0} />

        <GateBeat />
      </SvgLayer>

      <ServiceNode xPct={9}  yPct={50} label="ATLASDESK" sublabel="crash telemetry" kind="external" widthPct={13} />
      <ServiceNode xPct={25} yPct={50} label="FINGERPRINT" sublabel="sha256 · code" kind="data" widthPct={13} />
      <ServiceNode xPct={41} yPct={50} label="SEVERITY" sublabel="ladder · code" kind="data" widthPct={13} />
      <ServiceNode xPct={57} yPct={50} label="LLM" sublabel="extracts · analyses" widthPct={13} highlight />

      <ServiceNode xPct={76} yPct={24} label="GITHUB ISSUE" sublabel="21s from trace" kind="data" widthPct={15} />
      <ServiceNode xPct={76} yPct={74} label="WORKTREE FIX" sublabel="isolated branch" widthPct={15} />
      <ServiceNode xPct={93} yPct={74} label="GATE" sublabel="3-tier · re-read from DB" kind="external" widthPct={12} />

      <AnnotationPill xPct={93} yPct={39} text="PR OPENED" tone="accent" />
      <AnnotationPill xPct={76} yPct={94} text="HUMAN · TELEGRAM" tone="warn" align="right" />
      <AnnotationPill xPct={4} yPct={92} text="DASHED BOXES = CODE DECIDES · GREEN = MODEL" align="left" />
    </DiagramFrame>
  );
}
