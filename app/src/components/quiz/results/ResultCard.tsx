"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ScoreData {
  value: number;
  label?: string;
}

export interface DimensionData {
  name: string;
  value: number;
  isPrimary?: boolean;
}

export interface RankedData {
  rank: number;
  name: string;
  value: number;
}

type ResultCardType = "score" | "dimensions" | "ranked";

interface ResultCardBaseProps {
  title: string;
  description?: string;
  className?: string;
}

interface ScoreCardProps extends ResultCardBaseProps {
  type: "score";
  data: ScoreData;
}

interface DimensionsCardProps extends ResultCardBaseProps {
  type: "dimensions";
  data: DimensionData[];
}

interface RankedCardProps extends ResultCardBaseProps {
  type: "ranked";
  data: RankedData[];
}

type ResultCardProps = ScoreCardProps | DimensionsCardProps | RankedCardProps;

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

const DIMENSION_LABELS: Record<string, string> = {
  // Attachment
  secure: "Secure",
  anxious: "Anxious",
  avoidant: "Avoidant",
  disorganized: "Disorganized",
  // Communication
  passive: "Passive",
  aggressive: "Aggressive",
  passive_aggressive: "Passive-Aggressive",
  assertive: "Assertive",
  // Love Languages
  words: "Words of Affirmation",
  time: "Quality Time",
  service: "Acts of Service",
  gifts: "Receiving Gifts",
  touch: "Physical Touch",
};

function getDisplayLabel(name: string): string {
  return DIMENSION_LABELS[name] ?? name;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultCard(props: ResultCardProps) {
  const { title, description, className } = props;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div className="relative z-10">
        {props.type === "score" && <ScoreContent data={props.data} />}
        {props.type === "dimensions" && (
          <DimensionsContent data={props.data} />
        )}
        {props.type === "ranked" && <RankedContent data={props.data} />}
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-slate-50 blur-2xl transition-colors group-hover:bg-slate-100" />
    </div>
  );
}

// ============================================================================
// CONTENT RENDERERS
// ============================================================================

function ScoreContent({ data }: { data: ScoreData }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-slate-900">{data.value}%</span>
        {data.label && (
          <span className="text-sm text-slate-500">{data.label}</span>
        )}
      </div>
      <Progress value={data.value} />
    </div>
  );
}

function DimensionsContent({ data }: { data: DimensionData[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span
              className={cn(
                "text-slate-700",
                item.isPrimary && "font-semibold text-slate-900"
              )}
            >
              {getDisplayLabel(item.name)}
              {item.isPrimary && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[#f9d544]/20 px-2 py-0.5 text-xs font-medium text-slate-900">
                  Primary
                </span>
              )}
            </span>
            <span className="font-medium text-slate-900">{item.value}%</span>
          </div>
          <Progress value={item.value} />
        </div>
      ))}
    </div>
  );
}

function RankedContent({ data }: { data: RankedData[] }) {
  return (
    <ol className="space-y-2">
      {data.map((item) => (
        <li key={item.name} className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              item.rank === 1
                ? "bg-[#f9d544] text-slate-900"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {item.rank}
          </span>
          <span className="flex-1 text-sm text-slate-700">
            {getDisplayLabel(item.name)}
          </span>
          <span className="text-sm font-medium text-slate-900">
            {item.value}%
          </span>
        </li>
      ))}
    </ol>
  );
}
