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


/* Interactive 2D face illusion
   Uses the supplied expression PNGs directly; no WebGL or 3D geometry is required. */
(() => {
  const stage = document.getElementById('interactivePortrait');
  const canvas = document.getElementById('faceCanvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const states = [
    'test','closed','half',
    'up','down','left','right',
    'upleft','upright','downleft','downright',
    'grin','hearts','angry','surprised','wink'
  ];

  const images = {};
  let currentState = 'test';
  let pointerInside = false;
  let specialUntil = 0;
  let specialState = null;
  let blinkTimer = null;
  let resizeObserver = null;

  const loadImage = (name) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { images[name] = img; resolve(img); };
    img.onerror = reject;
    img.src = `assets/face-states/${name}.png`;
  });

  const drawCover = (img, w, h) => {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const resizeCanvas = () => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawState(currentState);
  };

  const drawState = (name) => {
    const img = images[name] || images.test;
    if (!img) return;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawCover(img, rect.width, rect.height);
  };

  const setState = (name) => {
    if (!images[name]) return;
    currentState = name;
    drawState(name);
  };

  const directionFromPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) - 0.5;
    const ny = ((event.clientY - rect.top) / rect.height) - 0.5;
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);

    if (ax < 0.10 && ay < 0.10) return 'test';
    if (ay > ax * 1.8) return ny < 0 ? 'up' : 'down';
    if (ax > ay * 1.8) return nx < 0 ? 'left' : 'right';

    if (nx < 0 && ny < 0) return 'upleft';
    if (nx > 0 && ny < 0) return 'upright';
    if (nx < 0 && ny > 0) return 'downleft';
    return 'downright';
  };

  const restorePointerState = () => {
    if (Date.now() < specialUntil) return;
    if (pointerInside) return;
    setState('test');
  };

  const triggerSpecial = (name, duration = 1200) => {
    if (!images[name]) return;
    specialState = name;
    specialUntil = Date.now() + duration;
    setState(name);
    window.setTimeout(() => {
      if (Date.now() >= specialUntil) {
        specialState = null;
        if (pointerInside && lastPointerEvent) setState(directionFromPointer(lastPointerEvent));
        else setState('test');
      }
    }, duration + 20);
  };

  let lastPointerEvent = null;

  canvas.addEventListener('pointerenter', (event) => {
    pointerInside = true;
    lastPointerEvent = event;
    if (!specialState) setState(directionFromPointer(event));
  });

  canvas.addEventListener('pointermove', (event) => {
    pointerInside = true;
    lastPointerEvent = event;
    if (!specialState && Date.now() >= specialUntil) {
      setState(directionFromPointer(event));
    }
  });

  canvas.addEventListener('pointerleave', () => {
    pointerInside = false;
    lastPointerEvent = null;
    if (!specialState) setState('test');
  });

  canvas.addEventListener('pointerdown', (event) => {
    // On touch, give the portrait a small playful reaction without
    // requiring a second interaction.
    if (event.pointerType === 'touch') {
      triggerSpecial('wink', 850);
    }
  });

  canvas.addEventListener('click', (event) => {
    if (event.pointerType === 'mouse') {
      const sequence = ['grin','hearts','surprised','wink'];
      const next = sequence[Math.floor(Math.random() * sequence.length)];
      triggerSpecial(next, 950);
    }
  });

  const scheduleBlink = () => {
    window.clearTimeout(blinkTimer);
    const delay = 3200 + Math.random() * 4300;
    blinkTimer = window.setTimeout(() => {
      if (!specialState) {
        const previous = currentState;
        setState('half');
        window.setTimeout(() => {
          if (!specialState) {
            setState('closed');
            window.setTimeout(() => {
              if (!specialState) {
                setState('half');
                window.setTimeout(() => {
                  if (!specialState) {
                    if (pointerInside && lastPointerEvent) setState(directionFromPointer(lastPointerEvent));
                    else setState('test');
                  }
                  scheduleBlink();
                }, 90);
              } else {
                scheduleBlink();
              }
            }, 105);
          } else {
            scheduleBlink();
          }
        }, 75);
      } else {
        scheduleBlink();
      }
    }, delay);
  };

  Promise.all(states.map(loadImage))
    .then(() => {
      stage.classList.add('face-ready');
      resizeCanvas();
      setState('test');
      scheduleBlink();

      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(stage);
      } else {
        window.addEventListener('resize', resizeCanvas, { passive: true });
      }
    })
    .catch(() => {
      // Keep the original portrait visible if an expression asset fails.
      stage.classList.remove('face-ready');
    });
})();
