/* ============================================================
   Parapharmacie Atlantic View — Interactions générales
   ------------------------------------------------------------
   • Révélation au scroll (Intersection Observer)
   • Navigation mobile (drawer), header au scroll
   • Compte à rebours de l'offre du moment
   • Rendu des produits (accueil + boutique)
   • Filtres / recherche / tri de la boutique
   • Avis clients (barres + étoiles animées)
   • Formulaire de contact & bouton retour en haut
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initReveal();
  initCountdown();
  initDemoViewers();
  initStarsBars();
  initBackToTop();
  initFooterYear();
  initShopPage();
  initHomeFeatured();
  initContactForm();
});

/* ---------- Header : ombre au scroll ---------- */
function initHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Navigation mobile ---------- */
function initMobileNav() {
  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");
  const overlay = document.getElementById("navOverlay");
  if (!burger || !nav) return;

  const setOpen = (open) => {
    burger.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  if (overlay) overlay.addEventListener("click", () => setOpen(false));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

/* ---------- Révélation au scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-stars"
  );
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Compte à rebours "Offre du moment" ---------- */
function initCountdown() {
  const box = document.getElementById("countdown");
  if (!box) return;

  const PROMO_KEY = "av_promo_end";
  let end = parseInt(localStorage.getItem(PROMO_KEY), 10);
  if (!end || end < Date.now()) {
    end = Date.now() + (3 * 24 * 3600 + 11 * 3600 + 37 * 60 + 12) * 1000;
    localStorage.setItem(PROMO_KEY, String(end));
  }

  const pad = (n) => String(n).padStart(2, "0");
  const cells = {
    j: box.querySelector("[data-cd='j']"),
    h: box.querySelector("[data-cd='h']"),
    m: box.querySelector("[data-cd='m']"),
    s: box.querySelector("[data-cd='s']")
  };

  function tick() {
    let diff = Math.max(0, end - Date.now());
    const d = Math.floor(diff / 86400000);
    diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);
    diff -= h * 3600000;
    const m = Math.floor(diff / 60000);
    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    if (cells.j) cells.j.textContent = pad(d);
    if (cells.h) cells.h.textContent = pad(h);
    if (cells.m) cells.m.textContent = pad(m);
    if (cells.s) cells.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Compteurs "consultés aujourd'hui" (simulation) ---------- */
function initDemoViewers() {
  const KEYS = "av_viewers_log";
  let already = false;
  try {
    const day = new Date().toDateString();
    const raw = localStorage.getItem(KEYS);
    already = raw === day;
  } catch (e) { /* */ }

  const LOG_IV = 7000; // un "visiteur" toutes les ~7s par session
  if (!already) {
    try { localStorage.setItem(KEYS, new Date().toDateString()); } catch (e) { /* */ }
    setInterval(() => {
      const hotIds = PRODUCTS.filter((p) => p.popular).map((p) => p.id);
      if (!hotIds.length) return;
      bumpViews(hotIds[Math.floor(Math.random() * hotIds.length)]);
      refreshProofCounters();
    }, LOG_IV);
  }
}

function refreshProofCounters() {
  document.querySelectorAll("[data-proof]").forEach((el) => {
    const id = el.getAttribute("data-proof");
    const p = productById(id);
    if (p) el.textContent = `${liveViews(p).toLocaleString("fr-MA")} personnes ont consulté ce produit aujourd'hui`;
  });
}

/* ---------- Avis : barres de score + étoiles animées ---------- */
function initStarsBars() {
  const bars = document.querySelectorAll("[data-bar]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const span = entry.target.firstElementChild;
        if (span) span.style.width = entry.target.dataset.bar + "%";
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => io.observe(b));
}

/* ---------- Retour en haut ---------- */
function initBackToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  const onScroll = () => btn.classList.toggle("show", window.scrollY > 600);
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();
}

/* ---------- Année du footer ---------- */
function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Carte produit (partagée accueil / boutique) ---------- */
function productCard(p) {
  const views = liveViews(p).toLocaleString("fr-MA");
  const badge = p.popular
    ? '<span class="product-badge">● Populaire</span>'
    : "";
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        <img src="${p.img}" alt="${escAttr(p.name)}" loading="lazy">
        ${badge}
        <button class="quick-add" data-add-to-cart="${p.id}" aria-label="Ajouter ${escAttr(p.name)} au panier">+</button>
      </div>
      <div class="product-info">
        <span class="product-brand">${escHtml(p.brand)}</span>
        <h3 class="product-name">${escHtml(p.name)}</h3>
        <div class="product-foot">
          <span class="price">${p.price}</span>
          <button class="btn-add" data-add-to-cart="${p.id}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Ajouter
          </button>
        </div>
        <p class="product-proof" data-proof="${p.id}"><span class="dot"></span> ${views} personnes ont consulté ce produit aujourd'hui</p>
      </div>
    </article>`;
}

function escHtml(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}
function escAttr(s) {
  return escHtml(s).replace(/"/g, "&quot;");
}

/* ---------- Accueil : produits populaires ---------- */
function initHomeFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  const featured = PRODUCTS.filter((p) => p.popular).slice(0, 4);
  if (!featured.length) featured = PRODUCTS.slice(0, 4);
  grid.innerHTML = featured.map(productCard).join("");
}

/* ---------- Boutique : rendu, filtres, recherche, tri ---------- */
function initShopPage() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const emptyEl = document.getElementById("shopEmpty");
  const resultsEl = document.getElementById("shopResults");
  const searchEl = document.getElementById("shopSearch");
  const sortEl = document.getElementById("shopSort");
  const chips = Array.from(document.querySelectorAll("[data-filter]"));

  const state = { cat: "all", q: "", sort: "reco" };

  /* Catégorie transmise via URL ?cat=… (bouton offre du moment) */
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cat") && CATEGORIES[params.get("cat")]) state.cat = params.get("cat");
  } catch (e) { /* */ }

  function filtered() {
    let list = [...PRODUCTS];
    if (state.cat !== "all") list = list.filter((p) => p.cat === state.cat);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
    if (state.sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }

  function render() {
    const list = filtered();
    const n = list.length;
    grid.innerHTML = list.map(productCard).join("");

    if (emptyEl) emptyEl.style.display = n ? "none" : "block";
    if (resultsEl) {
      const label = state.cat === "all" ? "Toute la boutique" : estc(catLabel(state.cat));
      resultsEl.innerHTML = n
        ? `<span><strong>${n}</strong> produit${n > 1 ? "s" : ""}</span><span>${label}</span>`
        : "";
    }
    syncChips();
  }

  function syncChips() {
    chips.forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filter === state.cat);
    });
  }

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      state.cat = chip.dataset.filter || "all";
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      state.q = searchEl.value.trim();
      render();
    });
  }
  if (sortEl) sortEl.addEventListener("change", () => { state.sort = sortEl.value; render(); });

  render();
}

/* ---------- Formulaire de contact ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const ok = document.getElementById("formOk");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nom = data.get("nom") || "";
    const tel = data.get("telephone") || "";
    const sujet = data.get("sujet") || "Demande de renseignements";
    const message = data.get("message") || "";

    const waMessage =
      `Bonjour, je suis ${nom}. ${sujet}\n\n${message}` +
      (tel ? `\n\nMon numéro : ${tel}` : "");

    window.open(
      `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(waMessage)}`,
      "_blank", "noopener"
    );

    if (ok) {
      ok.classList.remove("show");
      void ok.offsetWidth;
      ok.classList.add("show");
    }
    form.reset();
    setTimeout(() => ok && ok.classList.remove("show"), 8000);
  });
}

/* Utilitaire partagé (déjà défini dans cart.js sur d'autres pages) */
function estc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}