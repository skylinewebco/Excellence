# MAISON NOIR — Immersive Haute Parfumerie

An award-level, single-scroll luxury perfume experience. The viewer approaches a crystal
flacon, watches the cap lift, sees the bottle **mouth open**, and the camera physically
descends **through the opening, down the neck, and into the perfume** — where the amber
liquid becomes the entire world and the collection floats within it.

Built with real-time **WebGL (Three.js)**, **GSAP ScrollTrigger + Lenis** smooth scroll,
custom **GLSL**, and integrated cinematic **video** + a photoreal product render.

## Experience
- **Cinematic bottle-entry**: approach → cap opens → visible rim/mouth → descend through the
  neck → break the liquid surface → underwater. Hollow glass geometry with real wall
  thickness; the glass never just "turns transparent."
- **Continuous liquid world**: the amber essence (video texture + shader + particles) stays as
  the persistent background; products float inside it on frosted glass panels.
- **12 fragrances**, each with description, notes, category, price, and a giant index numeral.
- **Immersive product detail** (opens in-world, not a new page) with **live bottle-colour**
  and **cap-style** customization, quantity, **Add to Cart** and **Order Now**.
- **Cart** + **checkout** with customer details and **Cash on Delivery / Bank Transfer / Card**.
- **Signature showcase** featuring the real MAISON NOIR flacon.
- Fixed **light + dark** luxury aesthetic (no theme toggle). Fully responsive + reduced-motion.

## Run locally
Requires a static server (the app uses ES modules).

```bash
python server.py
```

Then open **http://localhost:5599**. `server.py` sends no-cache headers for clean reloads.
(Any static server works, e.g. `python -m http.server 5599`.)

## Structure
```
index.html            markup: hero stage, collection, signature, products, outro, detail, cart, checkout
css/styles.css        full design system (light + dark glass, responsive)
js/scene.js           WebGL hero: hollow flacon, camera-through-mouth path, env map, liquid video world
js/products.js        12 fragrances + procedural customizable flacon SVGs (colourways + cap styles)
js/shop.js            in-world product detail (live colour/cap swap) + cart
js/checkout.js        multi-item order flow (COD / Bank Transfer / Card)
js/main.js            Lenis + GSAP ScrollTrigger orchestration, loader, product reveals
assets/img/           studio-env.jpg (environment map), flacon-hero.jpg (signature photo)
assets/video/         liquid-world.mp4 (underwater world), liquid-macro.mp4 (detail stage)
server.py             tiny no-cache static dev server
```

## Tech
Three.js 0.160 · GSAP 3.12 + ScrollTrigger · Lenis 1.1 · custom GLSL · vanilla ES modules. No build step.

## Notes
`?static=1` disables smooth-scroll/loader/reveal-hiding (graceful fallback + QA); append
`#<product-id>` in static mode to deep-link a section.

This is a design demonstration — checkout processes no payment and no data leaves the browser.
