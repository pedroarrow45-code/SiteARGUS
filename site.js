const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=$('.nav'), menu=$('.menu'), links=$('.navlinks');
addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>24),{passive:true});
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));links.classList.toggle('open',!open)});
$$('.navlinks a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));
 const steps=$$('.steps article'), method=$('.method-progress');const mo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const n=steps.indexOf(e.target)+1;method?.style.setProperty('--method',`${n*20}%`)}}),{rootMargin:'-35% 0px -45%'});steps.forEach(s=>mo.observe(s));
}else $$('.reveal').forEach(el=>el.classList.add('visible'));
const fmt=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
function calculate(){const form=$('#impact-form');if(!form)return;const d=Object.fromEntries(new FormData(form));const units=+d.units,staff=+d.staff,hours=+d.hours,cost=+d.cost,processes=+d.processes,losses=+d.losses;const factor=Math.min(.3,.15+processes*.005);const hoursLow=Math.round(hours*52*factor),hoursHigh=Math.round(hours*52*Math.min(.4,factor+.1));const adminLow=hoursLow*cost,adminHigh=hoursHigh*cost;const lossLow=losses*12*.05,lossHigh=losses*12*.15;$('#saved-hours').textContent=`${hoursLow.toLocaleString('pt-BR')}–${hoursHigh.toLocaleString('pt-BR')} h/ano`;$('#admin-saving').textContent=`${fmt.format(adminLow)}–${fmt.format(adminHigh)}`;$('#loss-saving').textContent=`${fmt.format(lossLow)}–${fmt.format(lossHigh)}`;$('#impact-range').textContent=`${fmt.format(adminLow+lossLow)}–${fmt.format(adminHigh+lossHigh)}`;const vals={units,staff,hours:`${hours}h`,cost:fmt.format(cost),processes,losses:fmt.format(losses)};Object.entries(vals).forEach(([k,v])=>{const o=$(`output[for="${k}"]`);if(o)o.textContent=v})}
$('#impact-form')?.addEventListener('input',calculate);calculate();

// Product evidence: one observer coordinates narrative, real screenshot and spotlight.
$$('[data-proof-story]').forEach(story=>{
  const steps=$$('.proof-step',story), images=$$('.proof-image',story), index=$('.proof-index span',story);
  const activate=step=>{
    steps.forEach(item=>item.classList.toggle('active',item===step));
    images.forEach(img=>img.classList.toggle('active',img.dataset.proofImage===step.dataset.image));
    story.dataset.focus=step.dataset.focus;
    if(index) index.textContent=String(steps.indexOf(step)+1).padStart(2,'0');
  };
  if(!reduced){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting) activate(entry.target);
    }),{rootMargin:'-32% 0px -46%',threshold:0});
    steps.forEach(step=>observer.observe(step));
  } else activate(steps[0]);
});

// Qualifies the first conversation without storing visitor data on the site.
$('#lead-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget));
  const subject=`Briefing inicial — ${data.company || 'nova operação'}`;
  const body=[
    'BRIEFING INICIAL — ARGUS INTEL',
    '',
    `Nome: ${data.name}`,
    `Empresa: ${data.company}`,
    `Contato: ${data.contact}`,
    `Frente: ${data.route}`,
    `Porte da operação: ${data.scale || 'Não informado'}`,
    `Prazo: ${data.deadline || 'Não informado'}`,
    '',
    'Processo que precisa mudar:',
    data.problem,
    '',
    'Impacto atual:',
    data.impact || 'Não informado'
  ].join('\n');
  location.href=`mailto:contato@argusintel.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
