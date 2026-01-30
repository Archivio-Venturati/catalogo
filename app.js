const DATA_FILE = "Archivio.csv";

const CASA_DEL_POPOLO_STORIA = `
<h1>Casa del Popolo di Caravaggio</h1>

<p class="lead">
Storia...
</p>

`;

const FUND_INFO = {
  "Venturati": {
    subtitle: "Fondo Venturati",
    image: "images/carlo_venturati.jpg",
    text: `Carlo Venturati nacque a Caravaggio il 21/7/1921.
Nel 1940, iscritto al primo anno della facoltà di chimica, venne chiamato sotto le armi. Fatto prigioniero in Albania, a Durazzo, il 10/9/1943, deportato in Austria, Polonia e Germania, il 7/4/1945 a Stahle venne liberato dalla 9A armata americana. Solo il 13/9/1945 fece ritorno a Caravaggio con negli occhi e nella mente gli orrori della guerra, della prigionia, della deportazione e subito si iscrisse al Partito Socialista Italiano.
Cambiò anche corso di studi e già nel marzo del 1948 si laureò in giurisprudenza presso l’Università degli Studi di Milano per poi intraprendere la professione di avvocato.
Per circa trent’anni, dal 1952, fu consigliere comunale prima a Caravaggio e poi a Treviglio, dove era andato a risiedere con la famiglia, e occupò posti chiave nel PSI: consigliere provinciale, segretario della Sezione di Treviglio, segretario della Federazione di Bergamo, membro dei probi viri del partito.
Morì in Spagna, improvvisamente, l’11 maggio 1984, durante una breve vacanza.

Il fondo è stato donato dalla famiglia di Carlo Venturati. Il fondo è il più consistente posseduto dall'Archivio che, infatti, è intitolato a Venturati in quanto si tratta del primo vero fondo acquisito. È costituito per la maggior parte di opere edite di stampo politico e filosofico-politico, soprattutto sul tema del socialismo italiano.`
  },

  "Gallavresi": {
    subtitle: "Fondo Gallavresi",
    image: "images/circuli.jpeg",
    text: `Il fondo Gallavresi rappresenta il lascito alla Casa del Popolo da parte della Cooperativa dei Lavoratori di Caravaggio e del Circolo "Gallavresi" di Caravaggio del Partito Socialista Italiano. 
I Socialisti hanno rappresentato una parte fondamentale della storia politica e culturale di Caravaggio. Fin dalla fine del XIX secolo, infatti, Caravaggio è stata un terreno molto fertile per le idee del socialismo. Nelle sue campagne, già nel 1897 nasce la Lega di resistenza contadina e nel 1898 la Lega dei muratori. 
Nel Novecento, fu soprattutto grazie alla costruzione nel 1956 e gestione del Circulì che fino al 2023 la Cooperativa diviene punto di riferimento per la cultura socialdemocratica della Bassa Bergamasca. 
Il Circolo socialista, attivo fino ai primi anni '10 del 2000, è intitolato all'Onorevole Emilio Gallavresi (1856-1931), figura di spicco del socialismo italiano e deputato con il PSI per due legislature. La sua famiglia fu proprietaria dell'attuale Palazzo Comunale.`
  },

  "Stella": {
    subtitle: "Fondo Stella",
    text: `Si tratta del fondo che contiene i materiali rinvenuti nella Casa del Popolo e che non possono essere connessi all'attività dell'ultima associazione politica in funzione, ovvero il Partito Democratico. È costituito dal lascito delle diverse organizzazioni politiche che l'hanno animata, ovvero Partito Comunista Italiano, Partito Democratico della Sinistra e Democratici di Sinistra.
Nella maggior parte è costituito da documentazione interna e organizzativa o materiale elettorale, ma anche da libri editi di vario genere. L'intitolazione a Fermo Stella ricalca molte di quelle fatte a realtà che hanno animato la Casa del Popolo (Radio Stella, Spazio Stella, Arci Stella), connotate dal riferimento alla via antistante la Casa e la Stella Rossa, simbolo internazionale della Sinistra.`
  },

  "Castelli": { subtitle: "Fondo Castelli", text: `Scrivi qui la descrizione.` },
  "Stuani":   { subtitle: "Fondo Stuani",   text: `Scrivi qui la descrizione.` },
  "Rossoni":  { subtitle: "Fondo Rossoni",  text: `Scrivi qui la descrizione.` },
  "Crapabela":  { subtitle: "Fondo Crapabela",  text: `Giuseppe Pisoni, detto "Crapabela", è stato segretario politico del Partito Comunista Italiano - Sezione di Caravaggio negli anni dell'acquisto e sistemazione della Casa del Popolo. È stato lui e il suo gruppo, quindi, il primo a credere in questo progetto comunitario.
  
  Il fondo è costituito soprattutto di documentazione interna ed esterna del Partito Comunista Italiano - Sezione di Caravaggio e da materiale fotografico.` },
  "Democratici":  { subtitle: "Fondo del Partito Democratico - Circolo di Caravaggio",  text: `Il fondo è fra quelli più eterogenei in possesso dell'Archivio. È costituito per la maggior parte da materiale fotografico, documentazione organizzativa, documentazione elettorale ed estratti di giornali. 
  
Il Circolo del Partito Democratico si è costituito a Caravaggio nel 2008, un anno dopo la sua fondazione nazionale. Si costituisce dalla fusione fra i militanti della Margherita e quelli dei Democratici di Sinistra, i quali, questi ultimi, detenevano parte della proprietà della Casa del Popolo. Per questo motivo è il Partito che ancora abita la nostra Casa, e che ha reso possibile il mantenimento della sua vitalità anche negli anni più difficili dopo la chiusura delle attività del Circolo Arci. 
Politicamente, ha rappresentato il polo opposto rispetto all'egemonia leghista in Caravaggio durante gli anni del decennio delle Giunte Prevedini (2008-2016), in cui ha sostenuto una lista civica nel 2011, la Tua Caravaggio con Cristina Ambrosini Candidata Sindaca. Negli anni seguenti, il Circolo vive momenti complicati fino al Commissariamento dovuto alle dimissioni della Segretaria Silvia Stuani.
Nel 2016, a seguito del superamento del tetto dei 15.000 abitanti, il Circolo ha avuto la possibilità di presentare una lista con il proprio simbolo. Quelle elezioni hanno visto la vittoria del civico Claudio Bolandrini con il PD divenuto partito di maggioranza relativa fra le liste collegate a lui. 
Gli anni del primo mandato hanno visto il Partito protagonista con la Segretaria Mara Carminati Assessore alle Politiche Giovanili e Pari Opportunità e Ivan Legramandi al Sociale. Il Sindaco diviene Consigliere Provinciale con la lista Civici e Democratici per la Bergamasca a trazione PD. A seguito di uno scandalo giornalistico, il Sindaco ritira le deleghe alla Segretaria nel 2018, incrinando il rapporto fra il Circolo e la Giunta. A seguito delle dimissioni da Partito da parte di Legramandi, il primo mandato si chiude senza tesserati in Giunta. 
Nel 2021 il Circolo, guidato dal Segretario Juri Cattelani, rappresentando una parte del Circolo scontenta dell'operato della Segretaria precedente, appoggia di nuovo la candidatura di Bolandrini a Sindaco. Tuttavia, il PD raccoglie solo il 14% dei consensi, uscendone come la lista meno votata della coalizione di centro sinistra. A seguito delle elezioni, Cattelani è nominato Assessore alla Cultura, Turismo e Attività Produttive, non rinnovando la tessera. 
Nel secondo mandato, dunque, il PD non avrà rappresentanti in Giunta. Solo per un anno, l'Assessore Marco Cremonesi all'Ambiente e PNRR si tessera, nonostante fosse capolista di una lista civica. Le successive elezioni provinciali vedono Bolandrini non confermato dopo due mandati.
A seguito della decisione del Sindaco di candidarsi con la lista Civici Moderati a trazione Forza Italia in provincia, i rapporti con il Circolo guidato da Mirko Gatti si incrinano fino alla spaccatura decisa nel 2025, a seguito di accordi politici non mantenuti dall'Amministrazione.
Diverse Segretarie e Segretari si sono succeduti negli anni: 
  - 2008-2011, Mirko Grassi;
  - 2011-2014, Silvia Stuani;
  - 2014-2018, Mara Carminati;
  - 2018-2021, Juri Cattelani;
  - 2021-2022, Mirko Gatti;
  - 2022- , Mirko Gatti.`}
};

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

/* HOME: mostra fondi + (se filtri/ricerca attivi) risultati globali */
/* HOME: vetrina (niente tabelloni). La ricerca resta nella sidebar e porta ai fondi/libri. */
function renderHome() {
  setStatus("");
  const view = el("view");

  const total = RECORDS.length;
  const fondiCount = FUNDS.length;

  const heroImg =
    Object.values(FUND_INFO).find(x => x?.image)?.image ||
    (RECORDS.find(r => r.immagine)?.immagine ?? "");

  view.innerHTML = `
    <div class="hero-photo">
      ${heroImg ? `<img src="${escapeAttr(heroImg)}" alt="" onerror="this.remove()">` : ``}

      <div class="hero-caption">
        <h1>Archivio Storico-Politico<br/>Carlo Venturati</h1>
        <p>Libri, documenti, fotografie e manifesti per ricostruire la memoria politica e culturale di Caravaggio e della Bassa Bergamasca.</p>
        <a class="hero-cta" href="#/archivio">Entra nell’Archivio →</a>
      </div>
    </div>

    <div class="home-inner">
      <div class="home-stats grid-3">
        <div class="stat">
          <div class="k">Record</div>
          <div class="v">${total}</div>
          <div class="p">Materiali catalogati e consultabili in sede. La sistemazione è in corso.</div>
        </div>

        <a class="stat clickable" href="#/archivio" style="display:block; color:inherit; text-decoration:none">
          <div class="k">Fondi</div>
          <div class="v">${fondiCount}</div>
          <div class="p">Raccolte organizzate per provenienza/donazione. Clicca per aprire l’Archivio.</div>
        </a>

        <div class="stat">
          <div class="k">Consultazione</div>
          <div class="v">Su appuntamento</div>
          <div class="p">Casa del Popolo di Caravaggio (BG) — via Fermo Stella 10</div>
        </div>
      </div>

      <div class="accordion" style="margin-top:14px">
        <details open>
          <summary>Il progetto</summary>
          <div class="acc-body">
            Questo sito raccoglie i volumi, i documenti, le fotografie e i manifesti dell’Archivio Storico-Politico “Carlo Venturati”.
            L’Archivio inizia a comporsi nel 2023 su impulso delle realtà che animano la Casa del Popolo, a seguito della donazione del fondo Venturati.
          </div>
        </details>

        <details>
          <summary>Cos’è l’Archivio</summary>
          <div class="acc-body">
            La finalità è recuperare e conservare materiali (libri, documenti, foto, manifesti) utili a mantenere viva la memoria storica e culturale
            della sinistra a Caravaggio e nella Bassa bergamasca.
          </div>
        </details>

        <details>
          <summary>Come consultare</summary>
          <div class="acc-body">
            Consultazione in sede su appuntamento, presso la Casa del Popolo di Caravaggio (BG), via Fermo Stella 10.<br>
            Contatti: <a href="mailto:pdcaravaggio@gmail.com">pdcaravaggio@gmail.com</a> ·
            <a href="mailto:circoloarcicaravaggio@gmail.com">circoloarcicaravaggio@gmail.com</a>
          </div>
        </details>

        <details>
          <summary>Disclaimer</summary>
          <div class="acc-body">
            Immagini e documenti sono pubblicati ai soli fini di documentazione storica e culturale.
            Su richiesta oscuriamo fotografie che ritraggono persone identificabili.
          </div>
        </details>
      </div>
    </div>
  `;

  // IMPORTANTISSIMO: non scrivere #count in home
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
            <th>Foto</th>
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
              <td>${r.immagine ? `<img class="thumb" src="${escapeAttr(r.immagine)}" alt="" loading="lazy" onerror="this.style.display='none'">` : ``}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  const c = el("count");
  if (c) c.textContent = `${inFund.length} nel fondo “${key}”`;
}

function renderStoria() {
  setStatus("");
  const view = el("view");
  view.innerHTML = `<div class="card prose">${CASA_DEL_POPOLO_STORIA}</div>`;
  const c = el("count");
  if (c) c.textContent = "";
}

function renderBook(id) {
  const r = RECORDS.find(x => x.id === id);
  const view = el("view");

  if (!r) {
    setStatus("Record non trovato.");
    view.innerHTML = `
      <div class="card">
        <h1>Non trovato</h1>
        <p>Il record richiesto non esiste (o il codice è cambiato).</p>
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
      ${metaRow("Tipo", r.tipo)}
      ${metaRow("Volume", r.volume)}
      ${metaRow("Autore/i", r.autori?.length ? r.autori.join("; ") : "")}
      ${metaRow("Anno", r.anno)}
      ${metaRow("Luogo", r.luogo)}
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
          ${r.anno ? ` · Anno: <span class="mono">${escapeHtml(r.anno)}</span>` : ""}
        </div>

        ${tags.length ? `
          <div class="book-tags">
            ${tags.map(t => `<span class="tagpill" title="${escapeAttr(String(t))}">${escapeHtml(String(t))}</span>`).join("")}
          </div>` : ``}
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
  const parts = h.replace(/^#\//, "").split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "fondo") return { name: "fondo", fondo: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "libro") return { name: "libro", id: decodeURIComponent(parts.slice(1).join("/")) };
  if (parts[0] === "storia") return { name: "storia" };
  if (parts[0] === "archivio") return { name: "archivio" };
  return { name: "home" };
}

function render() {
  const route = parseRoute();

  // HOME: layout senza sidebar
  document.body.classList.toggle("is-home", route.name === "home");

  if (route.name === "home") return renderHome();
  if (route.name === "archivio") return renderArchivio();
  if (route.name === "fondo") return renderFund(route.fondo);
  if (route.name === "libro") return renderBook(route.id);
  if (route.name === "storia") return renderStoria();
  return renderHome();
}


function wireEvents() {
  window.addEventListener("hashchange", render);

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

    // PDF: colonna "PDF" nel CSV (oppure "pdf")
    const pdf = norm(row.PDF ?? row.pdf ?? row["PDF"] ?? row["pdf"] ?? "");

    const id = codice || ("row-" + Math.random().toString(36).slice(2));

    return { id, titolo, codice, tipo, volume, autori, anno, luogo, editore, tags, fondo, pdf, immagine };
  }).filter(r => r.titolo || r.codice);

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
  const heroImg =
    Object.values(FUND_INFO).find(x => x?.image)?.image ||
    (RECORDS.find(r => r.immagine)?.immagine ?? "");

  // query/filtri
  const q = (el("q")?.value || "").trim();
  const a = (el("authorFilter")?.value || "").trim();
  const t = (el("tagFilter")?.value || "").trim();
  const hasQuery = !!(q || a || t);

  const filtered = applyFilters(RECORDS);

  // conteggio per fondo
  const counts = new Map();
  for (const r of RECORDS) {
    const f = r.fondo || "";
    if (!f) continue;
    counts.set(f, (counts.get(f) || 0) + 1);
  }

  function fundTeaser(name) {
    const info = FUND_INFO?.[name];
    const raw = (info?.text || "").toString().trim().replace(/\s+/g, " ");
    if (!raw) return "Descrizione in preparazione.";
    return raw.length > 140 ? raw.slice(0, 140).trim() + "…" : raw;
  }

  const hero = `
    <div class="archive-hero">
      ${heroImg ? `<img src="${escapeAttr(heroImg)}" alt="" onerror="this.remove()">` : ``}
      <div class="cap">
        <h1>Archivio Storico-Politico Carlo Venturati</h1>
        <p>Libri, documenti, fotografie e manifesti per ricostruire la memoria politica e culturale di Caravaggio e della Bassa Bergamasca.</p>
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
            <th>Titolo</th>
            <th>Autore</th>
            <th>Anno</th>
            <th>Fondo</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.slice(0, 250).map(r => `
            <tr>
              <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
              <td>${escapeHtml((r.autori || []).join("; "))}</td>
              <td>${escapeHtml(r.anno || "")}</td>
              <td><a href="#/fondo/${encodeURIComponent(r.fondo)}">${escapeHtml(r.fondo || "")}</a></td>
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

