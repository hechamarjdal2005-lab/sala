/* ============================================================
   Parapharmacie Atlantic View — Catalogue produits
   ------------------------------------------------------------
   DONNÉES : modifiez ici les produits pour mettre à jour
   la boutique, la page d'accueil et le panier du site entier.
   Format prix : en dirhams (DH), nombres entiers.
   ============================================================ */

const CATEGORIES = {
  visage:     "Soins du visage",
  solaire:    "Solaires",
  bebe:       "Soins bébé & maman",
  nutrition:  "Compléments alimentaires",
  maquillage: "Maquillage & Beauté"
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

/* Petite liste d'images de démonstration (Unsplash).
   Remplacez ces URLs par vos propres photos produits. */
const PRODUCTS = [
  {
    id: 1,
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    cat: "visage",
    price: 95,
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 342,
    note: "Sérum anti-imperfections & matifiant — le best-seller mondial."
  },
  {
    id: 2,
    name: "Acide Hyaluronique 2% + B5",
    brand: "The Ordinary",
    cat: "visage",
    price: 88,
    img: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 214,
    note: "Hydratation intense en profondeur, toutes peaux."
  },
  {
    id: 3,
    name: "Normaderm Phytosolution",
    brand: "Vichy",
    cat: "visage",
    price: 169,
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 251,
    note: "Soin correcteur peau grasse & imperfection."
  },
  {
    id: 4,
    name: "Effaclar Duo(+) Correcteur",
    brand: "La Roche-Posay",
    cat: "visage",
    price: 178,
    img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 187,
    note: "Soin anti-imperfection & anti-marque n°1."
  },
  {
    id: 5,
    name: "Minéral 89 Sérum Visage",
    brand: "Vichy",
    cat: "visage",
    price: 239,
    img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 129,
    note: "Booster d'hydratation quotidien — fortifiant de la barrière cutanée."
  },
  {
    id: 6,
    name: "Rayblock Crème Solaire SPF50+",
    brand: "Covermark",
    cat: "solaire",
    price: 185,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 405,
    note: "Protection totale & invisible, actifs anti-âge inclus."
  },
  {
    id: 7,
    name: "Sérum Solaire Visage SPF50+",
    brand: "Aposèche",
    cat: "solaire",
    price: 149,
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 168,
    note: "Texture légère, fini sec, sans effect blanchissant."
  },
  {
    id: 8,
    name: "Anthelios UVMune 400 SPF50+",
    brand: "La Roche-Posay",
    cat: "solaire",
    price: 152,
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 143,
    note: "Protection UVA ultra-longue, même peaux sensibles."
  },
  {
    id: 9,
    name: "Crème Solaire Peaux Sensibles SPF50",
    brand: "Avène",
    cat: "solaire",
    price: 178,
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 96,
    note: "Prébiome apaisant, idéale après-soin ou peau en réaction."
  },
  {
    id: 10,
    name: "Lanoline Pure 40 ml",
    brand: "Lansinoh",
    cat: "bebe",
    price: 139,
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 310,
    note: "L'alliée de l'allaitement : apaise les mamelons sensibles."
  },
  {
    id: 11,
    name: "Hydra Bébé Crème de Jour",
    brand: "Mustela",
    cat: "bebe",
    price: 89,
    img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 157,
    note: "Hydratation 24h pour la peau délicate de bébé."
  },
  {
    id: 12,
    name: "Cicalfate+ Crème Réparatrice",
    brand: "Avène",
    cat: "bebe",
    price: 159,
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 208,
    note: "Répare & apaise les peaux irritées, nourrisson et adulte."
  },
  {
    id: 13,
    name: "Pregnacare Original",
    brand: "Vitabiotics",
    cat: "nutrition",
    price: 189,
    img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 154,
    note: "Le complexe de référence avant, pendant et après la grossesse."
  },
  {
    id: 14,
    name: "Vitamine D3 2000 UI",
    brand: "Solgar",
    cat: "nutrition",
    price: 129,
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 121,
    note: "Soutien osseux et immunitaire, formule hautement absorbable."
  },
  {
    id: 15,
    name: "Magnésium Marin Stress",
    brand: "Arkopharma",
    cat: "nutrition",
    price: 115,
    img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 102,
    note: "Aide à réduire la fatigue et à gérer le stress quotidien."
  },
  {
    id: 16,
    name: "Oméga 3 Ultra",
    brand: "Physiomance",
    cat: "nutrition",
    price: 145,
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 88,
    note: "Équilibre cœur, cerveau et confort articulaire."
  },
  {
    id: 17,
    name: "Correcteur Camouflage Pro",
    brand: "Covermark",
    cat: "maquillage",
    price: 139,
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    popular: true,
    views: 264,
    note: "Couvrance parfaite des imperfections et cicatrices."
  },
  {
    id: 18,
    name: "Shampooing Douceur Antipelliculaire",
    brand: "Aposèche",
    cat: "maquillage",
    price: 92,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
    popular: false,
    views: 133,
    note: "Cuir chevelu apaisé, cheveux brillants et propres."
  }
];

/* ============================================================
   Helpers produits
   ============================================================ */

const AV_VIEWS_PREFIX = "av_views_";

/* Retourne le libellé d'une catégorie */
function catLabel(key) {
  return CATEGORIES[key] || "Autre";
}

/* Nombre total de produits d'une catégorie */
function catCount(key) {
  return PRODUCTS.filter((p) => p.cat === key).length;
}

/* Compteur "social proof" : base du catalogue + incréments
   simulés de la journée, enregistrés dans localStorage. */
function liveViews(product) {
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(AV_VIEWS_PREFIX + product.id);
    const data = raw ? JSON.parse(raw) : null;
    if (!data || data.date !== today) return product.views;
    return product.views + data.n;
  } catch (e) {
    return product.views;
  }
}

function bumpViews(productId) {
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(AV_VIEWS_PREFIX + productId);
    const data = raw ? JSON.parse(raw) : null;
    const base = data && data.date === today ? data.n : 0;
    localStorage.setItem(
      AV_VIEWS_PREFIX + productId,
      JSON.stringify({ date: today, n: base + 1 })
    );
  } catch (e) { /* silencieux */ }
}

/* Trouve un produit par id */
function productById(id) {
  return PRODUCTS.find((p) => String(p.id) === String(id));
}