// HMAC-signed stateless share-tokens for report links.
// Token format: base64url(payload) + "." + base64url(hmac_sha256(payload, SECRET))
// Payload: { c: code, e: exp_unix_seconds, ph?: sha256_hex(password) }
// SERVER-ONLY: import inside .handler() bodies only.

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
  const bytes = new TextEncoder().encode(secret);
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return crypto.subtle.importKey("raw", ab, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function getSecret(): string {
  return (
    process.env.SHARE_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "bosla-dev-fallback-please-set-SHARE_TOKEN_SECRET"
  );
}

function toAB(bytes: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return ab;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", toAB(bytes));
  const arr = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, "0");
  return hex;
}

/** Constant-time equal for equal-length strings. */
function ctEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Sign a code into a share token that expires in `ttlDays` days (default 7). */
export async function signShareToken(
  code: string,
  ttlDays = 7,
  password?: string,
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + Math.max(1, Math.min(30, ttlDays)) * 86400;
  const payloadObj: { c: string; e: number; ph?: string } = { c: code, e: exp };
  if (password && password.length > 0) payloadObj.ph = await sha256Hex(password);
  const payload = JSON.stringify(payloadObj);
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await hmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign("HMAC", key, toAB(payloadBytes));
  return `${b64urlEncode(payloadBytes)}.${b64urlEncode(new Uint8Array(sigBuf))}`;
}

export type VerifyResult =
  | { ok: true; code: string; requiresPassword: false }
  | { ok: false; reason: "password_required" }
  | { ok: false; reason: "bad_password" }
  | { ok: false; reason: "invalid" }
  | { ok: false; reason: "expired" };

/** Verify a token (and optional password) and return the code or a typed error. */
export async function verifyShareToken(token: string, password?: string): Promise<VerifyResult> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return { ok: false, reason: "invalid" };
    const payloadBytes = b64urlDecode(payloadB64);
    const sigBytes = b64urlDecode(sigB64);
    const key = await hmacKey(getSecret());
    const sigOk = await crypto.subtle.verify("HMAC", key, toAB(sigBytes), toAB(payloadBytes));
    if (!sigOk) return { ok: false, reason: "invalid" };
    const parsed = JSON.parse(new TextDecoder().decode(payloadBytes)) as { c: string; e: number; ph?: string };
    if (typeof parsed.c !== "string" || typeof parsed.e !== "number") return { ok: false, reason: "invalid" };
    if (Date.now() / 1000 > parsed.e) return { ok: false, reason: "expired" };
    if (parsed.ph) {
      if (!password) return { ok: false, reason: "password_required" };
      const supplied = await sha256Hex(password);
      if (!ctEq(supplied, parsed.ph)) return { ok: false, reason: "bad_password" };
    }
    return { ok: true, code: parsed.c, requiresPassword: false };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

/** Peek at a token: does it require a password? Does not validate the password. */
export async function inspectShareToken(token: string): Promise<
  | { ok: true; requiresPassword: boolean; expiresAt: number }
  | { ok: false; reason: "invalid" | "expired" }
> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return { ok: false, reason: "invalid" };
    const payloadBytes = b64urlDecode(payloadB64);
    const sigBytes = b64urlDecode(sigB64);
    const key = await hmacKey(getSecret());
    const sigOk = await crypto.subtle.verify("HMAC", key, toAB(sigBytes), toAB(payloadBytes));
    if (!sigOk) return { ok: false, reason: "invalid" };
    const parsed = JSON.parse(new TextDecoder().decode(payloadBytes)) as { c: string; e: number; ph?: string };
    if (Date.now() / 1000 > parsed.e) return { ok: false, reason: "expired" };
    return { ok: true, requiresPassword: !!parsed.ph, expiresAt: parsed.e };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
