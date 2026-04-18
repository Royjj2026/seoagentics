import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SHARED_HEAD_EXTRA = `    <meta name="theme-color" content="#282828" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&amp;family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&amp;display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/marketing.css" />`;

function navHtml(active) {
  const mk = (key, href, label) => {
    if (active && active === key) {
      return `      <li><a href="${href}" class="active" aria-current="page">${label}</a></li>`;
    }
    return `      <li><a href="${href}">${label}</a></li>`;
  };
  return `<nav id="navbar" aria-label="Primary">
  <div class="nav-inner">
    <a href="index.html" class="logo" aria-label="SEO Agentics — Home" data-nav="home">
      <div class="logo-bars" aria-hidden="true">
        <div class="logo-bar logo-bar-1"></div>
        <div class="logo-bar logo-bar-2"></div>
        <div class="logo-bar logo-bar-3"></div>
      </div>
      <div class="logo-wordmark">
        <span class="logo-seo">SEO </span>
        <span class="logo-agentics">agentics</span>
      </div>
    </a>
    <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navDrawer" aria-label="Open menu">
      <span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <div class="nav-drawer" id="navDrawer">
      <ul class="nav-links">
${mk("platform", "index.html#services", "Platform")}
${mk("content-engine", "content-engine.html", "Content Engine")}
${mk("agents", "agents.html", "AI Agents")}
${mk("pricing", "pricing.html", "Pricing")}
${mk("about", "about.html", "About")}
      </ul>
      <div class="nav-actions">
        <a class="btn-ghost" href="#">Log in</a>
        <a class="btn-accent" href="contact.html">Book a Demo</a>
      </div>
    </div>
  </div>
</nav>`;
}

const FOOTER = `<footer>
  <div class="footer-inner">
    <span class="footer-copy">© <span data-year></span> SEO Agentics. All rights reserved.</span>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</footer>
<script src="js/main.js" defer></script>`;

function stripBodyScripts(html) {
  let s = html;
  for (;;) {
    const i = s.lastIndexOf("<script>");
    if (i === -1) break;
    const j = s.indexOf("</script>", i);
    if (j === -1) break;
    s = s.slice(0, i) + s.slice(j + 9);
  }
  return s;
}

function extractBodyInner(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!m) throw new Error("no body");
  let inner = m[1].trim();
  inner = inner.replace(/\sonclick="[^"]*"/gi, "");
  inner = stripBodyScripts(inner);
  inner = inner.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/i, "{{NAV}}");
  inner = inner.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, "{{FOOTER}}");
  return inner;
}

function postProcessInner(dest, inner) {
  inner = inner
    .replace(/seo-agentics-homepage\.html/gi, "index.html")
    .replace(/seo-agentics-content-engine\.html/gi, "content-engine.html")
    .replace(/seo-agentics-agents\.html/gi, "agents.html")
    .replace(/seo-agentics-pricing\.html/gi, "pricing.html")
    .replace(/seo-agentics-contact\.html/gi, "contact.html");
  if (dest === "about.html") {
    inner = inner.replace(
      '<section class="how-section">',
      '<section class="about-how-section">'
    );
  }
  if (dest === "index.html") {
    inner = inner.replace(
      '<section class="services-section"',
      '<section id="services" class="services-section"'
    );
    inner = inner.replace(
      '<a class="service-link" href="#">Explore content engine',
      '<a class="service-link" href="content-engine.html">Explore content engine'
    );
    inner = inner.replace(
      '<a class="service-link" href="#">Explore AI agents',
      '<a class="service-link" href="agents.html">Explore AI agents'
    );
  }
  if (dest === "contact.html") {
    inner = inner.replace(/hello@seaogentics\.com/g, "hello@seoagentics.com");
  }
  if (dest === "agents.html") {
    inner = inner.replace(
      /<div class="cat-tabs fade-up">\s*<button class="cat-tab active">All agents<\/button>\s*<button class="cat-tab">Keyword research<\/button>\s*<button class="cat-tab">Content strategy<\/button>\s*<button class="cat-tab">On-page & technical<\/button>\s*<button class="cat-tab">Link building<\/button>\s*<button class="cat-tab">Competitive intel<\/button>\s*<button class="cat-tab">Reporting & planning<\/button>\s*<\/div>/i,
      `<div class="cat-tabs fade-up" id="agentCatTabs">
      <button type="button" class="cat-tab active" data-cat="all">All agents</button>
      <button type="button" class="cat-tab" data-cat="kw">Keyword research</button>
      <button type="button" class="cat-tab" data-cat="content">Content strategy</button>
      <button type="button" class="cat-tab" data-cat="onpage">On-page & technical</button>
      <button type="button" class="cat-tab" data-cat="link">Link building</button>
      <button type="button" class="cat-tab" data-cat="intel">Competitive intel</button>
      <button type="button" class="cat-tab" data-cat="report">Reporting & planning</button>
    </div>`
    );
  }
  return inner;
}

function buildPage({ src, dest, title, description, activeNav, dataPage }) {
  const raw = fs.readFileSync(src, "utf8");
  let inner = extractBodyInner(raw)
    .replace("{{NAV}}", navHtml(activeNav))
    .replace("{{FOOTER}}", FOOTER);
  inner = inner.replace(/<section(\s)/, '<section id="page-main"$1', 1);
  inner = postProcessInner(dest, inner);

  const out = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
${SHARED_HEAD_EXTRA}
  </head>
  <body${dataPage ? ` data-page="${dataPage}"` : ""}>
    <a class="skip-link" href="#page-main">Skip to content</a>
${inner}
  </body>
</html>
`;
  fs.writeFileSync(path.join(root, dest), out);
  console.log("Wrote", dest);
}

const pages = [
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-homepage (2).html",
    dest: "index.html",
    title: "SEO Agentics — AI Content Engine for Agencies",
    description:
      "Per-client AI content engines and SEO agents for agencies. Brand-faithful content at scale without generic output.",
    activeNav: null,
    dataPage: "home",
  },
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-content-engine.html",
    dest: "content-engine.html",
    title: "Content Engine — SEO Agentics",
    description:
      "A dedicated content engine per client: ICP alignment, style matching, intent analysis, topic modelling, and a Human Authenticity Layer.",
    activeNav: "content-engine",
    dataPage: "content-engine",
  },
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-agents.html",
    dest: "agents.html",
    title: "AI Agents — SEO Agentics",
    description:
      "Sixty configurable SEO agents that mirror your agency's methodology — research, analysis, delivery, and reporting at scale.",
    activeNav: "agents",
    dataPage: "agents",
  },
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-contact (1).html",
    dest: "contact.html",
    title: "Contact — SEO Agentics",
    description:
      "Reach SEO Agentics about your agency, roster, and goals. We reply within one business day.",
    activeNav: null,
    dataPage: "contact",
  },
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-pricing.html",
    dest: "pricing.html",
    title: "Pricing — SEO Agentics",
    description:
      "How SEO Agentics is priced: platform setup, per-client engine build, and volume-aware monthly retainers — discussed transparently on a demo call.",
    activeNav: "pricing",
    dataPage: "pricing",
  },
  {
    src: "c:/Users/daniy/Downloads/seo-agentics-about (1).html",
    dest: "about.html",
    title: "About — SEO Agentics",
    description:
      "Why SEO Agentics exists: bespoke content engines and agents shaped around each agency's methodology, experience, and client roster.",
    activeNav: "about",
    dataPage: "about",
  },
];

for (const p of pages) {
  buildPage(p);
}
