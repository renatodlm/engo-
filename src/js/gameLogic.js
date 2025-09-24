// ======= Game Logic & Interactions =======

// ======= Game State =======
let deck = [];
let hand = [];
let hold = [];
let round = 1;
let maxRounds = GAME_CONFIG.maxRounds;
let rerolls = GAME_CONFIG.initialRerolls;
let timer = GAME_CONFIG.roundTimer;
let tHandle = null;
let youScore = 0;
let botScore = 0;

// ======= Helper Functions =======
function shuffle(a) {
   for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
   }
   return a;
}

function freshDeck(level) {
   const lvls = levelOrder(level); // include <= selected
   return shuffle(WORDS.filter(x => lvls.includes(x.lvl))).slice();
}

function levelOrder(level) {
   const order = ['A1', 'A2', 'B1', 'B2', 'C1'];
   const idx = order.indexOf(level);
   return order.slice(0, idx + 1);
}

function draw(n) {
   const out = [];
   while (n-- && deck.length) {
      out.push(deck.pop());
   }
   return out;
}

function count(arr, pos) {
   return arr.filter(c => c.pos === pos).length;
}

function bestOfSame(arr) {
   const m = byPOS(arr);
   return Math.max(...Object.values(m), 0);
}

function byPOS(arr) {
   const m = {};
   arr.forEach(c => m[c.pos] = (m[c.pos] || 0) + 1);
   return m;
}

function hasAtLeast(arr, k) {
   return bestOfSame(arr) >= k;
}

function distinctPOS(arr) {
   return Object.keys(byPOS(arr)).length;
}

function isFullHouse(arr) {
   const m = Object.values(byPOS(arr)).sort((a, b) => b - a);
   return m[0] === 3 && m[1] === 2;
}

function fullHouseProg(arr) {
   const m = Object.values(byPOS(arr)).sort((a, b) => b - a);
   const a = m[0] || 0;
   const b = m[1] || 0;
   return Math.min((Math.min(a, 3) + Math.min(b, 2)) / 5, 1);
}

function q(sel) {
   return document.querySelector(sel);
}

function el(tag, cls) {
   const e = document.createElement(tag);
   if (cls) e.className = cls;
   return e;
}

// ======= DOM Elements =======
let handEl, holdEl, combosEl;

function initializeDOM() {
   handEl = q('#hand');
   holdEl = q('#hold');
   combosEl = q('#combos');
}

// ======= UI Rendering =======
function renderCards() {
   [handEl, holdEl].forEach(z => z.innerHTML = '');
   hand.forEach((c, i) => handEl.appendChild(cardEl(c, i, false)));
   hold.forEach((c, i) => holdEl.appendChild(cardEl(c, i, true)));
   updateCombos();
}

function cardEl(card, idx, isHeld) {
   const wrap = el('div', 'card animate-deal-in w-28 h-40 relative');
   wrap.draggable = true;
   wrap.dataset.held = isHeld ? 1 : 0;
   wrap.dataset.index = idx;

   wrap.addEventListener('dragstart', ev => {
      ev.dataTransfer.setData('text/plain', JSON.stringify({ held: isHeld, idx }));
      wrap.classList.add('opacity-75');
   });

   wrap.addEventListener('dragend', () => wrap.classList.remove('opacity-75'));
   wrap.addEventListener('dblclick', () => toggleHold(isHeld, idx));

   const inner = el('div', 'inner absolute inset-0 bg-game-card-gradient rounded-2xl border border-game-border-2 shadow-game-card p-2.5 flex flex-col gap-1.5 transition-all duration-300 hover:shadow-game-card-hover');

   const top = el('div', 'tag text-xs font-bold text-game-text-3 opacity-90');
   top.textContent = POS_LABEL[card.pos] || card.pos;

   const word = el('div', 'word text-lg font-extrabold leading-tight text-game-text');
   word.textContent = card.w;

   const lvl = el('div', 'level mt-auto text-xs text-game-text-5 opacity-80');
   lvl.textContent = 'Nível ' + card.lvl;

   inner.appendChild(top);
   inner.appendChild(word);
   inner.appendChild(lvl);
   wrap.appendChild(inner);

   if (isHeld) {
      wrap.classList.add('outline-2', 'outline-game-accent', 'outline-offset-2', 'outline');
   }

   return wrap;
}

// ======= Drag & Drop =======
function setupDragAndDrop() {
   [handEl, holdEl].forEach(zone => {
      zone.addEventListener('dragover', ev => {
         ev.preventDefault();
         zone.classList.add('border-dashed', 'border-blue-400', 'rounded-xl', 'p-1.5');
      });

      zone.addEventListener('dragleave', () => {
         zone.classList.remove('border-dashed', 'border-blue-400', 'rounded-xl', 'p-1.5');
      });

      zone.addEventListener('drop', ev => {
         ev.preventDefault();
         zone.classList.remove('border-dashed', 'border-blue-400', 'rounded-xl', 'p-1.5');
         const data = JSON.parse(ev.dataTransfer.getData('text/plain'));
         moveCard(data.held, data.idx, zone === holdEl);
      });
   });
}

function moveCard(fromHeld, idx, toHeld) {
   if (fromHeld === toHeld) return;

   if (fromHeld) {
      const [c] = hold.splice(idx, 1);
      hand.push(c);
   } else {
      const [c] = hand.splice(idx, 1);
      hold.push(c);
   }

   renderCards();
}

function toggleHold(isHeld, idx) {
   moveCard(isHeld, idx, !isHeld);
}

// ======= Combos Sidebar =======
function filteredObjectives() {
   const lv = q('#level').value;
   return OBJECTIVES.filter(o => o.levels.includes(lv));
}

function updateCombos() {
   const objs = filteredObjectives();
   combosEl.innerHTML = '';
   const all = [...hand, ...hold];

   objs.forEach(o => {
      const ok = o.req(all);
      const p = o.prog(all);

      const box = el('div', 'combo bg-game-panel border border-game-border rounded-xl p-2.5 mb-2.5');

      const head = el('div', 'combo-head flex justify-between gap-2 font-bold');

      const title = el('div', 'text-game-text');
      title.textContent = o.label;

      const stat = el('div', 'text-sm');
      stat.innerHTML = ok ?
         `<span class="text-game-good">✓ pronto</span>` :
         `<small class="text-game-muted">${Math.round(p * 100)}%</small>`;

      head.appendChild(title);
      head.appendChild(stat);
      box.appendChild(head);

      const bar = el('div', 'bar h-2 bg-game-bg-4 border border-game-border-3 rounded-full mt-2 overflow-hidden');

      const fill = el('i', 'block h-full bg-game-progress-gradient transition-all duration-300');
      fill.style.width = (p * 100) + '%';

      bar.appendChild(fill);
      box.appendChild(bar);
      combosEl.appendChild(box);
   });
}

// ======= Game Flow =======
function startRound() {
   rerolls = GAME_CONFIG.initialRerolls;
   timer = GAME_CONFIG.roundTimer;
   updateHUD();
   deck = freshDeck(q('#level').value);
   hand = draw(GAME_CONFIG.handSize);
   hold = [];
   renderCards();
   enableActions(true);
   startTimer();
}

function enableActions(play) {
   q('#btnRoll').disabled = !play;
   q('#btnSubmit').disabled = !play;
}

function updateHUD() {
   q('#round').textContent = round;
   q('#rerolls').textContent = rerolls;
   q('#timer').textContent = `⏳ ${timer}s`;
}

function startTimer() {
   clearInterval(tHandle);
   tHandle = setInterval(() => {
      timer--;
      updateHUD();
      if (timer <= 0) {
         clearInterval(tHandle);
         submit();
      }
   }, 1000);
}

function roll() {
   if (rerolls <= 0) return;

   // replace non-held cards
   const keep = hold.slice();
   const need = GAME_CONFIG.handSize - keep.length;
   hand = draw(need);
   hold = keep;
   rerolls--;
   updateHUD();
   renderCards();

   if (rerolls <= 0) {
      q('#btnRoll').disabled = true;
   }
}

function scoreFor(arr) {
   const objs = filteredObjectives();
   let total = 0;
   let hits = [];

   objs.forEach(o => {
      if (o.req(arr)) {
         total += o.weight;
         hits.push(o.label);
      }
   });

   return { total, hits };
}

function simulateBot() {
   // Very simple bot: draws 5, pseudo-rerolls twice keeping best-of-same
   const d = freshDeck(q('#level').value);
   let h = d.splice(-GAME_CONFIG.handSize);
   let keptPOS = bestPOS(h);

   for (let r = 0; r < GAME_CONFIG.initialRerolls; r++) {
      const keep = h.filter(c => c.pos === keptPOS);
      const newOnes = d.splice(-(GAME_CONFIG.handSize - keep.length));
      h = [...keep, ...newOnes];
      keptPOS = bestPOS(h);
   }

   return scoreFor(h).total;
}

function bestPOS(h) {
   const m = byPOS(h);
   let bestKey = null;
   let bestVal = -1;

   Object.entries(m).forEach(([k, v]) => {
      if (v > bestVal) {
         bestVal = v;
         bestKey = k;
      }
   });

   return bestKey;
}

function submit() {
   enableActions(false);
   clearInterval(tHandle);

   const all = [...hand, ...hold];
   const { total, hits } = scoreFor(all);
   youScore += total;
   q('#youScore').textContent = youScore;

   // Bot
   const bot = simulateBot();
   botScore += bot;
   q('#botScore').textContent = botScore;

   // Toast-like feedback
   const msg = `Você marcou +${total} (${hits.join(', ') || 'sem objetivos'}). Oponente fez +${bot}.`;
   flash(msg);

   // advance
   setTimeout(() => {
      if (round >= maxRounds) {
         endGame();
      } else {
         round++;
         startRound();
      }
   }, 900);
}

function endGame() {
   const res = youScore === botScore ? 'Empate!' :
      (youScore > botScore ? 'Você venceu! 🏆' : 'Você perdeu 😿');
   flash(`Fim de jogo — ${res}  Placar ${youScore} x ${botScore}`);

   // reset for a new session
   round = 1;
   youScore = 0;
   botScore = 0;
   startRound();
   q('#youScore').textContent = 0;
   q('#botScore').textContent = 0;
}

function flash(text) {
   const n = el('div', 'fixed left-1/2 top-4 transform -translate-x-1/2 bg-game-bg-3 border border-game-border-2 px-3.5 py-2.5 rounded-xl shadow-game z-50 text-game-text');
   n.textContent = text;
   document.body.appendChild(n);

   setTimeout(() => {
      n.remove();
   }, 2000);
}

// ======= Event Listeners =======
function setupEventListeners() {
   q('#btnRoll').addEventListener('click', roll);
   q('#btnSubmit').addEventListener('click', submit);
   q('#level').addEventListener('change', () => {
      startRound();
   });
}

// ======= Initialization =======
function initializeGame() {
   initializeDOM();
   setupDragAndDrop();
   setupEventListeners();
   startRound();
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', initializeGame);
} else {
   initializeGame();
}
