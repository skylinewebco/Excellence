/* ============================================================
   MAIN — orchestration
   Lenis smooth scroll · GSAP ScrollTrigger · beats · product reveals
   ============================================================ */
import { renderProducts } from "./products.js";

const { gsap } = window;
gsap.registerPlugin(window.ScrollTrigger);
const ST = window.ScrollTrigger;

const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = matchMedia("(max-width: 820px)").matches;
const STATIC = new URLSearchParams(location.search).has("static");

/* ---------- 1. render product DOM first ---------- */
renderProducts();

/* QA helper: in static mode, jump to a deep-linked section after render */
if (STATIC && location.hash) {
  const node = document.querySelector(location.hash);
  if (node) { document.body.classList.remove("is-locked"); node.scrollIntoView(); }
  window.addEventListener("load", () => node && node.scrollIntoView());
}

/* ---------- 2. loader ---------- */
(function loader() {
  const el = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const pct = document.getElementById("loaderPct");
  if (STATIC) { el.classList.add("is-done"); document.body.classList.remove("is-locked"); return; }
  let p = 0, ready = false, done = false;
  window.addEventListener("mn:ready", () => { ready = true; });

  const tick = () => {
    const cap = ready ? 100 : 88;
    p += (cap - p) * 0.06 + 0.4;
    if (p > cap) p = cap;
    bar.style.width = p + "%";
    pct.textContent = Math.round(p);
    if (p >= 99.5 && ready && !done) {
      done = true;
      setTimeout(() => {
        el.classList.add("is-done");
        document.body.classList.remove("is-locked");
        ST.refresh();
      }, 350);
      return;
    }
    requestAnimationFrame(tick);
  };
  document.body.classList.add("is-locked");
  tick();
  // safety: never hang the loader (rAF can be throttled in background tabs)
  setTimeout(() => { ready = true; }, 5000);
  const hardHide = () => {
    if (done) return;
    done = true;
    bar.style.width = "100%"; pct.textContent = 100;
    el.classList.add("is-done");
    document.body.classList.remove("is-locked");
    ST.refresh();
  };
  setTimeout(hardHide, 7000);
})();

/* ---------- 3. Lenis smooth scroll ---------- */
let lenis;
if (!prefersReduced && !STATIC && window.Lenis) {
  lenis = new window.Lenis({
    lerp: isMobile ? 0.12 : 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false
  });
  window.__lenis = lenis;
  lenis.on("scroll", ST.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* smooth in-page anchor links */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"], [data-scroll]');
  if (!a) return;
  const target = a.getAttribute("href") || a.dataset.scroll;
  if (!target || target === "#") return;
  const node = document.querySelector(target);
  if (!node) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(node, { offset: -10, duration: 1.4 });
  else node.scrollIntoView({ behavior: "smooth" });
});

/* ---------- 4. cinematic stage: scroll -> 3D ---------- */
const beats = [...document.querySelectorAll(".beat")];
// window [in0,in1,out0,out1] over stage progress for each beat
const beatWin = [
  [0.00, 0.00, 0.09, 0.14],
  [0.15, 0.22, 0.30, 0.38],
  [0.44, 0.52, 0.60, 0.68],
  [0.80, 0.88, 1.01, 1.02]
];
const clamp01 = v => Math.min(1, Math.max(0, v));
function winOpacity(p, [i0, i1, o0, o1]) {
  if (p < i0 || p > o1) return 0;
  if (p < i1) return clamp01((p - i0) / Math.max(0.0001, i1 - i0));
  if (p > o0) return clamp01(1 - (p - o0) / Math.max(0.0001, o1 - o0));
  return 1;
}

ST.create({
  trigger: "#stage",
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    const p = self.progress;
    if (window.MNScene) window.MNScene.setProgress(p);
    for (let i = 0; i < beats.length; i++) {
      const o = winOpacity(p, beatWin[i]);
      const b = beats[i];
      b.style.opacity = o;
      b.style.transform = `translateY(${(1 - o) * 26}px)`;
    }
  }
});

/* The liquid essence stays as the living background for the whole journey —
   we only pause rendering when the tab is hidden (handled inside scene.js). */

/* ---------- 5. product reveals (alternate L/R) ---------- */
if (!prefersReduced && !STATIC) {
  document.querySelectorAll(".product").forEach((prod) => {
    const side = prod.dataset.side;
    const dx = side === "left" ? -90 : side === "right" ? 90 : 0;
    const visual = prod.querySelector(".product__visual");
    const info = prod.querySelector(".product__info");

    gsap.set([visual, info], { willChange: "transform, opacity" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: prod,
        start: "top 78%",
        end: "top 40%",
        toggleActions: "play none none reverse"
      }
    });
    tl.from(visual, {
      x: dx, opacity: 0, scale: 0.94, duration: 1.1, ease: "power3.out"
    }).from(info, {
      x: dx * 0.35, y: 24, opacity: 0, duration: 0.9, ease: "power3.out"
    }, "-=0.8");
  });

  /* giant index numerals drift (parallax depth in the liquid) */
  gsap.utils.toArray(".product__idx").forEach((n) => {
    gsap.to(n, {
      yPercent: -30, ease: "none",
      scrollTrigger: { trigger: n.closest(".product"), start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* collection intro + signature + outro reveal */
  gsap.utils.toArray(".section-head, .signature__text, .outro__inner").forEach((el) => {
    gsap.from(el.children, {
      y: 36, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 82%" }
    });
  });

  /* signature media parallax (floats in the liquid) */
  const sigMedia = document.querySelector(".signature__media");
  if (sigMedia) gsap.to(sigMedia, {
    yPercent: -12, ease: "none",
    scrollTrigger: { trigger: sigMedia, start: "top bottom", end: "bottom top", scrub: true }
  });
}

/* ---------- 6. nav solid state ---------- */
ST.create({
  trigger: "#collection",
  start: "top 70%",
  onToggle: (self) => document.getElementById("nav").classList.toggle("is-solid", self.isActive || self.progress > 0)
});
ST.create({
  start: 0, end: "max",
  onUpdate: (self) => {
    const past = window.scrollY > window.innerHeight * 0.85;
    document.getElementById("nav").classList.toggle("is-solid", past);
  }
});

/* refresh after fonts load (layout shift safe) */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ST.refresh());
}
window.addEventListener("load", () => ST.refresh());
