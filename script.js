// Header: solid background after scrolling, mobile menu toggle, current-section highlight.
(() => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');
  const current = document.querySelector('.menu-current');
  const links = [...panel.querySelectorAll('a[data-section]')];

  const onScroll = () => { header.dataset.scrolled = String(window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.dataset.open = String(open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.header-menu')) setOpen(false); });

  const sections = links.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const active = a.dataset.section === entry.target.id;
        if (active) { a.setAttribute('aria-current', 'true'); current.textContent = a.textContent; }
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => observer.observe(s));
})();

// Hero motion: duplicate ticker content for a seamless loop, and count up the stat numbers.
(() => {
  document.querySelectorAll('.ticker-track').forEach((track) => {
    [...track.children].forEach((chip) => track.appendChild(chip.cloneNode(true)));
  });

  document.querySelectorAll('.hero-stats strong').forEach((el) => {
    const node = el.firstChild;
    const target = parseInt(node && node.textContent, 10);
    if (!target) return;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    node.textContent = '0';
    requestAnimationFrame(tick);
  });
})();
