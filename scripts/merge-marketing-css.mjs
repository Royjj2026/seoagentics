import fs from "fs";
import path from "path";

const paths = [
  "c:/Users/daniy/Downloads/seo-agentics-homepage (2).html",
  "c:/Users/daniy/Downloads/seo-agentics-content-engine.html",
  "c:/Users/daniy/Downloads/seo-agentics-agents.html",
  "c:/Users/daniy/Downloads/seo-agentics-contact (1).html",
  "c:/Users/daniy/Downloads/seo-agentics-pricing.html",
  "c:/Users/daniy/Downloads/seo-agentics-about (1).html",
];

const outFile = new URL("../css/marketing.css", import.meta.url);

let out = "/* Merged marketing CSS from source HTML exports */\n";

for (const p of paths) {
  const raw = fs.readFileSync(p, "utf8");
  const m = raw.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) {
    console.error("No style block:", p);
    process.exit(1);
  }
  let chunk = m[1].trim();
  /* About page reuses .how-section / .how-* which clash with the homepage; scope renames. */
  if (p.includes("about")) {
    chunk = chunk
      .replace(/\.how-section\b/g, ".about-how-section")
      .replace(/\.how-grid\b/g, ".about-how-grid")
      .replace(/\.how-card\b/g, ".about-how-card")
      .replace(/\.how-icon\b/g, ".about-how-icon");
  }
  out += `\n/* ===== ${path.basename(p)} ===== */\n`;
  out += chunk + "\n";
}

out += `
/* ----- Skip link (site integration) ----- */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 10000;
  padding: 8px 16px;
  background: var(--bg2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  text-decoration: none;
}
.skip-link:focus {
  left: 16px;
  top: 16px;
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ----- Hero / top section layout restore -----
   About export ends the merge with a two-column .hero-inner grid that was
   overriding every page. Scoped rules below match the reference: centered
   stack for home, content-engine, agents; centered block hero for pricing. */
body[data-page="home"] .hero,
body[data-page="content-engine"] .hero,
body[data-page="agents"] .hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 140px 0 100px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}
body[data-page="home"] .hero-inner,
body[data-page="content-engine"] .hero-inner,
body[data-page="agents"] .hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  grid-template-columns: unset;
  gap: 0;
}
body[data-page="home"] .hero h1 {
  font-size: clamp(2.25rem, 8vw, 76px);
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 26px;
}
body[data-page="content-engine"] .hero h1,
body[data-page="agents"] .hero h1 {
  font-size: clamp(2.25rem, 7.5vw, 72px);
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 24px;
}
body[data-page="home"] .hero-sub {
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
}
body[data-page="content-engine"] .hero-sub,
body[data-page="agents"] .hero-sub {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
}
body[data-page="pricing"] .hero {
  min-height: unset;
  display: block;
  padding: 160px 0 100px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}
body[data-page="pricing"] .hero h1 {
  font-size: clamp(2rem, 7vw, 68px);
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 24px;
}
body[data-page="pricing"] .hero-sub {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

/* ----- Navigation: mobile drawer + desktop inline ----- */
.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  flex-shrink: 0;
  margin-left: auto;
  z-index: 160;
  transition: border-color 0.2s, background 0.2s;
}
.nav-toggle:hover {
  border-color: var(--border-hover);
  background: rgba(255, 255, 255, 0.04);
}
.nav-toggle-bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 18px;
}
.nav-toggle-bars span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--text-muted);
  border-radius: 1px;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
#navbar.nav-open .nav-toggle-bars span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
#navbar.nav-open .nav-toggle-bars span:nth-child(2) {
  opacity: 0;
}
#navbar.nav-open .nav-toggle-bars span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (min-width: 901px) {
  .nav-toggle {
    display: none !important;
  }
  .nav-drawer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    gap: 36px;
    min-width: 0;
  }
}

@media (max-width: 900px) {
  html {
    -webkit-text-size-adjust: 100%;
  }
  .nav-inner {
    height: auto !important;
    min-height: 56px;
    padding: 10px 16px !important;
    flex-wrap: nowrap;
    align-items: center;
    gap: 12px;
  }
  .nav-toggle {
    display: flex !important;
  }
  .logo {
    flex-shrink: 1;
    min-width: 0;
    font-size: 15px;
  }
  .nav-drawer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 140;
    padding: 72px 20px 32px;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 20px;
    background: rgba(7, 10, 14, 0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    overflow-y: auto;
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.28s ease, visibility 0.28s;
  }
  #navbar.nav-open .nav-drawer {
    transform: translateX(0);
    visibility: visible;
  }
  .nav-links {
    flex-direction: column;
    align-items: stretch;
    gap: 0 !important;
    width: 100%;
  }
  .nav-links li {
    border-bottom: 1px solid var(--border);
  }
  .nav-links a {
    display: block;
    padding: 14px 0;
    font-size: 16px;
  }
  .nav-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    width: 100%;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .nav-actions .btn-ghost,
  .nav-actions .btn-accent {
    width: 100%;
    text-align: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .footer-inner {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 20px 16px !important;
  }
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .services-section,
  .how-section,
  .comparison-section,
  .diff-section,
  .testimonial-section,
  .pricing-section,
  .cta-section,
  .layers-section,
  .workflow-section,
  .auth-section,
  .what-section,
  .library-section,
  .output-section,
  .method-section,
  .standalone-section,
  .honest-section,
  .model-section,
  .value-section,
  .draft-section,
  .faq-section,
  .story-section,
  .beliefs-section,
  .about-how-section,
  .deploy-section,
  .founder-section,
  .page {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .services-section,
  .how-section,
  .comparison-section,
  .diff-section,
  .testimonial-section,
  .pricing-section,
  .cta-section,
  .layers-section,
  .workflow-section,
  .auth-section,
  .what-section,
  .library-section,
  .output-section,
  .method-section,
  .standalone-section,
  .honest-section,
  .model-section,
  .value-section,
  .draft-section,
  .faq-section,
  .story-section,
  .beliefs-section,
  .about-how-section,
  .deploy-section,
  .founder-section {
    padding-top: 64px !important;
    padding-bottom: 64px !important;
  }

  .section-h2 {
    font-size: clamp(1.75rem, 6vw, 2.25rem) !important;
  }
  .cta-section h2 {
    font-size: clamp(1.75rem, 7vw, 2.5rem) !important;
  }

  .services-grid,
  .diff-grid {
    grid-template-columns: 1fr !important;
  }
  .how-inner {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .dash-mock {
    position: static !important;
    top: auto !important;
  }

  .comparison-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-left: -4px;
    margin-right: -4px;
  }
  .ct-header,
  .ct-row {
    min-width: 520px;
  }

  .pricing-card {
    flex-direction: column !important;
    text-align: center;
    align-items: center !important;
    gap: 24px !important;
    padding: 28px 20px !important;
  }
  .pricing-right {
    text-align: center !important;
  }

  .hero-actions,
  .cta-row {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px !important;
  }
  .btn-cta,
  .btn-cta-ghost,
  .btn-hero,
  .btn-how {
    max-width: 100%;
  }

  body[data-page="home"] .hero,
  body[data-page="content-engine"] .hero,
  body[data-page="agents"] .hero {
    min-height: auto !important;
    padding: 96px 0 56px !important;
  }
  body[data-page="pricing"] .hero {
    padding: 96px 0 56px !important;
  }

  .layer-row {
    grid-template-columns: 1fr !important;
    padding: 28px 20px !important;
  }
  .layer-body {
    border-left: none !important;
    padding-left: 0 !important;
    margin-top: 12px;
  }
  .layer-title-col {
    padding-right: 0 !important;
  }

  .workflow-inner {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .auth-inner {
    grid-template-columns: 1fr !important;
    padding: 40px 24px !important;
    gap: 40px !important;
  }

  .how-step {
    grid-template-columns: 1fr !important;
    padding: 24px 0 !important;
  }
  .how-step-num {
    padding: 20px 0 0 !important;
    border-right: none !important;
    border-bottom: 1px solid var(--border);
    justify-content: flex-start !important;
  }
  .how-step-body,
  .how-step-detail {
    border-right: none !important;
    padding: 24px 16px !important;
  }

  .agent-grid,
  .output-grid,
  .value-grid,
  .beliefs-grid {
    grid-template-columns: 1fr !important;
  }
  .cat-tabs {
    gap: 6px !important;
  }

  .page-inner {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .contact-left {
    position: static !important;
    top: auto !important;
  }
  .contact-form-wrap {
    padding: 32px 20px !important;
  }
  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .model-step {
    grid-template-columns: 1fr !important;
  }
  .model-step-num,
  .model-step-body,
  .model-step-detail {
    border-right: none !important;
    padding: 24px 16px !important;
  }
  .model-step-num {
    padding-top: 20px !important;
    border-bottom: 1px solid var(--border);
  }

  .honest-inner,
  .draft-inner,
  .faq-inner,
  .story-inner,
  .founder-inner,
  .deploy-inner,
  .standalone-inner,
  .method-inner,
  .what-inner {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .faq-left {
    position: static !important;
  }
  .library-count {
    flex-wrap: wrap;
  }
  .library-num {
    font-size: clamp(2.5rem, 12vw, 4rem) !important;
  }

  body[data-page="about"] .hero-inner {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  body[data-page="about"] .hero {
    padding: 96px 0 56px !important;
  }
  body[data-page="about"] .hero h1 {
    font-size: clamp(1.75rem, 7vw, 2.75rem) !important;
  }
}

@media (max-width: 480px) {
  .nav-inner {
    padding: 8px 12px !important;
  }
  .container {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .hero-trust {
    flex-direction: column;
    gap: 12px !important;
  }
}
`;

fs.writeFileSync(outFile, out);
console.log("Wrote", outFile.pathname || outFile, out.length, "chars");
