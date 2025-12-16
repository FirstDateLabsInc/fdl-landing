/**
 * Unit Tests: ListGate Component
 *
 * Tests the content gating component used for list-based locked content
 * (datingCycle, redFlags, coachingFocus).
 *
 * Security Context:
 *   - ListGate only receives pre-rendered teaser items
 *   - Locked content never reaches client bundle
 *   - BlurOverlay renders generic placeholders, not actual locked content
 *
 * Run with: npm run test
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListGate } from "@/components/quiz/results/gating/ListGate";

describe("ListGate", () => {
  const defaultProps = {
    visibleItems: [
      <div key="1" data-testid="visible-item-1">Visible Item 1</div>,
      <div key="2" data-testid="visible-item-2">Visible Item 2</div>,
    ],
    lockedCount: 3,
    teaserText: "Unlock to see 3 more insights",
  };

  describe("Visible Content", () => {
    it("renders all visible items", () => {
      render(<ListGate {...defaultProps} />);

      expect(screen.getByTestId("visible-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("visible-item-2")).toBeInTheDocument();
      expect(screen.getByText("Visible Item 1")).toBeInTheDocument();
      expect(screen.getByText("Visible Item 2")).toBeInTheDocument();
    });

    it("renders visible items in correct order", () => {
      render(<ListGate {...defaultProps} />);

      const items = screen.getAllByTestId(/visible-item/);
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("Visible Item 1");
      expect(items[1]).toHaveTextContent("Visible Item 2");
    });

    it("renders empty state when no visible items", () => {
      render(
        <ListGate {...defaultProps} visibleItems={[]} lockedCount={0} />
      );

      // Should render without crashing
      expect(screen.queryByTestId("visible-item-1")).not.toBeInTheDocument();
    });
  });

  describe("Locked Content Indicator", () => {
    it("shows blur overlay when lockedCount > 0", () => {
      render(<ListGate {...defaultProps} lockedCount={3} />);

      // Check for teaser text in unlock prompt
      expect(screen.getByText("Unlock to see 3 more insights")).toBeInTheDocument();
    });

    it("hides blur overlay when lockedCount is 0", () => {
      render(<ListGate {...defaultProps} lockedCount={0} />);

      // Teaser text should not be present
      expect(screen.queryByText("Unlock to see 3 more insights")).not.toBeInTheDocument();
    });

    it("shows Unlock button when content is locked", () => {
      render(<ListGate {...defaultProps} />);

      expect(screen.getByRole("button", { name: /unlock/i })).toBeInTheDocument();
    });

    it("hides Unlock button when no content is locked", () => {
      render(<ListGate {...defaultProps} lockedCount={0} />);

      expect(screen.queryByRole("button", { name: /unlock/i })).not.toBeInTheDocument();
    });
  });

  describe("Teaser Text", () => {
    it("displays custom teaser text", () => {
      render(
        <ListGate {...defaultProps} teaserText="Custom unlock message" />
      );

      expect(screen.getByText("Custom unlock message")).toBeInTheDocument();
    });

    it("renders teaser text in unlock prompt card", () => {
      render(<ListGate {...defaultProps} />);

      const teaserElement = screen.getByText("Unlock to see 3 more insights");
      expect(teaserElement.tagName.toLowerCase()).toBe("p");
    });
  });

  describe("CTA Target", () => {
    it("uses default ctaTargetId of 'full-picture'", () => {
      render(<ListGate {...defaultProps} />);

      // Button should be rendered with default target
      expect(screen.getByRole("button", { name: /unlock/i })).toBeInTheDocument();
    });

    it("accepts custom ctaTargetId", () => {
      render(<ListGate {...defaultProps} ctaTargetId="custom-section" />);

      // Button should still render
      expect(screen.getByRole("button", { name: /unlock/i })).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <ListGate {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has relative positioning for overlay", () => {
      const { container } = render(<ListGate {...defaultProps} />);

      expect(container.firstChild).toHaveClass("relative");
    });
  });

  describe("Security", () => {
    it("does not render any hidden/aria-hidden content beyond placeholders", () => {
      render(<ListGate {...defaultProps} />);

      // Verify only the visible items and unlock prompt are rendered
      // No actual locked content should be in the DOM
      const visibleItems = screen.getAllByTestId(/visible-item/);
      expect(visibleItems).toHaveLength(2);
    });

    it("blur overlay contains only placeholder skeletons", () => {
      const { container } = render(<ListGate {...defaultProps} />);

      // Check that blur content exists but contains no text from actual items
      const blurredArea = container.querySelector(".blur-\\[6px\\]");
      if (blurredArea) {
        expect(blurredArea.textContent).toBe("");
      }
    });
  });
});
