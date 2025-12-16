/**
 * Unit Tests: SectionGate Component
 *
 * Tests the content gating component used for entire locked sections
 * (datingMeaning, etc.).
 *
 * Security Context:
 *   - SectionGate never receives locked content
 *   - Only renders placeholder with optional blurred illustration
 *   - Lock overlay with CTA to unlock
 *
 * Run with: npm run test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionGate } from "@/components/quiz/results/gating/SectionGate";

// Mock window.scrollTo for scroll behavior tests
const mockScrollTo = vi.fn();
Object.defineProperty(window, "scrollTo", { value: mockScrollTo, writable: true });

describe("SectionGate", () => {
  const defaultProps = {
    teaserText: "Download the app to see your full dating profile",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Teaser Content", () => {
    it("renders teaser text message", () => {
      render(<SectionGate {...defaultProps} />);

      expect(
        screen.getByText("Download the app to see your full dating profile")
      ).toBeInTheDocument();
    });

    it("displays custom teaser text", () => {
      render(<SectionGate teaserText="Custom locked message here" />);

      expect(screen.getByText("Custom locked message here")).toBeInTheDocument();
    });
  });

  describe("Lock Icon", () => {
    it("renders lock icon", () => {
      const { container } = render(<SectionGate {...defaultProps} />);

      // Lock icon from lucide-react
      const lockIcon = container.querySelector("svg");
      expect(lockIcon).toBeInTheDocument();
    });
  });

  describe("CTA Button", () => {
    it("renders unlock button", () => {
      render(<SectionGate {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /unlock full results/i })
      ).toBeInTheDocument();
    });

    it("button has sparkles icon", () => {
      render(<SectionGate {...defaultProps} />);

      const button = screen.getByRole("button", { name: /unlock full results/i });
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("scrolls to target section on click", () => {
      // Create mock target element
      const mockElement = document.createElement("div");
      mockElement.id = "full-picture";
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 500,
        bottom: 600,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 500,
        toJSON: () => {},
      });

      render(<SectionGate {...defaultProps} />);

      const button = screen.getByRole("button", { name: /unlock full results/i });
      fireEvent.click(button);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: "smooth",
      });

      // Cleanup
      document.body.removeChild(mockElement);
    });

    it("scrolls to custom target section", () => {
      const mockElement = document.createElement("div");
      mockElement.id = "custom-target";
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 300,
        bottom: 400,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: 300,
        toJSON: () => {},
      });

      render(<SectionGate {...defaultProps} ctaTargetId="custom-target" />);

      const button = screen.getByRole("button", { name: /unlock full results/i });
      fireEvent.click(button);

      expect(mockScrollTo).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it("handles missing target element gracefully", () => {
      render(<SectionGate {...defaultProps} ctaTargetId="nonexistent-element" />);

      const button = screen.getByRole("button", { name: /unlock full results/i });

      // Should not throw
      expect(() => fireEvent.click(button)).not.toThrow();
      expect(mockScrollTo).not.toHaveBeenCalled();
    });
  });

  describe("Illustration Background", () => {
    it("renders without illustration by default", () => {
      const { container } = render(<SectionGate {...defaultProps} />);

      expect(container.querySelector("img")).not.toBeInTheDocument();
    });

    it("renders blurred illustration when provided", () => {
      render(
        <SectionGate
          {...defaultProps}
          illustrationSrc="/images/dating-meaning.png"
        />
      );

      const img = screen.getByRole("img", { hidden: true });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/images/dating-meaning.png");
    });

    it("illustration has blur styling", () => {
      render(
        <SectionGate
          {...defaultProps}
          illustrationSrc="/images/dating-meaning.png"
        />
      );

      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveClass("blur-md");
      expect(img).toHaveClass("opacity-15");
    });

    it("illustration has empty alt for decorative image", () => {
      render(
        <SectionGate
          {...defaultProps}
          illustrationSrc="/images/dating-meaning.png"
        />
      );

      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveAttribute("alt", "");
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <SectionGate {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has rounded corners", () => {
      const { container } = render(<SectionGate {...defaultProps} />);

      expect(container.firstChild).toHaveClass("rounded-2xl");
    });

    it("has gradient background", () => {
      const { container } = render(<SectionGate {...defaultProps} />);

      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    });

    it("has decorative gradient orbs", () => {
      const { container } = render(<SectionGate {...defaultProps} />);

      // Should have blur-3xl and blur-2xl decorative elements
      const blurElements = container.querySelectorAll("[class*='blur-']");
      expect(blurElements.length).toBeGreaterThan(0);
    });
  });

  describe("Security", () => {
    it("does not expose any locked content in DOM", () => {
      render(<SectionGate {...defaultProps} />);

      // Only teaser text should be visible
      expect(
        screen.getByText("Download the app to see your full dating profile")
      ).toBeInTheDocument();

      // No dating meaning content should be present
      expect(screen.queryByText(/strengths/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/challenges/i)).not.toBeInTheDocument();
    });

    it("illustration source is only used for blurred background", () => {
      render(
        <SectionGate
          {...defaultProps}
          illustrationSrc="/images/locked-content.png"
        />
      );

      const img = screen.getByRole("img", { hidden: true });
      // Image should be decorative and blurred
      expect(img).toHaveClass("pointer-events-none");
    });
  });

  describe("Accessibility", () => {
    it("button is keyboard accessible", () => {
      render(<SectionGate {...defaultProps} />);

      const button = screen.getByRole("button", { name: /unlock full results/i });
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe("button");
    });

    it("teaser text is readable", () => {
      render(<SectionGate {...defaultProps} />);

      const text = screen.getByText("Download the app to see your full dating profile");
      expect(text.tagName.toLowerCase()).toBe("p");
    });
  });
});
