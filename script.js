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


/* Contact form: open a prefilled Gmail compose window (works without a desktop mail app) */
(() => {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;
  const note = document.getElementById('contact-form-note');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      note.textContent = 'Please complete all fields and enter a valid email address.';
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('maryjane.brnrd0401@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    note.textContent = 'Opening Gmail compose. Review your message and click Send in Gmail.';
    window.location.assign(composeUrl);
  });
})();


/* Contact message length indicator */
(() => {
  const field = document.querySelector('#portfolio-contact-form textarea[name="message"]');
  const counter = document.getElementById('message-counter');
  if (!field || !counter) return;
  const update = () => { counter.textContent = `${field.value.length} / 500`; };
  field.addEventListener('input', update);
  update();
})();

// Floating Back to Top button (text arrow; no SVG dependency)
(() => {
  const button = document.getElementById('backToTop');
  if (!button) return;
  const updateVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 420);
  };
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
