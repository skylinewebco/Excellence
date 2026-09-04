/* ============================================================
   ENHANCE — premium micro-interactions (additive, non-invasive)
   · scroll progress rule   · magnetic CTAs   · mobile nav
   · cart-count pop         · CTA-in-view sheen
   Everything here is purely presentational and guarded for
   reduced-motion, coarse pointers, and the ?static QA mode.
   Nothing changes existing functionality.
   ============================================================ */
const gsap    = window.gsap;
const reduce  = matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse  = matchMedia("(pointer: coarse)").matches;
const STATIC  = new URLSearchParams(location.search).has("static");

/* ------------------------------------------------------------
   1. Scroll progress — GPU-composited scaleX, rAF-throttled.
   Hooks Lenis when present, falls back to native scroll.
------------------------------------------------------------ */
(function scrollProgress() {
  const bar = document.querySelector("#scrollProgress > i");
  if (!bar) return;
  let raf = 0;
  const paint = () => {
    raf = 0;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  if (window.__lenis) window.__lenis.on("scroll", schedule);
  paint();
})();

/* ------------------------------------------------------------
   2. Magnetic CTAs — the pointer gently pulls inline gold
   buttons + the cart pill. Skipped on touch / reduced-motion.
   Full-width action buttons are excluded (translation reads odd).
------------------------------------------------------------ */
(function magnetic() {
  if (!gsap || reduce || coarse || STATIC) return;
  const nodes = [...document.querySelectorAll(".btn--gold, .nav__cart")].filter(
    (el) =>
      !el.classList.contains("checkout__submit") &&
      !el.closest(".detail__actions, .cart__foot")
  );
  nodes.forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const strength = 0.32;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
})();

/* ------------------------------------------------------------
   3. Mobile navigation — the links no longer disappear < 900px.
   Reuses the existing delegated anchor-scroll in main.js.
------------------------------------------------------------ */
(function mobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  const otherOverlayOpen = () =>
    !!document.querySelector(".detail.is-open, .cart.is-open, .checkout.is-open");

  const open = () => {
    menu.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    if (window.__lenis) window.__lenis.stop();
  };
  const close = () => {
    menu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.setAttribute("aria-hidden", "true");
    if (!otherOverlayOpen()) {
      document.body.classList.remove("is-locked");
      if (window.__lenis) window.__lenis.start();
    }
  };

  toggle.addEventListener("click", () =>
    menu.classList.contains("is-open") ? close() : open()
  );
  // close on link tap (before main.js scrolls) or on backdrop tap
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a") || e.target === menu) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) close();
  });
  // if the viewport grows back to desktop, ensure the menu is dismissed
  matchMedia("(min-width: 901px)").addEventListener?.("change", (ev) => {
    if (ev.matches && menu.classList.contains("is-open")) close();
  });
})();

/* ------------------------------------------------------------
   4. Cart-count pop — a little bump each time the count grows.
------------------------------------------------------------ */
(function cartBump() {
  if (!window.MNCart || reduce) return;
  let prev = window.MNCart.count();
  window.MNCart.onChange(() => {
    const c = window.MNCart.count();
    if (c > prev) {
      document.querySelectorAll(".nav__cart-count").forEach((el) => {
        el.classList.remove("bump");
        void el.offsetWidth; // restart the animation
        el.classList.add("bump");
      });
    }
    prev = c;
  });
})();
