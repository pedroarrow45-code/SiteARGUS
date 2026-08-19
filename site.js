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
// The hero responds only by a few pixels: depth without making the interface feel like a 3D demo.
const hero = document.querySelector('.hero');
const heroVisual = hero?.querySelector('.hero-visual');
if (!reducedMotion && hero && heroVisual && matchMedia('(pointer:fine)').matches) {
  let frame;
  hero.addEventListener('pointermove', event => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroVisual.style.setProperty('--mx', `${x * 10}px`);
      heroVisual.style.setProperty('--my', `${y * 7}px`);
      frame = null;
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--mx', '0px'); heroVisual.style.setProperty('--my', '0px');
  });
}
// Tool tabs work with hover, keyboard and touch; copy describes functions, never client results.
const toolCopy = {
  core: ['ARGUS v4', 'Orquestração analítica e estruturação de evidências'],
  graphs: ['Argus Grafos', 'Mapeamento visual de entidades, vínculos e clusters'],
  watch: ['Sentinela', 'Monitoramento de sinais, temas e mudanças relevantes'],
  format: ['ARGUS Formatter', 'Padronização de achados para entregas executivas'],
  oracle: ['ORÁCULO', 'Apoio ao cruzamento, contexto e exploração de hipóteses']
};
document.querySelectorAll('.tool-tabs button').forEach(button => {
  const activate = () => {
    const display = button.closest('.tool-experience')?.querySelector('.tool-display');
    if (!display) return;
    button.parentElement.querySelectorAll('button').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    display.dataset.activeTool = button.dataset.tool;
    const [name, description] = toolCopy[button.dataset.tool];
    display.querySelector('.tool-copy strong').textContent = name;
    display.querySelector('.tool-copy span').textContent = description;
  };
  button.addEventListener('click', activate);
  button.addEventListener('mouseenter', activate);
});
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
