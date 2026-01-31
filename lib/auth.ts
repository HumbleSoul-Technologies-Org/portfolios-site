import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret";
const USERNAME = process.env.AUTH_USERNAME || "admin";
const PASSWORD = process.env.AUTH_PASSWORD || "123456";
const SESSION_MAX_AGE = 60 * 60; // seconds (1 hour)

export function createSession(username: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = { username, exp };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySession(token?: string) {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.username as string;
  } catch (err) {
    return null;
  }
}

function timingSafeEqual(a: string, b: string) {
  try {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch (err) {
    return false;
  }
}

export function validateCredentials(username: string, password: string) {
  return username === USERNAME && password === PASSWORD;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE;
