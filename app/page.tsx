import ConsultationForm from "./components/consultation-form";

const services = [
  {
    number: "01",
    title: "The skin reset",
    copy: "A thoughtful 1:1 consultation to understand your skin, your habits, and what it actually needs.",
    detail: "FREE · 20 MINUTES",
  },
  {
    number: "02",
    title: "Routine, refined",
    copy: "A clear, uncomplicated routine built around your real life, not a shelf full of products.",
    detail: "PERSONALIZED PLAN",
  },
  {
    number: "03",
    title: "Ongoing guidance",
    copy: "Check in as your skin changes. We’ll adjust together, without the pressure or guesswork.",
    detail: "HERE WHEN YOU NEED US",
  },
];

const notes = [
  { tag: "SKIN NOTES · 04 MIN READ", title: "Your skin barrier, explained", href: "#learn" },
  { tag: "INGREDIENTS · 06 MIN READ", title: "What niacinamide can really do", href: "#learn" },
  { tag: "RITUALS · 03 MIN READ", title: "A gentler way to start retinol", href: "#learn" },
];

export default function Home() {
  return (
    <>
      <header className="site-header" id="home">
        <a className="wordmark" href="#home" aria-label="Skindrug Gist">
          Skin<span>drug</span> Gist
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#learn">Learn</a>
          <a href="#shop">Shop</a>
        </nav>
        <ConsultationForm triggerClassName="header-cta" triggerLabel="Book a consultation" />
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> SKINCARE, WITHOUT THE GUESSWORK</p>
            <h1 id="hero-title">Your skin deserves <em>the truth.</em></h1>
            <p className="hero-description">
              Good skin starts with being heard. Get honest, expert guidance that meets your skin where it is today.
            </p>
            <div className="hero-actions">
              <ConsultationForm triggerClassName="primary-button" triggerLabel="Get free consultation" />
              <a className="text-link" href="#learn">Learn first <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars" aria-hidden="true"><span>J</span><span>M</span><span>A</span></div>
              <p><strong>Real skin. Real conversations.</strong><br />A more personal kind of skincare.</p>
            </div>
            <span className="hero-index">01 / 04</span>
          </div>
          <div className="hero-portrait" role="img" aria-label="Woman with healthy, natural skin in warm daylight">
            <div className="portrait-caption"><span>NO FILTERS.</span><span>JUST YOUR SKIN.</span></div>
            <div className="portrait-seal"><span>CARE THAT</span><span>STARTS WITH</span><strong>you</strong></div>
          </div>
        </section>

        <div className="ticker" aria-label="Skincare should feel like care, not a second job">
          <span>SKINCARE SHOULD FEEL LIKE CARE, NOT A SECOND JOB</span><span aria-hidden="true">✳</span>
          <span>SKINCARE SHOULD FEEL LIKE CARE, NOT A SECOND JOB</span><span aria-hidden="true">✳</span>
        </div>

        <section className="services-section section-shell" id="services">
          <div className="section-heading">
            <div><p className="eyebrow">A LITTLE HELP, A LOT MORE CLARITY</p><h2>Skin support that<br /><em>starts with you.</em></h2></div>
            <p className="section-intro">No one-size-fits-all routines. Just a real person, a curious conversation, and a plan that makes sense for your skin.</p>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <span className="service-detail">{service.detail}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="learn-section" id="learn">
          <div className="learn-image" role="img" aria-label="Simple skincare ingredients arranged in natural morning light">
            <span className="image-note">A softer approach<br />to your skincare shelf.</span>
          </div>
          <div className="learn-content">
            <p className="eyebrow">A GOOD PLACE TO START</p>
            <h2>Get to know<br /><em>your skin.</em></h2>
            <p className="learn-intro">A little knowledge can make everything feel less confusing. Start with the things your skin’s been trying to tell you.</p>
            <div className="notes-list">
              {notes.map((note, index) => (
                <a className="note-row" href={note.href} key={note.title}>
                  <span className="note-index">0{index + 1}</span>
                  <span className="note-text"><small>{note.tag}</small><strong>{note.title}</strong></span>
                  <span className="note-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <a className="text-link learn-link" href="#services">Explore skin services <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="shop-section section-shell" id="shop">
          <div className="shop-heading"><div><p className="eyebrow">FEWER THINGS, BETTER CHOSEN</p><h2>Meet your new<br /><em>skin essentials.</em></h2></div><p>We believe in a small, considered routine. A few good things, chosen with care.</p></div>
          <div className="product-grid">
            <article className="product-item">
              <div className="product-image product-cleanser" role="img" aria-label="Gentle cleanser bottle beside fresh green leaves"><span>01 / CLEANSE</span></div>
              <div className="product-info"><div><h3>The Everyday Cleanser</h3><p>Soft, simple, no tight-skin feeling.</p></div><span>$24</span></div>
            </article>
            <article className="product-item">
              <div className="product-image product-moisturizer" role="img" aria-label="Moisturizer jar in soft morning light"><span>02 / NOURISH</span></div>
              <div className="product-info"><div><h3>Cloud Nine Moisturizer</h3><p>A little comfort for your skin barrier.</p></div><span>$32</span></div>
            </article>
            <article className="product-item">
              <div className="product-image product-spf" role="img" aria-label="Sunscreen tube on a sunlit stone surface"><span>03 / PROTECT</span></div>
              <div className="product-info"><div><h3>Everyday SPF 30</h3><p>Lightweight, easy, every single day.</p></div><span>$28</span></div>
            </article>
          </div>
          <a className="text-link shop-link" href="#shop">Shop all essentials <span aria-hidden="true">↗</span></a>
        </section>

        <section className="closing-cta">
          <p className="eyebrow">YOUR SKIN, YOUR STARTING POINT</p>
          <h2>Let’s make sense<br />of <em>your skin.</em></h2>
          <p>Twenty minutes. One honest conversation. A much clearer next step.</p>
          <ConsultationForm triggerClassName="light-button" triggerLabel="Get free consultation" />
          <span className="closing-scribble" aria-hidden="true">with care, always</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">truth<span>skin studio</span></a>
        <p>Thoughtful skincare for real life.</p>
        <div className="footer-links"><a href="#services">Services</a><a href="#learn">Learn</a><a href="#shop">Shop</a><a href="mailto:hello@truthskin.studio">Contact</a></div>
        <span className="copyright">© 2026 TRUTH SKIN STUDIO</span>
      </footer>
    </>
  );
}