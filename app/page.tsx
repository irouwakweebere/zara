import ConsultationForm from "./components/consultation-form";
import Link from "next/link";
import { connection } from "next/server";
import { defaultSiteContent } from "./lib/site-content-model";
import { getSiteContent } from "./lib/site-content";

function backgroundImage(url: string) {
  try {
    return `url("${new URL(url).href.replaceAll('"', "%22")}")`;
  } catch {
    return "none";
  }
}

export default async function Home() {
  await connection();
  let content = defaultSiteContent;
  try {
    content = await getSiteContent();
  } catch {
    content = defaultSiteContent;
  }

  return (
    <>
      <header className="site-header" id="home">
        <a className="wordmark" href="#home" aria-label="Skindrug Gist">
          {content.brand.headerFirst}<span>{content.brand.headerMiddle}</span>{content.brand.headerLast}
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#home">{content.brand.navHome}</a>
          <a href="#services">{content.brand.navServices}</a>
          <a href="#learn">{content.brand.navLearn}</a>
          <a href="#shop">{content.brand.navShop}</a>
          <Link href="/admin">Dashboard</Link>
        </nav>
        <ConsultationForm triggerClassName="header-cta" triggerLabel={content.brand.headerCtaText} />
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> {content.hero.eyebrow}</p>
            <h1 id="hero-title">{content.hero.heading} <em>{content.hero.emphasis}</em></h1>
            <p className="hero-description">{content.hero.description}</p>
            <div className="hero-actions">
              <ConsultationForm triggerClassName="primary-button" triggerLabel={content.hero.ctaText} />
              <a className="text-link" href="#learn">{content.hero.secondaryCtaText} <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span></div>
              <p><strong>{content.hero.proofTitle}</strong><br />{content.hero.proofDescription}</p>
            </div>
            <span className="hero-index">01 / 04</span>
          </div>
          <div className="hero-portrait" role="img" aria-label={content.hero.imageAlt} style={{ backgroundImage: backgroundImage(content.hero.imageUrl) }}>
            <div className="portrait-caption"><span>{content.hero.captionFirst}</span><span>{content.hero.captionSecond}</span></div>
            <div className="portrait-seal"><span>{content.hero.sealFirst}</span><span>{content.hero.sealSecond}</span><strong>{content.hero.sealFinal}</strong></div>
          </div>
        </section>

        <div className="ticker" aria-label={content.brand.tickerText}>
          <span>{content.brand.tickerText}</span><span aria-hidden="true">✳</span>
          <span>{content.brand.tickerText}</span><span aria-hidden="true">✳</span>
        </div>

        <section className="services-section section-shell" id="services">
          <div className="section-heading">
            <div><p className="eyebrow">{content.services.eyebrow}</p><h2>{content.services.heading}<br /><em>{content.services.emphasis}</em></h2></div>
            <p className="section-intro">{content.services.description}</p>
          </div>
          <div className="service-list">
            {content.services.items.map((service, index) => (
              <article className="service-row" key={service.title}>
                <span className="service-number">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <span className="service-detail">{service.detail}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="learn-section" id="learn">
            <div className="learn-image" role="img" aria-label={content.learn.imageAlt} style={{ backgroundImage: backgroundImage(content.learn.imageUrl) }}>
            <span className="image-note">{content.learn.imageNoteFirst}<br />{content.learn.imageNoteSecond}</span>
          </div>
          <div className="learn-content">
            <p className="eyebrow">{content.learn.eyebrow}</p>
            <h2>{content.learn.heading}<br /><em>{content.learn.emphasis}</em></h2>
            <p className="learn-intro">{content.learn.description}</p>
            <div className="notes-list">
              {content.learn.items.map((note, index) => (
                <a className="note-row" href="#learn" key={note.title}>
                  <span className="note-index">0{index + 1}</span>
                  <span className="note-text"><small>{note.tag}</small><strong>{note.title}</strong></span>
                  <span className="note-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <a className="text-link learn-link" href="#services">{content.learn.linkText} <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="shop-section section-shell" id="shop">
          <div className="shop-heading"><div><p className="eyebrow">{content.shop.eyebrow}</p><h2>{content.shop.heading}<br /><em>{content.shop.emphasis}</em></h2></div><p>{content.shop.description}</p></div>
          <div className="product-grid">
            {content.shop.items.map((product) => (
              <article className="product-item" key={product.label}>
                <div className="product-image" role="img" aria-label={product.imageAlt} style={{ backgroundImage: backgroundImage(product.imageUrl) }}><span>{product.label}</span></div>
                <div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><span>{product.price}</span></div>
              </article>
            ))}
          </div>
          <a className="text-link shop-link" href="#shop">{content.shop.linkText} <span aria-hidden="true">↗</span></a>
        </section>

        <section className="closing-cta">
          <p className="eyebrow">{content.closing.eyebrow}</p>
          <h2>{content.closing.heading}<br />of <em>{content.closing.emphasis}</em></h2>
          <p>{content.closing.description}</p>
          <ConsultationForm triggerClassName="light-button" triggerLabel={content.closing.ctaText} />
          <span className="closing-scribble" aria-hidden="true">{content.closing.signature}</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">{content.brand.footerFirst}<span>{content.brand.footerLast}</span></a>
        <p>{content.brand.footerTagline}</p>
        <div className="footer-links"><a href="#services">{content.brand.navServices}</a><a href="#learn">{content.brand.navLearn}</a><a href="#shop">{content.brand.navShop}</a><a href={`mailto:${content.brand.contactEmail}`}>{content.brand.navContact}</a></div>
        <span className="copyright">{content.brand.copyright}</span>
      </footer>
    </>
  );
}