const nav=document.querySelector('.site-nav');addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>40),{passive:true});
document.querySelector('.menu')?.addEventListener('click',e=>{const links=document.querySelector('.nav-links');links?.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',links?.classList.contains('open')?'true':'false')});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('.contact-form')?.addEventListener('submit',e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.textContent='REQUISIÇÃO REGISTRADA';button.disabled=true});
