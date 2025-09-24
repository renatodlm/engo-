// ======= Game Data & Configuration =======

const WORDS = [
   // A1/A2
   { w: 'cat', pos: 'noun', lvl: 'A1' }, { w: 'dog', pos: 'noun', lvl: 'A1' }, { w: 'house', pos: 'noun', lvl: 'A1' },
   { w: 'run', pos: 'verb', lvl: 'A1' }, { w: 'eat', pos: 'verb', lvl: 'A1' }, { w: 'go', pos: 'verb', lvl: 'A1' },
   { w: 'big', pos: 'adj', lvl: 'A1' }, { w: 'small', pos: 'adj', lvl: 'A1' }, { w: 'fast', pos: 'adj', lvl: 'A1' },
   { w: 'quickly', pos: 'adv', lvl: 'A2' }, { w: 'slowly', pos: 'adv', lvl: 'A2' },
   { w: 'in', pos: 'prep', lvl: 'A1' }, { w: 'on', pos: 'prep', lvl: 'A1' }, { w: 'at', pos: 'prep', lvl: 'A1' },
   { w: 'he', pos: 'pron', lvl: 'A1' }, { w: 'she', pos: 'pron', lvl: 'A1' }, { w: 'they', pos: 'pron', lvl: 'A1' },
   // B1/B2
   { w: 'purchase', pos: 'verb', lvl: 'B1' }, { w: 'improve', pos: 'verb', lvl: 'B1' }, { w: 'consider', pos: 'verb', lvl: 'B2' },
   { w: 'device', pos: 'noun', lvl: 'B1' }, { w: 'feature', pos: 'noun', lvl: 'B2' }, { w: 'challenge', pos: 'noun', lvl: 'B1' },
   { w: 'reliable', pos: 'adj', lvl: 'B2' }, { w: 'efficient', pos: 'adj', lvl: 'B2' },
   { w: 'throughout', pos: 'prep', lvl: 'B2' }, { w: 'despite', pos: 'prep', lvl: 'B2' },
   { w: 'carefully', pos: 'adv', lvl: 'B1' }, { w: 'barely', pos: 'adv', lvl: 'B2' },
   // C1
   { w: 'mitigate', pos: 'verb', lvl: 'C1' }, { w: 'endeavor', pos: 'verb', lvl: 'C1' },
   { w: 'hypothesis', pos: 'noun', lvl: 'C1' }, { w: 'implication', pos: 'noun', lvl: 'C1' },
   { w: 'notwithstanding', pos: 'prep', lvl: 'C1' }, { w: 'predominantly', pos: 'adv', lvl: 'C1' }, { w: 'meticulous', pos: 'adj', lvl: 'C1' }
];

const POS_LABEL = {
   noun: 'Substantivo',
   verb: 'Verbo',
   adj: 'Adjetivo',
   adv: 'Advérbio',
   prep: 'Preposição',
   pron: 'Pronome'
};

// Objectives by difficulty. Each item: id, label, requirement(hand)=>{ok:boolean, progress:0..1, weight:int}
const OBJECTIVES = [
   // A1-A2
   {
      id: 'pair-verbs',
      levels: ['A1', 'A2'],
      label: '2 Verbos',
      weight: 1,
      req: (h) => count(h, 'verb') >= 2,
      prog: (h) => Math.min(count(h, 'verb') / 2, 1)
   },
   {
      id: 'pair-nouns',
      levels: ['A1', 'A2'],
      label: '2 Substantivos',
      weight: 1,
      req: (h) => count(h, 'noun') >= 2,
      prog: (h) => Math.min(count(h, 'noun') / 2, 1)
   },
   {
      id: 'verb+noun',
      levels: ['A1', 'A2', 'B1'],
      label: 'Verbo + Substantivo',
      weight: 1,
      req: (h) => count(h, 'verb') >= 1 && count(h, 'noun') >= 1,
      prog: (h) => Math.min(((count(h, 'verb') > 0 ? 1 : 0) + (count(h, 'noun') > 0 ? 1 : 0)) / 2, 1)
   },
   {
      id: 'three-same',
      levels: ['A2', 'B1'],
      label: '3 do mesmo tipo',
      weight: 2,
      req: (h) => hasAtLeast(h, 3),
      prog: (h) => Math.min(bestOfSame(h) / 3, 1)
   },
   // B1-B2
   {
      id: 'four-same',
      levels: ['B1', 'B2'],
      label: '4 do mesmo tipo',
      weight: 3,
      req: (h) => hasAtLeast(h, 4),
      prog: (h) => Math.min(bestOfSame(h) / 4, 1)
   },
   {
      id: 'svo',
      levels: ['B1', 'B2', 'C1'],
      label: 'Sujeito + Verbo + Objeto',
      weight: 3,
      req: (h) => count(h, 'verb') >= 1 && count(h, 'noun') >= 2,
      prog: (h) => Math.min((Math.min(count(h, 'verb'), 1) + Math.min(count(h, 'noun'), 2)) / 3, 1)
   },
   {
      id: 'prep-pair',
      levels: ['B1', 'B2'],
      label: '2 Preposições',
      weight: 2,
      req: (h) => count(h, 'prep') >= 2,
      prog: (h) => Math.min(count(h, 'prep') / 2, 1)
   },
   // C1
   {
      id: 'full-house',
      levels: ['C1'],
      label: 'Full House (3+2 POS)',
      weight: 4,
      req: (h) => isFullHouse(h),
      prog: (h) => fullHouseProg(h)
   },
   {
      id: 'rainbow',
      levels: ['C1'],
      label: 'Arco-íris (5 tipos diferentes)',
      weight: 5,
      req: (h) => distinctPOS(h) >= 5,
      prog: (h) => Math.min(distinctPOS(h) / 5, 1)
   }
];

// Game Configuration
const GAME_CONFIG = {
   maxRounds: 5,
   initialRerolls: 2,
   roundTimer: 20, // seconds
   handSize: 5
};

// Export for use in other modules
window.WORDS = WORDS;
window.POS_LABEL = POS_LABEL;
window.OBJECTIVES = OBJECTIVES;
window.GAME_CONFIG = GAME_CONFIG;
