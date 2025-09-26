// ======= Game Logic & Interactions =======

// ======= Game State =======
let deck = [];
let hand = []; // Todas as cartas ficam na hand, algumas são locked
let round = 1;
let maxRounds = GAME_CONFIG.maxRounds;
let rerolls = GAME_CONFIG.initialRerolls;
let timer = GAME_CONFIG.roundTimer;
let tHandle = null;
let youScore = 0;
let botScore = 0;
let currentTurn = 'player'; // 'player' or 'opponent'
let gamePhase = 'playing'; // 'playing', 'opponent_turn', 'player_turn'
let playerReady = false; // Controla se o jogador está pronto para começar o round

// ======= Helper Functions =======
function shuffle(a) {
   for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
   }
   return a;
}

// ======= Sound System =======
function playSound(soundName) {
   // TODO: Implementar sistema de som
   // Você pode usar Web Audio API ou Audio objects
   // Exemplo:
   // const audio = new Audio(`sounds/${soundName}.mp3`);
   // audio.play().catch(e => console.log('Audio play failed:', e));

   console.log(`🎵 Playing sound: ${soundName}`);
   // Sugestões de sons para implementar:
   // - card_flip: virar carta
   // - card_lock: travar/destravar carta
   // - roll_dice: rolar dados/cartas
   // - player_turn: vez do jogador
   // - opponent_turn: vez do oponente
   // - victory: vitória
   // - defeat: derrota
   // - level_up: subir de nível
   // - button_click: clique em botão
}

// ======= Progress Management =======
function loadPlayerProgress() {
   const progress = JSON.parse(localStorage.getItem('engo_progress') || '{}');
   return {
      totalGames: progress.totalGames || 0,
      totalWins: progress.totalWins || 0,
      totalLosses: progress.totalLosses || 0,
      currentStreak: progress.currentStreak || 0,
      defeatedOpponents: progress.defeatedOpponents || [],
      unlockedOpponents: progress.unlockedOpponents || ['beginner', 'student']
   };
}

function savePlayerProgress(progress) {
   localStorage.setItem('engo_progress', JSON.stringify(progress));
}

function saveGameResult(didWin, opponentId) {
   const progress = loadPlayerProgress();

   progress.totalGames++;

   if (didWin) {
      progress.totalWins++;
      progress.currentStreak++;
      if (!progress.defeatedOpponents.includes(opponentId)) {
         progress.defeatedOpponents.push(opponentId);
      }
   } else {
      progress.totalLosses++;
      progress.currentStreak = 0;
   }

   savePlayerProgress(progress);
}

function freshDeck(level) {
   const lvls = levelOrder(level); // include <= selected
   let availableWords = WORDS.filter(x => lvls.includes(x.lvl));

   // Remover cartas que já foram usadas hoje
   const today = new Date().toDateString();
   const usedCards = JSON.parse(localStorage.getItem('engo_used_cards_' + today) || '[]');

   availableWords = availableWords.filter(word => !usedCards.includes(word.w));

   // Se não há cartas suficientes, resetar as usadas hoje
   if (availableWords.length < GAME_CONFIG.handSize * 2) {
      localStorage.removeItem('engo_used_cards_' + today);
      availableWords = WORDS.filter(x => lvls.includes(x.lvl));
   }

   return shuffle(availableWords).slice();
}

function markCardAsUsed(card) {
   const today = new Date().toDateString();
   const usedCards = JSON.parse(localStorage.getItem('engo_used_cards_' + today) || '[]');

   if (!usedCards.includes(card.w)) {
      usedCards.push(card.w);
      localStorage.setItem('engo_used_cards_' + today, JSON.stringify(usedCards));
   }
}

// ======= Turn Management =======
function setPlayerTurn() {
   currentTurn = 'player';
   gamePhase = 'player_turn';

   // Visual indicators
   document.querySelector('.center-panel').classList.add('player-turn-overlay', 'turn-transition');
   document.querySelector('.center-panel').classList.remove('opponent-turn-overlay');

   document.querySelector('.left-panel').classList.add('player-turn', 'turn-transition');
   document.querySelector('.left-panel').classList.remove('opponent-turn');

   document.querySelector('.controls').classList.remove('controls-disabled');

   // Som de turno do jogador
   playSound('player_turn');
}

function setOpponentTurn() {
   currentTurn = 'opponent';
   gamePhase = 'opponent_turn';

   // Visual indicators
   document.querySelector('.center-panel').classList.add('opponent-turn-overlay', 'turn-transition');
   document.querySelector('.center-panel').classList.remove('player-turn-overlay');

   document.querySelector('.right-panel').classList.add('opponent-turn', 'turn-transition');
   document.querySelector('.right-panel').classList.remove('player-turn');

   document.querySelector('.controls').classList.add('controls-disabled');

   // Som de turno do oponente
   playSound('opponent_turn');
}

function showTurnModal(turnType, callback) {
   const overlay = el('div', 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 fade-in');
   overlay.innerHTML = `
      <div class="bg-game-panel-gradient border border-game-border rounded-2xl p-8 shadow-game text-center max-w-md mx-4 turn-modal">
      <div class="flex flex-col items-center justify-center">
         <div class="text-6xl mb-4">${turnType === 'player' ? '🎯' : '🤖'}</div>
         <h2 class="text-2xl font-black text-game-text mb-2">
            ${turnType === 'player' ? 'Sua Vez!' : 'Vez do Oponente!'}
         </h2>
         <p class="text-game-muted">
            ${turnType === 'player' ? 'Faça sua jogada!' : 'O oponente está pensando...'}
         </p>
         </div>
      </div>
   `;

   document.body.appendChild(overlay);

   // Som do modal de turno
   playSound('turn_modal');

   setTimeout(() => {
      overlay.remove();
      if (callback) callback();
   }, 3000);
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
let handEl, playerCombosEl, opponentCombosEl;

function initializeDOM() {
   handEl = q('#hand');
   playerCombosEl = q('#playerCombos');
   opponentCombosEl = q('#opponentCombos');
}

// ======= UI Rendering =======
function renderCards() {
   handEl.innerHTML = '';
   hand.forEach((c, i) => handEl.appendChild(cardEl(c, i, c.locked || false)));
   updatePlayerCombos();
   updateOpponentCombos();
}

function animateCardDraw(cardElement, index) {
   // Animação de virar carta do deck
   cardElement.classList.add('card-drawing');

   // Posiciona a carta inicialmente no deck
   const deckRect = q('#deck').getBoundingClientRect();
   const handRect = handEl.getBoundingClientRect();

   cardElement.style.position = 'fixed';
   cardElement.style.left = deckRect.left + 'px';
   cardElement.style.top = deckRect.top + 'px';
   cardElement.style.zIndex = '1000';
   cardElement.style.transform = 'rotateY(180deg) scale(0.8)';

   // Anima para a posição final na mão
   setTimeout(() => {
      const finalLeft = handRect.left + (index * 120) + 'px';
      const finalTop = handRect.top + 'px';

      cardElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      cardElement.style.left = finalLeft;
      cardElement.style.top = finalTop;
      cardElement.style.transform = 'rotateY(0deg) scale(1) rotateZ(0deg)';

      // Remove estilos temporários após animação
      setTimeout(() => {
         cardElement.style.position = '';
         cardElement.style.left = '';
         cardElement.style.top = '';
         cardElement.style.zIndex = '';
         cardElement.style.transition = '';
         cardElement.style.transform = '';
         cardElement.classList.remove('card-drawing');
         cardElement.classList.add('card-flip'); // Adiciona animação de flip final
      }, 300);
   }, 100);
}

function renderCardsWithAnimation(newCards = []) {
   handEl.innerHTML = '';

   hand.forEach((c, i) => {
      const cardElement = cardEl(c, i, c.locked || false);
      handEl.appendChild(cardElement);

      // Anima apenas cartas novas que não estão locked
      const isNewCard = newCards.some(newCard => newCard.w === c.w && newCard.pos === c.pos);
      if (isNewCard && !c.locked) {
         animateCardDraw(cardElement, i);
      }
   });

   updatePlayerCombos();
   updateOpponentCombos();
}

function cardEl(card, idx, isLocked) {
   const wrap = el('div', 'card animate-deal-in w-28 h-40 relative');
   wrap.draggable = !isLocked; // Cartas travadas não podem ser arrastadas
   wrap.dataset.locked = isLocked ? 1 : 0;
   wrap.dataset.index = idx;

   wrap.addEventListener('dragstart', ev => {
      if (isLocked) {
         ev.preventDefault(); // Impede drag de cartas travadas
         return;
      }
      ev.dataTransfer.setData('text/plain', JSON.stringify({ locked: isLocked, idx }));
      wrap.classList.add('opacity-75');
   });

   wrap.addEventListener('dragend', () => wrap.classList.remove('opacity-75'));
   wrap.addEventListener('click', () => toggleLock(idx));

   // Design de carta de baralho
   const inner = el('div', 'inner absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-lg p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105');

   // Efeito visual de carta travada
   if (isLocked) {
      inner.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'ring-offset-game-bg');
      inner.style.filter = 'brightness(1.1) saturate(1.2)';

      // Ícone de cadeado
      const lockIcon = el('div', 'absolute top-1 right-1 text-yellow-600 text-lg font-bold');
      lockIcon.textContent = '🔒';
      lockIcon.style.filter = 'drop-shadow(0 0 2px rgba(0,0,0,0.5))';
      inner.appendChild(lockIcon);
   }

   // Parte superior - tipo gramatical e nível
   const header = el('div', 'flex justify-between items-start mb-2');
   const top = el('div', 'tag text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded');
   top.textContent = POS_LABEL[card.pos] || card.pos;
   header.appendChild(top);

   const lvl = el('div', 'level text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded');
   lvl.textContent = card.lvl;
   header.appendChild(lvl);
   inner.appendChild(header);

   // Centro - símbolo representativo do tipo gramatical + emote
   const symbolContainer = el('div', 'flex-1 flex items-center justify-center mb-2 relative');
   const symbol = el('div', 'text-5xl opacity-40 absolute inset-0 flex items-center justify-center z-0');
   symbol.textContent = getPosSymbol(card.pos);
   const emote = el('div', 'text-2xl opacity-70 z-10 relative');
   emote.textContent = getPosEmote(card.pos);
   symbolContainer.appendChild(symbol);
   symbolContainer.appendChild(emote);
   inner.appendChild(symbolContainer);

   // Parte inferior - palavra
   const wordContainer = el('div', 'text-center');
   const word = el('div', 'word text-lg font-black text-gray-800 leading-tight');
   word.textContent = card.w;
   wordContainer.appendChild(word);
   inner.appendChild(wordContainer);

   wrap.appendChild(inner);

   return wrap;
}

function getPosSymbol(pos) {
   const symbols = {
      'noun': '🌟',      // Estrela para substantivos
      'verb': '🚀',      // Foguete para verbos
      'adj': '💎',      // Diamante para adjetivos
      'adv': '⚡',      // Raio para advérbios
      'pron': '👑',     // Coroa para pronomes
      'prep': '🌈',     // Arco-íris para preposições
      'conj': '🔥',     // Fogo para conjunções
      'interjection': '💥' // Explosão para interjeições
   };
   return symbols[pos] || '❓';
}

function getPosEmote(pos) {
   const emotes = {
      'noun': '😊',      // Rostinho alegre para substantivos
      'verb': '😎',      // Óculos escuros para verbos
      'adj': '🤩',      // Olhos de estrela para adjetivos
      'adv': '😜',      // Língua de fora para advérbios
      'pron': '🥰',     // Apaixonado para pronomes
      'prep': '😉',     // Piscadinha para preposições
      'conj': '🤪',     // Maluco para conjunções
      'interjection': '😱' // Surpreso para interjeições
   };
   return emotes[pos] || '🙂';
}

// ======= Drag & Drop =======
function setupDragAndDrop() {
   // Drag and drop foi removido - agora usamos apenas double-click para travar/destravar cartas
   // O sistema antigo movia cartas entre containers, agora elas ficam travadas no lugar
}

function toggleLock(idx) {
   hand[idx].locked = !hand[idx].locked;
   renderCards();

   // Som de travar/destravar carta
   playSound('card_lock_toggle');
}

// ======= Combos Sidebar =======
function filteredObjectives() {
   const lv = q('#level').value;
   return OBJECTIVES.filter(o => o.levels.includes(lv));
}

function updateCombos(containerEl, cards, isPlayer = true) {
   const objs = filteredObjectives();
   containerEl.innerHTML = '';

   objs.forEach(o => {
      const ok = o.req(cards);
      const p = o.prog(cards);

      const box = el('div', 'combo bg-game-panel border border-game-border rounded-xl p-2.5 mb-2.5');

      const head = el('div', 'combo-head flex justify-between gap-2 font-bold');

      const title = el('div', 'text-game-text cursor-help');
      title.textContent = o.label;
      title.title = o.tooltip || '';  // Tooltip nativo do browser

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
      containerEl.appendChild(box);
   });
}

function updatePlayerCombos() {
   const playerCards = hand.filter(card => !card.locked); // Apenas cartas não travadas contam para combos
   updateCombos(playerCombosEl, playerCards, true);
}

function updateOpponentCombos() {
   // Por enquanto, oponente tem cartas aleatórias simuladas
   // Isso será melhorado quando implementarmos a lógica do oponente
   const opponentCards = draw(5); // Simula 5 cartas do oponente
   updateCombos(opponentCombosEl, opponentCards, false);
}

// ======= Game Flow =======
function startRound() {
   rerolls = GAME_CONFIG.initialRerolls;
   timer = GAME_CONFIG.roundTimer;
   playerReady = false;
   updateHUD();
   deck = freshDeck(q('#level').value);
   hand = draw(GAME_CONFIG.handSize);

   // Marcar cartas iniciais como usadas hoje
   hand.forEach(card => markCardAsUsed(card));

   renderCardsWithAnimation(hand); // Anima todas as cartas iniciais
   enableActions(true);
   showReadyButton(); // Mostra botão "Estou Pronto" ao invés de iniciar timer

   // Começar com turno do jogador
   setPlayerTurn();
   showTurnModal('player');
}

function enableActions(play) {
   q('#btnRoll').disabled = !play || !playerReady;
   q('#btnSubmit').disabled = !play || !playerReady;
}

function updateHUD() {
   q('#round').textContent = round;
   q('#rerolls').textContent = rerolls;
   q('#timer').textContent = playerReady ? `⏳ ${timer}s` : '⏸️ Aguardando...';
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

function showReadyButton() {
   // Criar overlay com botão "Estou Pronto"
   const overlay = el('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ready-overlay');

   const modal = el('div', 'bg-game-panel-gradient border border-game-border rounded-2xl p-8 shadow-game text-center max-w-md mx-4');

   const title = el('h3', 'text-2xl font-bold text-game-text mb-4');
   title.textContent = `Rodada ${round}`;

   const message = el('p', 'text-game-muted mb-6');
   message.textContent = currentTurn === 'player' ?
      'Suas cartas foram distribuídas! Clique quando estiver pronto para iniciar o cronômetro.' :
      'Aguarde ambos os jogadores ficarem prontos...';

   const readyBtn = el('button', 'px-6 py-3 bg-game-accent-gradient text-game-bg font-bold rounded-xl hover:scale-105 transition-transform');
   readyBtn.textContent = '🚀 Estou Pronto!';

   readyBtn.addEventListener('click', () => {
      playerReady = true;
      document.body.removeChild(overlay);
      enableActions(true); // Reabilita ações agora que está pronto
      startTimer(); // Inicia o timer
      playSound('player_ready');
   });

   modal.appendChild(title);
   modal.appendChild(message);
   modal.appendChild(readyBtn);
   overlay.appendChild(modal);
   document.body.appendChild(overlay);
}

function roll() {
   if (rerolls <= 0) return;

   // Substituir apenas cartas não travadas
   const newHand = [];
   const newCards = [];

   hand.forEach(card => {
      if (card.locked) {
         newHand.push(card); // Manter carta travada
      } else {
         // Precisamos de uma nova carta aqui
         if (deck.length > 0) {
            const newCard = deck.pop();
            newHand.push(newCard);
            newCards.push(newCard);
         } else {
            // Se não há cartas no deck, manter a carta existente
            newHand.push(card);
         }
      }
   });

   hand = newHand;
   rerolls--;
   updateHUD();

   // Renderizar com animação das novas cartas
   renderCardsWithAnimation(newCards);

   // Marcar cartas novas como usadas hoje
   newCards.forEach(card => markCardAsUsed(card));

   if (rerolls <= 0) {
      q('#btnRoll').disabled = true;
   }

   // Som de rolar cartas
   playSound('card_roll');
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

   // Calcular pontuação do jogador
   const all = hand.filter(card => !card.locked); // Apenas cartas não travadas contam
   const { total, hits } = scoreFor(all);
   youScore += total;
   q('#youScore').textContent = youScore;

   // Toast-like feedback
   const msg = `Você marcou +${total} (${hits.join(', ') || 'sem objetivos'}).`;
   flash(msg);

   // Passar para turno do oponente
   setOpponentTurn();
   showTurnModal('opponent', () => {
      // Simular turno do oponente
      simulateOpponentTurn();
   });
}

function simulateOpponentTurn() {
   // Simular tempo de pensamento do oponente
   setTimeout(() => {
      const bot = simulateBot();
      botScore += bot;
      q('#botScore').textContent = botScore;

      // Toast-like feedback
      const msg = `Oponente marcou +${bot}.`;
      flash(msg);

      // Voltar para turno do jogador
      setTimeout(() => {
         if (round >= maxRounds) {
            endGame();
         } else {
            round++;
            startRound();
         }
      }, 2000);
   }, 2000); // Simular 2 segundos de "pensamento"
}

function endGame() {
   const didWin = youScore > botScore;
   const isDraw = youScore === botScore;

   // Salvar resultado no progresso
   const selectedOpponent = JSON.parse(localStorage.getItem('engo_selected_opponent') || '{}');
   if (selectedOpponent.id) {
      saveGameResult(didWin, selectedOpponent.id);
   }

   // Mostrar modal de resultado
   showGameResultModal(didWin, isDraw, youScore, botScore);
}

function showGameResultModal(didWin, isDraw, playerScore, opponentScore) {
   const modal = el('div', 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 fade-in');
   modal.innerHTML = `
      <div class="bg-game-panel-gradient border border-game-border rounded-2xl p-8 shadow-game text-center max-w-md mx-4 result-modal">
         <div class="text-6xl mb-4">
            ${isDraw ? '🤝' : didWin ? '🏆' : '😿'}
         </div>
         <h2 class="text-3xl font-black text-game-text mb-2">
            ${isDraw ? 'Empate!' : didWin ? 'Vitória!' : 'Derrota!'}
         </h2>
         <div class="text-xl text-game-muted mb-6">
            ${isDraw ? 'Foi um jogo equilibrado!' : didWin ? 'Parabéns! Você venceu!' : 'Não desanime! Tente novamente!'}
         </div>

         <div class="scores bg-game-panel border border-game-border rounded-xl p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
               <div class="text-center">
                  <div class="text-lg font-bold text-game-text">Você</div>
                  <div class="text-3xl font-black ${didWin ? 'text-game-good' : 'text-game-muted'}">${playerScore}</div>
               </div>
               <div class="text-center">
                  <div class="text-lg font-bold text-game-text">Oponente</div>
                  <div class="text-3xl font-black ${!didWin && !isDraw ? 'text-game-bad' : 'text-game-muted'}">${opponentScore}</div>
               </div>
            </div>
         </div>

         <div class="flex gap-3">
            <button id="btnPlayAgain" class="flex-1 btn appearance-none border-0 bg-game-btn-gradient text-game-text-4 rounded-xl px-4 py-3 font-bold cursor-pointer shadow-game transition-all duration-200 hover:opacity-90">
               🎮 Jogar Novamente
            </button>
            <button id="btnBackToHub" class="flex-1 btn appearance-none border-0 bg-game-panel text-game-text-2 rounded-xl px-4 py-3 font-semibold cursor-pointer shadow-game transition-all duration-200 hover:bg-game-panel-2">
               🏠 Voltar ao Hub
            </button>
         </div>
      </div>
   `;

   document.body.appendChild(modal);

   // Animação de fade in
   setTimeout(() => modal.classList.add('opacity-100'), 100);

   // Event listeners
   modal.querySelector('#btnPlayAgain').addEventListener('click', () => {
      playSound('button_click');
      modal.remove();
      resetGame();
   });

   modal.querySelector('#btnBackToHub').addEventListener('click', () => {
      playSound('button_click');
      window.location.href = '/';
   });

   // Som de vitória/derrota
   playSound(isDraw ? 'draw' : didWin ? 'victory' : 'defeat');
}

function resetGame() {
   round = 1;
   youScore = 0;
   botScore = 0;
   q('#youScore').textContent = 0;
   q('#botScore').textContent = 0;
   startRound();
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
   q('#btnBackToHub').addEventListener('click', () => {
      playSound('button_click');
      window.location.href = '/';
   });
   q('#btnRoll').addEventListener('click', () => {
      playSound('button_click');
      roll();
   });
   q('#btnSubmit').addEventListener('click', () => {
      playSound('button_click');
      submit();
   });
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

// ======= Multiplayer Preparation (WebSocket) =======
/*
// Estrutura preparada para implementação futura de multiplayer com WebSocket
// Quando implementar, substitua o código atual por este sistema

let ws = null;
let gameRoom = null;
let isHost = false;

function initializeWebSocket() {
   // TODO: Implementar conexão WebSocket
   // ws = new WebSocket('ws://localhost:8080');
   // ws.onmessage = handleWebSocketMessage;
   // ws.onclose = handleDisconnect;
}

function handleWebSocketMessage(event) {
   const data = JSON.parse(event.data);

   switch(data.type) {
      case 'game_start':
         // Iniciar jogo multiplayer
         break;
      case 'opponent_move':
         // Processar movimento do oponente
         break;
      case 'game_end':
         // Finalizar jogo
         break;
   }
}

function sendWebSocketMessage(type, payload) {
   if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload, room: gameRoom }));
   }
}

function createGameRoom() {
   // TODO: Implementar criação de sala
   gameRoom = 'room_' + Date.now();
   isHost = true;
   // sendWebSocketMessage('create_room', { roomId: gameRoom });
}

function joinGameRoom(roomId) {
   // TODO: Implementar entrada em sala
   gameRoom = roomId;
   isHost = false;
   // sendWebSocketMessage('join_room', { roomId });
}

function sendGameMove(moveData) {
   // TODO: Enviar movimento para o oponente
   // sendWebSocketMessage('game_move', moveData);
}

// Para usar multiplayer futuramente:
// 1. Implementar servidor WebSocket (Node.js + ws ou Socket.io)
// 2. Descomentar as funções acima
// 3. Modificar submit() para enviar movimentos via WebSocket
// 4. Modificar startRound() para esperar sinal do servidor
// 5. Adicionar UI para criar/entrar em salas
*/

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', initializeGame);
} else {
   initializeGame();
}
