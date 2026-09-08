import { describe, it, expect } from "vitest";
import { calculateMatch, formatMatchResult } from "../../src/lib/matching";

describe("matching.calculateMatch", () => {
  it("scores high when required skills are verified", () => {
    const result = calculateMatch({
      requiredSkills: ["SAST", "AWS", "Threat Modelling", "Application Security"],
      preferredSkills: [],
      experienceRequirements: [],
      responsibilities: [],
      educationRequirements: [],
      certifications: [],
    });
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.strongMatches.length).toBeGreaterThan(0);
  });

  it("records Kubernetes as unknown/gap", () => {
    const result = calculateMatch({
      requiredSkills: ["Kubernetes", "SAST"],
      preferredSkills: [],
      experienceRequirements: [],
      responsibilities: [],
      educationRequirements: [],
      certifications: [],
    });
    const unknownOrGap = [...result.unknowns, ...result.gaps];
    expect(unknownOrGap.some((d) => /kubernetes/i.test(d.item))).toBe(true);
  });

  it("formatMatchResult includes score band", () => {
    const result = calculateMatch({
      requiredSkills: ["SAST"],
      preferredSkills: [],
      experienceRequirements: [],
      responsibilities: [],
      educationRequirements: [],
      certifications: [],
    });
    const text = formatMatchResult(result);
    expect(text).toContain("Match:");
    expect(text).toMatch(/Strong Match|Good Match|Moderate Match|Limited Match/);
  });
});
