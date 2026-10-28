(function () {
  var MapData = window.TechPlusMap;
  var QuestionsData = window.TechPlusQuestions.QUESTIONS;

  var map = MapData.buildGrid();
  var TILE = map.tileSize;

  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');
  var VIEW_W = canvas.width;
  var VIEW_H = canvas.height;

  var WORLD_W = map.cols * TILE;
  var WORLD_H = map.rows * TILE;

  var ROOM_BY_ID = {};
  MapData.ROOMS.forEach(function (r) { ROOM_BY_ID[r.id] = r; });

  var player = {
    x: (map.spawn.x + 0.5) * TILE,
    y: (map.spawn.y + 0.5) * TILE,
    radius: 11,
    speed: 190,
    facing: 'down'
  };

  var keys = {};
  var justPressed = {};
  window.addEventListener('keydown', function (e) {
    var code = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE'].indexOf(code) !== -1) {
      e.preventDefault();
    }
    if (!keys[code]) justPressed[code] = true;
    keys[code] = true;
  });
  window.addEventListener('keyup', function (e) {
    keys[e.code] = false;
  });

  function isWalkable(tx, ty) {
    if (tx < 0 || tx >= map.cols || ty < 0 || ty >= map.rows) return false;
    var v = map.grid[ty][tx];
    return v === MapData.FLOOR || v === MapData.TERMINAL;
  }

  function canStandAt(px, py) {
    var r = player.radius;
    var pts = [
      [px - r, py - r], [px + r, py - r],
      [px - r, py + r], [px + r, py + r]
    ];
    for (var i = 0; i < pts.length; i++) {
      var tx = Math.floor(pts[i][0] / TILE);
      var ty = Math.floor(pts[i][1] / TILE);
      if (!isWalkable(tx, ty)) return false;
    }
    return true;
  }

  var state = {
    started: false,
    quizOpen: false,
    score: 0,
    badges: {},
    startTime: null,
    elapsed: 0,
    toast: null,
    toastTimer: 0,
    currentZone: null
  };

  MapData.ROOMS.forEach(function (r) { state.badges[r.id] = false; });

  function badgeCount() {
    var n = 0;
    for (var k in state.badges) if (state.badges[k]) n++;
    return n;
  }

  function showToast(text) {
    state.toast = text;
    state.toastTimer = 2.2;
  }

  function nearestTerminal() {
    var best = null;
    var bestDist = Infinity;
    for (var id in map.terminals) {
      var t = map.terminals[id];
      var cx = (t.x + 0.5) * TILE;
      var cy = (t.y + 0.5) * TILE;
      var dx = player.x - cx;
      var dy = player.y - cy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist) {
        bestDist = d;
        best = id;
      }
    }
    if (best && bestDist <= TILE * 1.3) return best;
    return null;
  }

  // ---------- Quiz UI ----------
  var quizModal = document.getElementById('quiz-modal');
  var quizDomain = document.getElementById('quiz-domain');
  var quizQuestion = document.getElementById('quiz-question');
  var quizChoices = document.getElementById('quiz-choices');
  var quizFeedback = document.getElementById('quiz-feedback');
  var quizContinue = document.getElementById('quiz-continue');

  var activeDomain = null;

  function pickQuestion(domainId) {
    var pool = QuestionsData[domainId];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function openQuiz(domainId) {
    if (state.badges[domainId]) {
      showToast('Badge already earned for ' + ROOM_BY_ID[domainId].name + '!');
      return;
    }
    activeDomain = domainId;
    state.quizOpen = true;
    var room = ROOM_BY_ID[domainId];
    var question = pickQuestion(domainId);
    quizDomain.textContent = room.name;
    quizDomain.style.color = room.color;
    quizQuestion.textContent = question.q;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    quizContinue.hidden = true;
    quizChoices.innerHTML = '';

    question.choices.forEach(function (choice, idx) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', function () {
        handleAnswer(idx, question, domainId);
      });
      quizChoices.appendChild(btn);
    });

    quizModal.hidden = false;
  }

  function handleAnswer(idx, question, domainId) {
    var buttons = quizChoices.querySelectorAll('.choice-btn');
    buttons.forEach(function (b) { b.disabled = true; });

    if (idx === question.correct) {
      buttons[idx].classList.add('correct');
      quizFeedback.textContent = 'Correct! ' + question.explain;
      quizFeedback.className = 'quiz-feedback correct';
      state.score += 100;
      state.badges[domainId] = true;
      updateHud();
    } else {
      buttons[idx].classList.add('wrong');
      buttons[question.correct].classList.add('correct');
      quizFeedback.textContent = 'Not quite. ' + question.explain;
      quizFeedback.className = 'quiz-feedback wrong';
    }
    quizContinue.hidden = false;
  }

  quizContinue.addEventListener('click', function () {
    quizModal.hidden = true;
    state.quizOpen = false;
    if (badgeCount() === MapData.ROOMS.length) {
      showWin();
    }
  });

  // ---------- HUD ----------
  var scoreEl = document.getElementById('hud-score');
  var timeEl = document.getElementById('hud-time');
  var badgeEls = {};
  var badgeRow = document.getElementById('badge-row');
  MapData.ROOMS.forEach(function (room) {
    var el = document.createElement('div');
    el.className = 'badge-dot';
    el.title = room.name;
    el.textContent = room.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    el.style.borderColor = room.color;
    badgeEls[room.id] = el;
    badgeRow.appendChild(el);
  });

  function updateHud() {
    scoreEl.textContent = 'Score: ' + state.score;
    MapData.ROOMS.forEach(function (room) {
      var el = badgeEls[room.id];
      if (state.badges[room.id]) {
        el.classList.add('earned');
        el.style.background = room.color;
      } else {
        el.classList.remove('earned');
        el.style.background = 'transparent';
      }
    });
  }

  // ---------- Start / Win screens ----------
  var startScreen = document.getElementById('start-screen');
  var winScreen = document.getElementById('win-screen');
  var winSummary = document.getElementById('win-summary');
  var startBtn = document.getElementById('start-btn');
  var playAgainBtn = document.getElementById('play-again-btn');

  startBtn.addEventListener('click', function () {
    startScreen.hidden = true;
    state.started = true;
    state.startTime = performance.now();
    requestAnimationFrame(loop);
  });

  playAgainBtn.addEventListener('click', function () {
    window.location.reload();
  });

  function showWin() {
    winSummary.textContent = 'Final score: ' + state.score + ' | Time: ' + formatTime(state.elapsed);
    winScreen.hidden = false;
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ---------- Game loop ----------
  var lastTime = null;

  function update(dt) {
    state.elapsed += dt;
    timeEl.textContent = 'Time: ' + formatTime(state.elapsed);

    if (state.toastTimer > 0) {
      state.toastTimer -= dt;
      if (state.toastTimer <= 0) state.toast = null;
    }

    if (state.quizOpen) return;

    var dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
    if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      var len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
      if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
      else player.facing = dy > 0 ? 'down' : 'up';

      var moveX = dx * player.speed * dt;
      var moveY = dy * player.speed * dt;

      if (canStandAt(player.x + moveX, player.y)) player.x += moveX;
      if (canStandAt(player.x, player.y + moveY)) player.y += moveY;
    }

    player.x = Math.max(player.radius, Math.min(WORLD_W - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(WORLD_H - player.radius, player.y));

    var tx = Math.floor(player.x / TILE);
    var ty = Math.floor(player.y / TILE);
    var zone = map.zoneGrid[ty] ? map.zoneGrid[ty][tx] : null;
    if (zone && zone !== state.currentZone && zone !== 'corridor') {
      state.currentZone = zone;
      if (zone === 'hub') {
        showToast('Central Hub');
      } else {
        showToast('Entering: ' + ROOM_BY_ID[zone].name);
      }
    }

    if (justPressed['KeyE'] || justPressed['Space']) {
      var termId = nearestTerminal();
      if (termId) openQuiz(termId);
    }
    justPressed = {};
  }

  function worldToScreen(wx, wy, camX, camY) {
    return [wx - camX, wy - camY];
  }

  function render() {
    var camX = Math.max(0, Math.min(WORLD_W - VIEW_W, player.x - VIEW_W / 2));
    var camY = Math.max(0, Math.min(WORLD_H - VIEW_H, player.y - VIEW_H / 2));

    ctx.fillStyle = '#10141c';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    var startCol = Math.floor(camX / TILE);
    var endCol = Math.ceil((camX + VIEW_W) / TILE);
    var startRow = Math.floor(camY / TILE);
    var endRow = Math.ceil((camY + VIEW_H) / TILE);

    for (var ty = startRow; ty < endRow; ty++) {
      for (var tx = startCol; tx < endCol; tx++) {
        if (ty < 0 || ty >= map.rows || tx < 0 || tx >= map.cols) continue;
        var v = map.grid[ty][tx];
        var screenX = tx * TILE - camX;
        var screenY = ty * TILE - camY;
        var zone = map.zoneGrid[ty][tx];

        if (v === MapData.WALL) {
          ctx.fillStyle = '#232a36';
          ctx.fillRect(screenX, screenY, TILE, TILE);
        } else {
          var floorColor = '#1a2230';
          if (zone && zone !== 'hub' && zone !== 'corridor') {
            floorColor = shadeColor(ROOM_BY_ID[zone].color, -75);
          } else if (zone === 'hub') {
            floorColor = '#2b3344';
          }
          ctx.fillStyle = floorColor;
          ctx.fillRect(screenX, screenY, TILE, TILE);
          ctx.strokeStyle = 'rgba(255,255,255,0.03)';
          ctx.strokeRect(screenX, screenY, TILE, TILE);

          if (v === MapData.TERMINAL) {
            var domainId = zone;
            var earned = state.badges[domainId];
            ctx.fillStyle = earned ? '#3ddc84' : (ROOM_BY_ID[domainId] ? ROOM_BY_ID[domainId].color : '#fff');
            ctx.fillRect(screenX + 4, screenY + 4, TILE - 8, TILE - 8);
            ctx.fillStyle = '#10141c';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(earned ? '✓' : '?', screenX + TILE / 2, screenY + TILE / 2);
          }
        }
      }
    }

    // Room labels (drawn once near top of each room, only if visible).
    MapData.ROOMS.forEach(function (room) {
      var labelX = (room.x + room.w / 2) * TILE - camX;
      var labelY = room.y * TILE - camY - 6;
      if (labelX < -100 || labelX > VIEW_W + 100 || labelY < -20 || labelY > VIEW_H + 20) return;
      ctx.fillStyle = room.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, labelX, labelY);
    });

    // Player
    var px = player.x - camX;
    var py = player.y - camY;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(px, py, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10141c';
    var dirOffset = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[player.facing];
    ctx.beginPath();
    ctx.arc(px + dirOffset[0] * 6, py + dirOffset[1] * 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Toast
    if (state.toast) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, state.toastTimer);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      var textWidth = ctx.measureText(state.toast).width;
      ctx.font = 'bold 16px sans-serif';
      textWidth = ctx.measureText(state.toast).width;
      ctx.fillRect(VIEW_W / 2 - textWidth / 2 - 14, 16, textWidth + 28, 32);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.toast, VIEW_W / 2, 32);
      ctx.restore();
    }

    // Interact prompt
    if (!state.quizOpen) {
      var termId = nearestTerminal();
      if (termId && !state.badges[termId]) {
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press E to answer a ' + ROOM_BY_ID[termId].name + ' question', VIEW_W / 2, VIEW_H - 20);
      }
    }
  }

  function shadeColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.max(0, Math.min(255, (num >> 16) + percent));
    var g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
    var b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function loop(now) {
    if (lastTime === null) lastTime = now;
    var dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    render();
    if (state.started) requestAnimationFrame(loop);
  }

  updateHud();
  render();
})();
