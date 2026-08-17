const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.querySelector('.site-nav');
addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 40), { passive: true });
document.querySelector('.menu')?.addEventListener('click', event => {
  const links = document.querySelector('.nav-links');
  const open = links?.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => document.querySelector('.nav-links')?.classList.remove('open')));
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08, rootMargin: '0px 0px -35px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
// Adapted from the original ARGUS typewriter: short technical labels only, never essential long-form copy.
document.querySelectorAll('[data-typewriter]').forEach(element => {
  const text = element.dataset.typewriter;
  if (reducedMotion) { element.textContent = text; return; }
  element.textContent = ''; element.classList.add('type-cursor'); let index = 0;
  const type = () => { element.textContent = text.slice(0, ++index); if (index < text.length) setTimeout(type, 24); else setTimeout(() => element.classList.remove('type-cursor'), 900); };
  setTimeout(type, 180);
});
document.querySelector('.contact-form')?.addEventListener('submit', event => {
  event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.textContent = 'REQUISIÇÃO REGISTRADA'; button.disabled = true;
});
