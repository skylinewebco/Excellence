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
const cap    = document.getElementById("heroCap");

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

  // one continuous move: approach -> CAP OPENS -> dive through the opening -> submerge
  const capOpen  = smooth(0.12, 0.42, p);                     // the seal visibly lifts
  const approach = smooth(0.0, 0.5, p);
  const dive     = smooth(0.5, 1.0, p);
  const scale    = lerp(0.94, 1.34, approach) + dive * 4.6;   // no plateau -> no "stuck then jump"
  const y        = -smooth(0.18, 1.0, p) * 10;
  const opacity  = 1 - smooth(0.72, 0.9, p);                  // dissolve as we pass into the liquid
  const blur     = smooth(0.6, 0.9, p) * 8;

  if (flacon){
    flacon.style.transform = `translate3d(0, ${y}%, 0) scale(${scale.toFixed(3)})`;
    flacon.style.opacity   = opacity.toFixed(3);
    flacon.style.filter    = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "none";
  }
  if (cap){
    // the gold seal lifts up and tilts away, revealing the open neck below
    cap.style.transform = `translate(${(capOpen*2).toFixed(2)}%, ${(-capOpen*14).toFixed(2)}%) rotate(${(-capOpen*5).toFixed(2)}deg)`;
  }
  if (tint){
    tint.style.opacity = lerp(0.92, 0.18, smooth(0.45, 0.85, p)).toFixed(3);
  }
}

setProgress(0);

/* same public API scene.js exposed, so main.js is untouched */
window.MNScene = { setProgress, setActive(){}, isReady: () => true };
requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("mn:ready")));
