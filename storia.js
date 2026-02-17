(() => {
  const svg = document.querySelector(".story-path");
  const path = document.querySelector("#path");
  const items = Array.from(document.querySelectorAll(".s-item"));

  if (!svg || !path || !items.length) return;

  // helper: punto lungo il path
  const total = path.getTotalLength();

  function placeItems() {
    const box = svg.getBoundingClientRect();

    // distribuzione lungo la curva (con margine sopra/sotto)
    const start = 0.06;
    const end   = 0.94;

    items.forEach((el, i) => {
      const t = start + (end - start) * (i / Math.max(1, items.length - 1));
      const p = path.getPointAtLength(total * t);

      // alternanza + irregolarità controllata
      const side = (i % 2 === 0) ? -1 : 1;
      const jitter = (i % 3 === 0) ? 40 : (i % 3 === 1 ? 10 : 70);
      const offsetX = side * (160 + jitter);    // quanto si stacca dalla linea
      const offsetY = (i % 2 === 0) ? -10 : 10; // micro variaz.

      // coordinate in px rispetto al contenitore
      el.style.left = (p.x / 1000 * box.width) + "px";
      el.style.top  = (p.y / 2600 * box.height) + "px";

      // sposta lateralmente dalla curva
      el.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) translateY(50px)`;
      el.dataset.baseX = offsetX;
      el.dataset.baseY = offsetY;
    });
  }

  // reveal su scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        // toglie la translateY extra usata per l’entrata
        const bx = Number(e.target.dataset.baseX || 0);
        const by = Number(e.target.dataset.baseY || 0);
        e.target.style.transform = `translate(-50%, -50%) translate(${bx}px, ${by}px)`;
      }
    });
  }, { threshold: 0.25 });

  items.forEach(el => io.observe(el));

  // linea che si disegna con lo scroll (stroke-dashoffset)
  function drawPathOnScroll(){
    const rect = svg.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress: quando la sezione entra e finisce
    const start = vh * 0.2;
    const end = vh * 0.8;

    const prog = Math.min(1, Math.max(0, (start - rect.top) / (rect.height - (start + end))));
    // dashoffset da 1 -> 0
    path.style.strokeDasharray = total;
    path.style.strokeDashoffset = total * (1 - prog);
  }

  // micro-parallax sulle immagini (leggero)
  function parallax(){
    const vh = window.innerHeight;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      const img = el.querySelector("img");
      if (!img) return;

      // -1..1 circa
      const k = ((r.top + r.height/2) - vh/2) / (vh/2);
      const y = Math.max(-12, Math.min(12, -k * 10));
      img.style.transform = `translateY(${y}px)`;
    });
  }

  // init
  placeItems();
  drawPathOnScroll();
  parallax();

  // resize
  window.addEventListener("resize", () => {
    placeItems();
    drawPathOnScroll();
    parallax();
  });

  // scroll
  window.addEventListener("scroll", () => {
    drawPathOnScroll();
    parallax();
  }, { passive: true });
})();
