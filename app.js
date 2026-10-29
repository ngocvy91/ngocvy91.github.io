const envelope = document.querySelector('#envelope');
const letter = document.querySelector('#letter');
const openLetter = document.querySelector('#open-letter');
const musicToggle = document.querySelector('#music-toggle');
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
  letter.classList.add('show');
  window.setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'center' }), 520);
}

envelope.addEventListener('click', revealLetter);
openLetter.addEventListener('click', revealLetter);

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

let audioContext;
let musicTimer;
const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
function playNote(frequency, time) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.035, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(time);
  oscillator.stop(time + 1.15);
}
function startMusic() {
  audioContext = audioContext || new AudioContext();
  const schedule = () => {
    const now = audioContext.currentTime;
    notes.forEach((note, index) => playNote(note, now + index * .62));
  };
  schedule();
  musicTimer = window.setInterval(schedule, notes.length * 620);
  musicToggle.setAttribute('aria-pressed', 'true');
  musicToggle.setAttribute('aria-label', 'Tắt nhạc nền');
  musicToggle.querySelector('span').textContent = 'Tắt nhạc';
}
function stopMusic() {
  window.clearInterval(musicTimer);
  audioContext?.suspend();
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.setAttribute('aria-label', 'Bật nhạc nền');
  musicToggle.querySelector('span').textContent = 'Nhạc nền';
}
musicToggle.addEventListener('click', async () => {
  if (musicToggle.getAttribute('aria-pressed') === 'true') return stopMusic();
  if (audioContext?.state === 'suspended') await audioContext.resume();
  startMusic();
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
console.assert(envelope && letter && musicToggle && shareButton, 'Thiếu một điều khiển chính của trang');
