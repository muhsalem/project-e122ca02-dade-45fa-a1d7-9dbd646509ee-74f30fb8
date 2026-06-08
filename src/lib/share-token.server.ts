// HMAC-signed stateless share-tokens for report links.
// Token format: base64url(payload) + "." + base64url(hmac_sha256(payload, SECRET))
// Payload: { c: code, e: exp_unix_seconds }
// No DB needed — verification recomputes the HMAC.
//
// SERVER-ONLY: this file MUST only be imported inside .handler() bodies
// (uses process.env.SHARE_TOKEN_SECRET).

function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(str: string): Uint8Array {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSecret(): string {
  // Falls back to a derived value from SUPABASE_SERVICE_ROLE_KEY so the feature
  // works even if SHARE_TOKEN_SECRET isn't set yet. Production should set it.
  return (
    process.env.SHARE_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "bosla-dev-fallback-please-set-SHARE_TOKEN_SECRET"
  );
}

function toAB(bytes: Uint8Array): ArrayBuffer {
  // Force a fresh ArrayBuffer (not SharedArrayBuffer) for Web Crypto type compat.
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return ab;
}

/** Sign a code into a share token that expires in `ttlDays` days (default 30). */
export async function signShareToken(code: string, ttlDays = 30): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86400;
  const payload = JSON.stringify({ c: code, e: exp });
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await hmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign("HMAC", key, toAB(payloadBytes));
  return `${b64urlEncode(payloadBytes)}.${b64urlEncode(new Uint8Array(sigBuf))}`;
}

/** Verify a token and return its code, or null when invalid/expired. */
export async function verifyShareToken(token: string): Promise<string | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const payloadBytes = b64urlDecode(payloadB64);
    const sigBytes = b64urlDecode(sigB64);
    const key = await hmacKey(getSecret());
    const ok = await crypto.subtle.verify("HMAC", key, toAB(sigBytes), toAB(payloadBytes));
    if (!ok) return null;
    const { c, e } = JSON.parse(new TextDecoder().decode(payloadBytes)) as { c: string; e: number };
    if (typeof c !== "string" || typeof e !== "number") return null;
    if (Date.now() / 1000 > e) return null;
    return c;
  } catch {
    return null;
  }
}
