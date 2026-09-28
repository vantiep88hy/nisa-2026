// src/types/slide.ts


export type SlideType =
  | "title_card"
  | "bullet_summary"
  | "big_number"
  | "timeline"
  | "comparison"
  | "question"
  | "pros_and_cons"
  | "warning"
  | "checklist"
  | "ranking"
  | "quote"
  | "before_after"
  | "pie_chart"
  | "bar_chart"
  | "summary";
// ======================================================
// META
// ======================================================

export interface SlideMeta {
  schema_version: string;
  title: string;
  audio: string;
  srt: string;
  resolution: string;
  fps: number;
}

// ======================================================
// BASE
// ======================================================

interface SlideBase {
  slide_id: number;

  type: SlideType;

  start: number;
  end: number;

  source_srt_ids: number[];

  summary?: string;
}

// ======================================================
// TITLE CARD
// ======================================================

export interface TitleCardSlide extends SlideBase {
  type: "title_card";

  badge: string | null;

  title: string;

  subtitle: string | null;
}

// ======================================================
// BULLET SUMMARY
// ======================================================

export interface BulletPoint {
  text: string;

  highlight: string | null;

  icon?: string;

  focus_weight?: number;

  source_srt_ids?: number[];

  start: number;
  end: number;
}

export interface BulletSummarySlide extends SlideBase {
  type: "bullet_summary";

  title: string;

  points: BulletPoint[];

  cta: string | null;
}

// ======================================================
// BIG NUMBER
// ======================================================

export interface BigNumberSlide extends SlideBase {
  type: "big_number";

  title: string;

  number: string;

  unit: string | null;

  context: string | null;

  description: string | null;

  icon?: string;

  highlight?: string | null;
}

// ======================================================
// TIMELINE
// ======================================================

export interface TimelineStep {
  label: string;

  desc: string | null;

  icon?: string;

  highlight?: string | null;

  focus_weight?: number;

  source_srt_ids?: number[];

  start?: number;
  end?: number;
}

export interface TimelineSlide extends SlideBase {
  type: "timeline";

  title: string;

  steps: TimelineStep[];

  conclusion: string | null;
}

// ======================================================
// COMPARISON
// ======================================================

export interface ComparisonPoint {
  text: string;

  highlight?: string | null;

  icon?: string;
}

export interface ComparisonItem {
  label: string;

  value: string;

  highlight?: string | null;

  icon?: string;

  points: ComparisonPoint[];
}

export interface ComparisonSlide extends SlideBase {
  type: "comparison";

  title: string;

  items: ComparisonItem[];
}

// ======================================================
// QUESTION
// ======================================================

export interface QuestionSlide extends SlideBase {
  type: "question";

  question: string;

  highlight?: string;

  cta?: string | null;
}

// ======================================================
// PROS AND CONS
// ======================================================

export interface ProsConsItem {
  text: string;

  highlight?: string;

  start?: number;
  end?: number;
}

export interface ProsAndConsSlide extends SlideBase {
  type: "pros_and_cons";

  title: string;

  prosLabel?: string;

  consLabel?: string;

  pros: ProsConsItem[];

  cons: ProsConsItem[];
}

// ======================================================
// WARNING
// ======================================================

export interface WarningSlide extends SlideBase {
  type: "warning";

  title: string;

  subtitle: string;

  body?: string;

  icon?: string;

  severity?: "warning" | "danger" | "info";
}

// ======================================================
// CHECKLIST
// ======================================================

export interface ChecklistItem {
  text: string;

  checked?: boolean;

  start?: number;
  end?: number;
}

export interface ChecklistSlide extends SlideBase {
  type: "checklist";

  title: string;

  items: ChecklistItem[];

  cta?: string | null;
}

// ======================================================
// RANKING
// ======================================================

export interface RankingItem {
  rank: number;

  name: string;

  label?: string;

  start?: number;
  end?: number;
}

export interface RankingSlide extends SlideBase {
  type: "ranking";

  title: string;

  items: RankingItem[];

  note?: string | null;
}

// ======================================================
// QUOTE
// ======================================================

export interface QuoteSlide extends SlideBase {
  type: "quote";

  text: string;

  author?: string;

  source?: string;
}

// ======================================================
// BEFORE AFTER
// ======================================================

export interface BeforeAfterSide {
  label: string;

  value: string;

  result: string;

  highlight?: string;

  icon?: string;

  points?: string[];
}

export interface BeforeAfterSlide extends SlideBase {
  type: "before_after";

  title: string;

  before: BeforeAfterSide;

  after: BeforeAfterSide;

  badge?: string;
}

// ======================================================
// PIE CHART
// ======================================================

export interface PieSlice {
  label: string;

  value: number;

  color?: string;
}

export interface PieChartSlide extends SlideBase {
  type: "pie_chart";

  title: string;

  subtitle?: string;

  slices: PieSlice[];

  note?: string;
}

// ======================================================
// BAR CHART
// ======================================================

export interface BarChartBar {
  label: string;

  value: number;

  unit?: string;

  isHighlight?: boolean;
}

export interface BarChartSlide extends SlideBase {
  type: "bar_chart";

  title: string;

  subtitle?: string;

  bars: BarChartBar[];

  yUnit?: string;

  note?: string;
}

// ======================================================
// SUMMARY
// ======================================================

export interface SummaryPoint {
  text: string;

  highlight?: string;

  start?: number;
  end?: number;
}

export interface SummarySlide extends SlideBase {
  type: "summary";

  title: string;

  points: SummaryPoint[];
}
// ======================================================
// UNION
// ======================================================

export type Slide =
  | TitleCardSlide
  | BulletSummarySlide
  | BigNumberSlide
  | TimelineSlide
  | ComparisonSlide
  | QuestionSlide
  | ProsAndConsSlide
  | WarningSlide
  | ChecklistSlide
  | RankingSlide
  | QuoteSlide
  | BeforeAfterSlide
  | PieChartSlide
  | BarChartSlide
  | SummarySlide;

// ======================================================
// ROOT DOCUMENT
// ======================================================

export interface SlidesDocument {
  meta: SlideMeta;

  slides: Slide[];
}