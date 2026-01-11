// Archivio statico: carica archivio.csv dal repo e costruisce:
// - Home con lista fondi
// - Pagine per fondo con filtri autore/tag + ricerca
// - Scheda libro cliccabile
//
// CSV consigliato (intestazioni):
// Titolo, Codice, Tipo, Volume, Autore1, Autore2, Autore3, Anno (o "Anno di pubblicazione"), Luogo, Editore, Tags, Fondo

const DATA_FILE = "archivio.csv";

// Descrizioni dei fondi (chiavi = valore esatto della colonna "Fondo" nel CSV, senza spazi finali)
// Qui NON metti HTML nel testo: metti solo testo + (opzionale) percorso immagine.
const FUND_INFO = {
  "Venturati": {
    subtitle: "Fondo Venturati",
    image: "images/carlo_venturati.jpg",
    text: `Carlo Venturati nacque a Caravaggio il 21/7/1921.
Nel 1940, iscritto al primo anno della facoltà di chimica, venne chiamato sotto le armi. Fatto prigioniero in Albania, a Durazzo, il 10/9/1943, deportato in Austria, Polonia e Germania, il 7/4/1945 a Stahle venne liberato dalla 9A armata americana. Solo il 13/9/1945 fece ritorno a Caravaggio con negli occhi e nella mente gli orrori della guerra, della prigionia, della deportazione e subito si iscrisse al Partito Socialista Italiano.
Cambiò anche corso di studi e già nel marzo del 1948 si laureò in giurisprudenza presso l’Università degli Studi di Milano per poi intraprendere la professione di avvocato.
Per circa trent’anni, dal 1952, fu consigliere comunale prima a Caravaggio e poi a Treviglio, dove era andato a risiedere con la famiglia, e occupò posti chiave nel PSI: consigliere provinciale, segretario della Sezione di Treviglio, segretario della Federazione di Bergamo, membro dei probi viri del partito.
Morì in Spagna, improvvisamente, l’11 maggio 1984, durante una breve vacanza.

Il fondo è stato donato dalla Famiglia di Carlo Venuturati. Il fondo è il più consistente posseduto dall'Archivio che, difatti, è intitolato a Venturati. È costituito per la maggior parte di opere edite di stampo politico e filosofico-politico, soprattutto sul tema del socialismo italiano.`
  },

  "Gallavresi": {
    subtitle: "Fondo Gallavresi",
    text: `Il fondo Gallavresi è stato di proprietà della Cooperativa dei Lavoratori di Caravaggio e del Circolo "Gallavresi" di Caravaggio del Partito Socialista Italiano.`
  },
  "Stella": {
    subtitle: "Fondo Stella",
    text: `Si tratta del fondo iniziale della Casa del Popolo, lascito delle diverse organizzazioni politiche che l'hanno animata.`
  },
  "Castelli": { subtitle: "Fondo Castelli", text: `Scrivi qui la descrizione.` },
  "Stuani":   { subtitle: "Fondo Stuani",   text: `Scrivi qui la descrizione.` },
  "Rossoni":  { subtitle: "Fondo Rossoni",  text: `Scrivi qui la descrizione.` },
};

let RECORDS = [];
let FUNDS = [];
let AUTHORS = [];
let TAGS = [];

const el = (id) => document.getElementById(id);

function norm(s) {
  return (s ?? "").toString().trim();
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

function splitTags(s) {
  const t = norm(s);
  if (!t) return [];
  return t.split(",").map(x => x.trim()).filter(Boolean);
}

function splitAuthors(row) {
  // prende tutte le colonne che iniziano con "Autore" (case-insensitive)
  const keys = Object.keys(row);
  const a = [];
  for (const k of keys) {
    if (/^autore/i.test(k)) {
      const v = norm(row[k]);
      if (v) a.push(v);
    }
  }
  // fallback: qualsiasi colonna che contiene "autore"
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
  FUNDS = [...new Set(RECORDS.map(r => r.fondo).filter(Boolean))]
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

  // Filtri
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

function applyFilters(list) {
  const { q, author, tag } = currentFilters();
  return list.filter(r => {
    if (author && !r.autori.includes(author)) return false;
    if (tag && !r.tags.includes(tag)) return false;
    if (q) {
      const hay = [
        r.titolo, r.codice, r.tipo, r.anno, r.luogo, r.editore, r.fondo,
        ...r.autori, ...r.tags
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderHome() {
  setStatus("");
  const view = el("view");
  view.innerHTML = `
    <div class="card">
      <h1>Fondi</h1>
      <p class="hint">Seleziona un fondo per sfogliare i libri. Puoi anche usare la ricerca a sinistra.</p>
      <div class="badges" style="margin-top:10px">
        ${FUNDS.map(f => `<a class="badge" href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`).join("")}
      </div>
    </div>
  `;
  const c = el("count");
  if (c) c.textContent = `${RECORDS.length} record totali`;
}

function renderFondiInfo() {
  setStatus("");
  const view = el("view");
  view.innerHTML = `
    <div class="card">
      <h1>Cosa sono i fondi</h1>
      <p>Qui puoi spiegare cosa intendi per “fondo”, da dove arrivano i materiali, e le convenzioni usate (codici, tag, criteri).</p>
      <p>Modifica questo testo in <code>renderFondiInfo()</code> dentro <code>app.js</code>.</p>
    </div>
  `;
  const c = el("count");
  if (c) c.textContent = "";
}

function renderFund(fondo) {
  const view = el("view");
  const key = (fondo || "").trim();

  const inFund = RECORDS.filter(r => r.fondo === key);
  const filtered = applyFilters(inFund);

  const info = FUND_INFO[key];

  setStatus(`Fondo: ${key} — ${filtered.length}/${inFund.length} record`);

  view.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(key)}</h1>

      ${
        info
          ? `
            <div class="hint">${escapeHtml(info.subtitle || "")}</div>
            ${info.image ? `<img src="${escapeAttr(info.image)}" style="max-width:300px; margin:10px 0" onerror="this.style.display='none'">` : ``}
            <div style="margin-top:10px; white-space:pre-wrap">${escapeHtml(info.text || "")}</div>
          `
          : `<div class="hint">Descrizione del fondo non ancora inserita.</div>`
      }

      <div class="hint" style="margin-top:12px">
        Clicca un titolo per aprire la scheda. Usa filtri e ricerca a sinistra.
      </div>

      <table class="grid" style="margin-top:12px">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Anno</th>
            <th>Tag</th>
            <th>Codice</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
              <td>${escapeHtml(r.autori.join("; "))}</td>
              <td>${escapeHtml(r.anno)}</td>
              <td><div class="badges">${r.tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}</div></td>
              <td>${escapeHtml(r.codice)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  const c = el("count");
  if (c) c.textContent = `${inFund.length} nel fondo “${key}”`;
}

function renderBook(id) {
  const r = RECORDS.find(x => x.id === id);
  const view = el("view");
  if (!r) {
    setStatus("Record non trovato.");
    view.innerHTML = `<div class="card"><h1>Non trovato</h1><p>Il record richiesto non esiste (o il codice è cambiato).</p></div>`;
    return;
  }

  const coverPath = r.codice ? `images/libri/${r.codice}.jpg` : "";

  setStatus("");
  view.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(r.titolo)}</h1>

      ${coverPath ? `<img src="${escapeAttr(coverPath)}" style="max-width:220px; margin:10px 0 12px" onerror="this.style.display='none'">` : ``}

      <div class="badges" style="margin:8px 0 12px">
        <a class="badge" href="#/fondo/${encodeURIComponent(r.fondo)}">Fondo: ${escapeHtml(r.fondo || "(n.d.)")}</a>
        ${r.tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div class="meta">
        <div class="k">Codice</div><div class="v">${escapeHtml(r.codice)}</div>
        <div class="k">Tipo</div><div class="v">${escapeHtml(r.tipo)}</div>
        <div class="k">Volume</div><div class="v">${escapeHtml(r.volume)}</div>
        <div class="k">Autore/i</div><div class="v">${escapeHtml(r.autori.join("; "))}</div>
        <div class="k">Anno</div><div class="v">${escapeHtml(r.anno)}</div>
        <div class="k">Luogo</div><div class="v">${escapeHtml(r.luogo)}</div>
        <div class="k">Editore</div><div class="v">${escapeHtml(r.editore)}</div>
      </div>

      <p style="margin-top:14px"><a href="#/fondo/${encodeURIComponent(r.fondo)}">← Torna al fondo</a></p>
    </div>
  `;

  const c = el("count");
  if (c) c.textContent = "";
}

function parseRoute() {
  const h = location.hash || "#/";
  const parts = h.replace(/^#\//, "").split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "fondi-info") return { name: "fondi-info" };
  if (parts[0] === "fondo") return { name: "fondo", fondo: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "libro") return { name: "libro", id: decodeURIComponent(parts.slice(1).join("/")) };
  return { name: "home" };
}

function render() {
  const route = parseRoute();
  if (route.name === "home") return renderHome();
  if (route.name === "fondi-info") return renderFondiInfo();
  if (route.name === "fondo") return renderFund(route.fondo);
  if (route.name === "libro") return renderBook(route.id);
}

function wireEvents() {
  window.addEventListener("hashchange", render);

  el("q")?.addEventListener("input", render);
  el("authorFilter")?.addEventListener("change", render);
  el("tagFilter")?.addEventListener("change", render);

  el("clearFilters")?.addEventListener("click", () => {
    if (el("q")) el("q").value = "";
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

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors?.length) console.warn(parsed.errors);

  const rows = parsed.data;

  RECORDS = rows.map(row => {
    const titolo  = norm(row.titolo ?? row.Titolo ?? row["Titolo"]);
    const codice  = norm(row.codice ?? row.Codice ?? row["Codice"]);
    const tipo    = norm(row.tipo ?? row.Tipo ?? row["Tipo"]);
    const volume  = norm(row.volume ?? row.Volume ?? row["Volume"]);

    const anno = norm(
      row.anno ?? row.Anno ?? row["Anno"] ??
      row["Anno di pubblicazione"] ?? row["Anno di pubblica"] ?? row["Anno di pubblicazione "]
    );

    const luogo   = norm(row.luogo ?? row.Luogo ?? row["Luogo"]);
    const editore = norm(row.editore ?? row.Editore ?? row["Editore"]);

    const fondo = norm(row.fondo ?? row.Fondo ?? row["Fondo"] ?? row["Fondo (from Fondo)"]);

    const tagRaw = row.tag ?? row.tags ?? row.Tags ?? row["Tags"] ?? "";
    const tags = splitTags(tagRaw);

    const autori = splitAuthors(row);

    const id = codice || ("row-" + Math.random().toString(36).slice(2));

    return { id, titolo, codice, tipo, volume, autori, anno, luogo, editore, tags, fondo };
  }).filter(r => r.titolo || r.codice);

  buildIndex();
  wireEvents();
  render();
  setStatus("");
}

loadData();
