(() => {
  const $ = (id) => document.getElementById(id);

  // ========== SOUNDS ==========
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playBatSound(type) {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    if (type === 'dot') {
      // Soft thud - defensive shot
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'run') {
      // Clean bat hit
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator();
      const gain = ctx.createGain();
      const gain2 = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      noise.type = 'square';
      noise.frequency.setValueAtTime(1800, now);
      noise.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(ctx.destination);
      noise.connect(gain2).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      noise.start(now);
      noise.stop(now + 0.06);
    } else if (type === 'four') {
      // Solid boundary hit - crisp crack
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const gain2 = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(2500, now);
      osc2.frequency.exponentialRampToValueAtTime(500, now + 0.06);
      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      osc2.start(now);
      osc2.stop(now + 0.07);
    } else if (type === 'six') {
      // Big hit - deep powerful crack + ring
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();
      const gain2 = ctx.createGain();
      const gain3 = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(3000, now);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      // Ring/echo after the hit
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(600, now + 0.05);
      osc3.frequency.exponentialRampToValueAtTime(400, now + 0.4);
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.linearRampToValueAtTime(0.15, now + 0.06);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);
      osc3.connect(gain3).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      osc2.start(now);
      osc2.stop(now + 0.09);
      osc3.start(now + 0.05);
      osc3.stop(now + 0.45);
    } else if (type === 'wicket') {
      // Stumps hit - sharp knock + rattling
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const gain2 = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(800, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.35);
    } else if (type === 'extra') {
      // Short blip for extras
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // ========== SPLASH SCREEN ==========
  let splashProgress = 0;
  const splashInterval = setInterval(() => {
    splashProgress += 2;
    $('splashBarFill').style.width = splashProgress + '%';
    if (splashProgress >= 100) {
      clearInterval(splashInterval);
      setTimeout(() => {
        $('splash-screen').classList.add('hidden');
        setTimeout(() => {
          $('splash-screen').style.display = 'none';
          $('toss-screen').classList.add('active');
        }, 500);
      }, 300);
    }
  }, 40);

  // ========== TOSS SCREEN ==========
  let coinFlipping = false;
  const coinFlipSound = new Audio('coin_flip.mp3');

  function playCoinSound() {
    coinFlipSound.currentTime = 0;
    coinFlipSound.play().catch(() => {});
  }

  function flipCoin() {
    if (coinFlipping) return;
    coinFlipping = true;

    const wrapper = $('coinWrapper');
    const result = Math.random() < 0.5 ? 'head' : 'tail';

    // Reset
    wrapper.classList.remove('tossing-head', 'tossing-tail');
    $('tossResult').textContent = '';
    $('tossResult').classList.remove('show');

    // Force reflow
    void wrapper.offsetWidth;

    // Apply animation
    wrapper.classList.add(result === 'head' ? 'tossing-head' : 'tossing-tail');

    // Play coin sound
    playCoinSound();

    setTimeout(() => {
      $('tossResult').textContent = result === 'head' ? 'HEADS!' : 'TAILS!';
      $('tossResult').classList.add('show');
      $('tossSkipBtn').textContent = 'Continue to match setup \u2192';
      coinFlipping = false;
    }, 2000);
  }

  $('coinArea').addEventListener('click', flipCoin);

  $('tossSkipBtn').addEventListener('click', () => {
    $('toss-screen').classList.remove('active');
    $('setup-screen').classList.add('active');
  });

  // ========== STATE ==========
  let maxOvers = 20;
  let playersPerTeam = 12;
  let maxWickets = 11;
  let teams = ['Team A', 'Team B'];
  let innings = 0;
  let runs = 0;
  let wickets = 0;
  let balls = 0;
  let totalExtras = 0;
  let history = [];
  let overBalls = [];
  let inningsData = [];

  // overHistory[innings] = [ { overNum, balls: [{label, cls, runs}], overRuns, scoreAfter } ]
  let overHistory = [[], []];
  let currentOverLog = [];

  const tossScreen = $('toss-screen');
  const setupScreen = $('setup-screen');
  const scoringScreen = $('scoring-screen');
  const summaryScreen = $('summary-screen');
  const historyScreen = $('history-screen');
  const winnerScreen = $('winner-screen');

  // ========== SETUP ==========
  document.querySelectorAll('.over-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.over-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      $('totalOvers').value = btn.dataset.overs;
    });
  });

  $('totalOvers').addEventListener('input', () => {
    document.querySelectorAll('.over-btn').forEach((b) => b.classList.remove('selected'));
  });

  document.querySelectorAll('.player-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.player-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  $('startBtn').addEventListener('click', () => {
    const t1 = $('team1').value.trim() || 'Team A';
    const t2 = $('team2').value.trim() || 'Team B';
    teams = [t1, t2];
    maxOvers = Math.max(1, parseInt($('totalOvers').value) || 20);
    const selectedPlayerBtn = document.querySelector('.player-btn.selected');
    playersPerTeam = selectedPlayerBtn ? parseInt(selectedPlayerBtn.dataset.players) : 12;
    maxWickets = playersPerTeam - 1;
    startInnings();
  });

  function showScreen(screen) {
    [tossScreen, setupScreen, scoringScreen, summaryScreen, historyScreen, winnerScreen].forEach((s) => s.classList.remove('active'));
    screen.classList.add('active');
  }

  function startInnings() {
    runs = 0;
    wickets = 0;
    balls = 0;
    totalExtras = 0;
    history = [];
    overBalls = [];
    overHistory[innings] = [];
    currentOverLog = [];

    $('inningsLabel').textContent = innings === 0 ? '1st Innings' : '2nd Innings';
    $('battingTeam').textContent = teams[innings];
    $('maxOvers').textContent = maxOvers;
    updateDisplay();
    showScreen(scoringScreen);

    if (innings === 1) {
      updateChaseInfo();
    } else {
      $('targetInfo').textContent = '';
    }
  }

  function updateDisplay() {
    $('totalRuns').textContent = runs;
    $('totalWickets').textContent = wickets;
    $('currentOvers').textContent = Math.floor(balls / 6) + '.' + (balls % 6);
    $('extras').textContent = totalExtras;

    const overs = balls / 6;
    $('runRate').textContent = overs > 0 ? (runs / overs).toFixed(2) : '0.00';

    renderBallTrack();

    if (innings === 1) {
      updateChaseInfo();
    }
  }

  function updateChaseInfo() {
    const target = inningsData[0].runs + 1;
    const need = target - runs;
    const ballsLeft = (maxOvers * 6) - balls;

    if (need <= 0) {
      $('targetInfo').textContent = 'Target achieved!';
      return;
    }

    const oversLeft = Math.floor(ballsLeft / 6) + '.' + (ballsLeft % 6);
    let info = 'Need ' + need + ' runs from ' + ballsLeft + ' balls (' + oversLeft + ' ov)';

    if (ballsLeft > 0) {
      const reqRR = (need / (ballsLeft / 6)).toFixed(2);
      info += '  |  RRR: ' + reqRR;
    }

    $('targetInfo').textContent = info;
  }

  function renderBallTrack() {
    const track = $('ballTrack');
    track.innerHTML = '';
    overBalls.forEach((b) => {
      const el = document.createElement('span');
      el.className = 'ball ' + b.cls;
      el.textContent = b.label;
      track.appendChild(el);
    });
    track.parentElement.scrollLeft = track.scrollWidth;
  }

  function addBall(label, cls, runsScored, isExtra, isWicket) {
    const legalBall = !isExtra;

    history.push({
      runs,
      wickets,
      balls,
      totalExtras,
      overBalls: [...overBalls],
      currentOverLog: [...currentOverLog],
    });

    runs += runsScored;
    if (isExtra) totalExtras += runsScored;
    if (isWicket) wickets++;
    if (legalBall) balls++;

    overBalls.push({ label, cls });
    currentOverLog.push({ label, cls, runs: runsScored });

    if (legalBall && balls % 6 === 0) {
      // Save completed over
      const overNum = balls / 6;
      const overRuns = currentOverLog.reduce((s, b) => s + b.runs, 0);
      overHistory[innings].push({
        overNum,
        balls: [...currentOverLog],
        overRuns,
        scoreAfter: runs + '/' + wickets,
      });
      currentOverLog = [];

      setTimeout(() => {
        overBalls = [];
        renderBallTrack();
      }, 800);
    }

    updateDisplay();
    checkInningsEnd();
  }

  function checkInningsEnd() {
    const allOut = wickets >= maxWickets;
    const oversUp = balls >= maxOvers * 6;
    const chaseWon = innings === 1 && runs >= inningsData[0].runs + 1;

    if (allOut || oversUp || chaseWon) {
      setTimeout(() => endInnings(), 500);
    }
  }

  function endInnings() {
    // Save any incomplete over
    if (currentOverLog.length > 0) {
      const overNum = Math.floor(balls / 6) + (balls % 6 > 0 ? Math.floor((balls - 1) / 6) + 1 : balls / 6);
      const overRuns = currentOverLog.reduce((s, b) => s + b.runs, 0);
      overHistory[innings].push({
        overNum: overHistory[innings].length + 1,
        balls: [...currentOverLog],
        overRuns,
        scoreAfter: runs + '/' + wickets,
      });
      currentOverLog = [];
    }

    inningsData[innings] = {
      runs,
      wickets,
      balls,
      team: teams[innings],
    };

    if (innings === 0) {
      innings = 1;
      startInnings();
    } else {
      showSummary();
    }
  }

  function showSummary() {
    const d1 = inningsData[0];
    const d2 = inningsData[1];

    $('sumTeam1').textContent = d1.team;
    $('sumScore1').textContent = d1.runs + '/' + d1.wickets;
    $('sumOvers1').textContent = formatOvers(d1.balls) + ' overs';

    $('sumTeam2').textContent = d2.team;
    $('sumScore2').textContent = d2.runs + '/' + d2.wickets;
    $('sumOvers2').textContent = formatOvers(d2.balls) + ' overs';

    let resultMsg;
    let winnerName;
    if (d2.runs > d1.runs) {
      const wicketsLeft = maxWickets - d2.wickets;
      resultMsg = d2.team + ' won by ' + wicketsLeft + ' wickets';
      winnerName = d2.team;
    } else if (d1.runs > d2.runs) {
      const margin = d1.runs - d2.runs;
      resultMsg = d1.team + ' won by ' + margin + ' runs';
      winnerName = d1.team;
    } else {
      resultMsg = 'Match Tied!';
      winnerName = null;
    }

    $('resultText').textContent = resultMsg;

    // Show winner celebration first, then summary
    if (winnerName) {
      showWinnerCelebration(winnerName, () => {
        showScreen(summaryScreen);
      });
    } else {
      showScreen(summaryScreen);
    }
  }

  function showWinnerCelebration(teamName, callback) {
    $('winnerTeamText').textContent = teamName;

    // Clear old confetti
    const confettiContainer = $('winnerConfetti');
    confettiContainer.innerHTML = '';

    showScreen(winnerScreen);

    // Spawn confetti
    const colors = ['#f1c40f', '#e74c3c', '#4f8cff', '#2ecc71', '#fff', '#f39c12', '#9b59b6'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'winner-confetti-piece';
      piece.style.background = colors[i % colors.length];
      piece.style.left = Math.random() * 100 + '%';
      piece.style.top = -10 + 'px';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDelay = (Math.random() * 2) + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      confettiContainer.appendChild(piece);
    }

    // Transition to summary after celebration
    setTimeout(() => {
      callback();
    }, 3500);
  }

  function formatOvers(b) {
    return Math.floor(b / 6) + '.' + (b % 6);
  }

  // ========== RUN BUTTONS ==========
  document.querySelectorAll('.run-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const r = parseInt(btn.dataset.run);
      playBatSound(r === 0 ? 'dot' : 'run');
      addBall(r.toString(), r === 4 ? 'four' : r === 6 ? 'six' : '', r, false, false);
    });
  });

  document.querySelector('.four-btn').addEventListener('click', () => {
    playBatSound('four');
    addBall('4', 'four', 4, false, false);
  });

  document.querySelector('.six-btn').addEventListener('click', () => {
    playBatSound('six');
    showSixCelebration();
    addBall('6', 'six', 6, false, false);
  });

  // SIX celebration
  function showSixCelebration() {
    const overlay = document.createElement('div');
    overlay.className = 'six-celebration';

    const bg = document.createElement('div');
    bg.className = 'six-celebration-bg';
    overlay.appendChild(bg);

    const text = document.createElement('div');
    text.className = 'six-celebration-text';
    text.textContent = 'SIX!';
    overlay.appendChild(text);

    const colors = ['#f1c40f', '#f39c12', '#fff', '#4f8cff', '#e74c3c'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'six-particle';
      p.style.background = colors[i % colors.length];
      const angle = (i / 20) * 360;
      const distance = 120 + Math.random() * 160;
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.animation = 'particleFly 0.8s ease-out forwards';
      p.style.transform = 'translate(0, 0)';
      setTimeout(() => {
        p.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.7s ease-out';
        p.style.transform = `translate(${x}px, ${y}px) scale(0.3)`;
        p.style.opacity = '0';
      }, 30);
      overlay.appendChild(p);
    }

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1600);
  }

  // ========== EXTRAS POPUP ==========
  let pendingExtraType = null;

  function openExtraPopup(type) {
    pendingExtraType = type;
    const label = type === 'wide' ? 'Wide' : 'No Ball';
    $('popupTitle').textContent = label + ' - Runs off this ball?';
    $('extraPopup').classList.add('active');
  }

  function closeExtraPopup() {
    pendingExtraType = null;
    $('extraPopup').classList.remove('active');
  }

  document.querySelectorAll('.popup-run-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const extraRuns = parseInt(btn.dataset.extraRun);
      const type = pendingExtraType;
      const prefix = type === 'wide' ? 'WD' : 'NB';
      const cls = type === 'wide' ? 'wide' : 'noball';
      const totalRuns = 1 + extraRuns;

      let label = prefix;
      if (extraRuns > 0) label = prefix + '+' + extraRuns;

      let ballCls = cls;
      if (extraRuns === 4) ballCls = cls + ' four';
      if (extraRuns >= 5) ballCls = cls + ' six';

      playBatSound('extra');
      addBall(label, ballCls, totalRuns, true, false);
      closeExtraPopup();
    });
  });

  $('popupCancel').addEventListener('click', closeExtraPopup);

  $('extraPopup').addEventListener('click', (e) => {
    if (e.target === $('extraPopup')) closeExtraPopup();
  });

  // Extras
  $('wideBtn').addEventListener('click', () => openExtraPopup('wide'));
  $('noBallBtn').addEventListener('click', () => openExtraPopup('noball'));

  $('byeBtn').addEventListener('click', () => {
    playBatSound('extra');
    addBall('B', 'bye', 1, false, false);
  });

  $('legByeBtn').addEventListener('click', () => {
    playBatSound('extra');
    addBall('LB', 'legbye', 1, false, false);
  });

  // Wicket
  $('wicketBtn').addEventListener('click', () => {
    playBatSound('wicket');
    addBall('W', 'wicket', 0, false, true);
  });

  // Undo
  $('undoBtn').addEventListener('click', () => {
    if (history.length === 0) return;
    const prev = history.pop();
    runs = prev.runs;
    wickets = prev.wickets;
    balls = prev.balls;
    totalExtras = prev.totalExtras;
    overBalls = prev.overBalls;
    currentOverLog = prev.currentOverLog;
    // If we undo past a completed over, remove it from history
    while (overHistory[innings].length > 0 && overHistory[innings][overHistory[innings].length - 1].overNum > Math.floor(balls / 6)) {
      overHistory[innings].pop();
    }
    updateDisplay();
  });

  // End Innings
  $('endInningsBtn').addEventListener('click', () => {
    if (confirm('End this innings?')) {
      endInnings();
    }
  });

  // New Match
  $('newMatchBtn').addEventListener('click', () => {
    innings = 0;
    inningsData = [];
    overHistory = [[], []];
    currentOverLog = [];
    // Reset coin
    const wrapper = $('coinWrapper');
    wrapper.classList.remove('tossing-head', 'tossing-tail');
    $('tossResult').textContent = '';
    $('tossResult').classList.remove('show');
    $('tossSkipBtn').textContent = 'Skip, go to match setup \u2192';
    coinFlipping = false;
    showScreen(tossScreen);
  });

  // ========== HISTORY ==========
  let historyViewInnings = 0;

  $('historyBtn').addEventListener('click', () => {
    historyViewInnings = innings;
    renderHistory();
    showScreen(historyScreen);
  });

  $('historyBackBtn').addEventListener('click', () => {
    showScreen(scoringScreen);
  });

  document.querySelectorAll('.history-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.history-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      historyViewInnings = parseInt(tab.dataset.innings);
      renderHistory();
    });
  });

  function renderHistory() {
    const list = $('historyList');
    const overs = overHistory[historyViewInnings];

    // Update tab labels
    $('histTab1').textContent = teams[0] || '1st Innings';
    $('histTab2').textContent = teams[1] || '2nd Innings';

    // Include current incomplete over if viewing the active innings
    let allOvers = [...overs];
    if (historyViewInnings === innings && currentOverLog.length > 0) {
      allOvers.push({
        overNum: allOvers.length + 1,
        balls: [...currentOverLog],
        overRuns: currentOverLog.reduce((s, b) => s + b.runs, 0),
        scoreAfter: runs + '/' + wickets,
        inProgress: true,
      });
    }

    if (allOvers.length === 0) {
      list.innerHTML = '<div class="history-no-data">No overs bowled yet</div>';
      return;
    }

    list.innerHTML = allOvers.map((ov) => {
      const ballsHtml = ov.balls.map((b) =>
        '<span class="ball ' + b.cls + '">' + b.label + '</span>'
      ).join('');

      const label = ov.inProgress ? 'Over ' + ov.overNum + ' (in progress)' : 'Over ' + ov.overNum;

      return '<div class="history-over">' +
        '<div class="history-over-header">' +
          '<span class="history-over-num">' + label + '</span>' +
          '<span class="history-over-runs">' + ov.overRuns + ' runs</span>' +
          '<span class="history-over-score">' + ov.scoreAfter + '</span>' +
        '</div>' +
        '<div class="history-balls">' + ballsHtml + '</div>' +
      '</div>';
    }).join('');
  }

  // ========== MODE TOGGLE ==========
  const manualModeBtn = $('manualModeBtn');
  const voiceModeBtn = $('voiceModeBtn');
  const manualPanel = $('manualPanel');
  const voicePanel = $('voicePanel');

  manualModeBtn.addEventListener('click', () => {
    manualModeBtn.classList.add('active');
    voiceModeBtn.classList.remove('active');
    manualPanel.style.display = '';
    voicePanel.style.display = 'none';
    stopVoiceListening();
  });

  voiceModeBtn.addEventListener('click', () => {
    voiceModeBtn.classList.add('active');
    manualModeBtn.classList.remove('active');
    manualPanel.style.display = 'none';
    voicePanel.style.display = '';
  });

  // ========== VOICE SCORING ==========
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  const voiceMicBtn = $('voiceMicBtn');
  const voiceStatus = $('voiceStatus');
  const voiceResult = $('voiceResult');

  // Word-to-action mapping
  const VOICE_MAP = {
    // Runs
    'zero': 0, '0': 0, 'dot': 0, 'no run': 0, 'duck': 0,
    'one': 1, '1': 1, 'single': 1,
    'two': 2, '2': 2, 'double': 2,
    'three': 3, '3': 3, 'triple': 3,
    'four': 4, '4': 4, 'boundary': 4,
    'five': 5, '5': 5,
    'six': 6, '6': 6, 'sixer': 6, 'maximum': 6,
    // Special
    'wide': 'wide',
    'no ball': 'noball', 'noball': 'noball', 'no-ball': 'noball',
    'wicket': 'wicket', 'out': 'wicket', 'bowled': 'wicket',
  };

  function parseVoiceCommand(text) {
    const t = text.toLowerCase().trim();

    // Try exact match first
    if (VOICE_MAP[t] !== undefined) return VOICE_MAP[t];

    // Try partial matches
    for (const [key, val] of Object.entries(VOICE_MAP)) {
      if (t.includes(key)) return val;
    }

    return null;
  }

  function executeVoiceCommand(command) {
    if (typeof command === 'number') {
      if (command === 4) {
        playBatSound('four');
        addBall('4', 'four', 4, false, false);
        showVoiceResult('FOUR!', 'success');
      } else if (command === 6) {
        playBatSound('six');
        showSixCelebration();
        addBall('6', 'six', 6, false, false);
        showVoiceResult('SIX!', 'success');
      } else {
        playBatSound(command === 0 ? 'dot' : 'run');
        addBall(command.toString(), '', command, false, false);
        showVoiceResult(command === 0 ? 'DOT' : '+' + command, 'success');
      }
    } else if (command === 'wide') {
      playBatSound('extra');
      addBall('WD', 'wide', 1, true, false);
      showVoiceResult('WIDE', 'success');
    } else if (command === 'noball') {
      playBatSound('extra');
      addBall('NB', 'noball', 1, true, false);
      showVoiceResult('NO BALL', 'success');
    } else if (command === 'wicket') {
      playBatSound('wicket');
      addBall('W', 'wicket', 0, false, true);
      showVoiceResult('WICKET!', 'success');
    }
  }

  function showVoiceResult(text, type) {
    voiceResult.textContent = text;
    voiceResult.className = 'voice-result ' + type;
    setTimeout(() => {
      voiceResult.textContent = '';
      voiceResult.className = 'voice-result';
    }, 1500);
  }

  function startVoiceListening() {
    if (!SpeechRecognition) {
      voiceStatus.textContent = 'Voice not supported on this device';
      return;
    }

    // Force cleanup any previous session
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
      recognition = null;
    }

    isListening = true;
    let gotResult = false;

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.continuous = false;

    voiceMicBtn.classList.add('listening');
    voiceStatus.textContent = 'Listening...';

    recognition.onresult = (event) => {
      gotResult = true;
      let matched = false;
      for (let i = 0; i < event.results[0].length; i++) {
        const transcript = event.results[0][i].transcript;
        const command = parseVoiceCommand(transcript);
        if (command !== null) {
          executeVoiceCommand(command);
          matched = true;
          break;
        }
      }
      if (!matched) {
        const heard = event.results[0][0].transcript;
        showVoiceResult('"' + heard + '" ?', 'error');
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return;
      if (event.error === 'no-speech') {
        voiceStatus.textContent = 'No speech heard. Tap mic again';
      } else if (event.error === 'not-allowed') {
        voiceStatus.textContent = 'Mic permission denied. Check settings';
      } else if (event.error === 'network') {
        voiceStatus.textContent = 'Network error. Check connection';
      } else {
        voiceStatus.textContent = 'Error: ' + event.error + '. Tap mic again';
      }
    };

    recognition.onend = () => {
      isListening = false;
      recognition = null;
      voiceMicBtn.classList.remove('listening');
      if (gotResult) {
        setTimeout(() => {
          voiceStatus.textContent = 'Tap mic to speak';
        }, 1200);
      } else {
        // If no result and no error message was set, reset status
        setTimeout(() => {
          if (voiceStatus.textContent === 'Listening...') {
            voiceStatus.textContent = 'Tap mic to speak';
          }
        }, 500);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      isListening = false;
      voiceMicBtn.classList.remove('listening');
      voiceStatus.textContent = 'Could not start mic. Tap again';
      recognition = null;
    }
  }

  function stopVoiceListening() {
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
      recognition = null;
    }
    isListening = false;
    voiceMicBtn.classList.remove('listening');
    voiceStatus.textContent = 'Tap mic to speak';
  }

  // Simple tap to start - recognition auto-stops after speech ends
  voiceMicBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isListening) {
      // Tap again while listening = stop
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
    } else {
      startVoiceListening();
    }
  });

  // Prevent context menu on long press
  voiceMicBtn.addEventListener('contextmenu', (e) => e.preventDefault());

  // ========== PWA SERVICE WORKER ==========
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
})();
