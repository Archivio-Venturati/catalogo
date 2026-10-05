const DATA_FILE = "Archivio.csv";
const FUND_FILE = "Fondi.csv";
const HERO_IMAGE = "images/PCI/Crapabela/05.8.PISFES.jpg";

let FUND_INFO = {};

let RECORDS = [];
let FUNDS = [];
let AUTHORS = [];
let TAGS = [];

const el = (id) => document.getElementById(id);

function norm(s) { return (s ?? "").toString().trim(); }

function metaRow(label, value) {
  const v = norm(value);
  if (!v) return "";
  return `<div class="k">${escapeHtml(label)}</div><div class="v">${escapeHtml(v)}</div>`;
}

function escapeHtml(s) {
  return (s ?? "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(s) { return escapeHtml(s); }
function getThumbUrl(r) {
  const url = norm(r.immagine);
  if (!url) return "";

  if (url.includes("e_pixelate_faces")) {
    return "images/fotoprivacy.png";
  }

  return url;
}
function splitTags(s) {
  const t = norm(s);
  if (!t) return [];
  return t.split(",").map(x => x.trim()).filter(Boolean);
}

function prettyTag(s) {
  const t = norm(s);
  if (!t) return "";
  return t
    .replace(/[_-]+/g, " ")
    .replace(/([a-zà-ù])([A-Z])/g, "$1 $2")   // PoliticaComunismo -> Politica Comunismo
    .replace(/(\d)([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}
function getFaldone(r) {
  return norm(r.faldone) || "Senza faldone";
}
function getBusta(r) {
  return norm(r.busta) || "Senza busta";
}
function renderTags(tags) {
  const arr = Array.isArray(tags) ? tags : splitTags(tags);
  if (!arr.length) return "";
  return `
    <div class="tagwrap">
      ${arr.map(t => `<span class="tagpill">${escapeHtml(prettyTag(t))}</span>`).join("")}
    </div>
  `;
}

function splitAuthors(row) {
  const keys = Object.keys(row);
  const a = [];
  for (const k of keys) {
    if (/^autore/i.test(k)) {
      const v = norm(row[k]);
      if (v) a.push(v);
    }
  }
  if (a.length === 0) {
    for (const k of keys) {
      if (k.toLowerCase().includes("autore")) {
        const v = norm(row[k]);
        if (v) a.push(v);
      }
    }
  }
  return [...new Set(a)];
}

function setStatus(msg) {
  const s = el("status");
  if (s) s.textContent = msg;
}

function buildIndex() {
const recordFunds = RECORDS.map(r => r.fondo).filter(Boolean);
const infoFunds = Object.keys(FUND_INFO).filter(Boolean);

FUNDS = [...new Set([...recordFunds, ...infoFunds])]
  .sort((a, b) => a.localeCompare(b, "it"));

  const authorSet = new Set();
  const tagSet = new Set();
  for (const r of RECORDS) {
    for (const a of r.autori) authorSet.add(a);
    for (const t of r.tags) tagSet.add(t);
  }
  AUTHORS = [...authorSet].sort((a, b) => a.localeCompare(b, "it"));
  TAGS = [...tagSet].sort((a, b) => a.localeCompare(b, "it"));

  // Sidebar fondi
  const fundList = el("fundList");
  if (fundList) {
    fundList.innerHTML = FUNDS
      .map(f => `<a href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`)
      .join("");
  }

  // Filtri globali
  const aSel = el("authorFilter");
  const tSel = el("tagFilter");
  if (aSel) {
    aSel.innerHTML =
      `<option value="">(tutti)</option>` +
      AUTHORS.map(a => `<option value="${escapeAttr(a)}">${escapeHtml(a)}</option>`).join("");
  }
  if (tSel) {
    tSel.innerHTML =
      `<option value="">(tutti)</option>` +
      TAGS.map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join("");
  }
}

function currentFilters() {
  return {
    q: norm(el("q")?.value).toLowerCase(),
    author: norm(el("authorFilter")?.value),
    tag: norm(el("tagFilter")?.value),
  };
}
function getScopedRecords() {
  const route = parseRoute();
  const params = new URLSearchParams(location.hash.split("?")[1] || "");

if (route.name === "fondo") {
  let list = RECORDS.filter(r => r.fondo === route.fondo);

  const faldoneParam = params.get("faldone");
  if (faldoneParam) {
    list = list.filter(r => getFaldone(r) === faldoneParam);
  }

  const bustaParam = params.get("busta");
  if (bustaParam) {
    list = list.filter(r => getBusta(r) === bustaParam);
  }

  return list;
}

  return RECORDS;
}
function buildScopedFilters() {
  const list = getScopedRecords();

  const currentAuthor = norm(el("authorFilter")?.value);
  const currentTag = norm(el("tagFilter")?.value);

  const authorSet = new Set();
  const tagSet = new Set();

  for (const r of list) {
    for (const a of r.autori) authorSet.add(a);
    for (const t of r.tags) tagSet.add(t);
  }

  const authors = [...authorSet].sort((a, b) => a.localeCompare(b, "it"));
  const tags = [...tagSet].sort((a, b) => a.localeCompare(b, "it"));

  const aSel = el("authorFilter");
  const tSel = el("tagFilter");

  if (aSel) {
    aSel.innerHTML =
      `<option value="">(tutti)</option>` +
      authors.map(a => `<option value="${escapeAttr(a)}">${escapeHtml(a)}</option>`).join("");

    if (currentAuthor && authors.includes(currentAuthor)) {
      aSel.value = currentAuthor;
    } else {
      aSel.value = "";
    }
  }

  if (tSel) {
    tSel.innerHTML =
      `<option value="">(tutti)</option>` +
      tags.map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join("");

    if (currentTag && tags.includes(currentTag)) {
      tSel.value = currentTag;
    } else {
      tSel.value = "";
    }
  }
}
function isLibro(t) {
  const x = (t || "").toString().trim().toLowerCase();
  return x === "libro edito"
    || x === "libro autoprodotto"
    || x === "periodici"
    || x === "studi e documentazione di ricerca";
}

function isFoto(t) {
  const x = (t || "").toString().trim().toLowerCase();
  return x === "fotografia";
}
function applyFilters(list = getScopedRecords()) {
  const { q, author, tag } = currentFilters();
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const tipo = params.get("tipo");

  return list.filter(r => {
    if (tipo === "libro" && !isLibro(r.tipo)) return false;
    if (tipo === "foto" && !isFoto(r.tipo)) return false;
    if (tipo === "documento" && (isLibro(r.tipo) || isFoto(r.tipo))) return false;

    if (author && !r.autori.includes(author)) return false;
    if (tag && !r.tags.includes(tag)) return false;

    if (q) {
      const hay = [
  r.titolo,
  r.codice,
  r.codiceBibliografico,
  r.tipo,
  r.anno,
  r.luogo,
  r.editore,
  r.fondo,
  r.faldone,
  r.busta,
  ...r.autori,
  ...r.tags
].join(" ").toLowerCase();

      if (!hay.includes(q)) return false;
    }

    return true;
  });
}

function getSortState() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  return {
    key: params.get("sort") || "codice",
    dir: params.get("dir") || "asc"
  };
}

function setSort(key) {
  const hash = location.hash || "#/";
  const [pathPart, queryString = ""] = hash.split("?");
  const params = new URLSearchParams(queryString);

  const currentKey = params.get("sort") || "codice";
  const currentDir = params.get("dir") || "asc";

  let nextDir = "asc";
  if (currentKey === key) {
    nextDir = currentDir === "asc" ? "desc" : "asc";
  }

  params.set("sort", key);
  params.set("dir", nextDir);

  location.hash = `${pathPart}?${params.toString()}`;
}

function compareValues(av, bv, dir = "asc") {
  const a = (av ?? "").toString().trim();
  const b = (bv ?? "").toString().trim();
  const factor = dir === "desc" ? -1 : 1;
  return a.localeCompare(b, "it", { numeric: true, sensitivity: "base" }) * factor;
}

function sortRecords(list) {
  const { key, dir } = getSortState();
  const arr = list.slice();

  arr.sort((a, b) => {
    if (key === "titolo") {
      return compareValues(a.titolo, b.titolo, dir);
    }

    if (key === "autore") {
      return compareValues(
        (a.autori && a.autori[0]) || "",
        (b.autori && b.autori[0]) || "",
        dir
      );
    }

    if (key === "anno") {
      return compareValues(a.anno, b.anno, dir);
    }

    if (key === "fondo") {
      return compareValues(a.fondo, b.fondo, dir);
    }

    return compareValues(a.codice, b.codice, dir);
  });

  return arr;
}

function sortArrow(key) {
  const state = getSortState();
  if (state.key !== key) return "";
  return state.dir === "asc" ? " ↑" : " ↓";
}

function sortButton(label, key) {
  const state = getSortState();
  const active = state.key === key;

  return `
    <button
      type="button"
      class="sort-btn${active ? " is-active" : ""}"
      data-sort-key="${escapeAttr(key)}"
      aria-label="Ordina per ${escapeAttr(label)}"
    >
      ${escapeHtml(label)}${sortArrow(key)}
    </button>
  `;
}
/* HOME: mostra fondi + (se filtri/ricerca attivi) risultati globali */
/* HOME: vetrina (niente tabelloni). La ricerca resta nella sidebar e porta ai fondi/libri. */
function renderHome() {
  setStatus("");
  const view = el("view");

  const total = RECORDS.length;
    // === Patrimoni (regole richieste) ===
  const totalAll = RECORDS.length;

  const libriCount = RECORDS.filter(r => isLibro(r.tipo)).length;
  const fotoCount  = RECORDS.filter(r => isFoto(r.tipo)).length;
  const docCount   = totalAll - libriCount - fotoCount; // tutto il resto
const ringHtml = (label, count, total, desc, link) => {
  const p = total > 0 ? (count / total) : 0;
  const safeP = Math.max(0, Math.min(1, p));

  return `
    <a href="${link}" class="ring-card" style="text-decoration:none; color:inherit">
      <div class="ring" data-p="${safeP}" style="--p:0">
        <div class="ring-circle" aria-label="${escapeAttr(label)} ${count} su ${total}"></div>
        <div class="ring-meta">
          <div class="k">${escapeHtml(label)}</div>
          <div class="v">${count}/${total}</div>
          <div class="p">${escapeHtml(desc)}</div>
        </div>
      </div>
    </a>
  `;
};
  const fondiCount = FUNDS.length;

  const heroImg = HERO_IMAGE;

  view.innerHTML = `
    <div class="hero-photo">
      ${heroImg ? `<img src="${escapeAttr(heroImg)}" alt="" onerror="this.remove()">` : ``}

      <div class="hero-caption">
        <h1>Archivio Storico-Politico<br/>Carlo Venturati</h1>
        <p>Libri, documenti, fotografie e manifesti per ricostruire la memoria politica e culturale di Caravaggio e della Bassa bergamasca</p>
        <a class="hero-cta" href="#/archivio">Entra nell’Archivio →</a>
      </div>
    </div>

    <div class="home-inner">
      <div class="home-stats grid-3">
        <a class="stat clickable" href="#/archivio?all=1" style="display:block; color:inherit; text-decoration:none">
  <div class="k">Record</div>
  <div class="v">${total}</div>
  <div class="p">su diverse migliaia ancora di cui ultimare la catalogazione, costituiti da libri, documenti, fotografie, manifesti, bandiere e oggetti. I materiali catalogati sono consultabili online o in sede</div>
</a>

        <a class="stat clickable" href="#/archivio" style="display:block; color:inherit; text-decoration:none">
          <div class="k">Fondi</div>
          <div class="v">${fondiCount}</div>
          <div class="p"> navigabili. L'archiviazione è completa per 6 di questi fondi</div>
        </a>

        <a class="stat clickable" href="casadelpopolo.html" style="display:block; color:inherit; text-decoration:none">
          <div class="k">La nostra storia</div>
          <div class="v">50 anni di Casa del Popolo</div>
          <div class="p">Dalla casa del PCI alla rigenerazione di una comunità</div>
        </a>
      </div>
    <div class="ring-panel">
  <div class="rings">
${ringHtml("Patrimonio librario", libriCount, totalAll, "", "#/archivio?tipo=libro&all=1")}
${ringHtml("Patrimonio documentale", docCount, totalAll, "", "#/archivio?tipo=documento&all=1")}
${ringHtml("Patrimonio fotografico", fotoCount, totalAll, "", "#/archivio?tipo=foto&all=1")}
  </div>
</div>
      <div class="accordion" style="margin-top:14px">
        <details open>
          <summary>Il progetto</summary>
          <div class="acc-body">
            Questo sito raccoglie i volumi, i documenti, le fotografie e i manifesti dell’Archivio Storico-Politico “Carlo Venturati”.
            La finalità è recuperare e conservare materiali (libri, documenti, foto, manifesti) utili a mantenere viva la memoria storica e culturale
            della sinistra a Caravaggio e nella Bassa bergamasca
          </div>
        </details>

        <details>
          <summary>Cos’è l’Archivio</summary>
          <div class="acc-body">
            L'Archivio inizia a comporsi nel 2023 su impulso di Amici della Festa de L'Unità di Caravaggio, Partito Democratico - Circolo di Caravaggio e Circolo Arci di Caravaggio a seguito della donazione del fondo Venturati, da cui prende il nome.
            Principalmente, raccoglie fondi provenienti da militanti, associazioni culturali, forze politiche e personalità politiche.
            Se hai un fondo affine ai nostri e vuoi renderlo pubblicamente consultabile, scrivici!
          </div>
        </details>

        <details>
          <summary>Consultazione e utilizzo</summary>
          <div class="acc-body">
            La consultazione dei materiali è possibile online per le immagini catalogate e in sede per il fondo librario e documentale non scannerizzato. Si consiglia l'appuntamento. Le immagini e i documenti accessibili direttamente dal presente sito possono essere utilizzati per fini di ricerca, didattici e culturali, a condizione che vengano sempre citati i metadati e la fonte, ovvero Archivio Storico-Politico "Carlo Venturati" - Caravaggio (BG).<br>
            Contatti: <a href="mailto:pdcaravaggio@gmail.com">pdcaravaggio@gmail.com</a> ·
            <a href="mailto:circoloarcicaravaggio@gmail.com">circoloarcicaravaggio@gmail.com</a>
          </div>
        </details>

        <details>
          <summary>Disclaimer</summary>
          <div class="acc-body">
            L'Archivio raccoglie anche materiale fotografico rinvenuto alla Casa del Popolo o donato da privati afferenti a realtà politiche.
            Si tratta di immagini di momenti di vita politica. Abbiamo deciso di caricare le immagini che raffigurano momenti di vita politica
            <i>collettiva</i> senza oscurare le persone che ne avessero avuto ruolo organizzativo. Diverse immagini, però, hanno i volti oscurati per proteggere la privacy di chi per un momento della
            sua vita ha fatto parte della storia della Casa del Popolo, ma ora ha preso strade differenti. Se qualcuno volesse consultare per fini di ricerca o personali, non esiti a contattarci.
            Allo stesso modo, se qualcuno volesse oscurare una fotografia che lo ritrae, non esiti a contattarci.
            Immagini e documenti sono pubblicati ai soli fini di documentazione storica e culturale
          </div>
        </details>
      </div>
    </div>
  `;

startRingAnimations(view);

  const c = el("count");
  if (c) c.textContent = "";
}

// ==========================
// HOME — animazione rings (cruscotti)
// ==========================
function startRingAnimations(root = document) {
  const rings = Array.from((root || document).querySelectorAll?.('.ring') || []);
  if (!rings.length) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const animateOne = (ring) => {
    if (!ring || ring.dataset.animated === '1') return;
    const target = Math.max(0, Math.min(1, parseFloat(ring.dataset.p || '0')));
    ring.dataset.animated = '1';

    // Se l'utente preferisce ridurre le animazioni, setta subito.
    if (prefersReduced || !Number.isFinite(target)) {
      ring.style.setProperty('--p', String(target));
      return;
    }

    const duration = 1500; // ms
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = target * easeOutCubic(t);
      ring.style.setProperty('--p', v.toFixed(4));
      if (t < 1) requestAnimationFrame(tick);
      else ring.style.setProperty('--p', String(target));
    };

    // Parte sempre da 0
    ring.style.setProperty('--p', '0');
    requestAnimationFrame(tick);
  };

  // Se supportato: anima solo quando il ring entra davvero in vista
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            animateOne(e.target);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.35 }
    );
    rings.forEach((r) => obs.observe(r));
  } else {
    // Fallback (browser vecchi)
    rings.forEach(animateOne);
  }
}




function renderFund(fondo) {
  const view = el("view");
  const key = (fondo || "").trim();

  const inFund = RECORDS.filter(r => r.fondo === key);
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
const faldoneParam = params.get("faldone");
const bustaParam = params.get("busta");
const showAll = params.get("all");

let filtered = applyFilters(inFund);

if (faldoneParam) {
  filtered = filtered.filter(r => getFaldone(r) === faldoneParam);
}

if (bustaParam) {
  filtered = filtered.filter(r => getBusta(r) === bustaParam);
}

filtered = sortRecords(filtered);

const info = FUND_INFO[key];

const isBustaView = !!bustaParam || !!showAll;
const isFaldoneView = !!faldoneParam || !!showAll;
const pageTitle = bustaParam
  ? `${key} - ${faldoneParam} - ${bustaParam}`
  : faldoneParam
    ? `${key} - ${faldoneParam}`
    : showAll
      ? `${key} - tutti i record`
      : key;
// raggruppa per faldoni (SEMPRЕ fuori dal template)
// Raggruppa per faldoni quando siamo nel fondo
const groups = {};
for (const r of filtered) {
  const f = getFaldone(r);
  if (!groups[f]) groups[f] = [];
  groups[f].push(r);
}

// Raggruppa per buste quando siamo dentro un faldone
const bustaGroups = {};
if (faldoneParam) {
  for (const r of filtered) {
    const b = getBusta(r);
    if (!bustaGroups[b]) bustaGroups[b] = [];
    bustaGroups[b].push(r);
  }
}

// HTML BASE (SEMPRE PRIMA)
view.innerHTML = `
  <div class="card">
    <h1>${escapeHtml(pageTitle)}</h1>

    ${
      info
        ? `
          <div class="hint">${escapeHtml(info.subtitle || "")}</div>
          ${info.image ? `<img class="fund-photo" src="${escapeAttr(info.image)}" alt="" onerror="this.style.display='none'">` : ``}

          ${(() => {
            const full = (info.text || "").toString().trim();
            return full ? `
              <details class="fund-details">
                <summary>Storia e descrizione</summary>
                <div class="fund-text">
 ${full.replaceAll("\n", "<br>")}
</div>
              </details>
            ` : ``;
          })()}
        `
        : `<div class="hint">Descrizione del fondo non ancora inserita.</div>`
    }

    <div class="hint" style="margin-top:12px">
      Clicca un titolo per aprire la scheda. Usa filtri e ricerca a sinistra.
    </div>
  </div>
`;

// 👉 Fondo → mostra faldoni
if (!faldoneParam && !showAll) {
  view.innerHTML += `
    <div style="margin-top:14px">

      <div class="faldoni-grid">
        ${Object.entries(groups).map(([name, list]) => `
          <a class="faldone-card" href="#/fondo/${encodeURIComponent(key)}?faldone=${encodeURIComponent(name)}">
            <div class="name">${escapeHtml(name)}</div>
            <div class="desc">${list.length} record</div>
          </a>
        `).join("")}
      </div>

      <div style="margin-top:24px">
        <a class="btn" href="#/fondo/${encodeURIComponent(key)}?all=1">
          Mostra tutti i record
        </a>
      </div>

    </div>
  `;
}

// 👉 Fondo → Faldone → mostra buste
if (faldoneParam && !bustaParam && !showAll) {
  view.innerHTML += `
    <div style="margin-top:14px">

      <div style="margin-bottom:12px">
        <a class="btn" href="#/fondo/${encodeURIComponent(key)}">
          ← Torna al fondo
        </a>
      </div>

      <div class="faldoni-grid">
        ${Object.entries(bustaGroups).map(([name, list]) => `
          <a class="faldone-card" href="#/fondo/${encodeURIComponent(key)}?faldone=${encodeURIComponent(faldoneParam)}&busta=${encodeURIComponent(name)}">
            <div class="name">${escapeHtml(name)}</div>
            <div class="desc">${list.length} record</div>
          </a>
        `).join("")}
      </div>

      <div style="margin-top:24px">
        <a class="btn" href="#/fondo/${encodeURIComponent(key)}?faldone=${encodeURIComponent(faldoneParam)}&all=1">
          Mostra tutti i record del faldone
        </a>
      </div>

    </div>
  `;
}

// 👉 Se siamo dentro una busta, oppure abbiamo chiesto tutti i record → mostra tabella
if (bustaParam || showAll) {
  view.innerHTML += `
  <div style="margin-top:12px">
   <a class="btn" href="${
  bustaParam
    ? `#/fondo/${encodeURIComponent(key)}?faldone=${encodeURIComponent(faldoneParam)}`
    : `#/fondo/${encodeURIComponent(key)}`
}">
  ← ${
    bustaParam
      ? "Torna al faldone"
      : "Torna al fondo"
  }
</a>
  </div>
`;
  view.innerHTML += `
    <table class="grid" style="margin-top:12px">
     <thead>
  <tr>
    <th>${sortButton("Titolo", "titolo")}</th>
    <th>${sortButton("Autore", "autore")}</th>
    <th>${sortButton("Anno", "anno")}</th>
    <th>${sortButton("Codice", "codice")}</th>
    <th>Foto</th>
  </tr>
</thead>
      <tbody>
  ${filtered.map(r => `
    <tr>
      <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
      <td>${escapeHtml(r.autori.join("; "))}</td>
      <td>${escapeHtml(r.anno)}</td>
      <td>${escapeHtml(r.codice)}</td>
      <td>${r.immagine ? `<img class="thumb" src="${getThumbUrl(r)}">` : ""}</td>
    </tr>
  `).join("")}
</tbody>
    </table>
  `;
}


  const c = el("count");
  if (c) c.textContent = `${inFund.length} nel fondo “${key}”`;
}



function renderBook(id) {
  const r = RECORDS.find(x => x.id === id);
  const view = el("view");

  if (!r) {
    setStatus("Record non trovato.");
    view.innerHTML = `
      <div class="card">
        <h1>Non trovato</h1>
        <p>Il record richiesto non esiste (o il codice è cambiato)</p>
      </div>`;
    return;
  }

  // Tags robusti (possono essere: array, stringa, vuoti, undefined)
  const rawTags = r.tags ?? r.tag ?? [];
  const tags = Array.isArray(rawTags)
    ? rawTags.filter(Boolean)
    : (rawTags ? [rawTags] : []);

  // Copertina opzionale: SOLO se hai codice
  const coverPath = r.codice ? `images/libri/${encodeURIComponent(r.codice)}.jpg` : "";

  // Meta: tieni SOLO quelli sensati e non vuoti
  const metaHtml = `
    <div class="kv">
     ${metaRow("Codice", r.codice)}
${metaRow("Codice bibliografico", r.codiceBibliografico)}
${metaRow("Tipo", r.tipo)}
      ${metaRow("Volume", r.volume)}
      ${metaRow("Autore/i", r.autori?.length ? r.autori.join("; ") : "")}
      ${metaRow("Anno", r.anno)}
      ${metaRow("Luogo", r.luogo)}
      ${metaRow("Collocazione", r.collocazione)}
      ${metaRow("Disclaimer", r.disclaimer)}
      ${metaRow("Editore", r.editore)}
    </div>
  `.trim();

  setStatus("");

  view.innerHTML = `
    <div class="book">

      <header class="book-head">
        <h1>${escapeHtml(r.titolo || "Senza titolo")}</h1>

        <div class="book-sub">
          ${r.fondo ? `Fondo: <a href="#/fondo/${encodeURIComponent(r.fondo)}">${escapeHtml(r.fondo)}</a>` : ""}
          ${r.codice ? ` · Codice: <span class="mono">${escapeHtml(r.codice)}</span>` : ""}
       ${r.codiceBibliografico ? ` · Codice bibliografico: <span class="mono">${escapeHtml(r.codiceBibliografico)}</span>` : ""}
        </div>

      </header>

      ${(r.immagine || coverPath) ? `
        <section class="book-media">
          ${r.immagine ? `
            <img class="book-img"
                 src="${escapeAttr(r.immagine)}"
                 alt=""
                 loading="lazy"
                 onerror="this.remove()">
          ` : ``}

          ${coverPath ? `
            <img class="book-img"
                 src="${escapeAttr(coverPath)}"
                 alt=""
                 loading="lazy"
                 onerror="this.remove()">
          ` : ``}
        </section>
      ` : ``}

      <section class="book-meta">
        ${metaHtml}
      </section>

      ${r.pdf ? `
        <section class="book-actions">
          <a class="btn btn-inline"
             href="${escapeAttr(r.pdf)}"
             target="_blank"
             rel="noopener">
            Apri PDF
          </a>
        </section>
      ` : ``}

      <footer class="book-footer">
        <a href="#/fondo/${encodeURIComponent(r.fondo || "")}">← Torna al fondo</a>
      </footer>

    </div>
  `;

  const c = el("count");
  if (c) c.textContent = "";
}

function parseRoute() {
  const h = location.hash || "#/";
  const [pathPart] = h.replace(/^#\//, "").split("?");
  const parts = pathPart.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "fondo") return { name: "fondo", fondo: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "libro") return { name: "libro", id: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "archivio") return { name: "archivio" };
  return { name: "home" };
}

function render() {
  const route = parseRoute();
  buildScopedFilters();

  // HOME: layout senza sidebar
  document.body.classList.toggle("is-home", route.name === "home");

  if (route.name === "home") return renderHome();
  if (route.name === "archivio") return renderArchivio();
  if (route.name === "fondo") return renderFund(route.fondo);
  if (route.name === "libro") return renderBook(route.id);
  return renderHome();
}


function wireEvents() {
 window.addEventListener("hashchange", () => {
  render();

  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  });
});

  const goArchivio = () => {
    const h = location.hash || "#/";
    if (h === "#/" || h === "") location.hash = "#/archivio";
  };

  // Sidebar search
  el("q")?.addEventListener("input", () => { render(); });
  el("authorFilter")?.addEventListener("change", render);
  el("tagFilter")?.addEventListener("change", render);

  // TOPBAR search (nuovo)
  el("topQ")?.addEventListener("input", () => {
    // copia valore nella search sidebar, poi vai su Archivio
    if (el("q")) el("q").value = el("topQ").value;
    goArchivio();
    render();
  });

  // se l'utente scrive nella sidebar, aggiorna anche top
  el("q")?.addEventListener("input", () => {
    if (el("topQ")) el("topQ").value = el("q").value;
    render();
  });
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-sort-key]");
  if (!btn) return;
  setSort(btn.dataset.sortKey);
});
  el("clearFilters")?.addEventListener("click", () => {
    if (el("q")) el("q").value = "";
    if (el("topQ")) el("topQ").value = "";
    if (el("authorFilter")) el("authorFilter").value = "";
    if (el("tagFilter")) el("tagFilter").value = "";
    render();
  });
}


async function loadData() {
  setStatus("Caricamento dati…");

  const res = await fetch(DATA_FILE, { cache: "no-store" });
  if (!res.ok) {
    setStatus(`Errore: non trovo ${DATA_FILE}. Deve stare nella root del repo insieme a index.html.`);
    return;
  }

  const csvText = await res.text();
const fundRes = await fetch(FUND_FILE, { cache: "no-store" });

if (!fundRes.ok) {
  setStatus(`Errore: non trovo ${FUND_FILE}.`);
  return;
}

const fundCsv = await fundRes.text();

const parsedFunds = Papa.parse(fundCsv, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: false,
});
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors?.length) console.warn(parsed.errors);

  const rows = parsed.data;

  RECORDS = rows.map(row => {
    const titolo  = norm(row.titolo ?? row.Titolo ?? row["Titolo"]);
    const immagine = norm(row.immagine ?? row.Immagine ?? row.foto ?? row.Foto ?? row.Media ?? row.media ?? "")
   const codice  = norm(row.codice ?? row.Codice ?? row["Codice"]);
  const codiceBibliografico = norm(
  row["Codice bibliografico"] ??
  row.codiceBibliografico ??
  row["codice bibliografico"] ??
  row.codice_bibliografico ??
  ""
);
const tipo    = norm(row.tipo ?? row.Tipo ?? row["Tipo"]);
    const volume  = norm(row.volume ?? row.Volume ?? row["Volume"]);

    const anno = norm(
      row.anno ?? row.Anno ?? row["Anno"] ??
      row["Anno di pubblicazione"] ?? row["Anno di pubblica"] ?? row["Anno di pubblicazione "]
    );

    const luogo   = norm(row.luogo ?? row.Luogo ?? row["Luogo"]);
    const editore = norm(row.editore ?? row.Editore ?? row["Editore"]);
const collocazione = norm(row.collocazione ?? row.Collocazione ?? row["Collocazione"]);
const faldone = norm(row.faldone ?? row.Faldone ?? row["Faldone"]);
const busta = norm(row.busta ?? row.Busta ?? row["Busta"]);
const disclaimer = norm(row.disclaimer ?? row.Disclaimer ?? row["Disclaimer"]);
    const fondo = norm(row.fondo ?? row.Fondo ?? row["Fondo"] ?? row["Fondo (from Fondo)"]);

    const tagRaw = row.tag ?? row.tags ?? row.Tags ?? row["Tags"] ?? "";
    const tags = splitTags(tagRaw);

    const autori = splitAuthors(row);

    // PDF: colonna "PDF" nel CSV (oppure "pdf")
    const pdf = norm(row.PDF ?? row.pdf ?? row["PDF"] ?? row["pdf"] ?? "");

    const id = codice || ("row-" + Math.random().toString(36).slice(2));

    return {
  id,
  titolo,
  codice,
  codiceBibliografico,
  tipo,
  volume,
  autori,
  anno,
  luogo,
  editore,
  tags,
  fondo,
  pdf,
  immagine,
  collocazione,
  faldone,
  busta,
  disclaimer
};
  }).filter(r => r.titolo || r.codice);
FUND_INFO = {};

parsedFunds.data.forEach(row => {
  const fondo = norm(row.fondo);

  FUND_INFO[fondo] = {
    subtitle: norm(row.subtitle),
    image: norm(row.image),
    text: norm(row.text)
  };
});
  buildIndex();
  wireEvents();
  render();
  setStatus("");
}

loadData();
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("topnav");
  if (!btn || !nav) return;

  function closeMenu() {
    document.body.classList.remove("nav-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = document.body.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // chiudi cliccando fuori
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    closeMenu();
  });

  // chiudi quando clicchi un link
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // chiudi quando cambi pagina (hash)
  window.addEventListener("hashchange", closeMenu);
});
function renderArchivio() {
  setStatus("");
  const view = el("view");

  // HERO: scegli una foto
  const heroImg = HERO_IMAGE;

  // query/filtri
  const q = (el("q")?.value || "").trim();
  const a = (el("authorFilter")?.value || "").trim();
  const t = (el("tagFilter")?.value || "").trim();
  const forceAll = location.hash.includes("?all=1");
const params = new URLSearchParams(location.hash.split("?")[1] || "");
const tipo = params.get("tipo");
const hasQuery = forceAll || !!(q || a || t || tipo);

 const filtered = sortRecords(applyFilters(RECORDS));

  // conteggio per fondo
  const counts = new Map();
  for (const r of RECORDS) {
    const f = r.fondo || "";
    if (!f) continue;
    counts.set(f, (counts.get(f) || 0) + 1);
  }

 function fundTeaser(name) {
  const info = FUND_INFO?.[name];
  const raw = (info?.text || "").toString().trim();

  if (!raw) return "Descrizione in preparazione.";

  const clean = raw
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return clean.length > 140 ? clean.slice(0, 140).trim() + "…" : clean;
}

  const hero = `
    <div class="archive-hero">
      ${heroImg ? `<img src="${escapeAttr(heroImg)}" alt="" onerror="this.remove()">` : ``}
      <div class="cap">
        <h1>Archivio Storico-Politico Carlo Venturati</h1>
        <p>Libri, documenti, fotografie e manifesti per ricostruire la memoria politica e culturale di Caravaggio e della Bassa Bergamasca</p>
      </div>
    </div>
  `;

   const fundsGrid = `
    <div class="results-head">
      <div class="title">Fondi</div>
      <div class="meta">${FUNDS.length} fondi</div>
    </div>

    <div class="fund-grid">
      ${FUNDS.map(f => {
        const c = counts.get(f) || 0;
        return `
          <a class="fund-card" href="#/fondo/${encodeURIComponent(f)}">
            <div class="name">${escapeHtml(f)}</div>
            <div class="desc">${escapeHtml(fundTeaser(f))}</div>
            <div style="display:flex; justify-content:space-between; gap:10px; margin-top:auto">
              <span class="pill">${c} record</span>
              <span class="pill">Apri →</span>
            </div>
          </a>
        `;
      }).join("")}
    </div>
  `;


    const resultsTable = `
  <div class="results-head">
    <div class="title">Risultati</div>
    <div class="meta">${filtered.length} record</div>
  </div>

  ${filtered.length === 0 ? `
    <div class="empty">Nessun risultato. Cambia termini o filtri.</div>
  ` : `
    <table class="grid">
      <thead>
  <tr>
    <th>${sortButton("Titolo", "titolo")}</th>
    <th>${sortButton("Autore", "autore")}</th>
    <th>${sortButton("Anno", "anno")}</th>
    <th>${sortButton("Fondo", "fondo")}</th>
    <th>${sortButton("Codice", "codice")}</th>
    <th>Foto</th>
  </tr>
</thead>
      <tbody>
  ${filtered.slice(0, 250).map(r => `
    <tr>
      <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
      <td>${escapeHtml((r.autori || []).join("; "))}</td>
      <td>${escapeHtml(r.anno || "")}</td>
      <td><a href="#/fondo/${encodeURIComponent(r.fondo)}">${escapeHtml(r.fondo || "")}</a></td>
      <td>${escapeHtml(r.codice || "")}</td>
      <td>${r.immagine ? `<img class="thumb" src="${getThumbUrl(r)}">` : ""}</td>
    </tr>
  `).join("")}
</tbody>
    </table>
    ${filtered.length > 250 ? `<div class="hint" style="margin-top:10px">Mostro solo i primi 250 risultati. Raffina la ricerca.</div>` : ``}
  `}
`;

  // ARCHIVIO = hero + (risultati se cerchi, altrimenti fondi)
  view.innerHTML = hero + (hasQuery ? resultsTable : fundsGrid);

  // via conteggio a caso in basso
  const c = el("count");
  if (c) c.textContent = "";
}
(function(){
  function initStoryStrip(strip){
    const track = strip.querySelector('.story-track');
    const slides = Array.from(strip.querySelectorAll('.story-slide'));
    const dotsWrap = strip.querySelector('.story-dots');
    const prev = strip.querySelector('[data-story-prev]');
    const next = strip.querySelector('[data-story-next]');
    let dots = [];
    let index = 0;
    let wheelLock = false;

    if (!track || !slides.length) return;

    if (dotsWrap){
      dotsWrap.innerHTML = slides.map(() => `<button type="button" class="story-dot" aria-label="Vai alla slide"></button>`).join('');
      dots = Array.from(dotsWrap.querySelectorAll('.story-dot'));

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => updateActive(i));
      });
    }

    function updateActive(i, behavior = 'smooth'){
      index = Math.max(0, Math.min(i, slides.length - 1));

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      const offset = slides[index].offsetLeft;
      track.scrollTo({ left: offset, behavior });
    }

    prev?.addEventListener('click', () => updateActive(index - 1));
    next?.addEventListener('click', () => updateActive(index + 1));

    track.addEventListener('scroll', () => {
      if (window.innerWidth <= 980) {
        const current = Math.round(track.scrollLeft / slides[0].offsetWidth);

        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle('is-active', dotIndex === current);
        });

        index = current;
      }
    });

    strip.addEventListener('wheel', (event) => {
      if (window.innerWidth <= 980) return;
      if (Math.abs(event.deltaY) < 10 || wheelLock) return;

      event.preventDefault();
      wheelLock = true;

      if (event.deltaY > 0) {
        updateActive(index + 1);
      } else {
        updateActive(index - 1);
      }

      setTimeout(() => {
        wheelLock = false;
      }, 420);
    }, { passive: false });

    window.addEventListener('resize', () => updateActive(index, 'auto'));

    updateActive(0, 'auto');
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-story-strip]').forEach(initStoryStrip);
  });
})();
