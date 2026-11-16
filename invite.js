const links=[...document.querySelectorAll('.photos a')],dialog=document.querySelector('dialog'),photo=dialog.querySelector('img'),counter=dialog.querySelector('.counter');let current=0;
function show(i){current=(i+links.length)%links.length;photo.src=links[current].href;photo.alt=links[current].querySelector('img').alt;counter.textContent=(current+1)+' / '+links.length;}
links.forEach((link,i)=>link.addEventListener('click',e=>{if(typeof dialog.showModal!=='function'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();show(i);dialog.showModal();dialog.querySelector('.close').focus();}));
dialog.addEventListener('click',e=>{const a=e.target.dataset.action;if(a==='close'||e.target===dialog)dialog.close();if(a==='prev')show(current-1);if(a==='next')show(current+1);});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(current+(e.key==='ArrowLeft'?-1:1));}});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const cover = document.querySelector('.invitation-cover');
const invitation = document.querySelector('#invitation');
const recording = document.querySelector('#wedding-music');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
cover.hidden = false;
invitation.hidden = true;

function showerFlowers() {
  if (reducedMotion.matches) return;
  const shower = document.createElement('div');
  shower.className = 'petal-shower';
  shower.setAttribute('aria-hidden', 'true');
  const colors = ['#da8e86', '#edafaa', '#efd49b', '#c67a76'];
  for (let i = 0; i < 48; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--x', (Math.random() * 100) + '%');
    petal.style.setProperty('--size', (8 + Math.random() * 14) + 'px');
    petal.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    petal.style.setProperty('--delay', (Math.random() * 1.25) + 's');
    petal.style.setProperty('--time', (2.3 + Math.random() * 1.3) + 's');
    petal.style.setProperty('--color', colors[i % colors.length]);
    shower.append(petal);
  }
  document.body.append(shower);
  setTimeout(() => shower.remove(), 5100);
}
showerFlowers();

cover.addEventListener('click', event => {
  const opener = event.target.closest('[data-open-invite]');
  if (!opener) return;
  recording.play().catch(error => console.warn('Wedding music could not start:', error));
  cover.hidden = true;
  invitation.hidden = false;
  invitation.classList.add('invitation-opening');
  window.scrollTo({top: 0, behavior: 'instant'});
  startSlideshow();
  invitation.querySelector('h1').focus({preventScroll: true});
  showerFlowers();
});

const envelope = document.querySelector('.photo-envelope');
const card = envelope.querySelector('.photo-card');
const cardImage = card.querySelector('img');
const photoNumber = envelope.querySelector('.photo-number');
let photoIndex = 0;
let slideshow;
let cardAnimation;

function revealPhoto(index, animate = true) {
  photoIndex = (index + links.length) % links.length;
  cardImage.src = links[photoIndex].href;
  const nextPhoto = new Image();
  nextPhoto.src = links[(photoIndex + 1) % links.length].href;
  cardImage.alt = links[photoIndex].querySelector('img').alt;
  photoNumber.textContent = (photoIndex + 1) + ' / ' + links.length;
  cardAnimation?.cancel();
  if (animate && !reducedMotion.matches && card.animate) {
    cardAnimation = card.animate([
      {transform: 'translateY(26%) rotate(-5deg) scale(.93)', opacity: .12},
      {transform: 'translateY(-2%) rotate(1deg)', opacity: 1, offset: .8},
      {transform: 'translateY(0) rotate(0deg)', opacity: 1}
    ], {duration: 620, easing: 'cubic-bezier(.22,.7,.24,1)'});
  }
}

function startSlideshow() {
  if (slideshow) return;
  slideshow = setInterval(() => revealPhoto(photoIndex + 1), 3900);
}

envelope.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  revealPhoto(photoIndex + Number(button.dataset.step));
}));
card.addEventListener('click', () => {
  links[photoIndex].click();
});
dialog.addEventListener('close', () => card.focus());
document.querySelector('.photos').hidden = true;
document.querySelector('.photos').style.display = 'none';
envelope.hidden = false;
revealPhoto(0, false);

