/* ============================================================
   SHOP — immersive product detail (customization) + cart
   Stays inside the liquid world; live bottle colour + cap swap.
   ============================================================ */
import { PRODUCTS, findProduct, colorwaysFor, signatureColor, CAP_STYLES,
         findColor, findCap, bottleDetailSVG, detailCapMarkup } from "./products.js";
import { openCheckout } from "./checkout.js";

const { gsap } = window;

/* ---------------- colour helpers ---------------- */
function hexToRgb(h){ h=h.replace("#",""); if(h.length===3) h=h.split("").map(c=>c+c).join(""); const n=parseInt(h,16); return [n>>16&255,n>>8&255,n&255]; }
function rgbToHex(r,g,b){ return "#"+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join(""); }
function mix(a,b,t){ const A=hexToRgb(a),B=hexToRgb(b); return rgbToHex(A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t); }

/* ============================================================
   CART
   ============================================================ */
const Cart = (() => {
  let items = [];
  const subs = [];
  const notify = () => subs.forEach(f=>f(items));
  return {
    items: () => items,
    count: () => items.reduce((s,i)=>s+i.qty,0),
    total: () => items.reduce((s,i)=>s+i.price*i.qty,0),
    add(it){
      const key = it.id+"|"+it.colorId+"|"+it.capId;
      const ex = items.find(x=>x.id+"|"+x.colorId+"|"+x.capId===key);
      if (ex) ex.qty += it.qty; else items.push({...it});
      notify();
    },
    remove(i){ items.splice(i,1); notify(); },
    clear(){ items=[]; notify(); },
    onChange(f){ subs.push(f); f(items); }
  };
})();
window.MNCart = Cart;

function cfgToLine(cfg){
  const p = findProduct(cfg.id);
  const c = findColor(p, cfg.colorId);
  const cap = findCap(cfg.capId);
  return { id:p.id, name:p.name, price:p.price, category:p.category,
           colorId:c.id, colorName:c.name, capId:cap.id, capName:cap.name, qty:cfg.qty||1 };
}

/* ============================================================
   DETAIL OVERLAY
   ============================================================ */
const detail = document.getElementById("detail");
const bottleWrap = document.getElementById("detailBottle");
const halo = document.getElementById("detailHalo");
let state = null; // { p, colorId, capId, qty, curA, curB }
let lastFocus = null;

function buildSwatches(){
  const cw = colorwaysFor(state.p);
  document.getElementById("colorSwatches").innerHTML = cw.map(c=>`
    <button class="swatch${c.id===state.colorId?" is-active":""}" data-color="${c.id}"
      style="--sa:${c.a};--sb:${c.b}" title="${c.name}" aria-label="${c.name}"></button>`).join("");
  document.getElementById("capOptions").innerHTML = CAP_STYLES.map(cs=>`
    <button class="cap-opt${cs.id===state.capId?" is-active":""}" data-cap="${cs.id}">${cs.name}</button>`).join("");
}

function setColor(id, animate=true){
  const c = findColor(state.p, id);
  state.colorId = id;
  document.getElementById("colorName").textContent = c.name;
  document.querySelectorAll("#colorSwatches .swatch").forEach(s=>s.classList.toggle("is-active", s.dataset.color===id));
  halo.style.background = `radial-gradient(circle, ${c.halo} 0%, transparent 62%)`;
  const stopA = bottleWrap.querySelector("#detailLiq .liq-a");
  const stopB = bottleWrap.querySelector("#detailLiq .liq-b");
  if(!stopA||!stopB){ return; }
  const fromA = state.curA || c.a, fromB = state.curB || c.b;
  if(!animate){ stopA.setAttribute("stop-color",c.a); stopB.setAttribute("stop-color",c.b); state.curA=c.a; state.curB=c.b; return; }
  const o = { t:0 };
  gsap.to(o,{ t:1, duration:.55, ease:"power2.out", onUpdate:()=>{
    stopA.setAttribute("stop-color", mix(fromA,c.a,o.t));
    stopB.setAttribute("stop-color", mix(fromB,c.b,o.t));
  }, onComplete:()=>{ state.curA=c.a; state.curB=c.b; }});
}

function setCap(id){
  state.capId = id;
  document.getElementById("capName").textContent = findCap(id).name;
  document.querySelectorAll("#capOptions .cap-opt").forEach(b=>b.classList.toggle("is-active", b.dataset.cap===id));
  const grp = bottleWrap.querySelector(".cap-group");
  if(grp){
    grp.innerHTML = detailCapMarkup(id);
    grp.classList.remove("cap-pop"); void grp.offsetWidth; grp.classList.add("cap-pop");
  }
}

function setQty(v){
  state.qty = Math.max(1, Math.min(99, v));
  document.getElementById("detailQty").value = state.qty;
}

export function openDetail(id){
  const p = findProduct(id); if(!p) return;
  const sig = signatureColor(p);
  state = { p, colorId:"signature", capId:p.capStyle||"classic", qty:1, curA:sig.a, curB:sig.b };
  lastFocus = document.activeElement;

  document.getElementById("detailCat").textContent = `${p.category} · ${p.type}`;
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailTag").textContent = p.tag;
  document.getElementById("detailDesc").textContent = p.desc;
  document.getElementById("detailNotes").innerHTML = p.notes.map(n=>`<span class="note-chip">${n}</span>`).join("");
  document.getElementById("detailPrice").textContent = "$"+p.price;
  bottleWrap.innerHTML = bottleDetailSVG(p,{ color:sig, capStyle:state.capId });
  buildSwatches();
  setColor("signature", false);
  document.getElementById("capName").textContent = findCap(state.capId).name;
  setQty(1);

  const dv = document.getElementById("detailVideo");
  if (dv){ if(!dv.getAttribute("src")) dv.setAttribute("src","assets/video/liquid-macro.mp4"); dv.play().catch(()=>{}); }

  detail.classList.add("is-open");
  detail.setAttribute("aria-hidden","false");
  document.body.classList.add("is-locked");
  if (window.__lenis) window.__lenis.stop();
}

function closeDetail(){
  const dv = document.getElementById("detailVideo"); if (dv) dv.pause();
  detail.classList.remove("is-open");
  detail.setAttribute("aria-hidden","true");
  if(!document.getElementById("cart").classList.contains("is-open")){
    document.body.classList.remove("is-locked");
    if (window.__lenis) window.__lenis.start();
  }
  if(lastFocus) lastFocus.focus();
}

function currentConfig(){ return { id:state.p.id, colorId:state.colorId, capId:state.capId, qty:state.qty }; }

/* ============================================================
   CART DRAWER
   ============================================================ */
const cart = document.getElementById("cart");
function renderCart(items){
  document.querySelectorAll("[data-cart-count]").forEach(e=>{
    e.textContent = Cart.count();
    e.classList.toggle("has-items", Cart.count()>0);
  });
  const list = document.getElementById("cartList");
  if(!items.length){ list.innerHTML = `<p class="cart__empty">Your selection is empty.<br/>Discover a fragrance to begin.</p>`; }
  else{
    list.innerHTML = items.map((it,i)=>`
      <div class="cart-item">
        <div class="cart-item__meta">
          <span class="cart-item__cat">${it.category}</span>
          <h4>${it.name}</h4>
          <p>${it.colorName} · ${it.capName} · ×${it.qty}</p>
        </div>
        <div class="cart-item__right">
          <span>$${(it.price*it.qty).toLocaleString("en-US")}</span>
          <button data-cart-remove="${i}" aria-label="Remove">Remove</button>
        </div>
      </div>`).join("");
  }
  document.getElementById("cartTotal").textContent = "$"+Cart.total().toLocaleString("en-US");
  document.getElementById("cartCheckout").disabled = !items.length;
}
Cart.onChange(renderCart);

function openCart(){
  cart.classList.add("is-open"); cart.setAttribute("aria-hidden","false");
  document.body.classList.add("is-locked"); if(window.__lenis) window.__lenis.stop();
}
function closeCart(){
  cart.classList.remove("is-open"); cart.setAttribute("aria-hidden","true");
  if(!detail.classList.contains("is-open")){ document.body.classList.remove("is-locked"); if(window.__lenis) window.__lenis.start(); }
}

/* ---------------- toast ---------------- */
let toastT;
function toast(msg){
  let t = document.getElementById("mnToast");
  if(!t){ t=document.createElement("div"); t.id="mnToast"; t.className="toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("is-shown");
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("is-shown"), 2200);
}

/* ============================================================
   WIRING
   ============================================================ */
function wire(){
  document.addEventListener("click",(e)=>{
    const d = e.target.closest("[data-detail]");
    if(d){ e.preventDefault(); openDetail(d.dataset.detail); return; }
    if(e.target.closest("[data-detail-close]")) closeDetail();
    if(e.target.closest("[data-cart-open]")){ e.preventDefault(); openCart(); }
    if(e.target.closest("[data-cart-close]")) closeCart();

    const sw = e.target.closest("[data-color]"); if(sw) setColor(sw.dataset.color);
    const cp = e.target.closest("[data-cap]"); if(cp) setCap(cp.dataset.cap);
    const dq = e.target.closest("[data-dqty]"); if(dq) setQty(state.qty + (+dq.dataset.dqty));

    if(e.target.closest("#detailAddCart")){
      Cart.add(cfgToLine(currentConfig()));
      toast(`${state.p.name} added — ${findColor(state.p,state.colorId).name}, ${findCap(state.capId).name} cap`);
    }
    if(e.target.closest("#detailBuy")){ openCheckout({ items:[currentConfig()] }); }

    const cr = e.target.closest("[data-cart-remove]"); if(cr) Cart.remove(+cr.dataset.cartRemove);
    if(e.target.closest("#cartCheckout")){ if(Cart.count()){ closeCart(); openCheckout({ items: Cart.items().map(i=>({id:i.id,colorId:i.colorId,capId:i.capId,qty:i.qty})) }); } }
  });

  document.getElementById("detailQty")?.addEventListener("input",(e)=>setQty(parseInt(e.target.value||"1",10)));

  document.addEventListener("keydown",(e)=>{
    if(e.key!=="Escape") return;
    if(cart.classList.contains("is-open")) closeCart();
    else if(detail.classList.contains("is-open")) closeDetail();
  });
}
document.addEventListener("DOMContentLoaded", wire);
window.__openDetail = openDetail;
