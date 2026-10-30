import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();

  if (!supabase || !code) {
    return NextResponse.redirect(new URL("/vendors/login?error=verification", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/vendors/login?error=verification", url.origin));
  }

  return NextResponse.redirect(new URL("/vendors/dashboard", url.origin));
}
