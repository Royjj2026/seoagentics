/**
 * Loads header.html + footer.html into #header-include / #footer-include (fetch + innerHTML),
 * then runs main.js so nav, glow canvas, and other behaviour initialise after the shell exists.
 */
(function () {
  "use strict";

  var headerMount = document.getElementById("header-include");
  var footerMount = document.getElementById("footer-include");
  if (!headerMount || !footerMount) {
    loadMainJs();
    return;
  }

  var headerUrl = headerMount.getAttribute("data-include") || "header.html";
  var footerUrl = footerMount.getAttribute("data-include") || "footer.html";
  var mainJs = document.body.getAttribute("data-main-js") || "js/main.js";

  function fetchText(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) {
        throw new Error("Include failed: " + url + " (" + res.status + ")");
      }
      return res.text();
    });
  }

  function loadMainJs() {
    var src = document.body.getAttribute("data-main-js") || "js/main.js";
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    document.body.appendChild(s);
  }

  function setMarketingNavActive() {
    var page = document.body.getAttribute("data-page");
    if (!page || page === "contact") return;
    var link = document.querySelector('#navbar a[data-nav="' + page + '"]');
    if (!link) return;
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }

  function setBlogNavState() {
    if (!document.body.hasAttribute("data-blog")) return;
    var mode = document.body.getAttribute("data-blog-page");
    var blogLink = document.querySelector(".site-header a[href='index.html']");
    if (mode === "listing" && blogLink) {
      blogLink.setAttribute("aria-current", "page");
    }
  }

  Promise.all([fetchText(headerUrl), fetchText(footerUrl)])
    .then(function (parts) {
      headerMount.innerHTML = parts[0];
      footerMount.innerHTML = parts[1];
      if (document.getElementById("navbar")) {
        setMarketingNavActive();
      }
      setBlogNavState();
      return new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = mainJs;
        s.async = false;
        s.onload = resolve;
        s.onerror = function () {
          reject(new Error("Failed to load " + mainJs));
        };
        document.body.appendChild(s);
      });
    })
    .catch(function (err) {
      console.error(err);
      loadMainJs();
    });
})();
