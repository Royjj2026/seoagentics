/**
 * Shared behaviour for marketing pages (glow canvas, nav, motion, modals, forms).
 */
(function () {
  "use strict";

  var GLOW_BY_PAGE = {
    home: [
      { x: 0.15, y: 0.25, r: 0.55, a: 0.18 },
      { x: 0.5, y: 0.5, r: 0.45, a: 0.14 },
      { x: 0.82, y: 0.65, r: 0.5, a: 0.15 },
      { x: 0.3, y: 0.75, r: 0.42, a: 0.13 },
    ],
    "content-engine": [
      { x: 0.5, y: 0.2, r: 0.55, a: 0.18 },
      { x: 0.15, y: 0.45, r: 0.48, a: 0.14 },
      { x: 0.8, y: 0.55, r: 0.5, a: 0.15 },
      { x: 0.4, y: 0.7, r: 0.45, a: 0.16 },
      { x: 0.6, y: 0.88, r: 0.42, a: 0.13 },
    ],
    agents: [
      { x: 0.5, y: 0.18, r: 0.55, a: 0.16 },
      { x: 0.2, y: 0.38, r: 0.5, a: 0.14 },
      { x: 0.78, y: 0.55, r: 0.48, a: 0.15 },
      { x: 0.35, y: 0.72, r: 0.45, a: 0.14 },
      { x: 0.62, y: 0.9, r: 0.42, a: 0.13 },
    ],
    pricing: [
      { x: 0.5, y: 0.15, r: 0.55, a: 0.16 },
      { x: 0.15, y: 0.35, r: 0.5, a: 0.14 },
      { x: 0.8, y: 0.52, r: 0.48, a: 0.15 },
      { x: 0.35, y: 0.7, r: 0.45, a: 0.14 },
      { x: 0.65, y: 0.88, r: 0.42, a: 0.13 },
    ],
    contact: [
      { x: 0.7, y: 0.3, r: 0.55, a: 0.15 },
      { x: 0.35, y: 0.55, r: 0.48, a: 0.13 },
      { x: 0.75, y: 0.75, r: 0.45, a: 0.12 },
    ],
    about: [
      { x: 0.75, y: 0.2, r: 0.55, a: 0.16 },
      { x: 0.2, y: 0.4, r: 0.5, a: 0.14 },
      { x: 0.7, y: 0.6, r: 0.48, a: 0.15 },
      { x: 0.3, y: 0.8, r: 0.45, a: 0.13 },
    ],
    insights: [
      { x: 0.5, y: 0.18, r: 0.52, a: 0.15 },
      { x: 0.2, y: 0.45, r: 0.48, a: 0.13 },
      { x: 0.78, y: 0.55, r: 0.5, a: 0.14 },
      { x: 0.35, y: 0.78, r: 0.44, a: 0.12 },
    ],
    "insights-post": [
      { x: 0.72, y: 0.22, r: 0.52, a: 0.15 },
      { x: 0.28, y: 0.42, r: 0.48, a: 0.13 },
      { x: 0.65, y: 0.62, r: 0.5, a: 0.14 },
      { x: 0.4, y: 0.85, r: 0.44, a: 0.12 },
    ],
    blog: [
      { x: 0.5, y: 0.3, r: 0.5, a: 0.14 },
      { x: 0.25, y: 0.5, r: 0.48, a: 0.13 },
      { x: 0.75, y: 0.65, r: 0.48, a: 0.13 },
    ],
  };

  function setCurrentYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initNavScrolled() {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function closeNavDrawer(nav, toggle) {
    if (!nav || !toggle) return;
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function initNavDrawer() {
    var nav = document.getElementById("navbar");
    var toggle = document.getElementById("navToggle");
    var drawer = document.getElementById("navDrawer");
    if (!nav || !toggle || !drawer) return;

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("nav-open");
      nav.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeNavDrawer(nav, toggle);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNavDrawer(nav, toggle);
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 900) closeNavDrawer(nav, toggle);
      },
      { passive: true }
    );
  }

  function initFadeUp() {
    document.querySelectorAll(".hero .fade-up").forEach(function (el) {
      el.classList.add("visible");
    });
    document.querySelectorAll(".page .fade-up").forEach(function (el) {
      el.classList.add("visible");
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach(function (el) {
      if (!el.classList.contains("visible")) observer.observe(el);
    });
  }

  function initVideoModal() {
    var modal = document.getElementById("videoModal");
    var wrap = document.getElementById("videoWrap") || document.querySelector(".hero-video-wrap");
    if (!modal || !wrap) return;
    /* Inline YouTube embed: no lightbox on wrapper click */
    if (wrap.querySelector("iframe[src*='youtube.com/embed']")) return;

    function openModal() {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeModal(e) {
      var t = e && e.target;
      if (!e || t === modal || (t.classList && t.classList.contains("modal-close"))) {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      }
    }

    wrap.addEventListener("click", openModal);
    modal.addEventListener("click", closeModal);
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        closeModal({ target: modal });
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal({ target: modal });
    });
  }

  function initGlowCanvas() {
    var canvas = document.getElementById("glow-canvas");
    if (!canvas || !canvas.getContext) return;

    var page = document.body.getAttribute("data-page") || "home";
    var glowZones = GLOW_BY_PAGE[page] || GLOW_BY_PAGE.home;

    var ctx = canvas.getContext("2d");
    var W = 0;
    var H = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function getTargetZone() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docH > 0 ? window.scrollY / docH : 0;
      var idx = Math.min(Math.floor(progress * glowZones.length), glowZones.length - 1);
      var nextIdx = Math.min(idx + 1, glowZones.length - 1);
      var zoneProgress = progress * glowZones.length - idx;
      var z0 = glowZones[idx];
      var z1 = glowZones[nextIdx];
      return {
        x: lerp(z0.x, z1.x, zoneProgress),
        y: lerp(z0.y, z1.y, zoneProgress),
        r: lerp(z0.r, z1.r, zoneProgress),
        a: lerp(z0.a, z1.a, zoneProgress),
      };
    }

    var currentGlow = {
      x: glowZones[0].x,
      y: glowZones[0].y,
      r: glowZones[0].r,
      a: glowZones[0].a,
    };
    var targetGlow = Object.assign({}, currentGlow);

    window.addEventListener(
      "scroll",
      function () {
        targetGlow = getTargetZone();
      },
      { passive: true }
    );

    function drawGlow() {
      var ease = 0.025;
      currentGlow.x = lerp(currentGlow.x, targetGlow.x, ease);
      currentGlow.y = lerp(currentGlow.y, targetGlow.y, ease);
      currentGlow.r = lerp(currentGlow.r, targetGlow.r, ease);
      currentGlow.a = lerp(currentGlow.a, targetGlow.a, ease);

      ctx.clearRect(0, 0, W, H);
      var cx = currentGlow.x * W;
      var cy = currentGlow.y * H;
      var radius = currentGlow.r * Math.max(W, H);
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      /* Matches Desktop homepage glow (seo-agentics-homepage.html) */
      grad.addColorStop(0, "rgba(20, 110, 75, " + currentGlow.a * 1.6 + ")");
      grad.addColorStop(0.35, "rgba(14, 75, 52, " + currentGlow.a + ")");
      grad.addColorStop(0.7, "rgba(8, 40, 28, " + currentGlow.a * 0.4 + ")");
      grad.addColorStop(1, "rgba(40, 40, 40, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      requestAnimationFrame(drawGlow);
    }
    drawGlow();
  }

  function initAgentFilters() {
    var grid = document.getElementById("agentGrid");
    var tabs = document.getElementById("agentCatTabs");
    if (!grid || !tabs) return;

    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".cat-tab");
      if (!btn || !tabs.contains(btn)) return;
      var cat = btn.getAttribute("data-cat") || "all";
      tabs.querySelectorAll(".cat-tab").forEach(function (t) {
        t.classList.remove("active");
      });
      btn.classList.add("active");
      grid.querySelectorAll(".agent-card").forEach(function (card) {
        if (cat === "all" || card.getAttribute("data-cat") === cat) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  }

  function initFaq() {
    document.body.addEventListener("click", function (e) {
      var q = e.target.closest(".faq-q");
      if (!q || !q.closest(".faq-list")) return;
      var item = q.closest(".faq-item");
      if (!item) return;
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
      });
      if (!wasOpen) item.classList.add("open");
    });
  }

  /**
   * Primary CTAs are often <button> in the source HTML; send them to the contact page
   * so behaviour matches real links. Only runs on marketing pages (body[data-page]).
   */
  function getContactHref() {
    var override = document.body && document.body.getAttribute("data-contact-href");
    if (override) return override;
    var path = window.location.pathname || "";
    if (path.indexOf("/blog") !== -1) return "../contact.html";
    return "contact.html";
  }

  function initArticleToc() {
    var headings = document.querySelectorAll(".prose h2[id], .prose h3[id]");
    var tocItems = document.querySelectorAll(".toc-item");
    if (!headings.length || !tocItems.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocItems.forEach(function (i) {
            i.classList.remove("active");
          });
          var a = document.querySelector(
            '.toc-item a[href="#' + entry.target.id + '"]'
          );
          if (a && a.parentElement) a.parentElement.classList.add("active");
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach(function (h) {
      observer.observe(h);
    });
  }

  function initCtaNavigation() {
    if (!document.body.hasAttribute("data-page")) return;

    document.body.addEventListener("click", function (e) {
      var how = e.target.closest(".btn-how");
      if (how && how.tagName !== "A" && !how.closest("form")) {
        var video =
          document.getElementById("videoWrap") || document.querySelector(".hero-video-wrap");
        if (video) {
          e.preventDefault();
          video.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      var t = e.target.closest(
        ".btn-cta, .btn-hero, .btn-demo, .btn-cta-ghost, .btn-pricing-primary, .btn-pricing-ghost, .btn-sidebar, .btn-sidebar-ghost"
      );
      if (!t || t.tagName === "A" || t.closest("form")) return;

      e.preventDefault();
      window.location.href = getContactHref();
    });
  }

  function initContactForm() {
    var formContent = document.getElementById("formContent");
    var success = document.getElementById("formSuccess");
    var submit = document.querySelector(".btn-submit");
    if (!formContent || !success || !submit) return;

    submit.addEventListener("click", function () {
      var required = ["fname", "lname", "agency", "email", "message"];
      var allFilled = true;
      required.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim()) {
          el.style.borderColor = "rgba(226,80,80,0.4)";
          allFilled = false;
        } else {
          el.style.borderColor = "";
        }
      });
      if (!allFilled) return;
      formContent.style.display = "none";
      success.classList.add("show");
    });
  }

  /**
   * scroll-behavior:smooth on the root element can fight scroll restoration and
   * first paint on refresh (small vertical jump). Use auto until load, then restore.
   */
  function initScrollStability() {
    document.documentElement.style.scrollBehavior = "auto";
    function restoreSmooth() {
      requestAnimationFrame(function () {
        document.documentElement.style.removeProperty("scroll-behavior");
      });
    }
    if (document.readyState === "complete") {
      restoreSmooth();
    } else {
      window.addEventListener("load", restoreSmooth, { once: true });
    }
  }

  /**
   * Home only: index.html sets history.scrollRestoration = "manual" so reload does not
   * restore a stale scroll position. After layout/fonts settle, pin top or hash target.
   */
  function initHomeScrollAfterLoad() {
    if (document.body.getAttribute("data-page") !== "home") return;
    window.addEventListener(
      "load",
      function () {
        var hash = window.location.hash;
        if (hash && hash.length > 1) {
          var id = decodeURIComponent(hash.slice(1));
          var el = document.getElementById(id);
          if (el) {
            requestAnimationFrame(function () {
              el.scrollIntoView({ block: "start" });
            });
            return;
          }
        }
        requestAnimationFrame(function () {
          window.scrollTo(0, 0);
        });
      },
      { once: true }
    );
  }

  function init() {
    if (document.body.hasAttribute("data-page")) {
      var page = document.body.getAttribute("data-page");
      if (page !== "home" && "scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    }
    initScrollStability();
    initHomeScrollAfterLoad();
    setCurrentYear();
    initNavScrolled();
    initNavDrawer();
    initFadeUp();
    initCtaNavigation();
    initVideoModal();
    initGlowCanvas();
    initAgentFilters();
    initFaq();
    initContactForm();
    initArticleToc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
