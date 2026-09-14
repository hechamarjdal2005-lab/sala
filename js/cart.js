/* ============================================================
   Parapharmacie Atlantic View — Panier (localStorage + WhatsApp)
   ------------------------------------------------------------
   Logique du panier : ajout, quantités, total et envoi de la
   commande via WhatsApp. Persistant entre toutes les pages.
   ============================================================ */

const CART_KEY = "av_cart_v1";
const PHONE_INTL = "212606716097"; // +212 6 06 71 60 97

/* ---------- Utilitaires persistance ---------- */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

/* ---------- Opérations panier ---------- */
function cartCount() {
  return Object.values(loadCart()).reduce((sum, q) => sum + q, 0);
}

function cartTotal() {
  const cart = loadCart();
  let total = 0;
  for (const key in cart) {
    const p = productById(key);
    if (p) total += p.price * cart[key];
  }
  return total;
}

function addToCart(id, delta = 1) {
  const cart = loadCart();
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  saveCart(cart);
}

/* ---------- Rendu DOM ---------- */
function estc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function renderCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.classList.toggle("visible", n > 0);
}

function cartItemHTML(id) {
  const p = productById(id);
  const qty = loadCart()[id] || 0;
  if (!p) return "";
  return `
    <li class="cart-item" data-id="${p.id}">
      <img src="${p.img}" alt="${estc(p.name)}" loading="lazy">
      <div class="cart-item-info">
        <strong>${estc(p.name)}</strong>
        <small>${estc(p.brand)}</small>
        <div class="cart-qty">
          <button data-qty-dec aria-label="Diminuer la quantité">−</button>
          <span>${qty}</span>
          <button data-qty-inc aria-label="Augmenter la quantité">+</button>
        </div>
      </div>
      <div class="cart-item-side">
        <button class="cart-remove" data-remove aria-label="Retirer du panier">✕</button>
        <span class="cart-item-amt">${p.price * qty} DH</span>
      </div>
    </li>`;
}

function renderCart() {
  const body = document.getElementById("cartBody");
  const totalEl = document.getElementById("cartTotal");
  if (!body || !totalEl) return;

  const cart = loadCart();
  const ids = Object.keys(cart).filter((id) => productById(id));

  if (!ids.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="ico">🛒</div>
        <b>Votre panier est vide</b>
        <p>Découvrez nos soins conseillés par notre pharmacien.</p>
        <br>
        <a href="shop.html">Parcourir la boutique →</a>
      </div>`;
  } else {
    body.innerHTML = `<ul class="cart-list">${ids.map(cartItemHTML).join("")}</ul>`;
  }
  totalEl.textContent = cartTotal() + " DH";
  renderCartBadge();
}

function removeCartItem(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

/* ---------- Message WhatsApp formaté ---------- */
function buildWhatsAppMessage() {
  const cart = loadCart();
  const lines = [];
  let total = 0;
  for (const key in cart) {
    const p = productById(key);
    if (!p) continue;
    lines.push(`• ${p.name} (${p.brand}) × ${cart[key]} — ${p.price * cart[key]} DH`);
    total += p.price * cart[key];
  }
  const intro = "Bonjour, je souhaite commander chez Parapharmacie Atlantic View 😊";
  const recap = lines.length ? lines.join("\n") : "Produits à confirmer.";
  const totalLine = `Total : ${total} DH`;
  const outro = "\nMerci de me confirmer la disponibilité et le retrait. ";
  return `${intro}\n\n${recap}\n${totalLine}${outro}`;
}

function checkoutViaWhatsApp() {
  const n = cartCount();
  if (!n) return;
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

/* ---------- Panneau (drawer / bottom-sheet) ---------- */
const cartUi = {
  panel: null,
  overlay: null,
  open() {
    if (!this.panel) return;
    this.panel.className = "cart-panel open";
    if (this.overlay) this.overlay.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  },
  close() {
    if (!this.panel) return;
    this.panel.className = "cart-panel";
    if (this.overlay) this.overlay.classList.remove("open");
    document.documentElement.style.overflow = "";
  }
};

/* ---------- Initialisation & événements ---------- */
document.addEventListener("DOMContentLoaded", () => {
  cartUi.panel = document.getElementById("cartPanel");
  cartUi.overlay = document.getElementById("cartOverlay");

  renderCart();

  const openBtn = document.getElementById("cartBtn");
  if (openBtn) openBtn.addEventListener("click", () => { renderCart(); cartUi.open(); });

  // Fermeture : overlay, bouton, touche Échap, swipe vers le bas
  document.querySelectorAll("#cartOverlay, [data-close-cart]").forEach((el) => {
    el.addEventListener("click", () => cartUi.close());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cartUi.close();
  });

  // Commande via WhatsApp
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutViaWhatsApp);

  // Délégation des clics (travaille sur toutes les pages)
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn && !addBtn.disabled) {
      e.preventDefault();
      const id = addBtn.getAttribute("data-add-to-cart");
      addToCart(id, 1);
      bumpViews(id);
      renderCart();
      animateCartIcon(addBtn);
      showToast("Ajouté au panier ✓");
      return;
    }

    const inc = e.target.closest("[data-qty-inc]");
    const dec = e.target.closest("[data-qty-dec]");
    if (inc || dec) {
      const li = e.target.closest(".cart-item");
      if (!li) return;
      addToCart(li.dataset.id, inc ? 1 : -1);
      renderCart();
      return;
    }

    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const li = e.target.closest(".cart-item");
      if (!li) return;
      removeCartItem(li.dataset.id);
      return;
    }

    // Lien "Fermer" en bas du panier
    const closeCart = e.target.closest("[data-close-cart]");
    if (closeCart) cartUi.close();
  });

  window.addEventListener("cart:changed", renderCartBadge);
});

/* ---------- Animation icône panier (header) ---------- */
function animateCartIcon(trigger) {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.classList.remove("pulse");
    void badge.offsetWidth; // relance l'animation
    badge.classList.add("pulse");
  }
  const card = trigger.closest(".product-card");
  if (card) {
    card.style.transform = "scale(.99)";
    setTimeout(() => (card.style.transform = ""), 180);
  }
}

/* ---------- Toast (notification) ---------- */
function showToast(msg, ms = 2200) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="ok">✓</span> ${estc(msg)}`;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), ms);
}