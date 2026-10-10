export type SiteContent = {
  brand: {
    headerFirst: string;
    headerMiddle: string;
    headerLast: string;
    headerCtaText: string;
    navHome: string;
    navServices: string;
    navLearn: string;
    navShop: string;
    navContact: string;
    footerFirst: string;
    footerLast: string;
    footerTagline: string;
    copyright: string;
    contactEmail: string;
    tickerText: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    description: string;
    proofTitle: string;
    proofDescription: string;
    ctaText: string;
    secondaryCtaText: string;
    captionFirst: string;
    captionSecond: string;
    sealFirst: string;
    sealSecond: string;
    sealFinal: string;
    imageUrl: string;
    imageAlt: string;
  };
  services: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    description: string;
    items: { title: string; copy: string; detail: string }[];
  };
  learn: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    linkText: string;
    imageNoteFirst: string;
    imageNoteSecond: string;
    items: { tag: string; title: string }[];
  };
  shop: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    description: string;
    linkText: string;
    items: { label: string; name: string; description: string; price: string; imageUrl: string; imageAlt: string }[];
  };
  closing: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    description: string;
    ctaText: string;
    signature: string;
  };
};

export const defaultSiteContent: SiteContent = {
  brand: {
    headerFirst: "Skin",
    headerMiddle: "drug",
    headerLast: " Gist",
    headerCtaText: "Book a consultation",
    navHome: "Home",
    navServices: "Services",
    navLearn: "Learn",
    navShop: "Shop",
    navContact: "Contact",
    footerFirst: "Skin",
    footerLast: "drug_Gist",
    footerTagline: "Thoughtful skincare for real life.",
    copyright: "© Created  by peace ",
    contactEmail: "hello@truthskin.studio",
    tickerText: "SKINCARE SHOULD FEEL LIKE CARE, NOT A SECOND JOB",
  },
  hero: {
    eyebrow: "SKINCARE, WITHOUT THE GUESSWORK",
    heading: "Your skin deserves",
    emphasis: "the truth.",
    description: "Good skin starts with being heard. Get honest, expert guidance that meets your skin where it is today.",
    proofTitle: "Real skin. Real conversations.",
    proofDescription: "A more personal kind of skincare.",
    ctaText: "Get free consultation",
    secondaryCtaText: "Learn first",
    captionFirst: "NO FILTERS.",
    captionSecond: "JUST YOUR SKIN.",
    sealFirst: "CARE THAT",
    sealSecond: "STARTS WITH",
    sealFinal: "you",
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1450&q=88",
    imageAlt: "Woman with healthy, natural skin in warm daylight",
  },
  services: {
    eyebrow: "A LITTLE HELP, A LOT MORE CLARITY",
    heading: "Skin support that",
    emphasis: "starts with you.",
    description: "No one-size-fits-all routines. Just a real person, a curious conversation, and a plan that makes sense for your skin.",
    items: [
      { title: "The skin reset", copy: "A thoughtful 1:1 consultation to understand your skin, your habits, and what it actually needs.", detail: "FREE · 20 MINUTES" },
      { title: "Routine, refined", copy: "A clear, uncomplicated routine built around your real life, not a shelf full of products.", detail: "PERSONALIZED PLAN" },
      { title: "Ongoing guidance", copy: "Check in as your skin changes. We’ll adjust together, without the pressure or guesswork.", detail: "HERE WHEN YOU NEED US" },
    ],
  },
  learn: {
    eyebrow: "A GOOD PLACE TO START",
    heading: "Get to know",
    emphasis: "your skin.",
    description: "A little knowledge can make everything feel less confusing. Start with the things your skin’s been trying to tell you.",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Simple skincare ingredients arranged in natural morning light",
    linkText: "Explore skin services",
    imageNoteFirst: "A softer approach",
    imageNoteSecond: "to your skincare shelf.",
    items: [
      { tag: "SKIN NOTES · 04 MIN READ", title: "Your skin barrier, explained" },
      { tag: "INGREDIENTS · 06 MIN READ", title: "What niacinamide can really do" },
      { tag: "RITUALS · 03 MIN READ", title: "A gentler way to start retinol" },
    ],
  },
  shop: {
    eyebrow: "FEWER THINGS, BETTER CHOSEN",
    heading: "Meet your new",
    emphasis: "skin essentials.",
    description: "We believe in a small, considered routine. A few good things, chosen with care.",
    linkText: "Shop all essentials",
    items: [
      { label: "01 / CLEANSE", name: "The Everyday Cleanser", description: "Soft, simple, no tight-skin feeling.", price: "$24", imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80", imageAlt: "Gentle cleanser bottle beside fresh green leaves" },
      { label: "02 / NOURISH", name: "Cloud Nine Moisturizer", description: "A little comfort for your skin barrier.", price: "$32", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", imageAlt: "Moisturizer jar in soft morning light" },
      { label: "03 / PROTECT", name: "Everyday SPF 30", description: "Lightweight, easy, every single day.", price: "$28", imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80", imageAlt: "Sunscreen tube on a sunlit stone surface" },
    ],
  },
  closing: {
    eyebrow: "YOUR SKIN, YOUR STARTING POINT",
    heading: "Let’s make sense",
    emphasis: "your skin.",
    description: "Twenty minutes. One honest conversation. A much clearer next step.",
    ctaText: "Get free consultation",
    signature: "with care, always",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validTextFields(record: Record<string, unknown>, limits: Record<string, number>) {
  return Object.entries(limits).every(([key, limit]) => typeof record[key] === "string" && record[key].length <= limit);
}

function validImageUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return false;
  if (!value) return true;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validItems(value: unknown, limits: Record<string, number>) {
  return Array.isArray(value) && value.length === 3 && value.every((item) => isRecord(item) && validTextFields(item, limits));
}

export function isSiteContent(value: unknown): value is SiteContent {
  if (!isRecord(value)) return false;
  const { brand, hero, services, learn, shop, closing } = value;
  if (!isRecord(brand) || !isRecord(hero) || !isRecord(services) || !isRecord(learn) || !isRecord(shop) || !isRecord(closing)) return false;

  return (
    validTextFields(brand, { headerFirst: 40, headerMiddle: 40, headerLast: 40, headerCtaText: 80, navHome: 40, navServices: 40, navLearn: 40, navShop: 40, navContact: 40, footerFirst: 40, footerLast: 60, footerTagline: 180, copyright: 120, contactEmail: 254, tickerText: 160 }) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brand.contactEmail as string) &&
    validTextFields(hero, { eyebrow: 100, heading: 120, emphasis: 120, description: 500, proofTitle: 100, proofDescription: 180, ctaText: 80, secondaryCtaText: 80, captionFirst: 80, captionSecond: 80, sealFirst: 80, sealSecond: 80, sealFinal: 80, imageAlt: 200 }) && validImageUrl(hero.imageUrl) &&
    validTextFields(services, { eyebrow: 100, heading: 120, emphasis: 120, description: 500 }) && validItems(services.items, { title: 100, copy: 300, detail: 100 }) &&
    validTextFields(learn, { eyebrow: 100, heading: 120, emphasis: 120, description: 500, imageAlt: 200, linkText: 100, imageNoteFirst: 100, imageNoteSecond: 100 }) && validImageUrl(learn.imageUrl) && validItems(learn.items, { tag: 100, title: 140 }) &&
    validTextFields(shop, { eyebrow: 100, heading: 120, emphasis: 120, description: 500, linkText: 100 }) &&
      Array.isArray(shop.items) && shop.items.length === 3 && shop.items.every((item) => isRecord(item) && validTextFields(item, { label: 80, name: 120, description: 300, price: 40, imageAlt: 200 }) && validImageUrl(item.imageUrl)) &&
    validTextFields(closing, { eyebrow: 100, heading: 120, emphasis: 120, description: 500, ctaText: 80, signature: 100 })
  );
}