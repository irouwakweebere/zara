import { cookies } from "next/headers";
import { adminSessionCookie, createAdminSession, isAdminConfigured, verifyAdminPassword } from "../../../lib/admin-auth";

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Request could not be verified." }, { status: 403 });
  }

  if (!isAdminConfigured()) {
    return Response.json({ error: "Admin login is not configured. Add the required server environment variables." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter your admin password." }, { status: 400 });
  }

  const password = body && typeof body === "object" && "password" in body && typeof body.password === "string"
    ? body.password
    : "";
  if (password.length > 1024 || !verifyAdminPassword(password)) {
    return Response.json({ error: "That password wasn't recognized." }, { status: 401 });
  }

  const session = createAdminSession();
  if (!session) {
    return Response.json({ error: "Admin login is not configured." }, { status: 503 });
  }

  (await cookies()).set(adminSessionCookie.name, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: adminSessionCookie.durationSeconds,
  });

  return Response.json({ authenticated: true });
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Request could not be verified." }, { status: 403 });
  }

  (await cookies()).delete(adminSessionCookie.name);
  return Response.json({ authenticated: false });
}