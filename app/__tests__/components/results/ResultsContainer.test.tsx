/**
 * Unit Tests: ResultsContainer Component
 *
 * Tests the main quiz results page container, with specific focus on:
 * - Content gating (isFullView prop controls preview vs full content)
 * - Security: locked content only renders when isFullView=true AND lockedContent exists
 * - Share URL generation (preview URL format)
 *
 * Security Context:
 *   - Preview mode (isFullView=false): ListGate/SectionGate components render
 *   - Full mode (isFullView=true): Full DatingCycleVisual, TraitGrid, RedFlagsList render
 *   - lockedContent prop only provided on authenticated full share routes
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsContainer } from "@/components/quiz/results/layout/ResultsContainer";
import {
  mockQuizResults,
  mockArchetypePublic,
  mockArchetypeLocked,
} from "../../helpers/mocks";

// Mock child components to isolate ResultsContainer behavior
vi.mock("@/components/quiz/results/sections/ArchetypeHero", () => ({
  ArchetypeHero: ({ archetype }: { archetype: { name: string } }) => (
    <div data-testid="archetype-hero">{archetype.name}</div>
  ),
}));

vi.mock("@/components/quiz/results/charts/CategoryRadarChart", () => ({
  CategoryRadarChart: ({ title }: { title: string }) => (
    <div data-testid="radar-chart">{title}</div>
  ),
}));

vi.mock("@/components/quiz/results/sections/LoveLanguageSuggestions", () => ({
  LoveLanguageSuggestions: () => <div data-testid="love-languages">Love Languages</div>,
}));

vi.mock("@/components/quiz/results/sections/ScoreInsightsSection", () => ({
  ScoreInsightsSection: () => <div data-testid="score-insights">Score Insights</div>,
}));

vi.mock("@/components/quiz/results/sections/ShareResults", () => ({
  ShareResults: ({ shareUrl }: { shareUrl: string | null }) => (
    <div data-testid="share-results" data-share-url={shareUrl || "none"}>
      Share Results
    </div>
  ),
}));

vi.mock("@/components/quiz/results/sections/QuizWaitlistSection", () => ({
  QuizWaitlistSection: () => <div data-testid="waitlist-section">Waitlist</div>,
}));

vi.mock("@/components/quiz/results/layout/ContentSection", () => ({
  ContentSection: ({
    children,
    title,
    id,
  }: {
    children: React.ReactNode;
    title: string;
    id: string;
  }) => (
    <section data-testid={`content-section-${id}`}>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock("@/components/quiz/results/sections/TraitGrid", () => ({
  TraitGrid: ({ items, type }: { items: string[]; type: string }) => (
    <div data-testid={`trait-grid-${type}`}>
      {items.map((item, i) => (
        <div key={i} data-testid={`trait-item-${type}-${i}`}>
          {item}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/quiz/results/sections/DatingCycleVisual", () => ({
  DatingCycleVisual: ({ steps }: { steps: string[] }) => (
    <div data-testid="dating-cycle-visual">
      {steps.map((step, i) => (
        <div key={i} data-testid={`cycle-step-${i}`}>
          {step}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/quiz/results/sections/RedFlagsList", () => ({
  RedFlagsList: ({ items }: { items: string[] }) => (
    <div data-testid="red-flags-list">
      {items.map((item, i) => (
        <div key={i} data-testid={`red-flag-${i}`}>
          {item}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/quiz/results/sections/CoachingFocusList", () => ({
  CoachingFocusList: () => <div data-testid="coaching-list">Coaching Focus</div>,
}));

vi.mock("@/components/quiz/results/layout/ResultsNavSidebar", () => ({
  ResultsNavSidebar: () => <nav data-testid="nav-sidebar">Sidebar</nav>,
  SECTIONS: [
    { id: "pattern", label: "Pattern" },
    { id: "score-insights", label: "Insights" },
    { id: "dating-meaning", label: "Dating" },
    { id: "red-flags", label: "Flags" },
    { id: "coaching", label: "Coaching" },
    { id: "love-languages", label: "Love" },
  ],
}));

vi.mock("@/components/quiz/results/layout/MobileFloatingNav", () => ({
  MobileFloatingNav: () => <nav data-testid="mobile-nav">Mobile Nav</nav>,
}));

// Mock framer-motion to avoid animation timing issues
vi.mock("motion/react", () => ({
  motion: {
    section: ({ children, ...props }: React.PropsWithChildren<object>) => (
      <section {...props}>{children}</section>
    ),
    div: ({ children, ...props }: React.PropsWithChildren<object>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => true,
}));

// Mock ListGate and SectionGate - these are critical for security testing
vi.mock("@/components/quiz/results/gating", () => ({
  ListGate: ({
    visibleItems,
    lockedCount,
    teaserText,
  }: {
    visibleItems: React.ReactNode[];
    lockedCount: number;
    teaserText: string;
  }) => (
    <div data-testid="list-gate" data-locked-count={lockedCount}>
      <div data-testid="list-gate-visible">{visibleItems}</div>
      <div data-testid="list-gate-teaser">{teaserText}</div>
    </div>
  ),
  SectionGate: ({ teaserText }: { teaserText: string }) => (
    <div data-testid="section-gate">
      <div data-testid="section-gate-teaser">{teaserText}</div>
    </div>
  ),
}));

describe("ResultsContainer", () => {
  const defaultResults = mockQuizResults();
  const defaultArchetype = mockArchetypePublic();
  const defaultLockedContent = mockArchetypeLocked();
  const defaultQuizResultId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.origin for share URL tests
    Object.defineProperty(window, "location", {
      value: { origin: "https://firstdatelabs.com" },
      writable: true,
    });
  });

  describe("Preview Mode (isFullView=false)", () => {
    it("renders ListGate for dating cycle section", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      // Should find ListGate for dating cycle
      const listGates = screen.getAllByTestId("list-gate");
      expect(listGates.length).toBeGreaterThan(0);
    });

    it("renders SectionGate for dating meaning section", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      // Should find SectionGate
      expect(screen.getByTestId("section-gate")).toBeInTheDocument();
    });

    it("does NOT render full DatingCycleVisual", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      expect(screen.queryByTestId("dating-cycle-visual")).not.toBeInTheDocument();
    });

    it("does NOT render full TraitGrid", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      expect(screen.queryByTestId("trait-grid-strength")).not.toBeInTheDocument();
      expect(screen.queryByTestId("trait-grid-challenge")).not.toBeInTheDocument();
    });

    it("does NOT render full RedFlagsList", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      expect(screen.queryByTestId("red-flags-list")).not.toBeInTheDocument();
    });

    it("shows teaser content from archetype public data", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      // ListGate should show teaser text
      const teaserElements = screen.getAllByTestId("list-gate-teaser");
      expect(teaserElements.length).toBeGreaterThan(0);
    });

    it("shows locked count in ListGate", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      const listGates = screen.getAllByTestId("list-gate");
      // At least one ListGate should have a locked count > 0
      const hasLockedContent = listGates.some(
        (gate) => parseInt(gate.getAttribute("data-locked-count") || "0") > 0
      );
      expect(hasLockedContent).toBe(true);
    });
  });

  describe("Full Report Mode (isFullView=true)", () => {
    it("renders DatingCycleVisual when lockedContent provided", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.getByTestId("dating-cycle-visual")).toBeInTheDocument();
    });

    it("renders TraitGrid for strengths when lockedContent provided", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.getByTestId("trait-grid-strength")).toBeInTheDocument();
    });

    it("renders TraitGrid for challenges when lockedContent provided", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.getByTestId("trait-grid-challenge")).toBeInTheDocument();
    });

    it("renders RedFlagsList when lockedContent provided", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.getByTestId("red-flags-list")).toBeInTheDocument();
    });

    it("does NOT render ListGate when in full view with locked content", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      // Should NOT have list gates (or have 0 of them)
      const listGates = screen.queryAllByTestId("list-gate");
      expect(listGates).toHaveLength(0);
    });

    it("does NOT render SectionGate when in full view with locked content", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={defaultLockedContent}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.queryByTestId("section-gate")).not.toBeInTheDocument();
    });
  });

  describe("Security: isFullView=true WITHOUT lockedContent", () => {
    it("falls back to ListGate when lockedContent is undefined", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={undefined}
          quizResultId={defaultQuizResultId}
          isFullView={true} // true but no lockedContent
        />
      );

      // Should still show gates because lockedContent is missing
      const listGates = screen.getAllByTestId("list-gate");
      expect(listGates.length).toBeGreaterThan(0);
    });

    it("falls back to SectionGate when lockedContent is undefined", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          lockedContent={undefined}
          quizResultId={defaultQuizResultId}
          isFullView={true}
        />
      );

      expect(screen.getByTestId("section-gate")).toBeInTheDocument();
    });

    it("does NOT render full content without lockedContent prop", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={true} // Even with isFullView=true
        />
      );

      expect(screen.queryByTestId("dating-cycle-visual")).not.toBeInTheDocument();
      expect(screen.queryByTestId("trait-grid-strength")).not.toBeInTheDocument();
      expect(screen.queryByTestId("red-flags-list")).not.toBeInTheDocument();
    });
  });

  describe("Share URL Generation", () => {
    it("generates preview URL format /quiz/results/{id}", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      const shareResults = screen.getByTestId("share-results");
      expect(shareResults).toHaveAttribute(
        "data-share-url",
        `https://firstdatelabs.com/quiz/results/${defaultQuizResultId}`
      );
    });

    it("does NOT generate /quiz/p/ format URL", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          isFullView={false}
        />
      );

      const shareResults = screen.getByTestId("share-results");
      const shareUrl = shareResults.getAttribute("data-share-url");
      expect(shareUrl).not.toContain("/quiz/p/");
    });

    it("returns null share URL when quizResultId is missing", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={undefined}
          isFullView={false}
        />
      );

      const shareResults = screen.getByTestId("share-results");
      expect(shareResults).toHaveAttribute("data-share-url", "none");
    });
  });

  describe("Common Content (Both Modes)", () => {
    it("renders archetype hero", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("archetype-hero")).toBeInTheDocument();
    });

    it("renders radar charts for attachment and communication", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      const radarCharts = screen.getAllByTestId("radar-chart");
      expect(radarCharts).toHaveLength(2);
    });

    it("renders score insights section", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("score-insights")).toBeInTheDocument();
    });

    it("renders coaching focus list (not gated)", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("coaching-list")).toBeInTheDocument();
    });

    it("renders love languages section", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("love-languages")).toBeInTheDocument();
    });

    it("renders share results section", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("share-results")).toBeInTheDocument();
    });

    it("renders navigation sidebar", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("nav-sidebar")).toBeInTheDocument();
    });

    it("renders mobile navigation", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
    });
  });

  describe("Waitlist Section", () => {
    it("renders waitlist section when quizResultId provided", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(screen.getByTestId("waitlist-section")).toBeInTheDocument();
    });

    it("hides waitlist section when quizResultId missing", () => {
      render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={undefined}
        />
      );

      expect(screen.queryByTestId("waitlist-section")).not.toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has max-width constraint", () => {
      const { container } = render(
        <ResultsContainer
          results={defaultResults}
          archetype={defaultArchetype}
          quizResultId={defaultQuizResultId}
        />
      );

      expect(container.firstChild).toHaveClass("max-w-6xl");
    });
  });
});
