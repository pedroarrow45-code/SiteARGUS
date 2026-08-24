const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.querySelector('.site-nav');
const scrollStories = [...document.querySelectorAll('[data-scroll-story]')];
let scrollFrame;
const updateScrollExperience = () => {
  const pageRange = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  document.body.style.setProperty('--scroll-progress', String(Math.min(scrollY / pageRange, 1)));
  nav?.classList.toggle('scrolled', scrollY > 40);
  scrollStories.forEach(story => {
    const rect = story.getBoundingClientRect();
    const travel = Math.max(rect.height - innerHeight * .5, 1);
    const progress = reducedMotion ? 1 : Math.min(Math.max((innerHeight * .65 - rect.top) / travel, 0), 1);
    story.style.setProperty('--story-progress', progress.toFixed(3));
    const steps = [...story.querySelectorAll('[data-story-step]')];
    if (!steps.length) return;
    const activeIndex = Math.min(Math.floor(progress * steps.length), steps.length - 1);
    steps.forEach((step, index) => step.classList.toggle('is-active', index === activeIndex));
    const active = steps[activeIndex];
    const readout = story.querySelector('.story-readout');
    if (readout && active) {
      readout.querySelector('strong').textContent = active.querySelector('span').textContent;
      readout.querySelector('small').textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    }
  });
  scrollFrame = null;
};
addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollExperience);
}, { passive: true });
addEventListener('resize', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollExperience);
}, { passive: true });
updateScrollExperience();
document.querySelector('.menu')?.addEventListener('click', event => {
  const links = document.querySelector('.nav-links');
  const open = links?.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.remove('open');
  document.querySelector('.menu')?.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelector('.nav-links')?.classList.remove('open');
  document.querySelector('.menu')?.setAttribute('aria-expanded', 'false');
  document.querySelector('.menu')?.focus();
});
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
// GROUP behaves as a bridge between two distinct operating modes.
const dualConsole = document.querySelector('[data-dual-console]');
const setDualMode = mode => {
  if (!dualConsole) return;
  document.body.dataset.dualMode = mode;
  document.querySelectorAll('[data-mode-label]').forEach(label => label.classList.toggle('is-active', label.dataset.modeLabel === mode));
  const copy = dualConsole.querySelector('[data-dual-copy]');
  if (copy) copy.textContent = mode === 'intel' ? 'INFORMATION → CONTEXT → DECISION' : 'OPERATIONS → SYSTEM → CAPACITY';
};
document.querySelectorAll('[data-dual-trigger], .group-hero .actions a').forEach(trigger => {
  const mode = trigger.dataset.dualTrigger || (trigger.getAttribute('href')?.includes('/intel') ? 'intel' : 'systems');
  trigger.addEventListener('mouseenter', () => setDualMode(mode));
  trigger.addEventListener('focus', () => setDualMode(mode));
});
if (dualConsole && !reducedMotion) {
  setTimeout(() => setDualMode('intel'), 2800);
  setTimeout(() => setDualMode('systems'), 5600);
}
// Pointer light is local to meaningful interactive surfaces, never a custom cursor.
if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.interactive-card').forEach(card => card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  }, { passive: true }));
}
// ARGUS GRAFOS reveals only the structured relationships of the focused entity.
const graph = document.querySelector('[data-graph]');
graph?.querySelectorAll('[data-node]').forEach(node => {
  node.addEventListener('mouseenter', () => {
    graph.dataset.focus = node.dataset.node;
    const focus = graph.querySelector('.graph-focus strong');
    if (focus) focus.textContent = `${node.dataset.node.toUpperCase()} / FOCUS`;
  });
  node.addEventListener('mouseleave', () => {
    delete graph.dataset.focus;
    const focus = graph.querySelector('.graph-focus strong');
    if (focus) focus.textContent = 'ENTITY / 01';
  });
});
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
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const tabs = [...button.parentElement.querySelectorAll('button')];
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(tabs.indexOf(button) + direction + tabs.length) % tabs.length];
    next.focus(); next.click(); event.preventDefault();
  });
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
