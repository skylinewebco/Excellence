/* ============================================================
   HERO — cinematic image + video sequence (no WebGL, buttery).
   Real flacon: cap opens, camera dives into the amber-liquid video.
   + subtle mouse-parallax tilt (desktop) / gentle sway (touch).
   Pure GPU transform + opacity — no per-frame filters. Same
   window.MNScene API main.js already drives.
   ============================================================ */
const clamp  = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp   = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

const video  = document.getElementById("worldVideo");
const tint   = document.getElementById("worldTint");
const flacon = document.getElementById("heroFlacon");
const cap    = document.getElementById("heroCap");
const stack  = document.querySelector(".hero-flacon__stack");

const fine   = matchMedia("(pointer: fine)").matches;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* ---------------- scroll-driven cinematic ---------------- */
let last = -1, curP = 0;
function setProgress(p){
  p = clamp(p, 0, 1);
  curP = p;
  if (Math.abs(p - last) < 0.0005) return;
  last = p;

  const capOpen  = smooth(0.12, 0.42, p);                     // seal lifts
  const approach = smooth(0.0, 0.5, p);
  const dive     = smooth(0.5, 1.0, p);
  const scale    = lerp(0.94, 1.34, approach) + dive * 4.6;   // continuous, no plateau
  const y        = -smooth(0.18, 1.0, p) * 10;
  const opacity  = 1 - smooth(0.72, 0.9, p);

  if (flacon){
    flacon.style.transform = `translate3d(0, ${y}%, 0) scale(${scale.toFixed(3)})`;
    flacon.style.opacity   = opacity.toFixed(3);
  }
  if (cap){
    cap.style.transform = `translate(${(capOpen*2).toFixed(2)}%, ${(-capOpen*14).toFixed(2)}%) rotate(${(-capOpen*5).toFixed(2)}deg)`;
  }
  if (tint){
    tint.style.opacity = lerp(0.92, 0.18, smooth(0.45, 0.85, p)).toFixed(3);
  }
}
setProgress(0);

/* ---------------- premium tilt (mouse / device) ---------------- */
let tmx = 0, tmy = 0, mx = 0, my = 0, lastTilt = "";
if (fine && !reduce){
  window.addEventListener("mousemove", (e) => {
    tmx = (e.clientX / innerWidth  - 0.5) * 2;
    tmy = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
}
function tiltLoop(){
  if (!document.hidden && stack){
    if (!fine){                                   // touch: a slow, alive idle sway
      const t = performance.now() * 0.0005;
      tmx = Math.sin(t) * 0.42; tmy = Math.cos(t * 0.9) * 0.26;
    }
    mx += (tmx - mx) * 0.07; my += (tmy - my) * 0.07;   // smooth easing → no jitter
    const k = 1 - smooth(0.3, 0.62, curP);              // fade tilt out as we dive in
    let t;
    if (k > 0.002){
      const ry = (mx * 7 * k).toFixed(2), rx = (-my * 5 * k).toFixed(2);
      const tx = (mx * 12 * k).toFixed(2), ty = (my * 10 * k).toFixed(2);
      t = `perspective(1400px) rotateY(${ry}deg) rotateX(${rx}deg) translate3d(${tx}px, ${ty}px, 0)`;
    } else {
      t = "none";
    }
    if (t !== lastTilt){ stack.style.transform = t; lastTilt = t; }
  }
  requestAnimationFrame(tiltLoop);
}
if (!reduce) requestAnimationFrame(tiltLoop);

/* same public API scene.js exposed, so main.js is untouched */
window.MNScene = { setProgress, setActive(){}, isReady: () => true };
requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("mn:ready")));
