import { describe, it, expect } from "vitest";
import { isPrivateOrLocalIP, validateJobUrl } from "../../src/lib/security/ssrf";

describe("ssrf.isPrivateOrLocalIP", () => {
  it("blocks loopback", () => {
    expect(isPrivateOrLocalIP("127.0.0.1")).toBe(true);
    expect(isPrivateOrLocalIP("0.0.0.0")).toBe(true);
  });

  it("blocks RFC1918", () => {
    expect(isPrivateOrLocalIP("10.0.0.1")).toBe(true);
    expect(isPrivateOrLocalIP("192.168.1.1")).toBe(true);
    expect(isPrivateOrLocalIP("172.16.0.1")).toBe(true);
  });

  it("blocks metadata IP", () => {
    expect(isPrivateOrLocalIP("169.254.169.254")).toBe(true);
  });

  it("allows public IP", () => {
    expect(isPrivateOrLocalIP("8.8.8.8")).toBe(false);
  });
});

describe("ssrf.validateJobUrl", () => {
  it("rejects non-HTTPS", async () => {
    const r = await validateJobUrl("http://example.com/job");
    expect(r.ok).toBe(false);
  });

  it("rejects localhost", async () => {
    const r = await validateJobUrl("https://localhost/job");
    expect(r.ok).toBe(false);
  });

  it("rejects file scheme", async () => {
    const r = await validateJobUrl("file:///etc/passwd");
    expect(r.ok).toBe(false);
  });
});
