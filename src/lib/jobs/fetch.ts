/**
 * Secure job page fetcher.
 * SSRF-hardened, size-limited, redirect-validated.
 */

import {
  validateJobUrl,
  SSRF_LIMITS,
  isPrivateOrLocalIP,
} from "@/lib/security/ssrf";
import { LIMITS } from "@/lib/security/limits";

export interface FetchResult {
  ok: boolean;
  html?: string;
  finalUrl?: string;
  error?: string;
  contentType?: string;
}

async function resolveAndCheck(hostname: string): Promise<string | null> {
  try {
    const { lookup } = await import("dns/promises");
    const records = await lookup(hostname, { all: true });
    for (const r of records) {
      if (isPrivateOrLocalIP(r.address)) {
        return "Hostname resolves to a private or local address.";
      }
    }
    return null;
  } catch {
    return "Could not resolve hostname.";
  }
}

/**
 * Fetch a job page with full SSRF protection.
 * Re-validates every redirect target.
 */
export async function fetchJobPage(rawUrl: string): Promise<FetchResult> {
  const initial = await validateJobUrl(rawUrl, LIMITS.MAX_URL_LENGTH);
  if (!initial.ok) {
    return { ok: false, error: initial.error };
  }

  let currentUrl = rawUrl.trim();
  let redirects = 0;

  while (redirects <= SSRF_LIMITS.maxRedirects) {
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      return { ok: false, error: "Invalid URL during redirect chain." };
    }

    if (parsed.protocol !== "https:") {
      return { ok: false, error: "Only HTTPS is allowed (including redirects)." };
    }

    const dnsError = await resolveAndCheck(parsed.hostname);
    if (dnsError) {
      return { ok: false, error: dnsError };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SSRF_LIMITS.timeoutMs);

    try {
      const res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "ChatWithSai-JobFetcher/1.0",
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
      });

      clearTimeout(timer);

      // Handle redirects manually so we can re-validate
      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const location = res.headers.get("location");
        if (!location) {
          return { ok: false, error: "Redirect without Location header." };
        }
        const next = new URL(location, currentUrl).toString();
        const nextValidation = await validateJobUrl(next, LIMITS.MAX_URL_LENGTH);
        if (!nextValidation.ok) {
          return {
            ok: false,
            error: `Redirect blocked: ${nextValidation.error}`,
          };
        }
        currentUrl = next;
        redirects += 1;
        continue;
      }

      if (!res.ok) {
        return {
          ok: false,
          error: `Job page returned HTTP ${res.status}. Please paste the job description instead.`,
        };
      }

      const contentType = res.headers.get("content-type") || "";
      if (
        !contentType.includes("text/html") &&
        !contentType.includes("application/xhtml") &&
        !contentType.includes("text/plain")
      ) {
        return {
          ok: false,
          error: "Unexpected content type. Expected HTML job page.",
        };
      }

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength > SSRF_LIMITS.maxResponseBytes) {
        return { ok: false, error: "Job page exceeds maximum allowed size." };
      }

      const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
      return {
        ok: true,
        html,
        finalUrl: currentUrl,
        contentType,
      };
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        return { ok: false, error: "Job page request timed out." };
      }
      return {
        ok: false,
        error:
          "I couldn't safely retrieve that job page. Please paste the job description instead.",
      };
    }
  }

  return { ok: false, error: "Too many redirects." };
}
