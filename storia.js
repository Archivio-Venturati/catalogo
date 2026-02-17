(() => {
  const items = Array.from(document.querySelectorAll(".tl-item"));
  if (!items.length) return;

  // watermark anno
  items.forEach(el => {
    const y = el.getAttribute("data-year") || "";
    const card = el.querySelector(".tl-card");
    if (card) card.setAttribute("data-year", y);
  });

  // reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.22 });

  items.forEach(el => io.observe(el));

  // parallax leggero sulle immagini
  function parallax(){
    const vh = window.innerHeight;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      const img = el.querySelector(".tl-media img");
      if (!img) return;

      const k = ((r.top + r.height/2) - vh/2) / (vh/2); // ~ -1..1
      const y = Math.max(-12, Math.min(12, -k * 10));
      img.style.transform = `translateY(${y}px)`;
    });
  }

  parallax();
  window.addEventListener("scroll", parallax, { passive: true });
  window.addEventListener("resize", parallax);
})();
