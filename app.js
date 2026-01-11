// Archivio statico: carica archivio.csv dal repo e costruisce:
// - Home con lista fondi
// - Pagine per fondo con filtri autore/tag + ricerca
// - Scheda libro cliccabile
//
// ATTENZIONE: rinomina le colonne in Sheets in modo stabile.
// Consigliato: Titolo, Codice, Tipo, Volume, Autore1, Autore2, Autore3, Anno, Luogo, Editore, Tags, Fondo

const DATA_FILE = "archivio.csv";

let RECORDS = [];
let FUNDS = [];
let AUTHORS = [];
let TAGS = [];

const el = (id) => document.getElementById(id);

function norm(s){
  return (s ?? "").toString().trim();
}
function splitTags(s){
  const t = norm(s);
  if(!t) return [];
  return t.split(",").map(x=>x.trim()).filter(Boolean);
}
function splitAuthors(row){
  // Prende tutte le colonne che iniziano con "Autore" (case-insensitive)
  const keys = Object.keys(row);
  const a = [];
  for(const k of keys){
    if(/^autore/i.test(k)){
      const v = norm(row[k]);
      if(v) a.push(v);
    }
  }
  // fallback: se hai solo una colonna "Autore (Cognome, Nome)" e non l'hai rinominata
  if(a.length===0){
    for(const k of keys){
      if(k.toLowerCase().includes("autore")){
        const v = norm(row[k]);
        if(v) a.push(v);
      }
    }
  }
  // uniq mantenendo ordine
  return [...new Set(a)];
}

function buildIndex(){
  FUNDS = [...new Set(RECORDS.map(r=>r.fondo).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'it'));
  const authorSet = new Set();
  const tagSet = new Set();
  for(const r of RECORDS){
    for(const a of r.autori) authorSet.add(a);
    for(const t of r.tags) tagSet.add(t);
  }
  AUTHORS = [...authorSet].sort((a,b)=>a.localeCompare(b,'it'));
  TAGS = [...tagSet].sort((a,b)=>a.localeCompare(b,'it'));

  // sidebar fondi
  const fundList = el("fundList");
  fundList.innerHTML = FUNDS.map(f => `<a href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`).join("");

  // filtri
  const aSel = el("authorFilter");
  const tSel = el("tagFilter");
  aSel.innerHTML = `<option value="">(tutti)</option>` + AUTHORS.map(a=>`<option value="${escapeAttr(a)}">${escapeHtml(a)}</option>`).join("");
  tSel.innerHTML = `<option value="">(tutti)</option>` + TAGS.map(t=>`<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join("");
}

function escapeHtml(s){
  return (s??"").toString()
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(s){ return escapeHtml(s); }

function setStatus(msg){ el("status").textContent = msg; }

function currentFilters(){
  return {
    q: norm(el("q").value).toLowerCase(),
    author: norm(el("authorFilter").value),
    tag: norm(el("tagFilter").value),
  };
}

function applyFilters(list){
  const {q, author, tag} = currentFilters();
  return list.filter(r=>{
    if(author && !r.autori.includes(author)) return false;
    if(tag && !r.tags.includes(tag)) return false;
    if(q){
      const hay = [
        r.titolo, r.codice, r.tipo, r.anno, r.luogo, r.editore, r.fondo,
        ...r.autori, ...r.tags
      ].join(" ").toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderHome(){
  setStatus("");
  const view = el("view");
  view.innerHTML = `
    <div class="card">
      <h1>Fondi</h1>
      <p class="hint">Seleziona un fondo per sfogliare i libri. Puoi anche usare la ricerca a sinistra.</p>
      <div class="badges" style="margin-top:10px">
        ${FUNDS.map(f=>`<a class="badge" href="#/fondo/${encodeURIComponent(f)}">${escapeHtml(f)}</a>`).join("")}
      </div>
    </div>
  `;
  el("count").textContent = `${RECORDS.length} record totali`;
}

function renderFondiInfo(){
  setStatus("");
  const view = el("view");
  view.innerHTML = `
    <div class="card">
      <h1>Cosa sono i fondi</h1>
      <p>Questa pagina è un testo libero. Modificala in <code>app.js</code> (funzione <code>renderFondiInfo</code>) oppure crea un file HTML dedicato e linkalo dal menu.</p>
      <p><b>Suggerimento:</b> descrivi origine dei fondi, criteri di ordinamento, eventuali lacune e convenzioni (es. codici, tag).</p>
    </div>
  `;
  el("count").textContent = "";
}

function renderFund(fondo){
  const view = el("view");
  const inFund = RECORDS.filter(r=>r.fondo === fondo);
  const filtered = applyFilters(inFund);

  setStatus(`Fondo: ${fondo} — ${filtered.length}/${inFund.length} record`);
  view.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(fondo)}</h1>
      <div class="hint">Clicca un titolo per aprire la scheda. Usa filtri e ricerca a sinistra.</div>
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
          ${filtered.map(r=>`
            <tr>
              <td><a href="#/libro/${encodeURIComponent(r.id)}">${escapeHtml(r.titolo)}</a></td>
              <td>${escapeHtml(r.autori.join("; "))}</td>
              <td>${escapeHtml(r.anno)}</td>
              <td><div class="badges">${r.tags.map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("")}</div></td>
              <td>${escapeHtml(r.codice)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  el("count").textContent = `${inFund.length} nel fondo “${fondo}”`;
}

function renderBook(id){
  const r = RECORDS.find(x=>x.id === id);
  const view = el("view");
  if(!r){
    setStatus("Record non trovato.");
    view.innerHTML = `<div class="card"><h1>Non trovato</h1><p>Il record richiesto non esiste (o il codice è cambiato).</p></div>`;
    return;
  }
  setStatus("");
  view.innerHTML = `
    <div class="card">
      <h1>${escapeHtml(r.titolo)}</h1>
      <div class="badges" style="margin:8px 0 12px">
        <a class="badge" href="#/fondo/${encodeURIComponent(r.fondo)}">Fondo: ${escapeHtml(r.fondo || "(n.d.)")}</a>
        ${r.tags.map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("")}
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
  el("count").textContent = "";
}

function parseRoute(){
  const h = location.hash || "#/";
  const parts = h.replace(/^#\//, "").split("/").filter(Boolean);
  if(parts.length === 0) return {name:"home"};
  if(parts[0] === "fondi-info") return {name:"fondi-info"};
  if(parts[0] === "fondo") return {name:"fondo", fondo: decodeURIComponent(parts.slice(1).join("/"))};
  if(parts[0] === "libro") return {name:"libro", id: decodeURIComponent(parts.slice(1).join("/"))};
  return {name:"home"};
}

function render(){
  const route = parseRoute();
  if(route.name === "home") return renderHome();
  if(route.name === "fondi-info") return renderFondiInfo();
  if(route.name === "fondo") return renderFund(route.fondo);
  if(route.name === "libro") return renderBook(route.id);
}

function wireEvents(){
  window.addEventListener("hashchange", render);

  const rerender = () => render();
  el("q").addEventListener("input", () => {
    // non forziamo home: filtra la vista corrente
    render();
  });
  el("authorFilter").addEventListener("change", rerender);
  el("tagFilter").addEventListener("change", rerender);
  el("clearFilters").addEventListener("click", () => {
    el("q").value = "";
    el("authorFilter").value = "";
    el("tagFilter").value = "";
    render();
  });
}

async function loadData(){
  setStatus("Caricamento dati…");
  const res = await fetch(DATA_FILE, {cache:"no-store"});
  if(!res.ok){
    setStatus(`Errore: non trovo ${DATA_FILE}. Mettilo nella stessa cartella del sito.`);
    return;
  }
  const csvText = await res.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if(parsed.errors?.length){
    console.warn(parsed.errors);
  }

  // Mappa colonne con una certa tolleranza ai nomi
  const rows = parsed.data;

  RECORDS = rows.map(row => {
    const titolo = norm(row.titolo ?? row.Titolo ?? row["Titolo"]);
    const codice = norm(row.codice ?? row.Codice ?? row["Codice"]);
    const tipo = norm(row.tipo ?? row.Tipo ?? row["Tipo"]);
    const volume = norm(row.volume ?? row.Volume ?? row["Volume"]);
    const anno = norm(row.anno ?? row.Anno ?? row["Anno"] ?? row["Anno di pubblicazione"] ?? row["Anno di pubblica"] ?? row["Anno di pubblicazione "]);
    const luogo = norm(row.luogo ?? row.Luogo ?? row["Luogo"]);
    const editore = norm(row.editore ?? row.Editore ?? row["Editore"]);
    const fondo = norm(row.fondo ?? row.Fondo ?? row["Fondo"] ?? row["Fondo (from Fondo)"]);
    const tagRaw = row.tag ?? row.tags ?? row.Tags ?? row["Tags"] ?? "";
    const tags = splitTags(tagRaw);
    const autori = splitAuthors(row);

    // id: usa codice se c'è, altrimenti un hash semplice
    const id = codice || ("row-" + Math.random().toString(36).slice(2));

    return { id, titolo, codice, tipo, volume, autori, anno, luogo, editore, tags, fondo };
  }).filter(r => r.titolo || r.codice);

  buildIndex();
  wireEvents();
  render();
  setStatus("");
}

loadData();
