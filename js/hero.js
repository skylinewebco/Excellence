/* ============================================================
   HERO — cinematic image + video sequence (no WebGL, buttery).
   The REAL flacon photo approaches, the seal releases, and the
   camera dives into the amber-liquid video which becomes the world.
   Exposes the same window.MNScene API main.js already drives.
   ============================================================ */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

const video  = document.getElementById("worldVideo");
const tint   = document.getElementById("worldTint");
const flacon = document.getElementById("heroFlacon");

/* keep the liquid world playing (muted autoplay is allowed); pause when hidden */
function play(){ if (video) video.play().catch(() => {}); }
if (video){
  video.addEventListener("canplay", play);
  video.addEventListener("loadeddata", play);
  play();
}
document.addEventListener("visibilitychange", () => {
  if (!video) return;
  document.hidden ? video.pause() : play();
});

/* scroll-driven state — direct GPU transforms, no render loop */
let last = -1;
function setProgress(p){
  p = clamp(p, 0, 1);
  if (Math.abs(p - last) < 0.0005) return;      // skip redundant writes
  last = p;

  const approach = smooth(0.0, 0.55, p);
  const dive     = smooth(0.55, 1.0, p);
  const scale    = lerp(0.95, 1.55, approach) + dive * 4.7;   // approach, then plunge into the liquid
  const y        = -smooth(0.18, 1.0, p) * 12;                // drift up toward the neck/opening
  const opacity  = 1 - smooth(0.66, 0.86, p);                 // dissolve as we submerge
  const blur     = smooth(0.55, 0.86, p) * 9;                 // focus falls off as we enter the liquid

  if (flacon){
    flacon.style.transform = `translate3d(0, ${y}%, 0) scale(${scale.toFixed(3)})`;
    flacon.style.opacity   = opacity.toFixed(3);
    flacon.style.filter    = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "none";
  }
  if (tint){
    tint.style.opacity = lerp(0.92, 0.18, smooth(0.4, 0.85, p)).toFixed(3);
  }
}

setProgress(0);

/* same public API scene.js exposed, so main.js is untouched */
window.MNScene = { setProgress, setActive(){}, isReady: () => true };
requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("mn:ready")));
