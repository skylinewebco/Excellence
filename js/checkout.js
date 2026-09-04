/* ============================================================
   CHECKOUT — luxury order flow (client-side demo)
   Accepts configured items (perfume + colour + cap + qty).
   ============================================================ */
import { PRODUCTS, bottleSVG, findProduct, findColor, findCap } from "./products.js";

const modal = document.getElementById("checkout");
const panel = modal.querySelector(".checkout__panel");
const form = document.getElementById("checkoutForm");
const successBox = document.getElementById("checkoutSuccess");
const listEl = document.getElementById("sumList");

let orderItems = [];
let lastFocus = null;

function money(n){ return "$" + n.toLocaleString("en-US"); }
function itemTotal(it){ return it.price * it.qty; }
function grandTotal(){ return orderItems.reduce((s,it)=>s+itemTotal(it),0); }

/* build a normalized line item from a config */
function lineFrom(cfg){
  const p = findProduct(cfg.id) || PRODUCTS[0];
  const color = findColor(p, cfg.colorId || "signature");
  const cap = findCap(cfg.capId || p.capStyle);
  return {
    id:p.id, product:p, name:p.name, price:p.price, category:p.category,
    colorId:color.id, colorName:color.name, colorA:color.a, colorB:color.b,
    capId:cap.id, capName:cap.name, qty: Math.max(1, cfg.qty||1)
  };
}

function renderSummary(){
  if(!orderItems.length) return;
  listEl.innerHTML = orderItems.map((it,idx)=>`
    <div class="sum-item">
      <div class="sum-item__thumb">${bottleSVG(it.product,{w:70,a:it.colorA,b:it.colorB,capStyle:it.capId})}</div>
      <div class="sum-item__meta">
        <span class="sum-item__cat">${it.category}</span>
        <h4>${it.name}</h4>
        <p>${it.colorName} bottle · ${it.capName} cap</p>
        <div class="sum-item__qty">
          <button type="button" class="sum-qty-btn" data-sqty="-1" data-i="${idx}" aria-label="Decrease">−</button>
          <span>${it.qty}</span>
          <button type="button" class="sum-qty-btn" data-sqty="1" data-i="${idx}" aria-label="Increase">+</button>
          ${orderItems.length>1?`<button type="button" class="sum-remove" data-remove="${idx}" aria-label="Remove">Remove</button>`:``}
        </div>
      </div>
      <div class="sum-item__price">${money(itemTotal(it))}</div>
    </div>`).join("");

  document.getElementById("sumSub").textContent = money(grandTotal());
  document.getElementById("sumTotal").textContent = money(grandTotal());
}

export function openCheckout(cfg){
  // cfg: { items:[...] } | single config | product id string
  let items;
  if (typeof cfg === "string") items = [lineFrom({ id: cfg })];
  else if (cfg && Array.isArray(cfg.items)) items = cfg.items.map(lineFrom);
  else if (cfg && cfg.id) items = [lineFrom(cfg)];
  else items = [lineFrom({ id: PRODUCTS[0].id })];
  orderItems = items;

  lastFocus = document.activeElement;
  successBox.classList.remove("is-shown");
  successBox.setAttribute("aria-hidden","true");
  renderSummary();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("is-locked");
  if (window.__lenis) window.__lenis.stop();
  setTimeout(()=>document.getElementById("c_name").focus(), 450);
}

function closeCheckout(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("is-locked");
  if (window.__lenis) window.__lenis.start();
  if (lastFocus) lastFocus.focus();
}

function wire(){
  document.addEventListener("click",(e)=>{
    if (e.target.closest("#checkout [data-close]")) closeCheckout();
    const sq = e.target.closest("[data-sqty]");
    if (sq){ const i=+sq.dataset.i; orderItems[i].qty=Math.max(1,orderItems[i].qty+ +sq.dataset.sqty); renderSummary(); }
    const rm = e.target.closest("[data-remove]");
    if (rm){ orderItems.splice(+rm.dataset.remove,1); renderSummary(); }
  });

  document.addEventListener("keydown",(e)=>{
    if (e.key==="Escape" && modal.classList.contains("is-open")) closeCheckout();
  });

  form.querySelectorAll("input").forEach(inp=>inp.addEventListener("blur",()=>inp.classList.add("touched")));

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!form.checkValidity()){
      form.querySelectorAll("input").forEach(i=>i.classList.add("touched"));
      form.reportValidity(); return;
    }
    const pay = form.querySelector("input[name=payment]:checked").value;
    const name = document.getElementById("c_name").value.split(" ")[0];
    const ref = "MN-" + Math.floor(100000 + Math.random()*899999);
    const count = orderItems.reduce((s,it)=>s+it.qty,0);

    document.getElementById("successRef").textContent = ref;
    document.getElementById("successMsg").innerHTML =
      `Thank you, ${name}. Your <strong>${count} flacon${count>1?"s":""}</strong> ` +
      `(${money(grandTotal())}) will be hand-sealed and dispatched. ` +
      (pay==="Cash on Delivery" ? "Please have payment ready on delivery."
        : pay==="Bank Transfer" ? "Bank transfer details have been sent to your email."
        : pay.indexOf("Wallet")>=0 ? "Mobile-wallet payment instructions have been sent to your phone and email."
        : "Card payment details have been sent to your email.");

    successBox.classList.add("is-shown");
    successBox.setAttribute("aria-hidden","false");
    if (window.MNCart && orderItems.length>1) window.MNCart.clear?.();
    panel.scrollTo({ top:0, behavior:"smooth" });
  });
}

document.addEventListener("DOMContentLoaded", wire);
window.__openCheckout = openCheckout;
