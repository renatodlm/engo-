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
let readyShownThisRound = false; // Controla se já mostrou o botão ready nesta rodada
let isFirstRound = true; // Controla se é a primeira rodada
let selectedObjectives = new Set(); // Objetivos que o jogador selecionou para usar

// ======= Large Tooltip System (Reutilizável) =======
let activeTooltip = null;
let tooltipPinned = false;
let tooltipHover = false;

// ======= Componentes Reutilizáveis =======
function createButton(text, type = 'primary', size = 'md', icon = null) {
   const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
   };

   const typeClasses = {
      primary: 'bg-game-accent-gradient text-game-bg font-bold hover:scale-105',
      secondary: 'bg-game-panel border border-game-border text-game-text hover:border-game-accent',
      success: 'bg-green-600 text-white hover:bg-green-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'bg-transparent border border-game-border text-game-text hover:bg-game-panel'
   };

   const button = el('button', `${sizeClasses[size]} ${typeClasses[type]} rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`);

   if (icon) {
      button.innerHTML = `${icon} ${text}`;
   } else {
      button.textContent = text;
   }

   return button;
}

function createModal(title, content, actions = []) {
   const overlay = el('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4');
   const modal = el('div', 'bg-game-panel border border-game-border rounded-2xl max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300');

   // Header
   const header = el('div', 'p-6 border-b border-game-border');
   const titleEl = el('h3', 'text-xl font-bold text-game-text');
   titleEl.textContent = title;
   header.appendChild(titleEl);

   // Content
   const body = el('div', 'p-6');
   if (typeof content === 'string') {
      body.innerHTML = content;
   } else {
      body.appendChild(content);
   }

   // Actions
   const footer = el('div', 'p-6 border-t border-game-border flex gap-3 justify-end');
   actions.forEach(action => {
      const btn = createButton(action.text, action.type || 'primary', 'sm');
      if (action.onClick) {
         btn.addEventListener('click', action.onClick);
      }
      footer.appendChild(btn);
   });

   modal.appendChild(header);
   modal.appendChild(body);
   if (actions.length > 0) {
      modal.appendChild(footer);
   }

   overlay.appendChild(modal);

   // Animação de entrada
   modal.style.transform = 'scale(0.9)';
   modal.style.opacity = '0';

   setTimeout(() => {
      modal.style.transform = 'scale(1)';
      modal.style.opacity = '1';
   }, 10);

   return { overlay, modal, close: () => overlay.remove() };
}

function createCard(options = {}) {
   const {
      title = '',
      subtitle = '',
      content = '',
      footer = null,
      className = '',
      onClick = null,
      hover = true
   } = options;

   const baseClasses = 'bg-game-card border border-game-border rounded-xl p-4 transition-all duration-300';
   const hoverClasses = hover ? 'hover:border-game-accent hover:shadow-lg hover:-translate-y-1' : '';
   const clickClasses = onClick ? 'cursor-pointer' : '';

   const card = el('div', `${baseClasses} ${hoverClasses} ${clickClasses} ${className}`);

   if (title) {
      const titleEl = el('h3', 'text-base font-bold text-game-text mb-1');
      titleEl.textContent = title;
      card.appendChild(titleEl);
   }

   if (subtitle) {
      const subtitleEl = el('p', 'text-xs text-game-muted mb-2');
      subtitleEl.textContent = subtitle;
      card.appendChild(subtitleEl);
   }

   if (content) {
      const contentEl = el('div', 'text-game-text');
      if (typeof content === 'string') {
         contentEl.innerHTML = content;
      } else {
         contentEl.appendChild(content);
      }
      card.appendChild(contentEl);
   }

   if (footer) {
      const footerEl = el('div', 'mt-4 pt-4 border-t border-game-border');
      if (typeof footer === 'string') {
         footerEl.innerHTML = footer;
      } else {
         footerEl.appendChild(footer);
      }
      card.appendChild(footerEl);
   }

   if (onClick) {
      card.addEventListener('click', onClick);
   }

   return card;
}

// Tornar disponível globalmente
window.showLargeTooltip = showLargeTooltip;
window.closeLargeTooltip = closeLargeTooltip;
window.createObjectiveComponent = createObjectiveComponent;
window.createButton = createButton;
window.createModal = createModal;
window.createCard = createCard;

function showLargeTooltip(objective) {
   // Fechar tooltip ativo se existir
   if (activeTooltip) {
      closeLargeTooltip();
   }

   // Criar overlay
   const overlay = el('div', 'large-tooltip-overlay');
   overlay.innerHTML = `
      <div class="large-tooltip">
         <div class="tooltip-header">
            <h3 class="tooltip-title">${objective.label}</h3>
            <div class="tooltip-controls">
               <button class="tooltip-pin-btn" id="tooltipPinBtn">
                  <span>📌</span> Fixar
               </button>
               <button class="tooltip-close-btn" id="tooltipCloseBtn">
                  <span>✕</span> Fechar
               </button>
            </div>
         </div>
         <div class="tooltip-content">
            <div class="tooltip-description">${objective.tooltip || 'Nenhuma descrição disponível.'}</div>

            <div class="tooltip-details mb-6">
               <div class="grid grid-cols-1 gap-4 p-4 bg-game-panel bg-opacity-30 rounded-lg border border-game-border border-opacity-30">
                  <div class="detail-item">
                     <div class="text-sm font-bold text-game-accent mb-2">Tabela de Pontuação:</div>
                     <div class="text-xs text-game-muted space-y-1">
                        <div>📋 1 carta = 0 pontos</div>
                        <div>⚡ 2 cartas = 2 pontos</div>
                        <div>🔥 3 cartas = 4 pontos</div>
                        <div>💎 4 cartas = 8 pontos</div>
                        <div>👑 5 cartas = 16 pontos</div>
                     </div>
                  </div>
                  <div class="detail-item">
                     <div class="text-sm font-bold text-game-accent mb-1">Níveis:</div>
                     <div class="text-game-muted text-sm">${objective.levels.join(', ')}</div>
                  </div>
               </div>
            </div>

            <div class="tooltip-video">
               <div class="tooltip-video-placeholder">
                  <div class="tooltip-video-icon">🎥</div>
                  <div class="tooltip-video-text">Vídeo Tutorial</div>
                  <div class="tooltip-video-filename">${objective.videoUrl || 'video-em-breve.mp4'}</div>
                  <div class="text-xs mt-2 opacity-60">Vídeo explicativo mostrando exemplos práticos desta combinação</div>
               </div>
            </div>
         </div>
      </div>
   `;

   document.body.appendChild(overlay);
   activeTooltip = overlay;
   tooltipPinned = false;
   tooltipHover = true;

   // Mostrar com animação
   setTimeout(() => overlay.classList.add('show'), 50);

   // Event listeners
   const pinBtn = overlay.querySelector('#tooltipPinBtn');
   const closeBtn = overlay.querySelector('#tooltipCloseBtn');
   const tooltipElement = overlay.querySelector('.large-tooltip');

   pinBtn.addEventListener('click', toggleTooltipPin);
   closeBtn.addEventListener('click', closeLargeTooltip);

   // Hover detection no tooltip
   tooltipElement.addEventListener('mouseenter', () => {
      tooltipHover = true;
   });

   tooltipElement.addEventListener('mouseleave', () => {
      tooltipHover = false;
      setTimeout(() => {
         if (!tooltipPinned && !tooltipHover) {
            closeLargeTooltip();
         }
      }, 300);
   });

   // Fechar clicando fora (só se não estiver pinned)
   overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !tooltipPinned) {
         closeLargeTooltip();
      }
   });

   // Suporte ao teclado - ESC para fechar
   document.addEventListener('keydown', handleKeyPress);

   // Guardar referência da função para remover depois
   overlay.dataset.keyHandler = 'active';
}

function toggleTooltipPin() {
   if (!activeTooltip) return;

   tooltipPinned = !tooltipPinned;
   const pinBtn = activeTooltip.querySelector('#tooltipPinBtn');

   if (tooltipPinned) {
      pinBtn.classList.add('pinned');
      pinBtn.innerHTML = '<span>📌</span> Fixado';
   } else {
      pinBtn.classList.remove('pinned');
      pinBtn.innerHTML = '<span>📌</span> Fixar';
   }
}

function closeLargeTooltip() {
   if (!activeTooltip) return;

   activeTooltip.classList.remove('show');

   // Remover event listener do teclado
   if (activeTooltip.dataset.keyHandler === 'active') {
      document.removeEventListener('keydown', handleKeyPress);
   }

   setTimeout(() => {
      if (activeTooltip && document.body.contains(activeTooltip)) {
         document.body.removeChild(activeTooltip);
      }
      activeTooltip = null;
      tooltipPinned = false;
      tooltipHover = false;
   }, 300);
}

// Função global para ESC
function handleKeyPress(e) {
   if (e.key === 'Escape' && activeTooltip) {
      closeLargeTooltip();
   }
}

// ======= Opponent Log System =======
// ======= Central Game Log System =======
let gameLogContainer = null;
let gameLogEntries = null;

function initializeGameLog() {
   // Usar o elemento existente pelo ID gameLog
   gameLogContainer = q('#gameLog');
   if (!gameLogContainer) {
      console.error('Elemento #gameLog não encontrado!');
      return;
   }
}

function addGameLog(message, player = 'player', type = 'info') {
   if (!gameLogContainer) initializeGameLog();

   const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
   });

   const logEntry = el('div', `log-entry ${player} ${type}`);

   // Ícone baseado no jogador e tipo
   const icon = el('div', 'log-entry-icon');
   icon.textContent = getLogIcon(player, type);

   const content = el('div', 'log-entry-content');
   const text = el('div', 'log-entry-text');
   text.textContent = message;

   const time = el('div', 'log-entry-time');
   time.textContent = timestamp;

   content.appendChild(text);
   content.appendChild(time);

   logEntry.appendChild(icon);
   logEntry.appendChild(content);

   // Usar o elemento gameLog diretamente
   gameLogContainer.appendChild(logEntry);

   // Auto scroll
   gameLogContainer.scrollTop = gameLogContainer.scrollHeight;

   // Limitar a 15 entradas
   const entries = gameLogContainer.children;
   if (entries.length > 15) {
      gameLogContainer.removeChild(entries[0]);
   }
}

function getLogIcon(player, type) {
   const icons = {
      player: {
         info: '🎯',
         action: '🎲',
         success: '✅',
         warning: '⚠️'
      },
      opponent: {
         info: '🤖',
         action: '🎲',
         success: '✅',
         warning: '⚠️'
      }
   };

   return icons[player]?.[type] || '•';
}

// Função de compatibilidade para não quebrar código existente
function addOpponentLog(message, type = 'info') {
   addGameLog(message, 'opponent', type);
}

function getLogTypeClass(type) {
   switch (type) {
      case 'action': return 'bg-blue-500 bg-opacity-20 text-blue-300 border border-blue-500 border-opacity-30';
      case 'success': return 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30';
      case 'thinking': return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border border-yellow-500 border-opacity-30';
      default: return 'bg-game-muted bg-opacity-20 text-game-muted border border-game-muted border-opacity-30';
   }
}

// ======= Score Notification System =======
function showScoreNotification(message, player = 'player') {
   const notification = el('div', 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 score-notification');

   const isPlayer = player === 'player';
   const bgClass = isPlayer ? 'bg-green-500' : 'bg-red-500';
   const textClass = isPlayer ? 'text-white' : 'text-white';
   const icon = isPlayer ? '🎉' : '🤖';

   notification.innerHTML = `
      <div class="${bgClass} ${textClass} px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-90 text-center transform scale-0 transition-all duration-500 ease-out">
         <div class="text-4xl mb-2">${icon}</div>
         <div class="text-xl font-bold">${message}</div>
         <div class="text-sm opacity-80 mt-1">Rodada ${round}</div>
      </div>
   `;

   document.body.appendChild(notification);

   // Animar entrada
   setTimeout(() => {
      notification.querySelector('div').classList.remove('scale-0');
      notification.querySelector('div').classList.add('scale-100');
   }, 50);

   // Animar saída e remover
   setTimeout(() => {
      notification.querySelector('div').classList.add('scale-0', 'opacity-0');
      setTimeout(() => {
         if (document.body.contains(notification)) {
            document.body.removeChild(notification);
         }
      }, 500);
   }, 2500);
}

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

function showTurnModal(turnType, callback, duration = 3000) {
   // Criar overlay com animação inicial
   const overlay = el('div', 'fixed inset-0 flex items-center justify-center z-50');
   overlay.style.background = 'rgba(0, 0, 0, 0)';
   overlay.style.transition = 'background 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

   // Criar modal com estilo e animações
   const modal = el('div', 'bg-game-panel-gradient border border-game-border rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4 turn-modal');
   modal.style.transform = 'scale(0.7) translateY(30px)';
   modal.style.opacity = '0';
   modal.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Bounce suave

   modal.innerHTML = `
      <div class="flex flex-col items-center justify-center">
         <div class="text-6xl mb-4 transition-all duration-700 ease-out" style="transform: scale(0.6) rotate(-10deg); opacity: 0;">
            ${turnType === 'player' ? '🎯' : '🤖'}
         </div>
         <h2 class="text-3xl font-black text-game-text mb-2 transition-all duration-600 delay-150 ease-out" style="transform: translateY(20px); opacity: 0;">
            ${turnType === 'player' ? 'Sua Vez!' : 'Vez do Oponente!'}
         </h2>
         <p class="text-game-muted transition-all duration-500 delay-300 ease-out" style="transform: translateY(15px); opacity: 0;">
            ${turnType === 'player' ? 'Faça sua jogada!' : 'O oponente está pensando...'}
         </p>
      </div>
   `;

   overlay.appendChild(modal);
   document.body.appendChild(overlay);

   // Som do modal de turno
   playSound('turn_modal');

   // Animação de entrada suave em cascata
   requestAnimationFrame(() => {
      // Fade in do fundo
      overlay.style.background = 'rgba(0, 0, 0, 0.8)';

      // Zoom in do modal principal
      modal.style.transform = 'scale(1) translateY(0)';
      modal.style.opacity = '1';

      // Animar elementos internos com delay
      setTimeout(() => {
         const icon = modal.querySelector('.text-6xl');
         const title = modal.querySelector('h2');
         const text = modal.querySelector('p');

         if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.opacity = '1';
         }

         setTimeout(() => {
            if (title) {
               title.style.transform = 'translateY(0)';
               title.style.opacity = '1';
            }
         }, 150);

         setTimeout(() => {
            if (text) {
               text.style.transform = 'translateY(0)';
               text.style.opacity = '1';
            }
         }, 300);
      }, 200);
   });

   // Animação de saída suave
   setTimeout(() => {
      // Fade out do fundo
      overlay.style.background = 'rgba(0, 0, 0, 0)';

      // Zoom out do modal com movimento suave
      modal.style.transform = 'scale(0.85) translateY(-20px)';
      modal.style.opacity = '0';

      // Remover após animação completa
      setTimeout(() => {
         if (overlay.parentNode) {
            document.body.removeChild(overlay);
         }
         if (callback) callback();
      }, 600); // Tempo suficiente para todas as animações
   }, duration);
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
   // Verificar se a carta está travada antes de animar
   const isLocked = cardElement.dataset.locked === '1';
   if (isLocked) {
      return; // Cartas travadas nunca devem ser animadas
   }

   // Animação de virar carta do deck
   cardElement.classList.add('card-drawing');

   // Posiciona a carta inicialmente no deck
   const deckRect = q('#deck').getBoundingClientRect();
   const handRect = handEl.getBoundingClientRect();

   cardElement.style.position = 'fixed';
   cardElement.style.left = deckRect.left + 'px';
   cardElement.style.top = deckRect.top - 10 + 'px'; // Um pouco mais acima do deck
   cardElement.style.zIndex = '1000';
   cardElement.style.transition = 'none';

   // Encontra o container 3D dentro da carta
   const card3D = cardElement.querySelector('.card-3d');
   if (!card3D) return;

   // Começa com o fundo virado (rotateY(180deg)) e menor
   cardElement.style.transform = 'scale(0.6)';
   card3D.style.transform = 'rotateY(180deg)';

   // Movimento direto para posição final (sem virada ainda)
   setTimeout(() => {
      const finalLeft = handRect.left + (index * 120) + 'px';
      const finalTop = handRect.top + 'px';

      cardElement.style.transition = 'transform 0.4s linear, left 0.4s linear, top 0.4s linear';
      cardElement.style.left = finalLeft;
      cardElement.style.top = finalTop;
      cardElement.style.transform = 'scale(1)'; // Tamanho final, mas ainda com fundo virado

      // Remove estilos temporários após movimento
      setTimeout(() => {
         cardElement.style.position = '';
         cardElement.style.left = '';
         cardElement.style.top = '';
         cardElement.style.zIndex = '';
         cardElement.style.transform = '';
         cardElement.style.transition = '';
         cardElement.classList.remove('card-drawing');
      }, 400);
   }, 100);
}

function renderCardsWithAnimation(newCards = []) {
   // Primeiro, vamos preservar as cartas travadas existentes
   const existingCards = Array.from(handEl.children);
   const lockedCards = existingCards.filter(cardEl => {
      const cardIndex = parseInt(cardEl.dataset.index);
      return hand[cardIndex] && hand[cardIndex].locked;
   });

   // Limpar apenas as cartas não travadas
   const unlockedCards = existingCards.filter(cardEl => {
      const cardIndex = parseInt(cardEl.dataset.index);
      return !hand[cardIndex] || !hand[cardIndex].locked;
   });

   unlockedCards.forEach(cardEl => cardEl.remove());

   const newCardElements = [];
   const newCardCount = newCards.filter(card => !card.locked).length;
   let animationIndex = 0;

   hand.forEach((c, i) => {
      let cardElement;

      // Se a carta está travada, manter a existente
      if (c.locked) {
         cardElement = lockedCards.find(cardEl => parseInt(cardEl.dataset.index) === i);
         if (!cardElement) {
            cardElement = cardEl(c, i, true);
            handEl.appendChild(cardElement);
         }
      } else {
         // Para cartas não travadas, criar nova
         cardElement = cardEl(c, i, false);
         handEl.appendChild(cardElement);
      }

      // Anima apenas cartas novas que não estão locked
      const isNewCard = newCards.some(newCard => newCard.w === c.w && newCard.pos === c.pos);
      if (isNewCard && !c.locked) {
         newCardElements.push(cardElement);
         // Animar sequencialmente com delay
         setTimeout(() => {
            animateCardDraw(cardElement, animationIndex);
         }, animationIndex * 100); // 100ms de delay entre cada carta nova
         animationIndex++;
      } else if (!c.locked) {
         // Para cartas não travadas existentes, mostrar a frente normalmente
         const front = cardElement.querySelector('.card-front');
         const back = cardElement.querySelector('.card-back');
         if (front && back) {
            front.style.display = 'flex';
            back.style.display = 'none';
         }
      }
   });

   // Virar todas as cartas juntas após todas chegarem na posição final
   if (newCardCount > 0) {
      const totalAnimationTime = (newCardCount - 1) * 100 + 600; // Tempo total para todas chegarem (600ms animação + delays)
      setTimeout(() => {
         flipAllCardsTogether(newCardElements);
      }, totalAnimationTime);
   }

   updatePlayerCombos();
   updateOpponentCombos();
}

function flipAllCardsTogether(cardElements) {
   cardElements.forEach(cardElement => {
      // Verificar se a carta está travada antes de girar
      const isLocked = cardElement.dataset.locked === '1';
      if (isLocked) {
         return; // Pular cartas travadas - elas nunca devem girar
      }

      const card3D = cardElement.querySelector('.card-3d');
      const front = cardElement.querySelector('.card-front');
      const back = cardElement.querySelector('.card-back');

      if (card3D && front && back) {
         // Mostrar a frente e esconder o fundo
         front.style.display = 'flex';
         back.style.display = 'none';

         // Virar o container 3D
         card3D.style.transition = 'transform 0.3s linear';
         card3D.style.transform = 'rotateY(0deg)'; // Virar para frente
      }
   });
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

   // Container 3D para flip
   const card3D = el('div', 'card-3d relative w-full h-full');
   card3D.style.transformStyle = 'preserve-3d';
   card3D.style.transition = isLocked ? 'none' : 'transform 0.4s linear'; // Sem transição para cartas travadas

   // Design de carta de baralho - FRENTE
   const front = el('div', 'card-front absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105');
   front.style.backfaceVisibility = 'hidden';
   front.style.display = isLocked ? 'flex' : 'none'; // Mostrar se travada, esconder se não

   // Design de carta de baralho - FUNDO
   const back = el('div', 'card-back absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl border-2 border-blue-400 shadow-xl');
   back.style.backfaceVisibility = 'hidden';
   back.style.transform = 'rotateY(180deg)';

   // Efeito visual de carta travada
   if (isLocked) {
      front.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'ring-offset-game-bg');
      front.style.filter = 'brightness(1.1) saturate(1.2)';

      // Ícone de cadeado
      const lockIcon = el('div', 'absolute top-1 right-1 text-yellow-600 text-base font-bold');
      lockIcon.textContent = '🔒';
      lockIcon.style.filter = 'drop-shadow(0 0 2px rgba(0,0,0,0.5))';
      front.appendChild(lockIcon);
   }

   // Header com tipo e nível - mais compacto
   const header = el('div', 'flex justify-between items-center mb-1 px-1 pt-1');
   const colors = POS_COLORS[card.pos] || { bg: '#6b7280', text: '#ffffff' };

   const top = el('div', 'tag text-xs font-bold px-2 py-1 rounded-full shadow-sm');
   top.textContent = POS_LABEL[card.pos] || card.pos;
   top.style.backgroundColor = colors.bg;
   top.style.color = colors.text;
   top.style.fontSize = '10px';
   header.appendChild(top);

   const lvl = el('div', 'level text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full shadow-sm');
   lvl.textContent = card.lvl;
   lvl.style.fontSize = '10px';
   header.appendChild(lvl);
   front.appendChild(header);

   // Área central com símbolo e emote - mais espaçosa
   const symbolContainer = el('div', 'flex-1 flex items-center justify-center mb-2 relative px-1');
   const symbol = el('div', 'text-4xl opacity-20 absolute inset-0 flex items-center justify-center z-0');
   symbol.textContent = getPosSymbol(card.pos);
   const emote = el('div', 'text-3xl opacity-60 z-10 relative');
   emote.textContent = getPosEmote(card.pos);
   symbolContainer.appendChild(symbol);
   symbolContainer.appendChild(emote);
   front.appendChild(symbolContainer);

   // Palavra na parte inferior - mais destacada
   const wordContainer = el('div', 'text-center px-1 pb-1');
   const word = el('div', 'word text-lg font-black text-gray-800 leading-tight break-words');
   word.textContent = card.w;
   word.style.fontSize = '16px';
   word.style.lineHeight = '1.2';
   wordContainer.appendChild(word);
   front.appendChild(wordContainer);

   // Adicionar ambas as faces ao container 3D
   card3D.appendChild(front);
   card3D.appendChild(back);
   wrap.appendChild(card3D);

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

   // Encontrar a carta específica no DOM pelo data-index
   const cardElement = handEl.querySelector(`[data-index="${idx}"]`);
   if (cardElement) {
      // Atualizar o estado visual da carta
      cardElement.dataset.locked = hand[idx].locked ? 1 : 0;
      cardElement.draggable = !hand[idx].locked;

      // Atualizar a visibilidade da frente e fundo
      const front = cardElement.querySelector('.card-front');
      const back = cardElement.querySelector('.card-back');
      const card3D = cardElement.querySelector('.card-3d');

      if (front && back && card3D) {
         if (hand[idx].locked) {
            front.style.display = 'flex';

            // Adicionar borda de destaque
            front.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'ring-offset-game-bg');

            // Adicionar ícone de cadeado se não existir
            if (!front.querySelector('.lock-icon')) {
               const lockIcon = el('div', 'lock-icon absolute top-1 right-1 text-yellow-600 text-base font-bold');
               lockIcon.textContent = '🔒';
               lockIcon.style.filter = 'drop-shadow(0 0 2px rgba(0,0,0,0.5))';
               front.appendChild(lockIcon);
            }
         } else {
            // Carta não travada: esconder frente, mostrar fundo (sem animação)
            back.style.display = 'flex';

            // Remover borda de destaque
            front.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2', 'ring-offset-game-bg');

            // Remover ícone de cadeado
            const lockIcon = front.querySelector('.lock-icon');
            if (lockIcon) {
               lockIcon.remove();
            }
         }
      }

      // Atualizar combos
      updatePlayerCombos();
   }

   // Som de travar/destravar carta
   playSound('card_lock_toggle');
}

// ======= Combos Sidebar =======
function filteredObjectives() {
   const lv = q('#level').value;
   return OBJECTIVES.filter(o => o.levels.includes(lv));
}

// ======= Componente Reutilizável de Objetivos =======
function createObjectiveComponent(objective, cards, options = {}) {
   const {
      showProgress = true,
      showTooltip = true,
      isPlayer = true,
      readyStatus = true,
      clickTooltip = false,
      showSelection = false
   } = options;

   const currentPoints = objective.calculate ? objective.calculate(cards) : 0;
   const p = objective.prog ? objective.prog(cards) : 0;
   const cardCount = objective.type && objective.type !== 'special' ? count(cards, objective.type) : 0;
   const isSelected = selectedObjectives.has(objective.id);

   // Classes baseadas no status
   let boxClasses = 'combo rounded-lg p-2 mb-2 transition-all duration-300';
   if (isSelected && showSelection) {
      boxClasses += ' combo-selected border-2 border-game-accent';
   } else if (currentPoints > 0 && showProgress) {
      boxClasses += ' combo-ready';
   } else {
      boxClasses += ' combo-inactive border border-game-border opacity-75';
   }

   const box = el('div', boxClasses);

   // Header com seleção se necessário
   const header = el('div', 'flex items-center justify-between mb-3');

   // Seção de seleção
   if (showSelection && isPlayer) {
      const selectionArea = el('div', 'flex items-center gap-3');

      // Toggle switch moderno
      const toggleContainer = el('div', 'relative');
      const toggle = el('input', 'sr-only');
      toggle.type = 'checkbox';
      toggle.id = `objective-${objective.id}`;
      toggle.checked = isSelected;

      const toggleBg = el('div', `w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${isSelected ? 'bg-game-accent' : 'bg-game-muted bg-opacity-30'}`);
      const toggleDot = el('div', `absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isSelected ? 'transform translate-x-6' : ''}`);

      toggleBg.appendChild(toggleDot);
      toggleContainer.appendChild(toggle);
      toggleContainer.appendChild(toggleBg);

      // Event listener para toggle
      toggleBg.addEventListener('click', () => {
         if (isSelected) {
            selectedObjectives.delete(objective.id);
         } else {
            selectedObjectives.add(objective.id);
         }
         // Atualizar interface
         updatePlayerCombos();
         playSound('card_select');
      });

      selectionArea.appendChild(toggleContainer);
      header.appendChild(selectionArea);
   }

   // Seção do título e info
   const infoSection = el('div', 'flex-1');
   const titleRow = el('div', 'flex justify-between items-start mb-1');

   const title = el('div', 'text-game-text tooltip-trigger font-bold text-sm cursor-pointer');
   title.textContent = objective.label;

   // Pontos atuais em destaque
   const pointsDisplay = el('div', 'flex gap-1 items-center');
   const showDetails = !isPlayer || readyStatus;

   if (showDetails && showProgress) {
      const pointsValue = el('div', `font-black text-lg ${isSelected && currentPoints > 0 ? 'text-green-400' : currentPoints > 0 ? 'text-game-accent' : 'text-game-muted'}`);
      pointsValue.textContent = `${currentPoints}`;

      const pointsLabel = el('div', 'text-xs text-game-muted');
      pointsLabel.textContent = 'pontos';

      pointsDisplay.appendChild(pointsValue);
      pointsDisplay.appendChild(pointsLabel);
   } else if (!showDetails) {
      pointsDisplay.innerHTML = `
         <div class="text-game-muted text-xl font-bold">?</div>
         <div class="text-xs text-game-muted opacity-60">após "pronto"</div>
      `;
   } else {
      pointsDisplay.innerHTML = `
         <div class="text-game-accent text-xl font-bold">16</div>
         <div class="text-xs text-game-muted">max</div>
      `;
   }

   titleRow.appendChild(title);
   titleRow.appendChild(pointsDisplay);

   // Info adicional
   const infoRow = el('div', 'flex justify-between items-center text-sm');
   const levelBadge = el('div', 'text-xs text-game-muted opacity-80');
   levelBadge.textContent = objective.levels.join(', ');

   const cardInfo = el('div', 'text-xs text-game-muted');
   if (showDetails && objective.type && objective.type !== 'special') {
      cardInfo.textContent = `${cardCount}/5`;
   } else {
      cardInfo.textContent = objective.type === 'special' ? 'especial' : 'coleção';
   }

   infoRow.appendChild(levelBadge);
   infoRow.appendChild(cardInfo);

   infoSection.appendChild(titleRow);
   infoSection.appendChild(infoRow);
   header.appendChild(infoSection);
   box.appendChild(header);

   // Barra de progresso mais sutil
   if (showProgress && showDetails) {
      const progressContainer = el('div', 'mt-3');
      const bar = el('div', 'progress-bar h-2 rounded-full');
      const fill = el('div', 'progress-fill h-full rounded-full transition-all duration-500 ease-out');
      fill.style.width = (p * 100) + '%';

      // Adicionar indicador de cartas

      bar.appendChild(fill);
      progressContainer.appendChild(bar);
      box.appendChild(progressContainer);
   }

   // Eventos de tooltip
   if (showTooltip) {
      if (clickTooltip) {
         title.addEventListener('click', () => showLargeTooltip(objective));
      } else {
         let hoverTimer = null;
         title.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => showLargeTooltip(objective), 500);
         });
         title.addEventListener('mouseleave', () => {
            if (hoverTimer) clearTimeout(hoverTimer);
            setTimeout(() => {
               if (!tooltipPinned && !tooltipHover) closeLargeTooltip();
            }, 300);
         });
      }
   }

   return box;
}

function updateCombos(containerEl, cards, isPlayer = true) {
   const objs = filteredObjectives();
   containerEl.innerHTML = '';

   objs.forEach(o => {
      const objectiveEl = createObjectiveComponent(o, cards, {
         showProgress: true,
         showTooltip: true,
         isPlayer: isPlayer,
         readyStatus: !isPlayer || playerReady,
         clickTooltip: false,
         showSelection: isPlayer && playerReady // Só mostra seleção para jogador após estar pronto
      });
      containerEl.appendChild(objectiveEl);
   });
}

function updatePlayerCombos() {
   const playerCards = hand.filter(card => !card.locked); // Apenas cartas não travadas contam para combos
   updateCombos(playerCombosEl, playerCards, true);
}

function updateOpponentCombos(opponentCards = null) {
   // Se não forneceu cartas, usar cartas aleatórias simuladas
   if (!opponentCards) {
      opponentCards = draw(5); // Simula 5 cartas do oponente
   }
   updateCombos(opponentCombosEl, opponentCards, false);
}

// ======= Game Flow =======
function initializeDefaultObjectives() {
   // Selecionar alguns objetivos por padrão na primeira rodada
   if (selectedObjectives.size === 0) {
      const objs = filteredObjectives();
      // Selecionar os 3 primeiros objetivos por padrão
      objs.slice(0, 3).forEach(obj => {
         selectedObjectives.add(obj.id);
      });
   }
}

function startRound() {
   rerolls = GAME_CONFIG.initialRerolls;
   timer = GAME_CONFIG.roundTimer;
   playerReady = false;
   readyShownThisRound = false;
   updateHUD();
   deck = freshDeck(q('#level').value);
   hand = draw(GAME_CONFIG.handSize);

   // Marcar cartas iniciais como usadas hoje
   hand.forEach(card => markCardAsUsed(card));

   // Inicializar objetivos padrão se necessário
   initializeDefaultObjectives();

   // Começar com turno do jogador (sem modal ainda)
   setPlayerTurn();

   // Sempre mostrar objetivos para aprendizado
   updatePlayerCombos();
   updateOpponentCombos();

   if (isFirstRound) {
      // Primeira rodada: só mostrar botão, esconder cartas
      handEl.innerHTML = ''; // Não mostrar cartas ainda
      enableActions(false); // Desabilitar ações até ficar pronto
      showInlineReadyButton(); // Mostrar botão inline
      isFirstRound = false;
   } else {
      // Rodadas seguintes: modal primeiro, depois timer e animação
      playerReady = true;
      enableActions(true);
      showNormalControls();

      showTurnModal('player', () => {
         // Callback após modal: iniciar timer e animar cartas
         startTimer();
         renderCardsWithAnimation(hand);
      }, 1000); // 1 segundo para consistência
   }
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

function showInlineReadyButton() {
   if (readyShownThisRound) return; // Só mostra uma vez por rodada

   const controlsEl = q('.controls');
   if (!controlsEl) return;

   // Criar container do botão usando componentes
   const container = el('div', 'ready-button-container text-center p-6 bg-game-panel border border-game-accent rounded-2xl shadow-game');

   const info = el('div', 'mb-4');
   const roundTitle = el('div', 'text-base font-bold text-game-text');
   roundTitle.textContent = `Rodada ${round}`;
   const subtitle = el('div', 'text-sm text-game-muted');
   subtitle.textContent = 'Suas cartas foram distribuídas!';

   info.appendChild(roundTitle);
   info.appendChild(subtitle);

   // Usar componente createButton
   const readyBtn = createButton('Estou Pronto!', 'primary', 'lg', '🚀');

   readyBtn.addEventListener('click', () => {
      playerReady = true;
      readyShownThisRound = true;

      // Restaurar botões normais
      showNormalControls();

      // Reabilitar ações
      enableActions(true);

      // Atualizar combos para mostrar o progresso atual
      updatePlayerCombos();

      // Mostrar modal "Sua vez" primeiro, depois iniciar timer e animar cartas
      showTurnModal('player', () => {
         // Callback executado após modal fechar: iniciar timer e animar cartas
         startTimer(); // Timer só começa depois do modal sumir
         renderCardsWithAnimation(hand);
      }, 1000); // 1 segundo (reduzido de 2)

      playSound('player_ready');
   });

   container.appendChild(info);
   container.appendChild(readyBtn);
   controlsEl.innerHTML = '';
   controlsEl.appendChild(container);
}

function showNormalControls() {
   const controlsEl = q('.controls');
   if (!controlsEl) return;

   controlsEl.innerHTML = `
      <div class="flex gap-4 justify-center">
         <button id="btnRoll" class="px-6 py-3 bg-game-btn-gradient text-game-text font-bold rounded-xl border border-game-border shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            🎲 Rolar Cartas
         </button>
         <button id="btnSubmit" class="px-6 py-3 bg-game-accent-gradient text-game-bg font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            ✅ Enviar
         </button>
      </div>
   `;

   // Reconectar event listeners
   q('#btnRoll').addEventListener('click', roll);
   q('#btnSubmit').addEventListener('click', submit);
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
   let details = [];

   objs.forEach(o => {
      // Só contar objetivos selecionados
      if (selectedObjectives.has(o.id)) {
         const points = o.calculate ? o.calculate(arr) : 0;
         if (points > 0) {
            total += points;
            hits.push(o.label);

            // Adicionar detalhes da pontuação
            if (o.type && o.type !== 'special') {
               const cardCount = count(arr, o.type);
               details.push(`${o.label}: ${cardCount} cartas = ${points}pts`);
            } else {
               details.push(`${o.label}: ${points}pts`);
            }
         }
      }
   });

   return { total, hits, details };
}

function simulateBot() {
   // Bot seleciona objetivos automaticamente (simula todos)
   const tempSelectedObjectives = new Set(selectedObjectives);

   // Bot usa todos os objetivos disponíveis
   filteredObjectives().forEach(obj => {
      selectedObjectives.add(obj.id);
   });

   // Bot inteligente que busca maximizar pontuação exponencial
   const d = freshDeck(q('#level').value);
   let h = d.splice(-GAME_CONFIG.handSize);
   let bestScore = scoreFor(h).total;
   let bestHand = [...h];

   // Bot tenta várias estratégias para maximizar pontos
   for (let r = 0; r < GAME_CONFIG.initialRerolls; r++) {
      // Estratégia: manter o tipo com mais cartas
      const keptPOS = bestPOS(h);
      const keep = h.filter(c => c.pos === keptPOS);

      if (keep.length < 5) { // Só reroll se não tiver 5 do mesmo tipo
         const newOnes = d.splice(-(GAME_CONFIG.handSize - keep.length));
         const newHand = [...keep, ...newOnes];
         const newScore = scoreFor(newHand).total;

         if (newScore >= bestScore) {
            h = newHand;
            bestScore = newScore;
            bestHand = [...newHand];
         } else {
            h = bestHand; // Voltar para a melhor mão anterior
         }
      }
   }

   const finalScore = scoreFor(h).total;

   // Restaurar objetivos selecionados do jogador
   selectedObjectives.clear();
   tempSelectedObjectives.forEach(id => selectedObjectives.add(id));

   return finalScore;
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
   const { total, hits, details } = scoreFor(all);
   youScore += total;
   q('#youScore').textContent = youScore;

   // Notificação melhorada e mais visível com detalhes
   if (details.length > 0) {
      const detailsText = details.slice(0, 2).join(', '); // Mostrar até 2 detalhes
      showScoreNotification(`+${total} pontos! ${detailsText}`, 'player');
   } else {
      showScoreNotification(`Sem pontos nesta rodada`, 'player');
   }

   // Passar para turno do oponente após delay
   setTimeout(() => {
      setOpponentTurn();
      showTurnModal('opponent', () => {
         // Simular turno do oponente
         simulateOpponentTurn();
      });
   }, 1000); // Delay para mostrar a notificação
}

function simulateOpponentTurn() {
   // Simular turno do oponente de forma visual
   let opponentHand = draw(GAME_CONFIG.handSize);
   let opponentRerolls = GAME_CONFIG.initialRerolls;

   // Atualizar visualmente as cartas do oponente
   updateOpponentCombos(opponentHand);

   // Função para simular uma ação do oponente
   function simulateOpponentAction(actionIndex = 0) {
      const actions = [
         () => {
            // Ação 1: "Pensar" (pausa)
            addOpponentLog('🤔 Analisando cartas disponíveis...', 'thinking');
         },
         () => {
            // Ação 2: Rolar algumas cartas
            if (opponentRerolls > 0) {
               const rolledCount = Math.floor(Math.random() * 3) + 1;
               addOpponentLog(`🎲 Rolou ${rolledCount} cartas`, 'action');

               // Simular rolagem: manter algumas cartas boas, trocar outras
               const keptPOS = bestPOS(opponentHand);
               const cardsToKeep = opponentHand.filter(c => c.pos === keptPOS).slice(0, 2);
               const newCards = draw(GAME_CONFIG.handSize - cardsToKeep.length);
               opponentHand = [...cardsToKeep, ...newCards];
               opponentRerolls--;
               updateOpponentCombos(opponentHand);
            }
         },
         () => {
            // Ação 3: Travar algumas cartas
            const keptPOS = bestPOS(opponentHand);
            let lockedCount = 0;
            opponentHand.forEach(card => {
               if (card.pos === keptPOS && Math.random() > 0.5) {
                  card.locked = true;
                  lockedCount++;
               }
            });
            if (lockedCount > 0) {
               addOpponentLog(`🔒 Travou ${lockedCount} cartas de ${POS_LABEL[keptPOS] || keptPOS}`, 'action');
            }
            updateOpponentCombos(opponentHand);
         },
         () => {
            // Ação 4: Finalizar turno
            const { total: bot, hits, details } = scoreFor(opponentHand);
            botScore += bot;
            q('#botScore').textContent = botScore;

            addOpponentLog(`✅ Finalizou turno: +${bot} pontos`, 'success');
            if (details.length > 0) {
               details.forEach(detail => {
                  addOpponentLog(`📊 ${detail}`, 'success');
               });
            }

            // Mostrar notificação centralizada mais visível
            if (details.length > 0) {
               const mainDetail = details[0];
               showScoreNotification(`Oponente: +${bot}pts! ${mainDetail}`, 'opponent');
            } else {
               showScoreNotification(`Oponente: sem pontos`, 'opponent');
            }

            // Voltar para turno do jogador
            setTimeout(() => {
               if (round >= maxRounds) {
                  endGame();
               } else {
                  round++;
                  startRound();
               }
            }, 2000);
         }
      ];

      if (actionIndex < actions.length) {
         actions[actionIndex]();
         if (actionIndex < actions.length - 1) {
            setTimeout(() => simulateOpponentAction(actionIndex + 1), 1500);
         }
      }
   }

   // Começar simulação após 1 segundo
   setTimeout(() => simulateOpponentAction(0), 1000);
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
                  <div class="text-base font-bold text-game-text">Você</div>
                  <div class="text-2xl font-black ${didWin ? 'text-game-good' : 'text-game-muted'}">${playerScore}</div>
               </div>
               <div class="text-center">
                  <div class="text-base font-bold text-game-text">Oponente</div>
                  <div class="text-2xl font-black ${!didWin && !isDraw ? 'text-game-bad' : 'text-game-muted'}">${opponentScore}</div>
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
