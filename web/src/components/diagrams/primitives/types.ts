export type Anchor = { xPct: number; yPct: number };

export type NodeKind = "service" | "data" | "external" | "client";

export type DiagramTheme = {
  bg: string;
  surface: string;
  border: string;
  muted: string;
  foreground: string;
  accent: string;
};

export const THEME: DiagramTheme = {
  bg: "#0a0a0b",
  surface: "#111113",
  border: "#27272a",
  muted: "#a1a1aa",
  foreground: "#fafafa",
  accent: "#10b981",
};
