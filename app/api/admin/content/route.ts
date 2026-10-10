import { revalidatePath } from "next/cache";
import { hasAdminSession } from "../../../lib/admin-auth";
import { isSiteContent } from "../../../lib/site-content-model";
import { saveSiteContent } from "../../../lib/site-content";

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Request could not be verified." }, { status: 403 });
  }

  if (!(await hasAdminSession())) {
    return Response.json({ error: "Your admin session has expired. Sign in again." }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 100_000) {
    return Response.json({ error: "That content update is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send valid homepage content." }, { status: 400 });
  }

  if (!isSiteContent(body)) {
    return Response.json({ error: "Some fields are invalid or too long. Check the image URLs and required fields." }, { status: 400 });
  }

  try {
    await saveSiteContent(body);
  } catch {
    return Response.json({ error: "Changes could not be published. Check Supabase configuration and table setup." }, { status: 503 });
  }

  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  return Response.json({ published: true });
}