// ============================================================
// Cricket Team Selector - App Logic
// ============================================================

const STORAGE_KEY = 'cricket_team_selector';

// State
let state = {
  players: [],
  teamA: [],
  teamB: [],
  captainA: null,
  captainB: null,
};

// Load state from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
      // Migration: ensure captain fields exist
      if (!('captainA' in state)) state.captainA = null;
      if (!('captainB' in state)) state.captainB = null;
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

// ============================================================
// Sample Data
// ============================================================
const SAMPLE_PLAYERS = [
  'Nafsal', 'Mahesh', 'Saji', 'Sufeek', 'Prasobh', 'Sam',
  'Vinu', 'Thafseel', 'Prasanth', 'Satheesan', 'Sufail', 'Bichi',
  'Babu', 'Kunjumon', 'Biju Annan', 'Jameer', 'Ani Kuru', 'Kaaku',
  'Ramees', 'Babu Kuru', 'Muthu Sadiq', 'Ani Soda', 'Aneesh Vnj', 'Jamshad'
];

// ============================================================
// DOM References
// ============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const teamAList = $('#team-a-list');
const teamBList = $('#team-b-list');
const teamACount = $('#team-a-count');
const teamBCount = $('#team-b-count');
const allPlayersList = $('#all-players-list');
const playerNameInput = $('#player-name');
const playerCountEl = $('#player-count');
const teamSubtitle = $('#team-subtitle');
const teamsContainer = $('#teams-container');
const emptyTeams = $('#empty-teams');
const emptyPlayers = $('#empty-players');
const dragHint = $('#drag-hint');
const clearAllBtn = $('#clear-all-btn');

// ============================================================
// Tab Navigation
// ============================================================
$$('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $(`#${tab}-tab`).classList.add('active');
  });
});

// ============================================================
// Render Players List (Players Tab)
// ============================================================
function renderPlayersList() {
  const count = state.players.length;
  playerCountEl.textContent = `${count} player${count !== 1 ? 's' : ''} added`;
  clearAllBtn.style.display = count > 0 ? '' : 'none';
  emptyPlayers.style.display = count > 0 ? 'none' : '';

  allPlayersList.innerHTML = '';
  state.players.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'all-player-item';
    li.innerHTML = `
      <span class="player-index">${i + 1}</span>
      <span class="player-name">${escapeHtml(name)}</span>
      <button class="action-btn delete" data-index="${i}" title="Remove">
        <span class="material-icons-round">close</span>
      </button>
    `;
    allPlayersList.appendChild(li);
  });

  // Delete handlers
  allPlayersList.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const removed = state.players.splice(idx, 1)[0];
      // Remove from teams if present
      state.teamA = state.teamA.filter(n => n !== removed);
      state.teamB = state.teamB.filter(n => n !== removed);
      if (state.captainA === removed) state.captainA = null;
      if (state.captainB === removed) state.captainB = null;
      saveState();
      renderPlayersList();
      renderTeams();
      showToast(`Removed ${removed}`);
    });
  });
}

// ============================================================
// Add Player
// ============================================================
$('#add-player-btn').addEventListener('click', addPlayer);
playerNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addPlayer();
});

function addPlayer() {
  const name = playerNameInput.value.trim();
  if (!name) {
    playerNameInput.focus();
    return;
  }
  if (state.players.some(p => p.toLowerCase() === name.toLowerCase())) {
    showToast('Player already exists!');
    return;
  }
  state.players.push(name);
  saveState();
  playerNameInput.value = '';
  playerNameInput.focus();
  renderPlayersList();

  // Animate last item
  const items = allPlayersList.querySelectorAll('.all-player-item');
  if (items.length > 0) {
    items[items.length - 1].classList.add('just-added');
  }
}

// ============================================================
// Load Sample Data
// ============================================================
$('#load-sample-btn').addEventListener('click', () => {
  if (state.players.length > 0) {
    if (!confirm('This will replace all current players. Continue?')) return;
  }
  state.players = [...SAMPLE_PLAYERS];
  state.teamA = [];
  state.teamB = [];
  state.captainA = null;
  state.captainB = null;
  saveState();
  renderPlayersList();
  renderTeams();
  showToast('24 players loaded!');
});

// ============================================================
// Clear All
// ============================================================
clearAllBtn.addEventListener('click', () => {
  if (!confirm('Remove all players?')) return;
  state.players = [];
  state.teamA = [];
  state.teamB = [];
  state.captainA = null;
  state.captainB = null;
  saveState();
  renderPlayersList();
  renderTeams();
  showToast('All cleared');
});

// ============================================================
// Shuffle Teams (Random)
// ============================================================
$('#shuffle-btn').addEventListener('click', shuffleTeams);

function shuffleTeams() {
  if (state.players.length < 2) {
    showToast('Add at least 2 players first');
    // Switch to players tab
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    $$('.nav-item')[1].classList.add('active');
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $('#players-tab').classList.add('active');
    return;
  }

  // Fisher-Yates shuffle
  const shuffled = [...state.players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const half = Math.ceil(shuffled.length / 2);
  state.teamA = shuffled.slice(0, half);
  state.teamB = shuffled.slice(half);

  // Auto-assign captains (first player in each team)
  state.captainA = state.teamA[0] || null;
  state.captainB = state.teamB[0] || null;

  saveState();
  renderTeams();
  showToast('Teams shuffled!');
  launchConfetti();
}

// ============================================================
// Render Teams
// ============================================================
function renderTeams() {
  const hasTeams = state.teamA.length > 0 || state.teamB.length > 0;
  teamsContainer.classList.toggle('visible', hasTeams);
  emptyTeams.style.display = hasTeams ? 'none' : '';
  dragHint.classList.toggle('visible', hasTeams);

  if (hasTeams) {
    teamSubtitle.textContent = `${state.teamA.length + state.teamB.length} players in 2 teams`;
  } else {
    teamSubtitle.textContent = 'Tap shuffle to create teams';
  }

  teamACount.textContent = state.teamA.length;
  teamBCount.textContent = state.teamB.length;

  renderTeamList(teamAList, state.teamA, 'a');
  renderTeamList(teamBList, state.teamB, 'b');
}

function renderTeamList(ul, players, team) {
  ul.innerHTML = '';
  const captain = team === 'a' ? state.captainA : state.captainB;

  players.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'player-item';
    li.draggable = true;
    li.dataset.player = name;
    li.dataset.team = team;

    const isCaptain = name === captain;

    li.innerHTML = `
      <span class="player-num">${i + 1}.</span>
      <span class="player-name">${escapeHtml(name)}</span>
      ${isCaptain ? `<span class="player-captain-badge">C</span>` : ''}
      <span class="drag-handle material-icons-round">drag_indicator</span>
    `;

    // Captain toggle on tap
    li.addEventListener('click', (e) => {
      if (e.target.closest('.drag-handle')) return;
      if (team === 'a') {
        state.captainA = state.captainA === name ? null : name;
      } else {
        state.captainB = state.captainB === name ? null : name;
      }
      saveState();
      renderTeams();
    });

    ul.appendChild(li);
  });

  setupDragAndDrop(ul, team);
}

// ============================================================
// Drag & Drop (Touch + Mouse)
// ============================================================
let dragState = null;

function setupDragAndDrop(ul, team) {
  const items = ul.querySelectorAll('.player-item');

  items.forEach(item => {
    // --- Touch Events ---
    let touchTimer = null;
    let isDragging = false;
    let ghost = null;

    item.addEventListener('touchstart', (e) => {
      touchTimer = setTimeout(() => {
        isDragging = true;
        const touch = e.touches[0];
        const name = item.dataset.player;
        const fromTeam = item.dataset.team;

        item.classList.add('dragging');

        // Create ghost element
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.textContent = name;
        ghost.style.left = `${touch.clientX - 80}px`;
        ghost.style.top = `${touch.clientY - 24}px`;
        document.body.appendChild(ghost);

        dragState = { name, fromTeam, ghost, item };

        // Vibrate if supported
        if (navigator.vibrate) navigator.vibrate(30);
      }, 300);
    }, { passive: true });

    item.addEventListener('touchmove', (e) => {
      if (!isDragging || !dragState) {
        clearTimeout(touchTimer);
        return;
      }
      e.preventDefault();

      const touch = e.touches[0];
      if (ghost) {
        ghost.style.left = `${touch.clientX - 80}px`;
        ghost.style.top = `${touch.clientY - 24}px`;
      }

      // Check which team card we're over
      const teamACard = $('#team-a-card');
      const teamBCard = $('#team-b-card');
      const aRect = teamACard.getBoundingClientRect();
      const bRect = teamBCard.getBoundingClientRect();

      teamACard.classList.remove('drop-active');
      teamBCard.classList.remove('drop-active');

      if (touch.clientY >= aRect.top && touch.clientY <= aRect.bottom) {
        if (dragState.fromTeam !== 'a') teamACard.classList.add('drop-active');
      } else if (touch.clientY >= bRect.top && touch.clientY <= bRect.bottom) {
        if (dragState.fromTeam !== 'b') teamBCard.classList.add('drop-active');
      }
    }, { passive: false });

    item.addEventListener('touchend', (e) => {
      clearTimeout(touchTimer);

      if (!isDragging || !dragState) {
        isDragging = false;
        return;
      }

      const touch = e.changedTouches[0];
      const teamACard = $('#team-a-card');
      const teamBCard = $('#team-b-card');
      const aRect = teamACard.getBoundingClientRect();
      const bRect = teamBCard.getBoundingClientRect();

      teamACard.classList.remove('drop-active');
      teamBCard.classList.remove('drop-active');

      let targetTeam = null;
      if (touch.clientY >= aRect.top && touch.clientY <= aRect.bottom && dragState.fromTeam !== 'a') {
        targetTeam = 'a';
      } else if (touch.clientY >= bRect.top && touch.clientY <= bRect.bottom && dragState.fromTeam !== 'b') {
        targetTeam = 'b';
      }

      if (targetTeam) {
        movePlayer(dragState.name, dragState.fromTeam, targetTeam);
      }

      // Cleanup
      if (ghost) ghost.remove();
      item.classList.remove('dragging');
      dragState = null;
      isDragging = false;
    });

    item.addEventListener('touchcancel', () => {
      clearTimeout(touchTimer);
      if (ghost) ghost.remove();
      item.classList.remove('dragging');
      dragState = null;
      isDragging = false;
      $('#team-a-card').classList.remove('drop-active');
      $('#team-b-card').classList.remove('drop-active');
    });

    // --- Mouse Drag Events (for desktop) ---
    item.addEventListener('dragstart', (e) => {
      const name = item.dataset.player;
      const fromTeam = item.dataset.team;
      e.dataTransfer.setData('text/plain', JSON.stringify({ name, fromTeam }));
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      $$('.team-card').forEach(c => c.classList.remove('drop-active'));
    });
  });

  // Drop zone for this team list
  const teamCard = ul.closest('.team-card');

  teamCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    teamCard.classList.add('drop-active');
  });

  teamCard.addEventListener('dragleave', (e) => {
    if (!teamCard.contains(e.relatedTarget)) {
      teamCard.classList.remove('drop-active');
    }
  });

  teamCard.addEventListener('drop', (e) => {
    e.preventDefault();
    teamCard.classList.remove('drop-active');

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.fromTeam !== team) {
        movePlayer(data.name, data.fromTeam, team);
      }
    } catch (err) {
      // ignore
    }
  });
}

function movePlayer(name, fromTeam, toTeam) {
  const fromArr = fromTeam === 'a' ? state.teamA : state.teamB;
  const toArr = toTeam === 'a' ? state.teamA : state.teamB;

  const idx = fromArr.indexOf(name);
  if (idx === -1) return;

  fromArr.splice(idx, 1);
  toArr.push(name);

  // Move captain along with player
  if (fromTeam === 'a' && state.captainA === name) {
    state.captainA = null;
  } else if (fromTeam === 'b' && state.captainB === name) {
    state.captainB = null;
  }

  saveState();
  renderTeams();
  showToast(`${name} moved to Team ${toTeam.toUpperCase()}`);
}

// ============================================================
// Share to WhatsApp
// ============================================================
$('#share-btn').addEventListener('click', shareTeams);

function shareTeams() {
  if (state.teamA.length === 0 && state.teamB.length === 0) {
    showToast('Shuffle teams first!');
    return;
  }

  // Build side-by-side text
  const maxRows = Math.max(state.teamA.length, state.teamB.length);

  // Find max width for Team A column
  const teamALines = [];
  const teamBLines = [];

  for (let i = 0; i < maxRows; i++) {
    if (i < state.teamA.length) {
      const cap = state.teamA[i] === state.captainA ? ' (c)' : '';
      teamALines.push(`${i + 1}. ${state.teamA[i]}${cap}`);
    } else {
      teamALines.push('');
    }
    if (i < state.teamB.length) {
      const cap = state.teamB[i] === state.captainB ? ' (c)' : '';
      teamBLines.push(`${i + 1}. ${state.teamB[i]}${cap}`);
    } else {
      teamBLines.push('');
    }
  }

  // Calculate padding for alignment
  const maxAWidth = Math.max(...teamALines.map(l => l.length), 'Team A'.length);

  let text = '*Sam Selector*\n\n';
  text += `${'*Team A*'.padEnd(maxAWidth + 4)}*Team B*\n`;
  text += `${''.padEnd(maxAWidth + 4, '-')}${''.padEnd(maxAWidth, '-')}\n`;

  for (let i = 0; i < maxRows; i++) {
    text += `${teamALines[i].padEnd(maxAWidth + 4)}${teamBLines[i]}\n`;
  }

  // Try native share first, fallback to WhatsApp URL
  if (navigator.share) {
    navigator.share({
      title: 'Sam Selector',
      text: text,
    }).catch(() => {
      openWhatsApp(text);
    });
  } else {
    openWhatsApp(text);
  }
}

function openWhatsApp(text) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

// ============================================================
// Toast
// ============================================================
let toastTimer = null;
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================================
// Utilities
// ============================================================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// Confetti Animation
// ============================================================
function launchConfetti() {
  const canvas = $('#confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#4fc3f7', '#ff8a65', '#7c4dff', '#66bb6a', '#ffd700', '#ef5350', '#b388ff', '#00e5ff'];
  const particles = [];
  const PARTICLE_COUNT = 120;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let startTime = Date.now();
  const DURATION = 3000;

  function animate() {
    const elapsed = Date.now() - startTime;
    if (elapsed > DURATION) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fadeStart = DURATION * 0.6;
    const globalAlpha = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (DURATION - fadeStart) : 1;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.rotation += p.rotSpeed;
      p.vx *= 0.99;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = globalAlpha * p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================
// Copy as Image (Canvas-based)
// ============================================================
$('#image-btn').addEventListener('click', generateTeamImage);

function generateTeamImage() {
  if (state.teamA.length === 0 && state.teamB.length === 0) {
    showToast('Shuffle teams first!');
    return;
  }

  const scale = 2; // Retina
  const cardW = 280;
  const gap = 24;
  const padding = 32;
  const headerH = 70;
  const rowH = 34;
  const maxRows = Math.max(state.teamA.length, state.teamB.length);
  const listH = maxRows * rowH + 16;
  const footerH = 40;
  const totalW = padding * 2 + cardW * 2 + gap;
  const totalH = padding + headerH + 20 + listH + 24 + footerH + padding;

  const canvas = document.createElement('canvas');
  canvas.width = totalW * scale;
  canvas.height = totalH * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, totalW, totalH);
  bgGrad.addColorStop(0, '#0f0f1a');
  bgGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 0, 0, totalW, totalH, 20);
  ctx.fill();

  // Title
  ctx.fillStyle = '#eeeef4';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sam Selector', totalW / 2, padding + 28);

  // Date
  ctx.fillStyle = '#8888aa';
  ctx.font = '12px Inter, sans-serif';
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  ctx.fillText(today, totalW / 2, padding + 48);

  // Draw Team Cards
  const cardY = padding + headerH;
  drawTeamCard(ctx, padding, cardY, cardW, listH, 'A', state.teamA, state.captainA, '#4fc3f7', 'rgba(79,195,247,0.08)', 'rgba(79,195,247,0.2)');
  drawTeamCard(ctx, padding + cardW + gap, cardY, cardW, listH, 'B', state.teamB, state.captainB, '#ff8a65', 'rgba(255,138,101,0.08)', 'rgba(255,138,101,0.2)');

  // VS divider
  ctx.fillStyle = '#2a2a4a';
  ctx.beginPath();
  ctx.arc(totalW / 2, cardY + listH / 2 + 20, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8888aa';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', totalW / 2, cardY + listH / 2 + 20);

  // Footer
  ctx.fillStyle = '#555570';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Sam Selector', totalW / 2, totalH - padding + 4);

  // Show preview
  showImagePreview(canvas);
}

function drawTeamCard(ctx, x, y, w, listH, label, players, captain, color, bgColor, borderColor) {
  const cardH = listH + 44;
  const r = 14;

  // Card background
  ctx.fillStyle = '#1a1a2e';
  roundRect(ctx, x, y, w, cardH, r);
  ctx.fill();

  // Card border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, cardH, r);
  ctx.stroke();

  // Team badge
  const badgeSize = 28;
  const badgeX = x + 12;
  const badgeY = y + 8;
  ctx.fillStyle = bgColor;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 7);
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 7);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

  // Team name
  ctx.fillStyle = '#eeeef4';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Team ${label}`, badgeX + badgeSize + 8, badgeY + badgeSize / 2);

  // Count
  ctx.fillStyle = '#8888aa';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${players.length}`, x + w - 14, badgeY + badgeSize / 2);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 42);
  ctx.lineTo(x + w - 12, y + 42);
  ctx.stroke();

  // Players
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  players.forEach((name, i) => {
    const rowY = y + 60 + i * 34;

    // Number
    ctx.fillStyle = '#8888aa';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`${i + 1}.`, x + 14, rowY);

    // Name
    ctx.fillStyle = '#eeeef4';
    ctx.font = '13px Inter, sans-serif';
    const maxNameW = name === captain ? w - 80 : w - 44;
    const truncated = truncateText(ctx, name, maxNameW);
    ctx.fillText(truncated, x + 34, rowY);

    // Captain badge
    if (name === captain) {
      const nameW = ctx.measureText(truncated).width;
      const bx = x + 34 + nameW + 6;
      const by = rowY - 10;
      ctx.fillStyle = bgColor;
      roundRect(ctx, bx, by, 18, 14, 3);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('C', bx + 9, rowY - 1);
      ctx.textAlign = 'left';
    }
  });
}

function truncateText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + '...').width > maxW) {
    t = t.slice(0, -1);
  }
  return t + '...';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function showImagePreview(canvas) {
  // Remove existing preview
  const existing = document.querySelector('.image-preview-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'image-preview-overlay';

  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');

  const actions = document.createElement('div');
  actions.className = 'image-preview-actions';

  // Download button
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'btn btn-primary';
  downloadBtn.innerHTML = '<span class="material-icons-round">download</span> Save';
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `cricket-teams-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image saved!');
    overlay.remove();
  });

  // Share button (mobile)
  const shareBtn = document.createElement('button');
  shareBtn.className = 'btn btn-share';
  shareBtn.innerHTML = '<span class="material-icons-round">share</span> Share';
  shareBtn.addEventListener('click', async () => {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'cricket-teams.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Cricket Teams' });
      } else {
        // Fallback: download
        downloadBtn.click();
      }
    } catch (e) {
      downloadBtn.click();
    }
    overlay.remove();
  });

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn-secondary';
  closeBtn.innerHTML = '<span class="material-icons-round">close</span> Close';
  closeBtn.addEventListener('click', () => overlay.remove());

  actions.appendChild(downloadBtn);
  actions.appendChild(shareBtn);
  actions.appendChild(closeBtn);

  overlay.appendChild(img);
  overlay.appendChild(actions);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

// ============================================================
// Splash Screen
// ============================================================
function initSplash() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  // Auto dismiss after 2.5s
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => splash.remove(), 500);
  }, 2500);

  // Also dismiss on tap
  splash.addEventListener('click', () => {
    splash.classList.add('fade-out');
    setTimeout(() => splash.remove(), 500);
  });
}

// ============================================================
// Initialize
// ============================================================
initSplash();
loadState();
renderPlayersList();
renderTeams();
