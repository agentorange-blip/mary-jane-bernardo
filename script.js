const header=document.getElementById('header');
const progress=document.querySelector('.scroll-progress');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const dot=document.querySelector('.cursor-dot');
window.addEventListener('scroll',()=>{header.classList.toggle('scrolled',window.scrollY>30);const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?window.scrollY/max*100:0)+'%'});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':''});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}));
if(matchMedia('(pointer:fine)').matches){document.addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'})}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const counter=document.querySelector('[data-count]');
if(counter){const co=new IntersectionObserver(es=>{if(es[0].isIntersecting){let n=0;const target=+counter.dataset.count;const step=()=>{n=Math.min(target,n+1);counter.textContent=n;if(n<target)requestAnimationFrame(step)};step();co.disconnect()}},{threshold:.6});co.observe(counter)}
