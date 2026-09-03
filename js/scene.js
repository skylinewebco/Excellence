/* ============================================================
   SCENE — cinematic hero (v2)
   HOLLOW glass flacon (real rim / mouth / wall thickness) ·
   camera descends THROUGH the actual opening · studio env-map
   reflections · amber-liquid VIDEO underwater world · particles.
   ============================================================ */
import * as THREE from "three";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

const canvas = document.getElementById("webgl");
const isMobile = matchMedia("(max-width: 820px)").matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer, mainScene, camera, bottleGroup, capGroup, glassMesh, liquidMesh, surfMesh;
let particles, bgScene, bgCam, bgMesh, videoEl, videoTex;
let ready = false, running = true;
let progress = 0, targetProgress = 0;
let tMouseX = 0, tMouseY = 0, mouseX = 0, mouseY = 0;

/* ---- camera keyframes: OUTSIDE -> above mouth -> through rim -> neck -> liquid -> underwater ---- */
const CAM = [
  { p:0.00, pos:[0.0, 0.6, 9.6], look:[0.0, 0.15, 0.0], fov:42 },
  { p:0.14, pos:[0.2, 0.9, 6.2], look:[0.0, 0.35, 0.0], fov:42 },
  { p:0.30, pos:[0.15,2.7, 5.2], look:[0.0, 1.45, 0.0], fov:44 }, // cap gone, rising, looking to neck
  { p:0.46, pos:[0.0, 4.9, 3.0], look:[0.0, 1.95, 0.0], fov:46 }, // above, 3/4 top-down: mouth visible
  { p:0.58, pos:[0.0, 4.5, 0.28],look:[0.0, 1.75, 0.0], fov:50 }, // directly above the opening
  { p:0.70, pos:[0.0, 2.2, 0.03],look:[0.0, 0.55, 0.0], fov:54 }, // crossing the rim
  { p:0.80, pos:[0.0, 1.0, 0.0], look:[0.0,-0.6, 0.0], fov:58 },  // inside the neck, walls around
  { p:0.88, pos:[0.0, 0.5, 0.0], look:[0.0,-1.1, 0.0], fov:60 },  // at the liquid surface
  { p:0.95, pos:[0.0,-0.7, 0.0], look:[0.0,-1.7, 0.0], fov:64 },  // breaking through
  { p:1.00, pos:[0.0,-1.8, 0.0], look:[0.0,-2.5, 0.0], fov:68 }   // underwater
];

function init() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false, powerPreference: "high-performance", stencil: false });
  renderer.setClearColor(0x080604, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.autoClear = false;

  mainScene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.03, 100);

  buildEnvironment();
  buildBottle();
  buildParticles();
  buildLiquidBackground();
  addLights();
  applyProgress(0);

  window.addEventListener("resize", onResize, { passive: true });
  if (!isMobile && !prefersReduced) window.addEventListener("mousemove", onMouse, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (videoEl) { document.hidden ? videoEl.pause() : videoEl.play().catch(()=>{}); }
    if (running) requestAnimationFrame(animate);
  });

  ready = true;
  requestAnimationFrame(animate);
  requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("mn:ready")));
}

/* -------------------- studio environment (real photo) -------------------- */
function buildEnvironment() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  // fallback procedural env immediately so glass never looks flat
  const envScene = new THREE.Scene();
  const c = document.createElement("canvas"); c.width = 64; c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#4a3f2c"); g.addColorStop(0.5, "#14100b"); g.addColorStop(1, "#050402");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 256);
  const domeTex = new THREE.CanvasTexture(c); domeTex.colorSpace = THREE.SRGBColorSpace;
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ map: domeTex, side: THREE.BackSide })));
  mainScene.environment = pmrem.fromScene(envScene, 0, 0.1, 100).texture;

  // upgrade to the real studio photo when it loads (soft-box glints on the glass)
  new THREE.TextureLoader().load("assets/img/studio-env.jpg", (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const rt = pmrem.fromEquirectangular(tex);
    mainScene.environment = rt.texture;
    tex.dispose();
  });
}

/* -------------------- hollow glass flacon -------------------- */
function v2(a){ return a.map(([x,y]) => new THREE.Vector2(x, y)); }

function buildBottle() {
  bottleGroup = new THREE.Group();
  mainScene.add(bottleGroup);
  const seg = isMobile ? 64 : 128;

  // A single continuous profile that goes UP the outside, over the RIM,
  // and DOWN the inside — producing a real hollow vessel with wall thickness.
  const profile = v2([
    [0.001,-2.30],[1.24,-2.30],[1.30,-2.10],
    [1.30, 0.85],[1.16, 1.12],[0.66, 1.44],  // outer wall + shoulder
    [0.47, 1.58],[0.47, 2.06],               // outer neck
    [0.44, 2.12],[0.34, 2.12],               // RIM (visible thickness across the top)
    [0.34, 1.62],[0.40, 1.46],               // inner neck
    [1.12, 1.08],[1.12,-1.95],               // inner wall
    [1.00,-2.06],[0.001,-2.06]               // inner floor
  ]);
  const glassGeo = new THREE.LatheGeometry(profile, seg);
  glassGeo.computeVertexNormals();
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.03,
    transmission: 1.0, thickness: 0.9, ior: 1.5,
    envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: 0.05,
    transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false
  });
  glassMesh = new THREE.Mesh(glassGeo, glassMat);
  bottleGroup.add(glassMesh);

  // liquid body (fills the cavity to ~60%)
  const liqProfile = v2([
    [0.001,-1.98],[1.08,-1.98],[1.08, 0.42],[0.98, 0.55],[0.001,0.55]
  ]);
  const liqGeo = new THREE.LatheGeometry(liqProfile, seg);
  liquidMesh = new THREE.Mesh(liqGeo, new THREE.MeshPhysicalMaterial({
    color: 0x8a3d10, metalness: 0, roughness: 0.25,
    transmission: 0.55, thickness: 3.0, ior: 1.38,
    emissive: 0x5a2a06, emissiveIntensity: 0.5,
    envMapIntensity: 1.0, transparent: true, opacity: 1
  }));
  bottleGroup.add(liquidMesh);

  // liquid surface disc
  surfMesh = new THREE.Mesh(new THREE.CircleGeometry(1.06, seg), new THREE.MeshPhysicalMaterial({
    color: 0xc9832f, roughness: 0.15, metalness: 0, transmission: 0.3,
    transparent: true, opacity: 0.9, emissive: 0x5a2a06, emissiveIntensity: 0.55, side: THREE.DoubleSide
  }));
  surfMesh.rotation.x = -Math.PI / 2; surfMesh.position.y = 0.54;
  bottleGroup.add(surfMesh);

  // gold sphere cap (matches the real MAISON NOIR flacon)
  capGroup = new THREE.Group();
  const capMat = new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 1, roughness: 0.28, envMapIntensity: 1.7 });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.62, seg, seg), capMat);
  sphere.position.y = 2.95;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.34, seg),
    new THREE.MeshStandardMaterial({ color: 0x9c7a2e, metalness: 1, roughness: 0.34 }));
  collar.position.y = 2.4;
  capGroup.add(sphere, collar);
  bottleGroup.add(capGroup);

  bottleGroup.position.y = 0.0;
}

/* -------------------- essence particles -------------------- */
function buildParticles() {
  const count = isMobile ? 300 : 900;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3), seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 0.6 + Math.random() * 6.5, a = Math.random() * Math.PI * 2;
    pos[i*3] = Math.cos(a) * r; pos[i*3+1] = (Math.random()-0.5)*12; pos[i*3+2] = Math.sin(a)*r*0.8;
    seed[i] = Math.random();
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime:{value:0}, uOpacity:{value:0.35}, uPr:{value:renderer.getPixelRatio()}, uStretch:{value:0} },
    vertexShader: `
      attribute float seed; uniform float uTime,uPr,uStretch; varying float vA;
      void main(){
        vec3 p = position;
        p.y = mod(p.y + uTime*(0.18+seed*0.4) + seed*12.0 + 6.0, 12.0) - 6.0;
        p.x += sin(uTime*0.4 + seed*6.28)*0.28;
        p.z += cos(uTime*0.33 + seed*6.28)*0.2;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = (0.4+seed*1.9)*uPr*(1.0+uStretch*2.0)*(12.0/-mv.z);
        gl_Position = projectionMatrix * mv;
        vA = 0.3 + seed*0.7;
      }`,
    fragmentShader: `
      precision mediump float; uniform float uOpacity; varying float vA;
      void main(){ float d=smoothstep(0.5,0.0,length(gl_PointCoord-0.5));
        gl_FragColor=vec4(vec3(1.0,0.83,0.52), d*vA*uOpacity); }`
  });
  particles = new THREE.Points(geo, mat);
  mainScene.add(particles);
}

/* -------------------- underwater liquid world (VIDEO + shader) -------------------- */
function buildLiquidBackground() {
  bgScene = new THREE.Scene(); bgCam = new THREE.Camera();

  videoEl = document.createElement("video");
  videoEl.src = "assets/video/liquid-world.mp4";
  videoEl.muted = true; videoEl.loop = true; videoEl.playsInline = true;
  videoEl.setAttribute("playsinline", ""); videoEl.setAttribute("muted", "");
  videoEl.preload = "auto"; videoEl.crossOrigin = "anonymous";
  videoTex = new THREE.VideoTexture(videoEl);
  videoTex.colorSpace = THREE.SRGBColorSpace;
  videoTex.minFilter = THREE.LinearFilter; videoTex.magFilter = THREE.LinearFilter;
  const tryPlay = () => videoEl.play().catch(()=>{});
  videoEl.addEventListener("canplay", tryPlay); tryPlay();

  const mat = new THREE.ShaderMaterial({
    depthTest: false, depthWrite: false, transparent: true,
    uniforms: {
      uTime:{value:0}, uOpacity:{value:0}, uHasVideo:{value:0},
      uTex:{value:videoTex}, uRes:{value:new THREE.Vector2(innerWidth,innerHeight)}
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`,
    fragmentShader: `
      precision highp float; varying vec2 vUv;
      uniform float uTime,uOpacity,uHasVideo; uniform vec2 uRes; uniform sampler2D uTex;
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p),f=fract(p); float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
        vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
      float fbm(vec2 p){ float v=0.,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.02; a*=0.5;} return v; }
      void main(){
        vec2 uv=vUv;
        vec3 col;
        if(uHasVideo>0.5){
          // gentle drifting zoom keeps the loop feeling alive & seamless
          vec2 cuv=(uv-0.5)*0.92+0.5+vec2(sin(uTime*0.03)*0.015, cos(uTime*0.025)*0.015);
          col = texture2D(uTex, cuv).rgb;
          col = pow(col, vec3(0.92));            // lift shadows a touch
        } else {
          vec2 p=(uv-0.5); p.x*=uRes.x/uRes.y; float t=uTime*0.06;
          vec2 q=vec2(fbm(p*1.6+vec2(0.,t*1.4)), fbm(p*1.6+vec2(4.2,-t)));
          float f=fbm(p*1.7+q*1.5+t*0.5);
          col=mix(vec3(0.16,0.07,0.02), vec3(0.55,0.27,0.06), smoothstep(0.25,0.6,f));
          col=mix(col, vec3(0.95,0.66,0.28), smoothstep(0.6,0.92,f));
        }
        // volumetric light rays from upper area
        vec2 rp=(uv-vec2(0.5,1.15)); float ang=atan(rp.x,-rp.y);
        float rays=pow(0.5+0.5*sin(ang*22.0+uTime*0.25),3.0)*smoothstep(1.2,0.1,length(uv-vec2(0.5,1.1)));
        col += vec3(1.0,0.78,0.42)*rays*0.16;
        // centre glow + vignette (depth)
        vec2 c=uv-0.5; c.x*=uRes.x/uRes.y;
        col += vec3(1.0,0.7,0.35)*smoothstep(0.8,0.0,length(c))*0.18;
        col *= 1.0 - 0.55*length(c*0.85);
        gl_FragColor=vec4(col, uOpacity);
      }`
  });
  bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  bgScene.add(bgMesh);
}

/* -------------------- lights -------------------- */
function addLights() {
  mainScene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.6); key.position.set(4, 7, 6); mainScene.add(key);
  const rim = new THREE.DirectionalLight(0xd99a3c, 2.2); rim.position.set(-5, 3, -4); mainScene.add(rim);
  const fill = new THREE.PointLight(0xffd9a0, 3, 22); fill.position.set(0, -0.5, 4); mainScene.add(fill);
  const glow = new THREE.PointLight(0xff9a3c, 2.4, 10); glow.position.set(0, -0.5, 0); mainScene.add(glow); // liquid glow
}

/* -------------------- interaction / resize -------------------- */
function onMouse(e){ tMouseX = e.clientX/innerWidth-0.5; tMouseY = e.clientY/innerHeight-0.5; }
function onResize(){
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
  camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
  bgMesh.material.uniforms.uRes.value.set(innerWidth, innerHeight);
}

/* -------------------- camera keyframe interpolation -------------------- */
const _pos = new THREE.Vector3(), _look = new THREE.Vector3();
function sampleCamera(p){
  let a = CAM[0], b = CAM[CAM.length-1];
  for (let i=0;i<CAM.length-1;i++){ if (p>=CAM[i].p && p<=CAM[i+1].p){ a=CAM[i]; b=CAM[i+1]; break; } }
  const t = smoothstep(a.p, b.p, p);
  _pos.set(lerp(a.pos[0],b.pos[0],t), lerp(a.pos[1],b.pos[1],t), lerp(a.pos[2],b.pos[2],t));
  _look.set(lerp(a.look[0],b.look[0],t), lerp(a.look[1],b.look[1],t), lerp(a.look[2],b.look[2],t));
  const fov = lerp(a.fov, b.fov, t);
  return fov;
}

/* -------------------- scroll-driven state -------------------- */
function applyProgress(p){
  // cap lifts straight up & drifts aside, out of frame, during 0.12–0.34
  const open = smoothstep(0.12, 0.34, p);
  capGroup.position.y = open * 4.5;
  capGroup.position.x = open * 1.1;
  capGroup.rotation.z = open * 0.5;
  capGroup.visible = open < 0.995;

  // camera path
  const fov = sampleCamera(p);
  const par = (1 - smoothstep(0.55, 0.85, p)); // kill parallax once we commit to the plunge
  camera.position.set(_pos.x + mouseX * 0.5 * par, _pos.y, _pos.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(_look.x, _look.y, _look.z);
  camera.fov = fov; camera.updateProjectionMatrix();

  // glass + inner liquid stay solid through the descent; dissolve ONLY once underwater
  const dissolve = smoothstep(0.90, 1.0, p);
  glassMesh.material.opacity = 1 - dissolve;
  glassMesh.visible = dissolve < 0.99;
  liquidMesh.material.opacity = 1 - smoothstep(0.88, 1.0, p);
  liquidMesh.visible = liquidMesh.material.opacity > 0.02;
  surfMesh.material.opacity = (1 - smoothstep(0.86, 0.98, p)) * 0.9;
  surfMesh.visible = surfMesh.material.opacity > 0.02;
  bottleGroup.visible = dissolve < 0.995 || capGroup.visible;

  // underwater world ramps in as we break the surface
  const under = smoothstep(0.82, 0.985, p);
  bgMesh.material.uniforms.uOpacity.value = under;
  particles.material.uniforms.uOpacity.value = 0.25 + smoothstep(0.4, 0.95, p) * 0.75;
  particles.material.uniforms.uStretch.value = smoothstep(0.66, 0.92, p) * (1 - smoothstep(0.95, 1.0, p)); // motion streak on the plunge

  bottleGroup.rotation.y = lerp(-0.22, 0.16, smoothstep(0, 0.5, p));
}

/* -------------------- loop -------------------- */
const clock = new THREE.Clock();
function animate(){
  if (!running) return;
  const dt = clock.getDelta(), t = clock.elapsedTime;
  progress += (targetProgress - progress) * Math.min(1, dt * 6);
  applyProgress(progress);

  mouseX += (tMouseX - mouseX) * 0.05; mouseY += (tMouseY - mouseY) * 0.05;

  particles.material.uniforms.uTime.value = t;
  bgMesh.material.uniforms.uTime.value = t;
  if (videoEl && videoEl.readyState >= 2) bgMesh.material.uniforms.uHasVideo.value = 1;

  renderer.clear();
  renderer.render(bgScene, bgCam);
  renderer.clearDepth();
  renderer.render(mainScene, camera);
  requestAnimationFrame(animate);
}

/* -------------------- public API -------------------- */
window.MNScene = {
  setProgress(p){ targetProgress = clamp(p, 0, 1); },
  setActive(on){ if (on && !running){ running = true; clock.getDelta(); requestAnimationFrame(animate); } else if (!on){ running = false; } },
  isReady: () => ready
};

try { init(); }
catch (err) {
  console.error("[MNScene] WebGL init failed:", err);
  canvas.style.display = "none";
  document.body.classList.add("no-webgl");
  window.dispatchEvent(new CustomEvent("mn:ready"));
  window.MNScene = { setProgress(){}, setActive(){}, isReady: () => true };
}
