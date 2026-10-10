import SiteContentEditor from "./site-content-editor";
import { defaultSiteContent } from "../../lib/site-content-model";
import { getSiteContent, isSiteContentStoreConfigured } from "../../lib/site-content";

export default async function AdminContentPage() {
  const storageConfigured = isSiteContentStoreConfigured();
  let content = defaultSiteContent;
  let loadError = "";

  if (storageConfigured) {
    try {
      content = await getSiteContent();
    } catch {
      loadError = "Saved content could not be loaded. Check the Supabase URL, service-role key, and table setup.";
    }
  }

  return <SiteContentEditor initialContent={content} storageConfigured={storageConfigured} loadError={loadError} />;
}