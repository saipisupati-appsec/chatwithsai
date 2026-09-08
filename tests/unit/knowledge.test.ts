import { describe, it, expect } from "vitest";
import {
  checkSkill,
  getUnknownSkills,
  KNOWLEDGE_VERSION,
} from "../../src/lib/knowledge";

describe("knowledge.checkSkill", () => {
  it("marks AWS as verified", () => {
    const r = checkSkill("AWS");
    expect(r.status).toBe("VERIFIED");
  });

  it("marks Kubernetes as UNKNOWN", () => {
    const r = checkSkill("Kubernetes");
    expect(r.status).toBe("UNKNOWN");
  });

  it("marks Go as UNKNOWN", () => {
    const r = checkSkill("Go");
    expect(r.status).toBe("UNKNOWN");
  });

  it("marks SAST as verified", () => {
    const r = checkSkill("SAST");
    expect(r.status).toBe("VERIFIED");
  });

  it("does not invent TypeScript", () => {
    const r = checkSkill("TypeScript");
    expect(r.status).toBe("UNKNOWN");
  });

  it("exposes knowledge version", () => {
    expect(KNOWLEDGE_VERSION).toBe("1.0.0");
  });

  it("lists unknown skills", () => {
    const u = getUnknownSkills();
    expect(u).toContain("Kubernetes");
    expect(u).toContain("Go");
  });
});
