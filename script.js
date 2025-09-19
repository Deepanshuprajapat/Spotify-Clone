// Simple Spotify-like interactions (educational demo)
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const seek = document.getElementById('seek');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');
const cards = document.getElementById('cards');
const cards2 = document.getElementById('cards2');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerCover = document.getElementById('playerCover');

// Demo tracks (royalty-free samples)
const demoTracks = [
  {
    title: 'SoundHelix Song 1',
    artist: 'T. Schürger',
    cover: '🎼',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'SoundHelix Song 2',
    artist: 'T. Schürger',
    cover: '🎶',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'SoundHelix Song 3',
    artist: 'T. Schürger',
    cover: '🎷',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    title: 'SoundHelix Song 4',
    artist: 'T. Schürger',
    cover: '🎸',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    title: 'SoundHelix Song 5',
    artist: 'T. Schürger',
    cover: '🥁',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    title: 'SoundHelix Song 6',
    artist: 'T. Schürger',
    cover: '🎻',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
];

// Duplicate subset for second row
const demoTracks2 = demoTracks.slice(0,4).map((t,i) => ({...t, cover: '💿', title: t.title + ' (Remix)'}));

function formatTime(sec){
  if(!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function setPlayingUI(isPlaying){
  playIcon.style.display = isPlaying ? 'none' : 'block';
  pauseIcon.style.display = isPlaying ? 'block' : 'none';
}

function loadTrack(track){
  audio.src = track.src;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerCover.textContent = track.cover || '🎧';
  audio.play().catch(()=>{});
  setPlayingUI(true);
}

function cardTemplate(track){
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="thumb">${track.cover || '🎵'}</div>
    <div class="title">${track.title}</div>
    <div class="subtitle">${track.artist}</div>
    <div class="play-fab" title="Play">
      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    </div>
  `;
  el.addEventListener('click', ()=> loadTrack(track));
  return el;
}

function renderCards(container, list){
  container.innerHTML = '';
  list.forEach(t => container.appendChild(cardTemplate(t)));
}

renderCards(cards, demoTracks);
renderCards(cards2, demoTracks2);

// Controls
playPauseBtn.addEventListener('click', ()=>{
  if(audio.paused) audio.play();
  else audio.pause();
});

audio.addEventListener('play', ()=> setPlayingUI(true));
audio.addEventListener('pause', ()=> setPlayingUI(false));

audio.addEventListener('loadedmetadata', ()=>{
  durationEl.textContent = formatTime(audio.duration);
  seek.max = Math.floor(audio.duration) || 100;
});

audio.addEventListener('timeupdate', ()=>{
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if(!seek.dragging){
    seek.value = Math.floor(audio.currentTime);
  }
});

seek.addEventListener('input', ()=>{
  audio.currentTime = seek.value;
});

volume.addEventListener('input', ()=>{
  audio.volume = volume.value;
});

// Basic next/prev (cycles through demo list)
let currentIndex = 0;
function playIndex(i){
  const list = demoTracks;
  currentIndex = (i + list.length) % list.length;
  loadTrack(list[currentIndex]);
}
document.getElementById('nextBtn').addEventListener('click', ()=> playIndex(currentIndex+1));
document.getElementById('prevBtn').addEventListener('click', ()=> playIndex(currentIndex-1));

// Keyboard space toggles
document.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){
    e.preventDefault();
    if(audio.paused) audio.play(); else audio.pause();
  }
});

// Simple search filter
document.getElementById('searchInput').addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  const filtered = demoTracks.filter(t => (t.title + ' ' + t.artist).toLowerCase().includes(q));
  renderCards(cards, filtered.length ? filtered : demoTracks);
});

// Initial load
playIndex(0);
