/**
 * SSRF protection for job URL fetching.
 * Only HTTPS public destinations are allowed.
 * Every redirect must be re-validated.
 */

import { lookup } from "dns/promises";
import { isIP } from "net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata",
]);

/** Private / reserved IPv4 ranges (RFC1918 + link-local + loopback + metadata). */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;

  const [a, b] = parts;

  // 0.0.0.0/8, 127.0.0.0/8
  if (a === 0 || a === 127) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 169.254.0.0/16 (link-local + cloud metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (CGNAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // ULA
  if (normalized.startsWith("fe80")) return true; // link-local
  if (normalized.startsWith("::ffff:")) {
    // IPv4-mapped
    const v4 = normalized.slice(7);
    return isPrivateIPv4(v4);
  }
  return false;
}

export function isPrivateOrLocalIP(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true; // unknown → reject
}

export interface UrlValidationResult {
  ok: boolean;
  error?: string;
  hostname?: string;
  resolvedIps?: string[];
}

/**
 * Validate a candidate job URL before any network request.
 * Rejects non-HTTPS, credentials in URL, private hosts, etc.
 */
export async function validateJobUrl(
  rawUrl: string,
  maxLength = 2000
): Promise<UrlValidationResult> {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { ok: false, error: "URL is required." };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > maxLength) {
    return { ok: false, error: "URL exceeds maximum allowed length." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL format." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Only HTTPS URLs are allowed." };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: "URLs with credentials are not allowed." };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { ok: false, error: "This host is not allowed." };
  }

  // Reject obvious internal / IP literals that are private
  if (isIP(hostname) && isPrivateOrLocalIP(hostname)) {
    return { ok: false, error: "Private or local IP addresses are not allowed." };
  }

  // DNS resolution + re-check IPs (basic DNS rebinding mitigation)
  let resolvedIps: string[] = [];
  try {
    const records = await lookup(hostname, { all: true });
    resolvedIps = records.map((r) => r.address);
  } catch {
    return { ok: false, error: "Could not resolve hostname." };
  }

  if (resolvedIps.length === 0) {
    return { ok: false, error: "Hostname resolved to no addresses." };
  }

  for (const ip of resolvedIps) {
    if (isPrivateOrLocalIP(ip)) {
      return {
        ok: false,
        error: "Hostname resolves to a private or local address.",
        hostname,
        resolvedIps,
      };
    }
  }

  return { ok: true, hostname, resolvedIps };
}

export const SSRF_LIMITS = {
  maxRedirects: 3,
  timeoutMs: 10_000,
  maxResponseBytes: 5 * 1024 * 1024, // 5 MB
} as const;
