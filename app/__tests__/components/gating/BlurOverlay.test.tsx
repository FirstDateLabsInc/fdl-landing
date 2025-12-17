/**
 * Unit Tests: BlurOverlay Component
 *
 * Tests the blur overlay component that renders placeholder skeletons
 * for locked content.
 *
 * Security Context:
 *   - BlurOverlay NEVER receives real locked content
 *   - Only renders generic skeleton shapes
 *   - Visually indicates hidden items without exposing data
 *
 * Run with: npm run test
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlurOverlay } from "@/components/quiz/results/gating/BlurOverlay";

describe("BlurOverlay", () => {
  describe("Placeholder Rendering", () => {
    it("renders default 3 placeholder skeletons", () => {
      const { container } = render(<BlurOverlay />);

      // Each placeholder has a circle and text lines
      const placeholders = container.querySelectorAll(".flex.items-start.gap-4");
      expect(placeholders).toHaveLength(3);
    });

    it("renders specified number of placeholders", () => {
      const { container } = render(<BlurOverlay placeholderCount={5} />);

      const placeholders = container.querySelectorAll(".flex.items-start.gap-4");
      expect(placeholders).toHaveLength(5);
    });

    it("renders single placeholder when count is 1", () => {
      const { container } = render(<BlurOverlay placeholderCount={1} />);

      const placeholders = container.querySelectorAll(".flex.items-start.gap-4");
      expect(placeholders).toHaveLength(1);
    });

    it("renders no placeholders when count is 0", () => {
      const { container } = render(<BlurOverlay placeholderCount={0} />);

      const placeholders = container.querySelectorAll(".flex.items-start.gap-4");
      expect(placeholders).toHaveLength(0);
    });
  });

  describe("Skeleton Structure", () => {
    it("each placeholder has icon circle", () => {
      const { container } = render(<BlurOverlay placeholderCount={1} />);

      const iconCircle = container.querySelector(".rounded-full");
      expect(iconCircle).toBeInTheDocument();
      expect(iconCircle).toHaveClass("h-6", "w-6");
    });

    it("each placeholder has text skeleton lines", () => {
      const { container } = render(<BlurOverlay placeholderCount={1} />);

      const textLines = container.querySelectorAll(".rounded-md");
      // Should have 2 text lines per placeholder (full width + 3/4 width)
      expect(textLines.length).toBeGreaterThanOrEqual(2);
    });

    it("text lines have shimmer animation", () => {
      const { container } = render(<BlurOverlay placeholderCount={1} />);

      const animatedLines = container.querySelectorAll(".animate-shimmer");
      expect(animatedLines.length).toBeGreaterThan(0);
    });
  });

  describe("Blur Effect", () => {
    it("applies blur to skeleton content", () => {
      const { container } = render(<BlurOverlay />);

      const blurredSection = container.querySelector(".blur-\\[6px\\]");
      expect(blurredSection).toBeInTheDocument();
    });

    it("has gradient fade from top", () => {
      const { container } = render(<BlurOverlay />);

      const topGradient = container.querySelector(".bg-gradient-to-b");
      expect(topGradient).toBeInTheDocument();
    });

    it("has gradient fade at bottom", () => {
      const { container } = render(<BlurOverlay />);

      const bottomGradient = container.querySelector(".bg-gradient-to-t");
      expect(bottomGradient).toBeInTheDocument();
    });
  });

  describe("Interaction Prevention", () => {
    it("disables pointer events", () => {
      const { container } = render(<BlurOverlay />);

      expect(container.firstChild).toHaveClass("pointer-events-none");
    });

    it("prevents text selection", () => {
      const { container } = render(<BlurOverlay />);

      expect(container.firstChild).toHaveClass("select-none");
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      const { container } = render(<BlurOverlay className="custom-class" />);

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("uses brand gradient colors for icon circles", () => {
      const { container } = render(<BlurOverlay placeholderCount={1} />);

      const iconCircle = container.querySelector(".rounded-full");
      expect(iconCircle).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Security", () => {
    it("contains no actual text content", () => {
      const { container } = render(<BlurOverlay placeholderCount={3} />);

      // The blur container should have empty or minimal text
      const blurredSection = container.querySelector(".blur-\\[6px\\]");
      expect(blurredSection?.textContent).toBe("");
    });

    it("skeleton lines do not expose real data", () => {
      const { container } = render(<BlurOverlay placeholderCount={5} />);

      // Verify no meaningful text is rendered
      expect(container.textContent).toBe("");
    });
  });
});
