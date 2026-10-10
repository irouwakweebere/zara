"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import AdminLogoutButton from "../admin-logout-button";
import type { SiteContent } from "../../lib/site-content-model";

type EditorSection = "Home" | "Services" | "Learn" | "Products" | "Brand & footer";
type EditableSection = "hero" | "services" | "learn" | "shop" | "closing";

type SiteContentEditorProps = {
  initialContent: SiteContent;
  storageConfigured: boolean;
  loadError: string;
};

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: "text" | "email" | "url";
};

function TextField({ label, value, onChange, multiline = false, type = "text" }: TextFieldProps) {
  return (
    <label className="admin-editor-field">
      <span>{label}</span>
      {multiline ? <textarea maxLength={500} onChange={(event) => onChange(event.target.value)} rows={3} value={value} /> : <input maxLength={2048} onChange={(event) => onChange(event.target.value)} type={type} value={value} />}
    </label>
  );
}

export default function SiteContentEditor({ initialContent, storageConfigured, loadError }: SiteContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [activeSection, setActiveSection] = useState<EditorSection>("Home");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function updateSection(section: EditableSection, field: string, value: string) {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    } as SiteContent));
    setIsSaved(false);
    setMessage("");
  }

  function updateBrand(field: keyof SiteContent["brand"], value: string) {
    setContent((current) => ({ ...current, brand: { ...current.brand, [field]: value } }));
    setIsSaved(false);
    setMessage("");
  }

  function updateService(index: number, field: keyof SiteContent["services"]["items"][number], value: string) {
    setContent((current) => ({
      ...current,
      services: { ...current.services, items: current.services.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) },
    }));
    setIsSaved(false);
    setMessage("");
  }

  function updateLearnItem(index: number, field: keyof SiteContent["learn"]["items"][number], value: string) {
    setContent((current) => ({
      ...current,
      learn: { ...current.learn, items: current.learn.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) },
    }));
    setIsSaved(false);
    setMessage("");
  }

  function updateProduct(index: number, field: keyof SiteContent["shop"]["items"][number], value: string) {
    setContent((current) => ({
      ...current,
      shop: { ...current.shop, items: current.shop.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) },
    }));
    setIsSaved(false);
    setMessage("");
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Changes could not be published. Please try again.");
        return;
      }

      setIsSaved(true);
      setMessage("Changes published. Your public homepage is updated.");
    } catch {
      setMessage("We couldn't connect. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/" aria-label="Skindrug Gist home">
          <span className="admin-brand-mark">t.</span>
          <span>SKINDRUG<span className="admin-brand-subtitle">GIST ADMIN</span></span>
        </Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link className="admin-nav-link" href="/admin"><span className="admin-nav-dot" />Overview</Link>
          <a className="admin-nav-link" href="/admin#requests"><span className="admin-nav-dot" />Consultations</a>
          <Link className="admin-nav-link active" href="/admin/content"><span className="admin-nav-dot" />Website content</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <p>Workspace <span>/</span> Website content</p>
          <div className="admin-topbar-actions">
            <Link className="admin-public-link" href="/">View public site <span aria-hidden="true">↗</span></Link>
            <AdminLogoutButton />
          </div>
        </header>

        <div className="admin-content admin-editor-page">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">SITE EDITOR</p>
              <h1>Make it yours.</h1>
              <p className="admin-subheading">Update the words, offers, and imagery visitors see on your homepage.</p>
            </div>
            <span className={`admin-preview-badge${isSaved ? " saved" : ""}`}><span />{isSaved ? "Published" : "Unpublished edits"}</span>
          </div>

          {!storageConfigured && <p className="admin-editor-alert" role="status">Connect Supabase to publish edits. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in the server environment.</p>}
          {loadError && <p className="admin-editor-alert" role="alert">{loadError}</p>}

          <form className="admin-editor-form" onSubmit={publish}>
            <div className="admin-editor-tabs" role="tablist" aria-label="Homepage sections">
              {(["Home", "Services", "Learn", "Products", "Brand & footer"] as const).map((section) => (
                <button aria-selected={activeSection === section} className={activeSection === section ? "active" : ""} key={section} onClick={() => setActiveSection(section)} role="tab" type="button">{section}</button>
              ))}
            </div>

            <div className="admin-editor-body">
              {activeSection === "Home" && <>
                <div className="admin-editor-heading"><div><p className="admin-eyebrow">FIRST IMPRESSION</p><h2>Hero section</h2></div><span>01 / 02</span></div>
                <div className="admin-editor-grid">
                  <TextField label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateSection("hero", "eyebrow", value)} />
                  <TextField label="Main heading" value={content.hero.heading} onChange={(value) => updateSection("hero", "heading", value)} />
                  <TextField label="Emphasized heading" value={content.hero.emphasis} onChange={(value) => updateSection("hero", "emphasis", value)} />
                  <TextField label="Hero button" value={content.hero.ctaText} onChange={(value) => updateSection("hero", "ctaText", value)} />
                  <TextField label="Secondary link" value={content.hero.secondaryCtaText} onChange={(value) => updateSection("hero", "secondaryCtaText", value)} />
                  <TextField label="Description" multiline value={content.hero.description} onChange={(value) => updateSection("hero", "description", value)} />
                  <TextField label="Image URL (HTTPS)" type="url" value={content.hero.imageUrl} onChange={(value) => updateSection("hero", "imageUrl", value)} />
                  <TextField label="Image description" value={content.hero.imageAlt} onChange={(value) => updateSection("hero", "imageAlt", value)} />
                  <TextField label="Proof line" value={content.hero.proofTitle} onChange={(value) => updateSection("hero", "proofTitle", value)} />
                  <TextField label="Proof description" value={content.hero.proofDescription} onChange={(value) => updateSection("hero", "proofDescription", value)} />
                  <TextField label="Image caption (first line)" value={content.hero.captionFirst} onChange={(value) => updateSection("hero", "captionFirst", value)} />
                  <TextField label="Image caption (second line)" value={content.hero.captionSecond} onChange={(value) => updateSection("hero", "captionSecond", value)} />
                  <TextField label="Image seal (top line)" value={content.hero.sealFirst} onChange={(value) => updateSection("hero", "sealFirst", value)} />
                  <TextField label="Image seal (middle line)" value={content.hero.sealSecond} onChange={(value) => updateSection("hero", "sealSecond", value)} />
                  <TextField label="Image seal (final word)" value={content.hero.sealFinal} onChange={(value) => updateSection("hero", "sealFinal", value)} />
                </div>
                <div className="admin-editor-heading admin-editor-secondary"><div><p className="admin-eyebrow">NEXT STEP</p><h2>Closing section</h2></div><span>02 / 02</span></div>
                <div className="admin-editor-grid">
                  <TextField label="Eyebrow" value={content.closing.eyebrow} onChange={(value) => updateSection("closing", "eyebrow", value)} />
                  <TextField label="Main heading" value={content.closing.heading} onChange={(value) => updateSection("closing", "heading", value)} />
                  <TextField label="Emphasized heading" value={content.closing.emphasis} onChange={(value) => updateSection("closing", "emphasis", value)} />
                  <TextField label="Button" value={content.closing.ctaText} onChange={(value) => updateSection("closing", "ctaText", value)} />
                  <TextField label="Description" multiline value={content.closing.description} onChange={(value) => updateSection("closing", "description", value)} />
                  <TextField label="Signature line" value={content.closing.signature} onChange={(value) => updateSection("closing", "signature", value)} />
                </div>
              </>}

              {activeSection === "Services" && <>
                <div className="admin-editor-heading"><div><p className="admin-eyebrow">WHAT YOU OFFER</p><h2>Services</h2></div><span>3 items</span></div>
                <div className="admin-editor-grid">
                  <TextField label="Eyebrow" value={content.services.eyebrow} onChange={(value) => updateSection("services", "eyebrow", value)} />
                  <TextField label="Main heading" value={content.services.heading} onChange={(value) => updateSection("services", "heading", value)} />
                  <TextField label="Emphasized heading" value={content.services.emphasis} onChange={(value) => updateSection("services", "emphasis", value)} />
                  <TextField label="Intro" multiline value={content.services.description} onChange={(value) => updateSection("services", "description", value)} />
                </div>
                {content.services.items.map((service, index) => <div className="admin-editor-item" key={index}>
                  <p className="admin-editor-item-label">SERVICE 0{index + 1}</p>
                  <div className="admin-editor-grid">
                    <TextField label="Name" value={service.title} onChange={(value) => updateService(index, "title", value)} />
                    <TextField label="Detail line" value={service.detail} onChange={(value) => updateService(index, "detail", value)} />
                    <TextField label="Description" multiline value={service.copy} onChange={(value) => updateService(index, "copy", value)} />
                  </div>
                </div>)}
              </>}

              {activeSection === "Learn" && <>
                <div className="admin-editor-heading"><div><p className="admin-eyebrow">HELPFUL READING</p><h2>Learn section</h2></div><span>3 links</span></div>
                <div className="admin-editor-grid">
                  <TextField label="Eyebrow" value={content.learn.eyebrow} onChange={(value) => updateSection("learn", "eyebrow", value)} />
                  <TextField label="Main heading" value={content.learn.heading} onChange={(value) => updateSection("learn", "heading", value)} />
                  <TextField label="Emphasized heading" value={content.learn.emphasis} onChange={(value) => updateSection("learn", "emphasis", value)} />
                  <TextField label="Description" multiline value={content.learn.description} onChange={(value) => updateSection("learn", "description", value)} />
                  <TextField label="Image URL (HTTPS)" type="url" value={content.learn.imageUrl} onChange={(value) => updateSection("learn", "imageUrl", value)} />
                  <TextField label="Image description" value={content.learn.imageAlt} onChange={(value) => updateSection("learn", "imageAlt", value)} />
                  <TextField label="Link label" value={content.learn.linkText} onChange={(value) => updateSection("learn", "linkText", value)} />
                  <TextField label="Image note (first line)" value={content.learn.imageNoteFirst} onChange={(value) => updateSection("learn", "imageNoteFirst", value)} />
                  <TextField label="Image note (second line)" value={content.learn.imageNoteSecond} onChange={(value) => updateSection("learn", "imageNoteSecond", value)} />
                </div>
                {content.learn.items.map((item, index) => <div className="admin-editor-item" key={index}>
                  <p className="admin-editor-item-label">ARTICLE 0{index + 1}</p>
                  <div className="admin-editor-grid">
                    <TextField label="Category and read time" value={item.tag} onChange={(value) => updateLearnItem(index, "tag", value)} />
                    <TextField label="Title" value={item.title} onChange={(value) => updateLearnItem(index, "title", value)} />
                  </div>
                </div>)}
              </>}

              {activeSection === "Products" && <>
                <div className="admin-editor-heading"><div><p className="admin-eyebrow">YOUR PRODUCT DISPLAY</p><h2>Products</h2></div><span>3 items</span></div>
                <div className="admin-editor-grid">
                  <TextField label="Eyebrow" value={content.shop.eyebrow} onChange={(value) => updateSection("shop", "eyebrow", value)} />
                  <TextField label="Main heading" value={content.shop.heading} onChange={(value) => updateSection("shop", "heading", value)} />
                  <TextField label="Emphasized heading" value={content.shop.emphasis} onChange={(value) => updateSection("shop", "emphasis", value)} />
                  <TextField label="Description" multiline value={content.shop.description} onChange={(value) => updateSection("shop", "description", value)} />
                  <TextField label="Link label" value={content.shop.linkText} onChange={(value) => updateSection("shop", "linkText", value)} />
                </div>
                {content.shop.items.map((product, index) => <div className="admin-editor-item" key={index}>
                  <p className="admin-editor-item-label">PRODUCT 0{index + 1}</p>
                  <div className="admin-editor-grid">
                    <TextField label="Name" value={product.name} onChange={(value) => updateProduct(index, "name", value)} />
                    <TextField label="Price" value={product.price} onChange={(value) => updateProduct(index, "price", value)} />
                    <TextField label="Category label" value={product.label} onChange={(value) => updateProduct(index, "label", value)} />
                    <TextField label="Image URL (HTTPS)" type="url" value={product.imageUrl} onChange={(value) => updateProduct(index, "imageUrl", value)} />
                    <TextField label="Description" multiline value={product.description} onChange={(value) => updateProduct(index, "description", value)} />
                    <TextField label="Image description" value={product.imageAlt} onChange={(value) => updateProduct(index, "imageAlt", value)} />
                  </div>
                </div>)}
              </>}

              {activeSection === "Brand & footer" && <>
                <div className="admin-editor-heading"><div><p className="admin-eyebrow">YOUR DETAILS</p><h2>Brand and footer</h2></div></div>
                <div className="admin-editor-grid">
                  <TextField label="Header wordmark (first part)" value={content.brand.headerFirst} onChange={(value) => updateBrand("headerFirst", value)} />
                  <TextField label="Header wordmark (center)" value={content.brand.headerMiddle} onChange={(value) => updateBrand("headerMiddle", value)} />
                  <TextField label="Header wordmark (last part)" value={content.brand.headerLast} onChange={(value) => updateBrand("headerLast", value)} />
                  <TextField label="Header button" value={content.brand.headerCtaText} onChange={(value) => updateBrand("headerCtaText", value)} />
                  <TextField label="Home navigation label" value={content.brand.navHome} onChange={(value) => updateBrand("navHome", value)} />
                  <TextField label="Services navigation label" value={content.brand.navServices} onChange={(value) => updateBrand("navServices", value)} />
                  <TextField label="Learn navigation label" value={content.brand.navLearn} onChange={(value) => updateBrand("navLearn", value)} />
                  <TextField label="Shop navigation label" value={content.brand.navShop} onChange={(value) => updateBrand("navShop", value)} />
                  <TextField label="Contact link label" value={content.brand.navContact} onChange={(value) => updateBrand("navContact", value)} />
                  <TextField label="Footer wordmark (first part)" value={content.brand.footerFirst} onChange={(value) => updateBrand("footerFirst", value)} />
                  <TextField label="Footer wordmark (last part)" value={content.brand.footerLast} onChange={(value) => updateBrand("footerLast", value)} />
                  <TextField label="Footer tagline" value={content.brand.footerTagline} onChange={(value) => updateBrand("footerTagline", value)} />
                  <TextField label="Contact email" type="email" value={content.brand.contactEmail} onChange={(value) => updateBrand("contactEmail", value)} />
                  <TextField label="Copyright line" value={content.brand.copyright} onChange={(value) => updateBrand("copyright", value)} />
                  <TextField label="Scrolling banner" value={content.brand.tickerText} onChange={(value) => updateBrand("tickerText", value)} />
                </div>
              </>}
            </div>

            <div className="admin-editor-actions">
              <p aria-live="polite" className={message && !isSaved ? "admin-editor-message error" : "admin-editor-message"}>{message}</p>
              <button className="admin-editor-publish" disabled={isSaving || !storageConfigured} type="submit">{isSaving ? "Publishing…" : "Publish changes"}</button>
            </div>
          </form>
          <footer className="admin-footer"><span>TRUTH SKIN STUDIO</span><span>Edits appear on the public homepage after publishing.</span></footer>
        </div>
      </main>
    </div>
  );
}