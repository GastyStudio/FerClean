/* =====================================================================
   CONFIGURACIÓN – ACÁ SE PERSONALIZA TODO
   ===================================================================== */
const CONFIG = {
  // PERSONALIZAR: número definitivo, solo dígitos, con código de país y sin "+".
  // Argentina celular: 549 + código de área + número. Ej: 5491123456789
  whatsappNumber: "5491167845506",

  // Mensajes iniciales según el botón (data-wa="clave"). "default" se usa si no hay clave.
  messages: {
    default: "Hola, FER CLEAN. Quisiera solicitar un presupuesto para un servicio de limpieza.",
    header: "Hola, FER CLEAN. Quisiera solicitar un presupuesto para un servicio de limpieza.",
    hero: "Hola, FER CLEAN. Quisiera solicitar un presupuesto para un servicio de limpieza exterior.",
    "servicio-tejados": "Hola, FER CLEAN. Quisiera solicitar un presupuesto para la limpieza de un tejado/techo.",
    "servicio-fachadas": "Hola, FER CLEAN. Quisiera solicitar un presupuesto para la limpieza de un frente/fachada.",
    "servicio-veredas": "Hola, FER CLEAN. Quisiera solicitar un presupuesto para la limpieza de una vereda/entrada.",
    "servicio-patios": "Hola, FER CLEAN. Quisiera solicitar un presupuesto para la limpieza de un patio o superficie exterior.",
    "como-trabajamos": "Hola, FER CLEAN. Quisiera consultar por un servicio de limpieza y saber cómo avanzar.",
    "cta-principal": "Hola, FER CLEAN. Quisiera pedir un presupuesto para limpiar mis espacios exteriores.",
    footer: "Hola, FER CLEAN. Quisiera hacer una consulta sobre sus servicios de limpieza.",
    flotante: "Hola, FER CLEAN. Quisiera solicitar un presupuesto para un servicio de limpieza."
  },

  // PERSONALIZAR: fotos reales. Dejar "" para usar las ilustraciones de muestra.
  // Usar rutas relativas (ej: "img/hero.webp") o URLs. Recomendado: WebP/AVIF, hero ≤ 200 KB, resto ≤ 120 KB.
  images: {
    hero: "",
    tejados: "", fachadas: "", veredas: "", patios: "",
    // Cada trabajo se puede cargar de dos formas:
    //  a) Slider:      { before: "img/x-antes.webp", after: "img/x-despues.webp" }
    //  b) Foto partida (una sola foto con zona sucia y limpia):
    //                  { split: "img/x.webp", dirty: "left" | "right" | "top" | "bottom" }
    //     "dirty" indica de qué lado de la foto está la zona SIN limpiar.
    ba: {
      tejado: { split: "img/tejado.webp", dirty: "bottom" },
      frente: { split: "img/frente.webp", dirty: "left" },
      vereda: { before: "", after: "" },
      patio:  { before: "", after: "" }
    }
  }
};

/* =====================================================================
   WHATSAPP + TRACKING (GA4 / GTM)
   Cada clic envía el evento "whatsapp_click" con la ubicación del botón.
   En GA4/GTM marcarlo como evento clave (conversión).
   ===================================================================== */
function waUrl(key){
  const msg = CONFIG.messages[key] || CONFIG.messages.default;
  return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
}
document.querySelectorAll("[data-wa]").forEach(a => {
  const key = a.dataset.wa;
  a.href = waUrl(key);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.addEventListener("click", () => {
    const payload = { event: "whatsapp_click", cta_location: key, link_url: a.href };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);                      // GTM
    if (typeof window.gtag === "function") {             // GA4 directo
      window.gtag("event", "whatsapp_click", { cta_location: key });
    }
  });
});

/* =====================================================================
   ILUSTRACIONES DE MUESTRA (se reemplazan con fotos en CONFIG.images)
   ===================================================================== */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function blotches(n, seed, y0, y1){
  const r = rng(seed), cols = ["#25381f","#3a3a26","#1b2a1a","#6f8546"]; let s="";
  for(let i=0;i<n;i++){
    s += `<ellipse cx="${r()*400|0}" cy="${y0 + r()*(y1-y0)|0}" rx="${14+r()*38|0}" ry="${6+r()*18|0}" fill="${cols[r()*cols.length|0]}" opacity="${(.22+r()*.3).toFixed(2)}"/>`;
  }
  return s;
}
function scene(type, dirty){
  const sky = `<defs><linearGradient id="sk${type}${+dirty}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dirty?'#9fb3c4':'#5bb4f2'}"/><stop offset="1" stop-color="${dirty?'#c5d1da':'#cfeaff'}"/></linearGradient></defs><rect width="400" height="300" fill="url(#sk${type}${+dirty})"/>`;
  let body = "";
  if(type==="roof"){
    const r = rng(7); let tiles = "";
    for(let row=0;row<11;row++){
      for(let c=-1;c<11;c++){
        const x = c*44 + (row%2?22:0), y = 30 + row*26, v = r()*18|0;
        const base = dirty ? `hsl(18 ${22+v/2}% ${30+v/2}%)` : `hsl(${14+v/3} ${60+v}% ${44+v/2}%)`;
        tiles += `<rect x="${x}" y="${y}" width="42" height="30" rx="8" fill="${base}" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>`;
      }
    }
    body = `<g transform="rotate(-7 200 150) translate(0 -10)">${tiles}</g>` + (dirty ? `<g transform="rotate(-7 200 150)">${blotches(34,3,20,300)}</g>` : "");
  }
  if(type==="facade"){
    const wall = dirty ? "#a9a699" : "#f1eadb";
    body = `<rect y="70" width="400" height="230" fill="${wall}"/>
      <polygon points="0,70 200,10 400,70" fill="${dirty?'#4a4f55':'#2c3a4d'}"/>
      <rect x="40" y="110" width="90" height="80" rx="4" fill="#cfe7f7" stroke="#fff" stroke-width="7"/><path d="M85 110v80M40 150h90" stroke="#fff" stroke-width="5"/>
      <rect x="270" y="110" width="90" height="80" rx="4" fill="#cfe7f7" stroke="#fff" stroke-width="7"/><path d="M315 110v80M270 150h90" stroke="#fff" stroke-width="5"/>
      <rect x="168" y="150" width="64" height="150" rx="4" fill="${dirty?'#5b4a3a':'#7a5a3e'}"/><circle cx="220" cy="228" r="4" fill="#e7c35b"/>
      <rect y="268" width="400" height="32" fill="${dirty?'#6e6a60':'#9aa3ab'}"/>
      <ellipse cx="30" cy="268" rx="46" ry="26" fill="#2f7a3a"/><ellipse cx="372" cy="268" rx="50" ry="28" fill="#2f7a3a"/>`
      + (dirty ? `${blotches(26,5,80,270)}<g opacity=".25" fill="#1b2a1a">${[50,95,300,335,190,215].map((x,i)=>`<rect x="${x}" y="${190+i%2*10}" width="5" height="${60+i*6}"/>`).join("")}</g>` : "");
  }
  if(type==="sidewalk"){
    let slabs = "";
    const r = rng(11);
    for(let row=0;row<5;row++){
      const y = 110 + row*40, h = 38, w = 80 + row*14, n = Math.ceil(420/w)+1, off = (row%2)*w/2;
      for(let c=-1;c<n;c++){
        const v = r()*10|0;
        slabs += `<rect x="${c*w - off}" y="${y}" width="${w-4}" height="${h}" fill="${dirty?`hsl(60 6% ${42+v}%)`:`hsl(210 12% ${78+v/2}%)`}" rx="2"/>`;
      }
    }
    body = `<rect y="70" width="400" height="60" fill="#3f8a3c"/><rect x="0" y="86" width="400" height="30" fill="#2f7a3a" opacity=".6"/>
      <rect x="260" y="30" width="110" height="80" fill="#e9e1d3"/><rect x="300" y="60" width="30" height="50" fill="#7a5a3e"/>
      ${slabs}` + (dirty ? blotches(30,9,115,300) : `<g opacity=".18"><rect x="0" y="116" width="400" height="6" fill="#fff"/></g>`);
  }
  if(type==="patio"){
    let tiles = "";
    const r = rng(21);
    for(let row=0;row<5;row++){
      for(let c=0;c<7;c++){
        const v = r()*10|0;
        tiles += `<rect x="${c*60 - (row%2)*30}" y="${130+row*36}" width="58" height="34" fill="${dirty?`hsl(18 28% ${34+v}%)`:`hsl(${16+v/3} ${62+v}% ${52+v/2}%)`}" rx="2"/>`;
      }
    }
    body = `<rect y="40" width="400" height="100" fill="${dirty?'#b3ada1':'#f4eee2'}"/><rect y="130" width="400" height="8" fill="#6d5a45"/>
      ${tiles}
      <g><rect x="30" y="150" width="34" height="44" rx="5" fill="#b5532d"/><ellipse cx="47" cy="146" rx="30" ry="22" fill="#2f7a3a"/></g>
      <g><line x1="320" y1="70" x2="320" y2="200" stroke="#6d5a45" stroke-width="5"/><path d="M262 100a58 40 0 0 1 116 0Z" fill="${dirty?'#7d8a96':'#38b6ff'}"/></g>`
      + (dirty ? blotches(30,13,50,300) : "");
  }
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${sky}${body}</svg>`;
}

/* Inserta imagen real (si está en CONFIG) o ilustración de muestra */
function media(url, type, dirty, label){
  if(url){
    const alt = label || "";
    return `<img src="${url}" alt="${alt}" loading="lazy" decoding="async">`;
  }
  return scene(type, dirty);
}
document.querySelectorAll("[data-slot]").forEach(el => {
  const key = el.dataset.slot, url = CONFIG.images[key];
  const isHero = key === "hero";
  let html = url ? `<img src="${url}" alt="${el.dataset.label}" ${isHero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : scene(el.dataset.scene, false);
  el.insertAdjacentHTML("afterbegin", html);
  if(!url) el.setAttribute("role","img"), el.setAttribute("aria-label", el.dataset.label);
});

/* Sliders antes/después */
document.querySelectorAll("[data-ba]").forEach(el => {
  const cfg = CONFIG.images.ba[el.dataset.ba] || {};
  const t = el.dataset.scene, lbl = el.dataset.label;

  /* Modo "foto partida": una sola foto con la zona sucia y la limpia (ver CONFIG.images.ba) */
  if (cfg.split) {
    el.classList.add("split");
    el.dataset.dirty = cfg.dirty || "left";
    el.innerHTML =
      `<div class="layer"><img src="${cfg.split}" alt="${lbl}: zona sin limpiar y zona limpia" loading="lazy" decoding="async"></div>
       <span class="lab a">Antes</span><span class="lab d">Después</span>`;
    return;
  }

  el.innerHTML =
    `<div class="layer">${media(cfg.after, t, false, lbl + " después de la limpieza")}</div>
     <div class="layer before">${media(cfg.before, t, true, lbl + " antes de la limpieza")}</div>
     <span class="lab a">Antes</span><span class="lab d">Después</span>
     <input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después: ${lbl}">
     <div class="bar"><span class="knob"><svg><use href="#i-chev"/></svg></span></div>`;
  const input = el.querySelector("input");
  const set = v => el.style.setProperty("--pos", v + "%");
  input.addEventListener("input", () => set(input.value));
  /* Pequeña animación inicial de invitación (se omite con movimiento reducido) */
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    let done = false;
    new IntersectionObserver((es, ob) => { es.forEach(e => {
      if(e.isIntersecting && !done){ done = true; ob.disconnect();
        let t0 = null; const dur = 1400;
        const step = ts => { t0 = t0 || ts; const p = Math.min((ts - t0) / dur, 1);
          const v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); input.value = v; set(v);
          if(p < 1) requestAnimationFrame(step); else { input.value = 50; set(50); } };
        requestAnimationFrame(step);
      } }); }, { threshold: .6 }).observe(el);
  }
});

/* =====================================================================
   UX: header, animaciones al scroll, año
   ===================================================================== */
document.body.classList.remove("no-js");
const header = document.querySelector("header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 24);
onScroll(); addEventListener("scroll", onScroll, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

document.getElementById("yr").textContent = new Date().getFullYear();