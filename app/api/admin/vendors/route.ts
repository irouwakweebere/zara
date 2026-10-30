import { revalidatePath } from "next/cache";
import { hasAdminSession } from "../../../lib/admin-auth";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: "Request could not be verified." }, { status: 403 });
  }
  if (!(await hasAdminSession())) {
    return Response.json({ error: "Your admin session has expired. Sign in again." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send valid vendor review details." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string"
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)
    || !("status" in body) || (body.status !== "approved" && body.status !== "rejected")) {
    return Response.json({ error: "Choose a valid vendor application and review decision." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ error: "Vendor review is not configured on the server." }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("vendor_profiles")
    .update({ status: body.status })
    .eq("id", body.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return Response.json({ error: "The vendor application could not be updated." }, { status: 503 });
  }
  if (!data) {
    return Response.json({ error: "That application was already reviewed or no longer exists." }, { status: 409 });
  }

  revalidatePath("/shops", "page");
  revalidatePath("/shops/[slug]", "page");
  revalidatePath("/admin/vendors", "page");
  return Response.json({ reviewed: true });
}
