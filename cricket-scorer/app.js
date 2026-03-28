(() => {
  const $ = (id) => document.getElementById(id);
  const PASSCODE = 'sam110';

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
          $('lock-screen').classList.add('active');
        }, 500);
      }, 300);
    }
  }, 40);

  // ========== LOCK SCREEN ==========
  function tryUnlock() {
    const val = $('lockInput').value;
    if (val === PASSCODE) {
      $('lock-screen').classList.remove('active');
      $('setup-screen').classList.add('active');
    } else {
      $('lockError').textContent = 'Wrong passcode';
      $('lockInput').classList.add('shake');
      setTimeout(() => $('lockInput').classList.remove('shake'), 400);
      $('lockInput').value = '';
    }
  }

  $('lockBtn').addEventListener('click', tryUnlock);
  $('lockInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
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

  const setupScreen = $('setup-screen');
  const scoringScreen = $('scoring-screen');
  const summaryScreen = $('summary-screen');
  const historyScreen = $('history-screen');

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
    [setupScreen, scoringScreen, summaryScreen, historyScreen].forEach((s) => s.classList.remove('active'));
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

    if (d2.runs > d1.runs) {
      const wicketsLeft = maxWickets - d2.wickets;
      $('resultText').textContent = d2.team + ' won by ' + wicketsLeft + ' wickets';
    } else if (d1.runs > d2.runs) {
      const margin = d1.runs - d2.runs;
      $('resultText').textContent = d1.team + ' won by ' + margin + ' runs';
    } else {
      $('resultText').textContent = 'Match Tied!';
    }

    showScreen(summaryScreen);
  }

  function formatOvers(b) {
    return Math.floor(b / 6) + '.' + (b % 6);
  }

  // ========== RUN BUTTONS ==========
  document.querySelectorAll('.run-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const r = parseInt(btn.dataset.run);
      addBall(r.toString(), r === 4 ? 'four' : r === 6 ? 'six' : '', r, false, false);
    });
  });

  document.querySelector('.four-btn').addEventListener('click', () => {
    addBall('4', 'four', 4, false, false);
  });

  document.querySelector('.six-btn').addEventListener('click', () => {
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
    addBall('B', 'bye', 1, false, false);
  });

  $('legByeBtn').addEventListener('click', () => {
    addBall('LB', 'legbye', 1, false, false);
  });

  // Wicket
  $('wicketBtn').addEventListener('click', () => {
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
    showScreen(setupScreen);
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

  // ========== PWA SERVICE WORKER ==========
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
})();
