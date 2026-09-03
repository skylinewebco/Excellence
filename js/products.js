/* ============================================================
   PRODUCTS — 12 signature fragrances
   Content, pricing, notes + procedural, customizable flacon art
   (bottle colour + cap style are live-swappable).
   ============================================================ */

export const PRODUCTS = [
  { id:"noir-1", name:"Nuit Impériale", tag:"Midnight in bloom", category:"Eau de Parfum", type:"Oriental · Amber", price:320,
    desc:"A regal descent into darkness — smoked oud wrapped in candied plum and a whisper of Turkish rose. Built to linger long after midnight.",
    notes:["Oud","Black Plum","Turkish Rose","Amber"], liquid:"#4a1f1f", liquid2:"#7a2e2e", cap:"#c9a24b", halo:"rgba(160,40,40,.45)", shape:"tall", capStyle:"luxury" },
  { id:"noir-2", name:"Or Blanc", tag:"Light made wearable", category:"Eau de Parfum", type:"Floral · Musk", price:285,
    desc:"Weightless white flowers over sheer sandalwood and clean musk. The scent of morning light through linen curtains.",
    notes:["Jasmine","White Musk","Sandalwood","Pear"], liquid:"#e9dfc4", liquid2:"#f3ecd8", cap:"#b9a06a", halo:"rgba(233,223,196,.6)", shape:"round", capStyle:"minimal" },
  { id:"noir-3", name:"Cuir Sauvage", tag:"The untamed accord", category:"Extrait de Parfum", type:"Leather · Woody", price:410,
    desc:"Raw suede, birch tar and a flicker of saffron. A leather so alive it feels warm to the touch.",
    notes:["Suede","Saffron","Birch","Vetiver"], liquid:"#3a2410", liquid2:"#6b431c", cap:"#8a6a34", halo:"rgba(120,70,25,.5)", shape:"square", capStyle:"sculpted" },
  { id:"noir-4", name:"Rose Céleste", tag:"A rose above the clouds", category:"Eau de Parfum", type:"Floral · Fruity", price:298,
    desc:"Dewy centifolia rose lifted by lychee and pink pepper, resting on a bed of soft cashmere woods.",
    notes:["Centifolia Rose","Lychee","Pink Pepper","Cashmeran"], liquid:"#c76a7a", liquid2:"#e59aa6", cap:"#d9b26a", halo:"rgba(213,120,140,.5)", shape:"round", capStyle:"classic" },
  { id:"noir-5", name:"Vétiver Noir", tag:"Earth after rain", category:"Eau de Parfum", type:"Woody · Aromatic", price:275,
    desc:"Smoked Haitian vetiver grounded by bitter grapefruit and a trace of wet stone. Sharp, cool, unmistakably masculine.",
    notes:["Vetiver","Grapefruit","Cedar","Mineral"], liquid:"#1f3326", liquid2:"#38564a", cap:"#9aa06a", halo:"rgba(60,110,80,.45)", shape:"tall", capStyle:"metallic" },
  { id:"noir-6", name:"Ambre Solaire", tag:"Bottled golden hour", category:"Extrait de Parfum", type:"Amber · Gourmand", price:390,
    desc:"Molten amber, tonka bean and vanilla absolute melt into salted caramel warmth. Skin-close and hypnotic.",
    notes:["Amber","Tonka","Vanilla","Salted Caramel"], liquid:"#b5701d", liquid2:"#e29a3c", cap:"#e2c987", halo:"rgba(217,154,60,.6)", shape:"round", capStyle:"luxury" },
  { id:"noir-7", name:"Fleur de Sel", tag:"The coast at dawn", category:"Eau de Parfum", type:"Aquatic · Floral", price:265,
    desc:"Sea salt spray, neroli and driftwood — a cool marine breeze pressed into crystal. Effortless and clean.",
    notes:["Sea Salt","Neroli","Driftwood","Ambergris"], liquid:"#9fc4cf", liquid2:"#c7e0e6", cap:"#a9b8bc", halo:"rgba(160,200,210,.55)", shape:"square", capStyle:"minimal" },
  { id:"noir-8", name:"Encens Sacré", tag:"Cathedral smoke", category:"Extrait de Parfum", type:"Incense · Resinous", price:425,
    desc:"Frankincense curling through myrrh and cold stone. A meditative, almost holy composition for the initiated.",
    notes:["Frankincense","Myrrh","Elemi","Guaiac Wood"], liquid:"#2b2440", liquid2:"#4a3f6b", cap:"#8f83b8", halo:"rgba(90,70,150,.45)", shape:"tall", capStyle:"sculpted" },
  { id:"noir-9", name:"Figue Noire", tag:"Orchard at dusk", category:"Eau de Parfum", type:"Green · Fruity", price:258,
    desc:"Ripe black fig, crushed leaf and milky coconut wood. Verdant, sun-warmed and quietly addictive.",
    notes:["Black Fig","Fig Leaf","Coconut Wood","Green Almond"], liquid:"#3d4a24", liquid2:"#63763a", cap:"#b0a75e", halo:"rgba(90,120,50,.45)", shape:"round", capStyle:"classic" },
  { id:"noir-10", name:"Safran Royal", tag:"Spice of kings", category:"Extrait de Parfum", type:"Spicy · Oriental", price:445,
    desc:"Precious saffron threads over rose oil and creamy sandalwood. Opulent, velvety and impossibly rich.",
    notes:["Saffron","Rose Oil","Sandalwood","Benzoin"], liquid:"#8a2f16", liquid2:"#c04a22", cap:"#e2b657", halo:"rgba(200,70,30,.5)", shape:"square", capStyle:"luxury" },
  { id:"noir-11", name:"Iris Cendré", tag:"Powder and shadow", category:"Eau de Parfum", type:"Powdery · Woody", price:335,
    desc:"Silvery orris butter, violet and a veil of ash. Cool, refined and cerebral — the scent of quiet confidence.",
    notes:["Orris","Violet","Ambrette","Ash Wood"], liquid:"#8f92a6", liquid2:"#c0c2d2", cap:"#b6b0c0", halo:"rgba(150,150,180,.5)", shape:"tall", capStyle:"metallic" },
  { id:"noir-12", name:"Tabac d'Or", tag:"The gentleman's ember", category:"Extrait de Parfum", type:"Tobacco · Gourmand", price:460,
    desc:"Honeyed tobacco leaf, cognac and dark cacao smouldering over patchouli. The final, most decadent chapter.",
    notes:["Tobacco","Cognac","Cacao","Patchouli"], liquid:"#5a3410", liquid2:"#8f5a1c", cap:"#d9b45a", halo:"rgba(150,90,20,.5)", shape:"round", capStyle:"luxury" }
];

/* ---------- Customisation libraries ---------- */
export const COLORWAYS = [
  { id:"amber",    name:"Amber Gold",  a:"#e29a3c", b:"#b5701d", halo:"rgba(217,154,60,.55)" },
  { id:"rose",     name:"Rose Quartz", a:"#e59aa6", b:"#c76a7a", halo:"rgba(213,120,140,.5)" },
  { id:"emerald",  name:"Emerald",     a:"#5a9a7a", b:"#1f3326", halo:"rgba(60,130,90,.45)" },
  { id:"sapphire", name:"Sapphire",    a:"#6f9fd0", b:"#26406b", halo:"rgba(90,130,200,.5)" },
  { id:"amethyst", name:"Amethyst",    a:"#a688cc", b:"#3b2b5e", halo:"rgba(140,100,190,.45)" },
  { id:"noir",     name:"Noir Smoke",  a:"#6a6a76", b:"#18181e", halo:"rgba(120,120,140,.4)" },
  { id:"ivory",    name:"Ivory",       a:"#f3ecd8", b:"#cdbf9a", halo:"rgba(233,223,196,.55)" }
];

export const CAP_STYLES = [
  { id:"classic",  name:"Classic" },
  { id:"metallic", name:"Metallic" },
  { id:"minimal",  name:"Minimal" },
  { id:"luxury",   name:"Luxury" },
  { id:"sculpted", name:"Sculpted" }
];

/* signature colourway of a product (first swatch) */
export function signatureColor(p){ return { id:"signature", name:"Signature", a:p.liquid2, b:p.liquid, halo:p.halo }; }
export function colorwaysFor(p){
  const sig = signatureColor(p);
  const extra = COLORWAYS.filter(c => c.name.toLowerCase() !== p.name.toLowerCase()).slice(0,6);
  return [sig, ...extra];
}
export function findColor(p,id){ return colorwaysFor(p).find(c=>c.id===id) || signatureColor(p); }
export function findCap(id){ return CAP_STYLES.find(c=>c.id===id) || CAP_STYLES[0]; }

/* ---------- Cap renderer (by style) ---------- */
function renderCap(style, uid, cx, topY, capW, capH){
  const x = cx - capW/2;
  const grad = `url(#cap-${uid})`;
  const stroke = `stroke="rgba(255,255,255,.35)" stroke-width="1"`;
  switch(style){
    case "metallic":
      return `
        <rect x="${x}" y="${topY}" width="${capW}" height="${capH}" rx="5" fill="${grad}" ${stroke}/>
        <rect x="${x}" y="${topY+capH*0.28}" width="${capW}" height="2" fill="rgba(0,0,0,.25)"/>
        <rect x="${x}" y="${topY+capH*0.52}" width="${capW}" height="2" fill="rgba(0,0,0,.25)"/>
        <rect x="${x}" y="${topY+capH*0.76}" width="${capW}" height="2" fill="rgba(0,0,0,.25)"/>
        <rect x="${x+5}" y="${topY+4}" width="8" height="${capH-8}" rx="4" fill="rgba(255,255,255,.45)"/>`;
    case "minimal":
      return `
        <rect x="${cx-capW*0.34}" y="${topY+capH*0.28}" width="${capW*0.68}" height="${capH*0.72}" rx="3" fill="${grad}" ${stroke} opacity=".92"/>`;
    case "luxury":
      return `
        <rect x="${x}" y="${topY+capH*0.35}" width="${capW}" height="${capH*0.65}" rx="7" fill="${grad}" ${stroke}/>
        <ellipse cx="${cx}" cy="${topY+capH*0.3}" rx="${capW*0.42}" ry="${capH*0.34}" fill="${grad}" ${stroke}/>
        <ellipse cx="${cx-capW*0.12}" cy="${topY+capH*0.22}" rx="${capW*0.12}" ry="${capH*0.1}" fill="rgba(255,255,255,.6)"/>`;
    case "sculpted":
      return `
        <polygon points="${x},${topY+capH} ${x+capW*0.16},${topY} ${x+capW*0.84},${topY} ${x+capW},${topY+capH}" fill="${grad}" ${stroke}/>
        <line x1="${cx}" y1="${topY}" x2="${cx}" y2="${topY+capH}" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
        <line x1="${x+capW*0.16}" y1="${topY}" x2="${x}" y2="${topY+capH}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`;
    default: // classic
      return `
        <rect x="${x}" y="${topY}" width="${capW}" height="${capH}" rx="8" fill="${grad}" ${stroke}/>
        <rect x="${x+6}" y="${topY+5}" width="10" height="${capH-10}" rx="5" fill="rgba(255,255,255,.4)"/>`;
  }
}

/* ---------- Procedural flacon SVG ---------- */
export function bottleSVG(p, opts = {}) {
  const w = opts.w || 300;
  const liquidTop = opts.a || p.liquid2;
  const liquidBot = opts.b || p.liquid;
  const capColor  = opts.cap || p.cap;
  const capStyle  = opts.capStyle || p.capStyle || "classic";
  const idBase    = opts.idBase || (p.id + "-" + Math.random().toString(36).slice(2,7));
  const uid = idBase;

  const shapes = {
    tall:   { bx:78,  by:120, bw:144, bh:210, r:14 },
    round:  { bx:66,  by:130, bw:168, bh:190, r:70 },
    square: { bx:74,  by:128, bw:152, bh:196, r:8 }
  };
  const s = shapes[p.shape] || shapes.tall;
  const capW = 70, capH = 46, cx = 150, capTopY = 60;
  const neckW = 40, neckH = 30, neckX = cx - neckW/2;
  const liqId = opts.liqId || `liq-${uid}`;

  return `
  <svg class="flacon" viewBox="0 0 300 380" width="${w}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name} flacon">
    <defs>
      <linearGradient id="${liqId}" x1="0" y1="0" x2="0" y2="1">
        <stop class="liq-a" offset="0%" stop-color="${liquidTop}"/>
        <stop class="liq-b" offset="100%" stop-color="${liquidBot}"/>
      </linearGradient>
      <linearGradient id="glass-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,.34)"/>
        <stop offset="45%" stop-color="rgba(255,255,255,.04)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,.12)"/>
      </linearGradient>
      <linearGradient id="cap-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff6df"/>
        <stop offset="35%" stop-color="${capColor}"/>
        <stop offset="100%" stop-color="#6f5622"/>
      </linearGradient>
      <radialGradient id="sheen-${uid}" cx="35%" cy="25%" r="60%">
        <stop offset="0%" stop-color="rgba(255,255,255,.7)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>

    <rect x="${s.bx}" y="${s.by}" width="${s.bw}" height="${s.bh}" rx="${s.r}" fill="url(#${liqId})"/>
    <rect x="${s.bx}" y="${s.by}" width="${s.bw}" height="${s.bh}" rx="${s.r}" fill="url(#glass-${uid})"/>
    <rect x="${s.bx}" y="${s.by}" width="${s.bw}" height="${s.bh}" rx="${s.r}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>
    <rect x="${s.bx+14}" y="${s.by+10}" width="14" height="${s.bh-40}" rx="7" fill="url(#sheen-${uid})" opacity=".8"/>
    <rect x="${s.bx + s.bw*0.2}" y="${s.by + s.bh*0.42}" width="${s.bw*0.6}" height="${s.bh*0.26}" rx="4" fill="rgba(250,246,238,.9)"/>
    <text x="150" y="${s.by + s.bh*0.55}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="15" fill="#1a1611" letter-spacing="1">MAISON NOIR</text>
    <text x="150" y="${s.by + s.bh*0.63}" text-anchor="middle" font-family="Jost, sans-serif" font-size="7" fill="#8c8272" letter-spacing="2">${p.type.toUpperCase()}</text>

    <rect x="${neckX}" y="${s.by - neckH + 4}" width="${neckW}" height="${neckH}" rx="4" fill="url(#${liqId})" opacity=".65" stroke="rgba(255,255,255,.2)"/>
    <g class="cap-group">${renderCap(capStyle, uid, cx, capTopY, capW, capH)}</g>
  </svg>`;
}

/* Cap group markup for the detail flacon (stable geometry + gradient id) */
export function detailCapMarkup(style){ return renderCap(style, "detail", 150, 60, 70, 46); }

/* Detail flacon with STABLE ids so colour/cap can be tweened/replaced live */
export function bottleDetailSVG(p, { color, capStyle } = {}) {
  const c = color || signatureColor(p);
  return bottleSVG(p, { w: 300, a:c.a, b:c.b, capStyle: capStyle || p.capStyle, idBase:"detail", liqId:"detailLiq" });
}

/* ---------- Render collection into #products ---------- */
export function renderProducts() {
  const root = document.getElementById("products");
  if (!root) return;
  const frag = document.createDocumentFragment();

  PRODUCTS.forEach((p, i) => {
    const side = i === 0 ? "center" : (i % 2 === 1 ? "left" : "right");
    const light = i % 3 === 1;
    const el = document.createElement("article");
    el.className = "product" + (light ? " is-light" : "");
    el.dataset.side = side;
    el.dataset.index = i;
    el.id = p.id;
    el.style.setProperty("--halo", p.halo);

    el.innerHTML = `
      <div class="product__inner">
        <button class="product__visual" data-detail="${p.id}" aria-label="Open ${p.name}">
          <span class="product__idx">${String(i + 1).padStart(2, "0")}</span>
          <span class="product__halo"></span>
          <span class="product__bottle" data-float>${bottleSVG(p)}</span>
        </button>
        <div class="product__info">
          <p class="product__cat">${p.category} · ${p.type}</p>
          <h3 class="product__name">${p.name}</h3>
          <p class="product__tag">${p.tag}</p>
          <p class="product__desc">${p.desc}</p>
          <div class="product__notes">${p.notes.map(n => `<span class="note-chip">${n}</span>`).join("")}</div>
          <div class="product__row">
            <span class="product__price">$${p.price} <span>/ 100ml</span></span>
            <button class="btn btn--gold product__buy" data-detail="${p.id}">Discover</button>
          </div>
        </div>
      </div>`;
    frag.appendChild(el);
  });

  root.appendChild(frag);
}

export function findProduct(id) { return PRODUCTS.find(p => p.id === id); }

window.__MN = { PRODUCTS, bottleSVG, findProduct, COLORWAYS, CAP_STYLES };
