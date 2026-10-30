const envelope = document.querySelector('#envelope');
const letter = document.querySelector('#letter');
const openLetter = document.querySelector('#open-letter');
const closeLetter = document.querySelector('#close-letter');
const musicToggle = document.querySelector('#music-toggle');
const music = document.querySelector('#background-music');
const shareButton = document.querySelector('#share-button');
const toast = document.querySelector('#toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function revealLetter() {
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');
  letter.setAttribute('aria-hidden', 'false');
  letter.classList.add('show');
  closeLetter.focus();
}

function hideLetter() {
  letter.classList.remove('show');
  letter.setAttribute('aria-hidden', 'true');
  envelope.classList.remove('open');
  envelope.setAttribute('aria-expanded', 'false');
  openLetter.focus();
}

envelope.addEventListener('click', revealLetter);
openLetter.addEventListener('click', revealLetter);
closeLetter.addEventListener('click', hideLetter);
letter.addEventListener('click', (event) => { if (event.target === letter) hideLetter(); });
document.addEventListener('keydown', (event) => {
  if (!letter.classList.contains('show')) return;
  if (event.key === 'Escape') hideLetter();
  if (event.key === 'Tab') { event.preventDefault(); closeLetter.focus(); }
});

function populateEffects() {
  const petals = document.querySelector('.petal-field');
  const sparkles = document.querySelector('.sparkle-field');
  for (let i = 0; i < 18; i += 1) {
    const petal = document.createElement('i');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 8}s`;
    petal.style.animationDelay = `${-Math.random() * 14}s`;
    petal.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
    petals.appendChild(petal);
  }
  for (let i = 0; i < 16; i += 1) {
    const sparkle = document.createElement('i');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✦';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 90}%`;
    sparkle.style.animationDuration = `${1.8 + Math.random() * 2.8}s`;
    sparkle.style.animationDelay = `${-Math.random() * 3}s`;
    sparkles.appendChild(sparkle);
  }
}

async function startMusic() {
  music.volume = 0.8;
  try { await music.play(); } catch { return; }
  musicToggle.setAttribute('aria-pressed', 'true');
  musicToggle.setAttribute('aria-label', 'Tắt nhạc nền');
  musicToggle.querySelector('span').textContent = 'Tắt nhạc';
}
function stopMusic() {
  music.pause();
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.setAttribute('aria-label', 'Bật nhạc nền');
  musicToggle.querySelector('span').textContent = 'Nhạc nền';
}
musicToggle.addEventListener('click', async () => {
  if (musicToggle.getAttribute('aria-pressed') === 'true') return stopMusic();
  await startMusic();
});

shareButton.addEventListener('click', async () => {
  const shareData = { title: document.title, text: 'Gửi người gieo nắng — lời chúc 20/11', url: window.location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(window.location.href); showToast('Đã sao chép đường link'); }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Chưa thể chia sẻ, vui lòng thử lại');
  }
});

populateEffects();
startMusic();
console.assert(envelope && letter && closeLetter && musicToggle && music && shareButton, 'Thiếu một điều khiển chính của trang');
