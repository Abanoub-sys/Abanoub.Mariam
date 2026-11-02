(() => {
  const body = document.body;
  const overlay = document.getElementById('opening');
  const openButton = document.getElementById('openInvite');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.getElementById('mobileNav');
  let openingStarted = false;
  const music = document.getElementById('weddingAudio');
  const audioToggle = document.getElementById('audioToggle');
  const audioText = document.getElementById('audioText');
  music.volume = 0.48;
  music.addEventListener('ended', () => { audioText.textContent = 'MUSIC OFF'; });
  function setMusicButton() {
    const playing = !music.paused;
    audioToggle.setAttribute('aria-pressed', String(playing));
    audioToggle.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music');
    audioText.textContent = playing ? 'MUSIC ON' : 'MUSIC OFF';
    audioToggle.classList.toggle('paused', !playing);
  }
  audioToggle.addEventListener('click', () => {
    if (music.paused) music.play().then(setMusicButton).catch(setMusicButton);
    else { music.pause(); setMusicButton(); }
  });
  function enter() {
    if (openingStarted) return;
    openingStarted = true;
    audioToggle.hidden = false;
    music.currentTime = 0;
    music.play().then(setMusicButton).catch(() => {setMusicButton();});
    openButton.disabled = true;
    overlay.classList.add('is-opening');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const complete = () => {
      body.classList.add('entered');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.removeAttribute('aria-modal');
      overlay.setAttribute('inert', '');
      document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 150));
      setTimeout(() => document.querySelector('.brand').focus({preventScroll:true}), reducedMotion ? 0 : 900);
    };
    if (reducedMotion) {complete();return;}
    setTimeout(() => overlay.classList.add('is-entering'), 2050);
    setTimeout(complete, 2820);
  }
  openButton.addEventListener('click', enter);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
  }, {threshold:0.13, rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => observer.observe(el));
  menuButton.addEventListener('click', () => {
    const opened = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
  const destination = new Date('2026-11-12T19:00:00+02:00').getTime();
  const refs = Object.fromEntries(['days','hours','minutes','seconds'].map(k => [k, document.getElementById(k)]));
  function tick() {
    let remaining = Math.max(0, destination - Date.now());
    const secondsTotal = Math.floor(remaining / 1000);
    const values = {days: Math.floor(secondsTotal/86400),hours:Math.floor(secondsTotal/3600)%24, minutes:Math.floor(secondsTotal/60)%60,seconds:secondsTotal%60};
    for (const [key, value] of Object.entries(values)) {
      const next = String(value).padStart(2,'0');
      if (refs[key].textContent !== next) refs[key].textContent = next;
    }
    if (remaining === 0) document.getElementById('countdownMessage').textContent = 'Our special day is here!';
  }
  tick(); setInterval(tick,1000);
})();
