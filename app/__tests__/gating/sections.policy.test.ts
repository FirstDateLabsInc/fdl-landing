import { describe, it, expect } from "vitest";
import {
  SECTION_POLICY,
  isSectionLocked,
  getTeaserCount,
  getLockedSections,
  getFreeSections,
  type SectionId,
} from "@/lib/quiz/sections.policy";

describe("Section Policy", () => {
  describe("SECTION_POLICY configuration", () => {
    it("should define all expected sections", () => {
      const expectedSections: SectionId[] = [
        "hero",
        "pattern",
        "datingCycle",
        "rootCause",
        "profile",
        "scoreInsights",
        "datingMeaning",
        "redFlags",
        "coachingFocus",
        "loveLanguages",
      ];

      const actualSections = Object.keys(SECTION_POLICY);
      expect(actualSections).toEqual(expect.arrayContaining(expectedSections));
      expect(actualSections.length).toBe(expectedSections.length);
    });

    it("should have locked boolean on all sections", () => {
      for (const config of Object.values(SECTION_POLICY)) {
        expect(typeof config.locked).toBe("boolean");
      }
    });
  });

  describe("isSectionLocked", () => {
    it("should return false for free sections", () => {
      expect(isSectionLocked("hero")).toBe(false);
      expect(isSectionLocked("pattern")).toBe(false);
      expect(isSectionLocked("rootCause")).toBe(false);
      expect(isSectionLocked("profile")).toBe(false);
      expect(isSectionLocked("loveLanguages")).toBe(false);
    });

    it("should return true for locked sections", () => {
      expect(isSectionLocked("datingCycle")).toBe(true);
      expect(isSectionLocked("scoreInsights")).toBe(true);
      expect(isSectionLocked("datingMeaning")).toBe(true);
      expect(isSectionLocked("redFlags")).toBe(true);
      expect(isSectionLocked("coachingFocus")).toBe(true);
    });
  });

  describe("getTeaserCount", () => {
    it("should return correct teaser counts for locked sections", () => {
      expect(getTeaserCount("datingCycle")).toBe(2);
      expect(getTeaserCount("redFlags")).toBe(1);
    });

    it("should return 0 for sections without teaserCount", () => {
      expect(getTeaserCount("pattern")).toBe(0);
      expect(getTeaserCount("loveLanguages")).toBe(0);
      expect(getTeaserCount("datingMeaning")).toBe(0);
      expect(getTeaserCount("coachingFocus")).toBe(0);
      expect(getTeaserCount("scoreInsights")).toBe(0);
    });
  });

  describe("getLockedSections", () => {
    it("should return all locked section IDs", () => {
      const locked = getLockedSections();

      expect(locked).toContain("datingCycle");
      expect(locked).toContain("scoreInsights");
      expect(locked).toContain("datingMeaning");
      expect(locked).toContain("redFlags");
      expect(locked).toContain("coachingFocus");
    });

    it("should not include free sections", () => {
      const locked = getLockedSections();

      expect(locked).not.toContain("hero");
      expect(locked).not.toContain("pattern");
      expect(locked).not.toContain("rootCause");
      expect(locked).not.toContain("profile");
      expect(locked).not.toContain("loveLanguages");
    });

    it("should return exactly 5 locked sections", () => {
      expect(getLockedSections().length).toBe(5);
    });
  });

  describe("getFreeSections", () => {
    it("should return all free section IDs", () => {
      const free = getFreeSections();

      expect(free).toContain("hero");
      expect(free).toContain("pattern");
      expect(free).toContain("rootCause");
      expect(free).toContain("profile");
      expect(free).toContain("loveLanguages");
    });

    it("should not include locked sections", () => {
      const free = getFreeSections();

      expect(free).not.toContain("datingCycle");
      expect(free).not.toContain("scoreInsights");
      expect(free).not.toContain("datingMeaning");
      expect(free).not.toContain("redFlags");
      expect(free).not.toContain("coachingFocus");
    });

    it("should return exactly 5 free sections", () => {
      expect(getFreeSections().length).toBe(5);
    });
  });

  describe("policy consistency", () => {
    it("should have locked + free sections equal total sections", () => {
      const locked = getLockedSections();
      const free = getFreeSections();
      const total = Object.keys(SECTION_POLICY).length;

      expect(locked.length + free.length).toBe(total);
    });

    it("should have no overlap between locked and free", () => {
      const locked = new Set(getLockedSections());
      const free = getFreeSections();

      for (const section of free) {
        expect(locked.has(section)).toBe(false);
      }
    });
  });
});
