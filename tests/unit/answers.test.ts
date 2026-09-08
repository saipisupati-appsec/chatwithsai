import { describe, it, expect } from "vitest";
import { answerQuestion, detectTopic } from "../../src/lib/answers";

describe("answers topic detection", () => {
  it("maps threat modelling variants", () => {
    expect(detectTopic("Does Sai have threat modelling experience?")).toBe(
      "threat_modelling"
    );
    expect(detectTopic("Has Sai done STRIDE?")).toBe("threat_modelling");
    expect(detectTopic("threat modeling experience")).toBe("threat_modelling");
  });

  it("maps AWS / Wiz / JFrog / Checkmarx / SAST", () => {
    expect(detectTopic("Does Sai have AWS experience?")).toBe("aws");
    expect(detectTopic("Wiz experience")).toBe("wiz");
    expect(detectTopic("What is Sai's JFrog experience?")).toBe("jfrog");
    expect(detectTopic("Checkmarx")).toBe("checkmarx");
    expect(detectTopic("SAST tools")).toBe("sast");
  });

  it("maps hobbies and cricket", () => {
    expect(detectTopic("What are Sai's hobbies?")).toBe("hobbies");
    expect(detectTopic("Does Sai know cricket?")).toBe("cricket");
  });

  it("keeps Kubernetes and singing unknown-style topics", () => {
    expect(detectTopic("Does Sai have Kubernetes experience?")).toBe(
      "kubernetes"
    );
    expect(detectTopic("Does Sai know singing?")).toBe("singing");
  });

  it("uses lastTopic for short follow-ups", () => {
    expect(detectTopic("What about that?", "threat_modelling")).toBe(
      "threat_modelling"
    );
  });
});

describe("answerQuestion content", () => {
  it("answers threat modelling positively", () => {
    const r = answerQuestion("Does Sai have threat modelling experience?", {
      mode: "general",
    });
    expect(r.text.toLowerCase()).toMatch(/stride|threat/);
    expect(r.text).not.toMatch(/I'm ChatWithSai, focused/);
  });

  it("does not claim singing", () => {
    const r = answerQuestion("Does Sai know singing?", { mode: "general" });
    expect(r.text.toLowerCase()).toMatch(/isn't listed|can't verify/);
  });

  it("does not claim kubernetes", () => {
    const r = answerQuestion("Kubernetes experience?", { mode: "general" });
    expect(r.text.toLowerCase()).toMatch(/not currently verified|won't turn aws/);
  });

  it("lists hobbies including cricket", () => {
    const r = answerQuestion("What are Sai's hobbies?", { mode: "general" });
    expect(r.text.toLowerCase()).toMatch(/cricket/);
    expect(r.text.toLowerCase()).toMatch(/chess/);
  });
});
