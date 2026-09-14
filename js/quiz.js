/* ============================================================
   Parapharmacie Atlantic View — Diagnostic Peau Express
   ------------------------------------------------------------
   Mini-quiz de 4 questions → recommandation catégorie + produits
   personnalisés. Réponses mémorisées dans localStorage (persistent
   entre les pages) avec possibilité de refaire le test.
   ============================================================ */

const QUIZ_KEY = "av_quiz_v1";

const QUIZ_STEPS = [
  {
    q: "Quel est votre type de peau ?",
    hint: "Pas sûr·e ? Choisissez « normale/mixte », votre conseiller affinera.",
    key: "type",
    options: [
      { v: "normale", label: "Normale / mixte" },
      { v: "seche",   label: "Sèche" },
      { v: "grasse",  label: "Grasse / à imperfections" },
      { v: "sensible",label: "Sensible / réactive" }
    ]
  },
  {
    q: "Quelle est votre préoccupation principale ?",
    hint: "Votre priorité du moment guidera notre sélection.",
    key: "besoin",
    options: [
      { v: "hydratation",  label: "Raviver mon éclat & hydrater" },
      { v: "imperfections",label: "Fermer les pores & imperfections" },
      { v: "age",          label: "Prévenir les premiers signes de l'âge" },
      { v: "soleil",       label: "Me protéger du soleil" },
      { v: "apaiser",      label: "Calmer les rougeurs / irritations" }
    ]
  },
  {
    q: "À quelle fréquence êtes-vous exposé·e au soleil ?",
    hint: "Exposition quotidienne, travail, sorties, terrasse…",
    key: "soleil",
    options: [
      { v: "souvent", label: "Tous les jours" },
      { v: "parfois", label: "De temps en temps" },
      { v: "rare",    label: "Rarement" }
    ]
  },
  {
    q: "Votre rituel beauté idéal, c'est plutôt… ?",
    hint: "Dernière question — votre routine, pas votre grade. 😉",
    key: "routine",
    options: [
      { v: "simple",  label: "Simple : le essentiel, efficace" },
      { v: "nature",  label: "Naturel & doux pour ma peau" },
      { v: "complet", label: "Complet : je raffine ma routine" },
      { v: "pro",     label: "Des actifs de marques expertes" }
    ]
  }
];

/* Lien entre les réponses et la recommandation */
function computeRecommendation(answers) {
  const type = answers.type || "normale";
  const besoin = answers.besoin || "hydratation";
  const soleil = answers.soleil || "parfois";

  // Protection solaire avant tout
  if (besoin === "soleil" || soleil === "souvent" && besoin === "age") {
    return {
      cat: "solaire",
      emoji: "☀️",
      title: "Routine solaire expert",
      catLabel: "Solaires",
      copy:
        "La protection solaire est votre alliée n°1 anti-âge. Nous vous conseillons des formules SPF50+ invisibles, testées sous contrôle dermatologique.",
      ids: [6, 7, 8, 9],
      cta: "shop.html?cat=solaire"
    };
  }

  // Peau sensible / réactive → soins apaisants
  if (type === "sensible" || besoin === "apaiser") {
    return {
      cat: "visage",
      emoji: "🤍",
      title: "Douceur & apaisement",
      catLabel: "Soins du visage",
      copy:
        "Votre peau réclame de la douceur. Cicalfate+, Avène et Aposèche apaisent durablement sans irriter. Évitez le savon et hydratez matin et soir.",
      ids: [12, 9, 7],
      cta: "shop.html"
    };
  }

  // Peau grasse / imperfections
  if (type === "grasse" || besoin === "imperfections") {
    return {
      cat: "visage",
      emoji: "✨",
      title: "Peau nette & matifiée",
      catLabel: "Soins du visage",
      copy:
        "Niacinamide, Effaclar Duo(+) et Normaderm : la combinaison gagnante pour affiner les pores et estomper les imperfections, sans dessécher.",
      ids: [1, 3, 4],
      cta: "shop.html?cat=visage"
    };
  }

  // Sécheresse / déshydratation
  if (type === "seche" || besoin === "hydratation") {
    return {
      cat: "visage",
      emoji: "💧",
      title: "Hydratation intense",
      catLabel: "Soins du visage",
      copy:
        "Combinez Hyaluronique 2% + Minéral 89, puis scellez avec une crème riche. Résultat : un teint rebondi et lumineux dès 2 semaines.",
      ids: [2, 5, 12],
      cta: "shop.html?cat=visage"
    };
  }

  // Anti-âge
  return {
    cat: "visage",
    emoji: "🌟",
    title: "Éclat & anti-âge",
    catLabel: "Soins du visage",
    copy:
      "Antioxydants le matin, actifs régénérants le soir, SPF chaque jour. On cible le teint terne avec un sérum enrichi et une protection optimale.",
    ids: [5, 17, 2],
    cta: "shop.html?cat=visage"
  };
}

/* ---------- Rendu DOM ---------- */
function quizResultHTML(rec) {
  const items = rec.ids
    .map((id) => productById(id))
    .filter(Boolean)
    .map(
      (p) => `
      <div class="quiz-rec-item">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div>
          <strong>${p.name}</strong>
          <small>${p.brand} · ${p.price} DH</small>
          <button class="btn-add" data-add-to-cart="${p.id}" style="margin-top:6px">Ajouter</button>
        </div>
      </div>`
    )
    .join("");

  return `
    <div class="result-emoji">${rec.emoji}</div>
    <h3>${rec.title}</h3>
    <span class="result-cat">★ ${rec.catLabel}</span>
    <p>${rec.copy}</p>
    <div class="quiz-rec">${items}</div>
    <a class="btn btn-teal" href="${rec.cta}">Découvrir la sélection</a>
    <div>
      <button class="quiz-restart" type="button">↺ Refaire le diagnostic</button>
    </div>`;
}

function initQuiz() {
  const root = document.getElementById("quiz");
  if (!root) return;

  const form = root.querySelector(".quiz-body");
  const bar = root.querySelector(".quiz-bar");
  const steps = Array.from(root.querySelectorAll(".quiz-step"));
  const result = root.querySelector(".quiz-result");
  const answers = {};
  let current = 0;

  /* Restauration d'un test déjà réalisé */
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(QUIZ_KEY)); } catch (e) { return null; }
  })();

  function saveResult(rec) {
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers, rec: rec.title, cat: rec.catLabel }));
    } catch (e) { /* silencieux */ }
  }

  const nav = root.querySelector(".quiz-nav");

  function showStep(i) {
    current = i;
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
    bar.style.width = steps.length ? `${((i + 1) / (steps.length + 1)) * 100}%` : "25%";
    if (backBtn) {
      backBtn.style.opacity = i > 0 ? "1" : "0";
      backBtn.style.pointerEvents = i > 0 ? "auto" : "none";
    }
    const counter = root.querySelector("#quizCount");
    if (counter) counter.textContent = i + 1;
  }

  function showResult(rec) {
    steps.forEach((s) => s.classList.remove("active"));
    result.innerHTML = quizResultHTML(rec);
    result.classList.add("show");
    bar.style.width = "100%";
    if (nav) nav.style.display = "none";
    saveResult(rec);
  }

  function renderResultFromStored() {
    if (!stored) return false;
    const rec = computeRecommendation(stored.answers || {});
    showResult(rec);
    return true;
  }

  function restart() {
    try { localStorage.removeItem(QUIZ_KEY); } catch (e) { /* */ }
    if (nav) nav.style.display = "";
    result.classList.remove("show");
    result.innerHTML = "";
    showStep(0);
  }

  /* Multi-étapes : clic sur une option → étape suivante */
  root.addEventListener("change", (e) => {
    const input = e.target.closest("input[type=radio]");
    if (!input) return;
    answers[input.name] = input.value;

    if (current < steps.length - 1) {
      setTimeout(() => showStep(current + 1), 260);
    } else {
      const rec = computeRecommendation(answers);
      setTimeout(() => showResult(rec), 320);
    }
  });

  root.addEventListener("click", (e) => {
    if (e.target.closest(".quiz-restart")) restart();
  });

  /* Bouton retour */
  const backBtn = root.querySelector("[data-quiz-back]");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (current > 0) showStep(current - 1);
    });
  }

  /* Au chargement : reprendre le résultat déjà calculé, sinon Q1 */
  if (!renderResultFromStored()) showStep(0);
}

document.addEventListener("DOMContentLoaded", initQuiz);