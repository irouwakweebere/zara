import "server-only";

import { defaultSiteContent, isSiteContent, type SiteContent } from "./site-content-model";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function isSiteContentStoreConfigured() {
  return getSupabaseConfig() !== null;
}

export async function getSiteContent(): Promise<SiteContent> {
  const config = getSupabaseConfig();
  if (!config) return defaultSiteContent;

  const response = await fetch(`${config.url}/rest/v1/site_content?id=eq.homepage&select=content`, {
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The homepage content could not be loaded from Supabase.");

  const rows: unknown = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) return defaultSiteContent;

  const row = rows[0];
  if (!row || typeof row !== "object" || !("content" in row) || !isSiteContent(row.content)) {
    throw new Error("The saved homepage content has an invalid format.");
  }

  return row.content;
}

export async function saveSiteContent(content: SiteContent) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Homepage editing needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY configured on the server.");

  const response = await fetch(`${config.url}/rest/v1/site_content?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ id: "homepage", content, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Supabase could not save the homepage content. Check the table schema and service-role key.");
}