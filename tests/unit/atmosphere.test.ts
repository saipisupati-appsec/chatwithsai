import { describe, it, expect } from "vitest";
import {
  resolveAtmosphere,
  atmospheres,
  ATMOSPHERE_STORAGE_KEY,
} from "../../src/config/themes";

describe("atmosphere config", () => {
  it("exposes storage key", () => {
    expect(ATMOSPHERE_STORAGE_KEY).toBe("chatwithsai-atmosphere");
  });

  it("resolveAtmosphere leaves explicit seasons unchanged", () => {
    expect(resolveAtmosphere("spring")).toBe("spring");
    expect(resolveAtmosphere("night")).toBe("night");
    expect(resolveAtmosphere("rainy")).toBe("rainy");
  });

  it("resolveAtmosphere(auto) returns a concrete season", () => {
    const r = resolveAtmosphere("auto");
    expect(["spring", "summer", "autumn", "winter"]).toContain(r);
  });

  it("every atmosphere has a className except auto", () => {
    expect(atmospheres.auto.className).toBe("");
    expect(atmospheres.spring.className).toBe("atmosphere-spring");
    expect(atmospheres.summer.className).toBe("atmosphere-summer");
    expect(atmospheres.autumn.className).toBe("atmosphere-autumn");
    expect(atmospheres.winter.className).toBe("atmosphere-winter");
    expect(atmospheres.rainy.className).toBe("atmosphere-rainy");
    expect(atmospheres.night.className).toBe("atmosphere-night");
  });
});
