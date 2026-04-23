(function () {
  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function headerOffset() {
    return header ? header.getBoundingClientRect().height + 8 : 72;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: top, behavior: "smooth" });
      if (mobileNav && !mobileNav.classList.contains("hidden")) {
        mobileNav.classList.add("hidden");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var nowHidden = mobileNav.classList.toggle("hidden");
      navToggle.setAttribute("aria-expanded", String(!nowHidden));
    });
  }

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("reveal-visible");
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      if (status) {
        status.textContent =
          "Thanks — this demo form is not connected to a server yet. Please email us directly.";
        status.classList.remove("hidden");
      }
    });
  }

  function scrollToHashIfPresent() {
    var id = window.location.hash;
    if (!id || id === "#" || id === "#top") return;
    var target = document.querySelector(id);
    if (!target) return;
    var instant =
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      !window.requestAnimationFrame;
    function run() {
      var top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: instant ? "auto" : "smooth",
      });
    }
    if (instant) run();
    else requestAnimationFrame(run);
  }

  if (window.location.hash) scrollToHashIfPresent();
  window.addEventListener("hashchange", scrollToHashIfPresent);
})();
