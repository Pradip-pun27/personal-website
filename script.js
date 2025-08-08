document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // THEME — load & apply
  const saved = localStorage.getItem('theme');
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', theme === 'light');
        icon.classList.toggle('fa-sun', theme === 'dark');
      }
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b1220' : '#1e88e5');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // NAVBAR scroll state
  const navbar = document.querySelector('.navbar');
  const setNavbarState = () => {
    if (!navbar) return;
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  setNavbarState();
  window.addEventListener('scroll', setNavbarState);

  // Smooth scroll ONLY for real section links (not dropdown toggles)
  document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // collapse navbar on mobile after click
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // Active link highlight based on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.nav-link');
  const onScrollActive = () => {
    let currentId = '';
    const offset = 220;
    sections.forEach(sec => {
      if (window.scrollY + offset >= sec.offsetTop) currentId = sec.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
  };
  onScrollActive();
  window.addEventListener('scroll', onScrollActive);

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 })
    : null;
  revealEls.forEach(el => { if (io) io.observe(el); else el.classList.add('in-view'); });

  // Lazy image polish
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    const done = () => img.classList.add('lazy-done');
    if (img.complete) done();
    else img.addEventListener('load', done, { once: true });
  });

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
