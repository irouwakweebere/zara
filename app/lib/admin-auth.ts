import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const sessionCookieName = "truth_admin_session";
const sessionDurationSeconds = 8 * 60 * 60;

function getAdminSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!password || password.length < 12 || !sessionSecret || sessionSecret.length < 32) {
    return null;
  }

  return { password, sessionSecret };
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signExpiration(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function isAdminConfigured() {
  return getAdminSecrets() !== null;
}

export function verifyAdminPassword(password: string) {
  const secrets = getAdminSecrets();
  return secrets !== null && constantTimeEqual(password, secrets.password);
}

export function createAdminSession() {
  const secrets = getAdminSecrets();
  if (!secrets) return null;

  const expiresAt = String(Math.floor(Date.now() / 1000) + sessionDurationSeconds);
  return `${expiresAt}.${signExpiration(expiresAt, secrets.sessionSecret)}`;
}

export async function hasAdminSession() {
  const secrets = getAdminSecrets();
  if (!secrets) return false;

  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return false;

  const [expiresAt, signature, extra] = token.split(".");
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  return constantTimeEqual(signature, signExpiration(expiresAt, secrets.sessionSecret));
}

export const adminSessionCookie = {
  name: sessionCookieName,
  durationSeconds: sessionDurationSeconds,
};