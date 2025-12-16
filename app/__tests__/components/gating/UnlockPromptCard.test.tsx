/**
 * Unit Tests: UnlockPromptCard Component
 *
 * Tests the CTA card component that prompts users to unlock premium content.
 * Used by both ListGate and SectionGate components.
 *
 * Variants:
 *   - overlay: Compact card for blur areas
 *   - subtle: Glassmorphism inline CTA bar
 *   - prominent: Section-level card
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnlockPromptCard } from "@/components/quiz/results/gating/UnlockPromptCard";

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, "scrollTo", { value: mockScrollTo, writable: true });

describe("UnlockPromptCard", () => {
  const defaultProps = {
    message: "Unlock more insights",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Message Display", () => {
    it("renders message text", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      expect(screen.getByText("Unlock more insights")).toBeInTheDocument();
    });

    it("renders custom message", () => {
      render(<UnlockPromptCard message="Custom unlock message here" />);

      expect(screen.getByText("Custom unlock message here")).toBeInTheDocument();
    });
  });

  describe("Subtle Variant (Default)", () => {
    it("renders subtle variant by default", () => {
      const { container } = render(<UnlockPromptCard {...defaultProps} />);

      // Subtle variant uses flex row layout
      expect(container.firstChild).toHaveClass("flex", "items-center", "justify-between");
    });

    it("shows simple Unlock button", () => {
      render(<UnlockPromptCard {...defaultProps} variant="subtle" />);

      expect(screen.getByRole("button", { name: /unlock/i })).toBeInTheDocument();
    });

    it("has glassmorphism styling", () => {
      const { container } = render(<UnlockPromptCard {...defaultProps} variant="subtle" />);

      expect(container.firstChild).toHaveClass("backdrop-blur-sm");
    });
  });

  describe("Overlay Variant", () => {
    it("renders compact overlay design", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} variant="overlay" />
      );

      // Overlay variant is centered text
      expect(container.firstChild).toHaveClass("text-center");
    });

    it("has smaller button in overlay mode", () => {
      render(<UnlockPromptCard {...defaultProps} variant="overlay" />);

      const button = screen.getByRole("button", { name: /unlock/i });
      // Size sm applied
      expect(button).toHaveClass("h-7", "sm:h-8");
    });

    it("shows decorative sparkle", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} variant="overlay" />
      );

      const sparkle = container.querySelector("svg");
      expect(sparkle).toBeInTheDocument();
    });
  });

  describe("Prominent Variant", () => {
    it("renders large prominent card", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} variant="prominent" />
      );

      // Prominent has larger padding
      expect(container.firstChild).toHaveClass("p-8");
    });

    it("shows full Unlock Full Results button", () => {
      render(<UnlockPromptCard {...defaultProps} variant="prominent" />);

      expect(
        screen.getByRole("button", { name: /unlock full results/i })
      ).toBeInTheDocument();
    });

    it("has rounded-2xl styling", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} variant="prominent" />
      );

      expect(container.firstChild).toHaveClass("rounded-2xl");
    });

    it("has gradient background", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} variant="prominent" />
      );

      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("CTA Click Behavior", () => {
    it("scrolls to default target on click", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "full-picture";
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 800,
        bottom: 900,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 800,
        toJSON: () => {},
      });

      render(<UnlockPromptCard {...defaultProps} />);

      fireEvent.click(screen.getByRole("button"));
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: "smooth",
      });

      document.body.removeChild(mockElement);
    });

    it("scrolls to custom target when specified", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "waitlist-section";
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 1200,
        bottom: 1300,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 1200,
        toJSON: () => {},
      });

      render(<UnlockPromptCard {...defaultProps} ctaTargetId="waitlist-section" />);

      fireEvent.click(screen.getByRole("button"));
      expect(mockScrollTo).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it("handles missing target gracefully", () => {
      render(<UnlockPromptCard {...defaultProps} ctaTargetId="nonexistent" />);

      expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it("accounts for navbar offset when scrolling", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "full-picture";
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 600,
        bottom: 700,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 600,
        toJSON: () => {},
      });

      // Mock window.scrollY
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });

      render(<UnlockPromptCard {...defaultProps} />);
      fireEvent.click(screen.getByRole("button"));

      // Should scroll to position minus 120px offset
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 600 + 100 - 120, // top + scrollY - offset
        behavior: "smooth",
      });

      document.body.removeChild(mockElement);
    });
  });

  describe("Button Styling", () => {
    it("has gradient background", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gradient-to-r");
    });

    it("has sparkles icon in button", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("has hover shadow effect", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button.className).toMatch(/hover:shadow/);
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <UnlockPromptCard {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("preserves variant-specific classes with custom class", () => {
      const { container } = render(
        <UnlockPromptCard
          {...defaultProps}
          variant="prominent"
          className="my-custom"
        />
      );

      expect(container.firstChild).toHaveClass("my-custom");
      expect(container.firstChild).toHaveClass("rounded-2xl");
    });
  });

  describe("Accessibility", () => {
    it("button is focusable", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("message is rendered as paragraph", () => {
      render(<UnlockPromptCard {...defaultProps} />);

      const message = screen.getByText("Unlock more insights");
      expect(message.tagName.toLowerCase()).toBe("p");
    });
  });
});
