const DATA_FILE = "archivio.csv";

const FUND_INFO = {
  "Venturati": {
    subtitle: "Fondo Venturati",
    image: "images/carlo_venturati.jpg",
    text: `Carlo Venturati nacque a Caravaggio il 21/7/1921.
Nel 1940, iscritto al primo anno della facoltà di chimica, venne chiamato sotto le armi. Fatto prigioniero in Albania, a Durazzo, il 10/9/1943, deportato in Austria, Polonia e Germania, il 7/4/1945 a Stahle venne liberato dalla 9A armata americana. Solo il 13/9/1945 fece ritorno a Caravaggio con negli occhi e nella mente gli orrori della guerra, della prigionia, della deportazione e subito si iscrisse al Partito Socialista Italiano.
Cambiò anche corso di studi e già nel marzo del 1948 si laureò in giurisprudenza presso l’Università degli Studi di Milano per poi intraprendere la professione di avvocato.
Per circa trent’anni, dal 1952, fu consigliere comunale prima a Caravaggio e poi a Treviglio, dove era andato a risiedere con la famiglia, e occupò posti chiave nel PSI: consigliere provinciale, segretario della Sezione di Treviglio, segretario della Federazione di Bergamo, membro dei probi viri del partito.
Morì in Spagna, improvvisamente, l’11 maggio 1984, durante una breve vacanza.

Il fondo è stato donato dalla Famiglia di Carlo Venturati. Il fondo è il più consistente posseduto dall'Archivio ed è intitolato a Venturati. È costituito per la maggior parte di opere edite di stampo politico e filosofico-politico, soprattutto sul tema del socialismo italiano.`
  },

  "Gallavresi": {
    subtitle: "Fondo Gallavresi",
    text: `Il fondo Gallavresi rappresenta il lascito alla Casa del Popolo da parte della Cooperativa dei Lavoratori di Caravaggio e del Circolo "Gallavresi" di Caravaggio del Partito Socialista Italiano. 
I Socialisti hanno rappresentato una parte fondamentale della storia politica e culturale di Caravaggio. Fin dalla fine del XIX secolo, infatti, Caravaggio è stata un terreno molto fertile per le idee del socialismo. Nelle sue campagne, già nel 1897 nasce la Lega di resistenza contadina e nel 1898 la Lega dei muratori. 
Nel Novecento, fu soprattutto grazie alla costruzione e gestione del Circulì che fino al 2023 la Cooperativa diviene punto di riferimento per la cultura socialdemocratica della Bassa Bergamasca. 
Il Circolo socialista, attivo fino ai primi anni '10 del 2000, è intitolato all'Onorevole Emilio Gallavresi (1856-1931), figura di spicco del socialismo italiano e deputato con il PSI per due legislature. La sua famiglia fu proprietaria dell'attuale Palazzo Comunale.`
  },
  "Stella": {
    subtitle: "Fondo Stella",
    text: `Si tratta del fondo iniziale della Casa del Popolo, lascito delle diverse organizzazioni politiche che l'hanno animata, ovvero Partito Comunista Italiano, Partito Democratico della Sinistra, Democratici di Sinistra e Partito Democratico.
Nella maggior parte è costituito da documentazione interna e organizzativa o materiale elettorale, ma anche da libri editi di vario genere.`
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

function norm(s) { return (s ?? "").toString().trim(); }

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

  const fundList = el("fundList");
  if (fundList) {
    fundList.innerHTML = FUNDS
      .map(f => `<a href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`)
      .join("");
  }

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

  const hasQuery =
    norm(el("q")?.value) ||
    norm(el("authorFilter")?.value) ||
    norm(el("tagFilter")?.value);

  // risultati globali (q + autore + tag)
  const filtered = applyFilters(RECORDS);

  // Se c'è filtro attivo: aggiorna le tendine per far vedere solo opzioni utili
  // (senza rompere: se l'opzione selezionata non è più valida, resta comunque selezionata)
  if (hasQuery) {
    const authorSet = new Set();
    const tagSet = new Set();
    for (const r of filtered) {
      for (const a of r.autori) authorSet.add(a);
      for (const t of r.tags) tagSet.add(t);
    }

    const currentA = norm(el("authorFilter")?.value);
    const currentT = norm(el("tagFilter")?.value);

    const aSel = el("authorFilter");
    const tSel = el("tagFilter");

    const aList = [...authorSet].sort((a,b)=>a.localeCompare(b,"it"));
    const tList = [...tagSet].sort((a,b)=>a.localeCompare(b,"it"));

    if (aSel) {
      aSel.innerHTML =
        `<option value="">(tutti)</option>` +
        aList.map(a => `<option value="${escapeAttr(a)}">${escapeHtml(a)}</option>`).join("");
      if (currentA) aSel.value = currentA; // ripristina selezione
    }

    if (tSel) {
      tSel.innerHTML =
        `<option value="">(tutti)</option>` +
        tList.map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join("");
      if (currentT) tSel.value = currentT; // ripristina selezione
    }
  } else {
    // se non c'è filtro attivo, ripristina index completo (tutte opzioni)
    // (evita che restino "strozzate" dopo una ricerca)
    buildIndex();
  }

  const aboutHtml = `
    <div class="card">
      <h1>Archivio</h1>
      <div class="fund-text hint">
Questo sito raccoglie i volumi dell’Archivio Storico Politico “Carlo Venturati”.
I materiali sono organizzati per fondi (provenienza/donazione).

Puoi:
- entrare in un fondo per sfogliare i libri
- usare ricerca, filtro autore e tag
      </div>
    </div>
  `;

  const fundsHtml = `
    <div class="card" style="margin-top:12px">
      <h1>Fondi</h1>
      <p class="hint">Seleziona un fondo per sfogliare i libri. Puoi anche usare la ricerca a sinistra.</p>
      <div class="badges" style="margin-top:10px">
        ${FUNDS.map(f => `<a class="badge fund-badge" href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`).join("")}
      </div>
    </div>
  `;

  const resultsHtml = hasQuery ? `
    <div class="card" style="margin-top:12px">
      <h1>Risultati</h1>
      <div class="hint">${filtered.length} record trovati</div>

      <table class="grid" style="margin-top:12px">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Anno</th>
            <th>Fondo</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.slice(0, 200).map(r => `
            <tr>
              <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
              <td>${escapeHtml(r.autori.join("; "))}</td>
              <td>${escapeHtml(r.anno)}</td>
              <td><a href="#/fondo/${encodeURIComponent(r.fondo)}">${escapeHtml(r.fondo)}</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      ${filtered.length > 200 ? `<div class="hint" style="margin-top:10px">Mostro solo i primi 200 risultati. Raffina la ricerca.</div>` : ``}
    </div>
  ` : ``;

  view.innerHTML = aboutHtml + fundsHtml + resultsHtml;

  const c = el("count");
  if (c) c.textContent = `${RECORDS.length} record totali`;
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
            ${info.image ? `<img class="fund-photo" src="${escapeAttr(info.image)}" alt="" onerror="this.style.display='none'">` : ``}
            <div class="fund-text">${escapeHtml(info.text || "")}</div>
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

  const coverPath = r.codice ? `images/libri/${encodeURIComponent(r.codice)}.jpg` : "";

  setStatus("");
  view.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(r.titolo)}</h1>

      ${coverPath ? `<img class="fund-photo" src="${escapeAttr(coverPath)}" alt="" onerror="this.style.display='none'">` : ``}

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
  if (parts[0] === "fondo") return { name: "fondo", fondo: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "libro") return { name: "libro", id: decodeURIComponent(parts.slice(1).join("/")) };
  return { name: "home" };
}

function render() {
  const route = parseRoute();
  if (route.name === "home") return renderHome();
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
