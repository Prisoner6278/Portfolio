// Mobile navigation toggle + progressive enhancements (no dependencies)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  if (!btn) return;

  const navId = btn.getAttribute('aria-controls');
  const nav = navId ? document.getElementById(navId) : null;
  if (!nav) return;

  const isDesktop = () => window.matchMedia('(min-width: 721px)').matches;

  const setExpanded = (open) => btn.setAttribute('aria-expanded', String(!!open));

  const closeMenu = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    setExpanded(false);
  };

  const toggleMenu = () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', open);
    setExpanded(open);
  };

  // 1) Toggle on button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // 2) Close when a nav link is clicked (mobile)
  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'A' && !isDesktop()) closeMenu();
  });

  // 3) Close when clicking outside (background click)
  document.addEventListener('click', (e) => {
    if (isDesktop()) return;
    if (!nav.classList.contains('is-open')) return;
    const target = e.target;
    if (nav.contains(target) || btn.contains(target)) return;
    closeMenu();
  });

  // 4) Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
  });

  // 5) Ensure menu resets when resizing to desktop
  window.addEventListener('resize', () => {
    if (isDesktop()) closeMenu();
  });

  // 6) Current page highlight (adds .is-active + aria-current)
  try {
    const path = (location.pathname || '').split('/').pop() || 'index.html';
    const links = Array.from(nav.querySelectorAll('a.nav-link[href]'));

    let anyActive = false;

    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const hrefFile = href.split('#')[0].split('/').pop();

      // Normalize index
      const isIndex = (path === '' || path === 'index.html');
      const linkIsIndex = (hrefFile === '' || hrefFile === 'index.html');

      let active = false;

      if (path === 'contact.html' && href.includes('contact.html')) active = true;
      else if (path === 'resume.html' && href.includes('resume.html')) active = true;
      else if (isIndex && linkIsIndex) active = true;

      if (active) anyActive = true;

      if (active) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('is-active');
        if (a.getAttribute('aria-current') === 'page') a.removeAttribute('aria-current');
      }
    });

    // Fallback: pages that are not in the top nav (e.g., project detail pages)
    if (!anyActive && links.length) {
      links[0].classList.add('is-active');
      links[0].setAttribute('aria-current', 'page');
    }
  } catch (_) {
    // no-op
  }
});
