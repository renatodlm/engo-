// ======= Hub Logic =======

// ======= Game State =======
let gameMode = 'single-player';
let selectedOpponent = null;

// ======= Opponent Data =======
const OPPONENTS = [
   {
      id: 'beginner',
      name: 'Aprendiz',
      level: 'A1',
      difficulty: 'Fácil',
      description: 'Oponente básico para iniciantes',
      emoji: '👶',
      unlocked: true,
      aiStrength: 1
   },
   {
      id: 'student',
      name: 'Estudante',
      level: 'A2',
      difficulty: 'Fácil',
      description: 'Oponente para nível intermediário básico',
      emoji: '📚',
      unlocked: true,
      aiStrength: 2
   },
   {
      id: 'worker',
      name: 'Trabalhador',
      level: 'B1',
      difficulty: 'Médio',
      description: 'Oponente com vocabulário profissional',
      emoji: '👷',
      unlocked: false,
      aiStrength: 3
   },
   {
      id: 'expert',
      name: 'Especialista',
      level: 'B2',
      difficulty: 'Difícil',
      description: 'Oponente avançado com estratégias complexas',
      emoji: '🧠',
      unlocked: false,
      aiStrength: 4
   },
   {
      id: 'master',
      name: 'Mestre',
      level: 'C1',
      difficulty: 'Muito Difícil',
      description: 'Oponente supremo, verdadeiro desafio',
      emoji: '👑',
      unlocked: false,
      aiStrength: 5
   }
];

// ======= DOM Elements =======
let opponentsListEl, totalGamesEl, totalWinsEl, totalLossesEl, currentStreakEl;

// ======= Helper Functions =======
function q(selector) {
   return document.querySelector(selector);
}

function el(tag, cls) {
   const e = document.createElement(tag);
   if (cls) e.className = cls;
   return e;
}

// ======= Player Progress =======
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

function updateOpponentUnlocks() {
   const progress = loadPlayerProgress();
   const defeatedIds = progress.defeatedOpponents;

   OPPONENTS.forEach((opponent, index) => {
      // Desbloquear oponente se o anterior foi derrotado
      if (index > 0 && defeatedIds.includes(OPPONENTS[index - 1].id)) {
         opponent.unlocked = true;
         if (!progress.unlockedOpponents.includes(opponent.id)) {
            progress.unlockedOpponents.push(opponent.id);
         }
      }
   });

   savePlayerProgress(progress);
}

// ======= UI Rendering =======
function renderOpponents() {
   const progress = loadPlayerProgress();
   opponentsListEl.innerHTML = '';

   OPPONENTS.forEach(opponent => {
      const isUnlocked = progress.unlockedOpponents.includes(opponent.id);
      const isDefeated = progress.defeatedOpponents.includes(opponent.id);

      const opponentCard = el('div', `opponent-card bg-game-panel border border-game-border rounded-xl p-4 transition-all duration-300 ${isUnlocked ? 'hover:border-game-accent cursor-pointer' : 'opacity-50 cursor-not-allowed'
         }`);

      opponentCard.innerHTML = `
         <div class="flex items-center gap-4">
            <div class="text-3xl">${opponent.emoji}</div>
            <div class="flex-1">
               <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-lg font-bold text-game-text">${opponent.name}</h4>
                  ${isDefeated ? '<span class="text-game-good text-sm">✓ Derrotado</span>' : ''}
               </div>
               <p class="text-sm text-game-muted mb-1">${opponent.description}</p>
               <div class="flex items-center gap-2">
                  <span class="badge text-xs px-2 py-1 rounded-full bg-game-accent-gradient text-game-bg font-bold">
                     ${opponent.level}
                  </span>
                  <span class="text-xs text-game-muted">
                     ${opponent.difficulty}
                  </span>
               </div>
            </div>
            <div class="text-2xl">
               ${isUnlocked ? '→' : '🔒'}
            </div>
         </div>
      `;

      if (isUnlocked) {
         opponentCard.addEventListener('click', () => selectOpponent(opponent));
      }

      opponentsListEl.appendChild(opponentCard);
   });
}

function renderStats() {
   const progress = loadPlayerProgress();

   totalGamesEl.textContent = progress.totalGames;
   totalWinsEl.textContent = progress.totalWins;
   totalLossesEl.textContent = progress.totalLosses;
   currentStreakEl.textContent = progress.currentStreak;
}

// ======= Game Logic =======
function selectOpponent(opponent) {
   selectedOpponent = opponent;

   // TODO: Aqui você pode adicionar som de seleção
   // playSound('opponent_select');

   // Salvar seleção no localStorage para o jogo usar
   localStorage.setItem('engo_selected_opponent', JSON.stringify(opponent));

   // Redirecionar para o jogo
   window.location.href = '/game';
}

function initializeHub() {
   opponentsListEl = q('#opponentsList');
   totalGamesEl = q('#totalGames');
   totalWinsEl = q('#totalWins');
   totalLossesEl = q('#totalLosses');
   currentStreakEl = q('#currentStreak');

   updateOpponentUnlocks();
   renderOpponents();
   renderStats();

   // Event listeners para modos de jogo
   document.querySelectorAll('.game-mode').forEach(mode => {
      if (!mode.classList.contains('cursor-not-allowed')) {
         mode.addEventListener('click', () => {
            gameMode = mode.dataset.mode;
            // Por enquanto só single-player funciona
            if (gameMode === 'single-player') {
               q('#opponentsTitle').textContent = '🤖 Oponentes Disponíveis';
            }
         });
      }
   });
}

// ======= Initialization =======
document.addEventListener('DOMContentLoaded', initializeHub);
