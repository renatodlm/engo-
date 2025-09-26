// ======= Game Data & Configuration =======

const WORDS = [
   // A1 - Básico
   { w: 'cat', pos: 'noun', lvl: 'A1' }, { w: 'dog', pos: 'noun', lvl: 'A1' }, { w: 'house', pos: 'noun', lvl: 'A1' },
   { w: 'car', pos: 'noun', lvl: 'A1' }, { w: 'book', pos: 'noun', lvl: 'A1' }, { w: 'food', pos: 'noun', lvl: 'A1' },
   { w: 'water', pos: 'noun', lvl: 'A1' }, { w: 'school', pos: 'noun', lvl: 'A1' }, { w: 'friend', pos: 'noun', lvl: 'A1' },
   { w: 'run', pos: 'verb', lvl: 'A1' }, { w: 'eat', pos: 'verb', lvl: 'A1' }, { w: 'go', pos: 'verb', lvl: 'A1' },
   { w: 'play', pos: 'verb', lvl: 'A1' }, { w: 'work', pos: 'verb', lvl: 'A1' }, { w: 'sleep', pos: 'verb', lvl: 'A1' },
   { w: 'read', pos: 'verb', lvl: 'A1' }, { w: 'write', pos: 'verb', lvl: 'A1' }, { w: 'talk', pos: 'verb', lvl: 'A1' },
   { w: 'big', pos: 'adj', lvl: 'A1' }, { w: 'small', pos: 'adj', lvl: 'A1' }, { w: 'fast', pos: 'adj', lvl: 'A1' },
   { w: 'slow', pos: 'adj', lvl: 'A1' }, { w: 'hot', pos: 'adj', lvl: 'A1' }, { w: 'cold', pos: 'adj', lvl: 'A1' },
   { w: 'good', pos: 'adj', lvl: 'A1' }, { w: 'bad', pos: 'adj', lvl: 'A1' }, { w: 'happy', pos: 'adj', lvl: 'A1' },
   { w: 'sad', pos: 'adj', lvl: 'A1' }, { w: 'new', pos: 'adj', lvl: 'A1' }, { w: 'old', pos: 'adj', lvl: 'A1' },
   { w: 'in', pos: 'prep', lvl: 'A1' }, { w: 'on', pos: 'prep', lvl: 'A1' }, { w: 'at', pos: 'prep', lvl: 'A1' },
   { w: 'under', pos: 'prep', lvl: 'A1' }, { w: 'over', pos: 'prep', lvl: 'A1' }, { w: 'with', pos: 'prep', lvl: 'A1' },
   { w: 'he', pos: 'pron', lvl: 'A1' }, { w: 'she', pos: 'pron', lvl: 'A1' }, { w: 'they', pos: 'pron', lvl: 'A1' },
   { w: 'it', pos: 'pron', lvl: 'A1' }, { w: 'we', pos: 'pron', lvl: 'A1' }, { w: 'you', pos: 'pron', lvl: 'A1' },
   { w: 'I', pos: 'pron', lvl: 'A1' }, { w: 'this', pos: 'pron', lvl: 'A1' }, { w: 'that', pos: 'pron', lvl: 'A1' },

   // A2 - Intermediário Básico
   { w: 'quickly', pos: 'adv', lvl: 'A2' }, { w: 'slowly', pos: 'adv', lvl: 'A2' }, { w: 'easily', pos: 'adv', lvl: 'A2' },
   { w: 'hardly', pos: 'adv', lvl: 'A2' }, { w: 'really', pos: 'adv', lvl: 'A2' }, { w: 'very', pos: 'adv', lvl: 'A2' },
   { w: 'beautiful', pos: 'adj', lvl: 'A2' }, { w: 'ugly', pos: 'adj', lvl: 'A2' }, { w: 'expensive', pos: 'adj', lvl: 'A2' },
   { w: 'cheap', pos: 'adj', lvl: 'A2' }, { w: 'difficult', pos: 'adj', lvl: 'A2' }, { w: 'easy', pos: 'adj', lvl: 'A2' },
   { w: 'interesting', pos: 'adj', lvl: 'A2' }, { w: 'boring', pos: 'adj', lvl: 'A2' }, { w: 'important', pos: 'adj', lvl: 'A2' },
   { w: 'music', pos: 'noun', lvl: 'A2' }, { w: 'movie', pos: 'noun', lvl: 'A2' }, { w: 'sport', pos: 'noun', lvl: 'A2' },
   { w: 'travel', pos: 'noun', lvl: 'A2' }, { w: 'city', pos: 'noun', lvl: 'A2' }, { w: 'country', pos: 'noun', lvl: 'A2' },
   { w: 'family', pos: 'noun', lvl: 'A2' }, { w: 'child', pos: 'noun', lvl: 'A2' }, { w: 'parent', pos: 'noun', lvl: 'A2' },
   { w: 'money', pos: 'noun', lvl: 'A2' }, { w: 'time', pos: 'noun', lvl: 'A2' }, { w: 'day', pos: 'noun', lvl: 'A2' },
   { w: 'year', pos: 'noun', lvl: 'A2' }, { w: 'week', pos: 'noun', lvl: 'A2' }, { w: 'month', pos: 'noun', lvl: 'A2' },
   { w: 'love', pos: 'verb', lvl: 'A2' }, { w: 'like', pos: 'verb', lvl: 'A2' }, { w: 'hate', pos: 'verb', lvl: 'A2' },
   { w: 'need', pos: 'verb', lvl: 'A2' }, { w: 'want', pos: 'verb', lvl: 'A2' }, { w: 'help', pos: 'verb', lvl: 'A2' },
   { w: 'start', pos: 'verb', lvl: 'A2' }, { w: 'finish', pos: 'verb', lvl: 'A2' }, { w: 'live', pos: 'verb', lvl: 'A2' },
   { w: 'during', pos: 'prep', lvl: 'A2' }, { w: 'before', pos: 'prep', lvl: 'A2' }, { w: 'after', pos: 'prep', lvl: 'A2' },
   { w: 'between', pos: 'prep', lvl: 'A2' }, { w: 'near', pos: 'prep', lvl: 'A2' }, { w: 'next', pos: 'prep', lvl: 'A2' },

   // B1 - Intermediário
   { w: 'purchase', pos: 'verb', lvl: 'B1' }, { w: 'improve', pos: 'verb', lvl: 'B1' }, { w: 'achieve', pos: 'verb', lvl: 'B1' },
   { w: 'develop', pos: 'verb', lvl: 'B1' }, { w: 'create', pos: 'verb', lvl: 'B1' }, { w: 'manage', pos: 'verb', lvl: 'B1' },
   { w: 'increase', pos: 'verb', lvl: 'B1' }, { w: 'decrease', pos: 'verb', lvl: 'B1' }, { w: 'provide', pos: 'verb', lvl: 'B1' },
   { w: 'device', pos: 'noun', lvl: 'B1' }, { w: 'feature', pos: 'noun', lvl: 'B1' }, { w: 'challenge', pos: 'noun', lvl: 'B1' },
   { w: 'solution', pos: 'noun', lvl: 'B1' }, { w: 'problem', pos: 'noun', lvl: 'B1' }, { w: 'result', pos: 'noun', lvl: 'B1' },
   { w: 'process', pos: 'noun', lvl: 'B1' }, { w: 'system', pos: 'noun', lvl: 'B1' }, { w: 'method', pos: 'noun', lvl: 'B1' },
   { w: 'service', pos: 'noun', lvl: 'B1' }, { w: 'product', pos: 'noun', lvl: 'B1' }, { w: 'customer', pos: 'noun', lvl: 'B1' },
   { w: 'company', pos: 'noun', lvl: 'B1' }, { w: 'market', pos: 'noun', lvl: 'B1' }, { w: 'business', pos: 'noun', lvl: 'B1' },
   { w: 'important', pos: 'adj', lvl: 'B1' }, { w: 'different', pos: 'adj', lvl: 'B1' }, { w: 'similar', pos: 'adj', lvl: 'B1' },
   { w: 'possible', pos: 'adj', lvl: 'B1' }, { w: 'impossible', pos: 'adj', lvl: 'B1' }, { w: 'necessary', pos: 'adj', lvl: 'B1' },
   { w: 'successful', pos: 'adj', lvl: 'B1' }, { w: 'useful', pos: 'adj', lvl: 'B1' }, { w: 'effective', pos: 'adj', lvl: 'B1' },
   { w: 'carefully', pos: 'adv', lvl: 'B1' }, { w: 'recently', pos: 'adv', lvl: 'B1' }, { w: 'suddenly', pos: 'adv', lvl: 'B1' },
   { w: 'immediately', pos: 'adv', lvl: 'B1' }, { w: 'finally', pos: 'adv', lvl: 'B1' }, { w: 'usually', pos: 'adv', lvl: 'B1' },
   { w: 'according', pos: 'prep', lvl: 'B1' }, { w: 'instead', pos: 'prep', lvl: 'B1' }, { w: 'except', pos: 'prep', lvl: 'B1' },
   { w: 'across', pos: 'prep', lvl: 'B1' }, { w: 'towards', pos: 'prep', lvl: 'B1' }, { w: 'among', pos: 'prep', lvl: 'B1' },

   // B2 - Intermediário Avançado
   { w: 'consider', pos: 'verb', lvl: 'B2' }, { w: 'analyze', pos: 'verb', lvl: 'B2' }, { w: 'evaluate', pos: 'verb', lvl: 'B2' },
   { w: 'implement', pos: 'verb', lvl: 'B2' }, { w: 'demonstrate', pos: 'verb', lvl: 'B2' }, { w: 'establish', pos: 'verb', lvl: 'B2' },
   { w: 'strategy', pos: 'noun', lvl: 'B2' }, { w: 'analysis', pos: 'noun', lvl: 'B2' }, { w: 'development', pos: 'noun', lvl: 'B2' },
   { w: 'technology', pos: 'noun', lvl: 'B2' }, { w: 'environment', pos: 'noun', lvl: 'B2' }, { w: 'education', pos: 'noun', lvl: 'B2' },
   { w: 'communication', pos: 'noun', lvl: 'B2' }, { w: 'organization', pos: 'noun', lvl: 'B2' }, { w: 'performance', pos: 'noun', lvl: 'B2' },
   { w: 'reliable', pos: 'adj', lvl: 'B2' }, { w: 'efficient', pos: 'adj', lvl: 'B2' }, { w: 'significant', pos: 'adj', lvl: 'B2' },
   { w: 'appropriate', pos: 'adj', lvl: 'B2' }, { w: 'sufficient', pos: 'adj', lvl: 'B2' }, { w: 'complex', pos: 'adj', lvl: 'B2' },
   { w: 'flexible', pos: 'adj', lvl: 'B2' }, { w: 'innovative', pos: 'adj', lvl: 'B2' }, { w: 'sustainable', pos: 'adj', lvl: 'B2' },
   { w: 'throughout', pos: 'prep', lvl: 'B2' }, { w: 'despite', pos: 'prep', lvl: 'B2' }, { w: 'regarding', pos: 'prep', lvl: 'B2' },
   { w: 'concerning', pos: 'prep', lvl: 'B2' }, { w: 'whereas', pos: 'conj', lvl: 'B2' }, { w: 'nevertheless', pos: 'adv', lvl: 'B2' },
   { w: 'consequently', pos: 'adv', lvl: 'B2' }, { w: 'furthermore', pos: 'adv', lvl: 'B2' }, { w: 'meanwhile', pos: 'adv', lvl: 'B2' },

   // C1 - Avançado
   { w: 'mitigate', pos: 'verb', lvl: 'C1' }, { w: 'endeavor', pos: 'verb', lvl: 'C1' }, { w: 'facilitate', pos: 'verb', lvl: 'C1' },
   { w: 'exemplify', pos: 'verb', lvl: 'C1' }, { w: 'underscore', pos: 'verb', lvl: 'C1' }, { w: 'articulate', pos: 'verb', lvl: 'C1' },
   { w: 'hypothesis', pos: 'noun', lvl: 'C1' }, { w: 'implication', pos: 'noun', lvl: 'C1' }, { w: 'paradigm', pos: 'noun', lvl: 'C1' },
   { w: 'phenomenon', pos: 'noun', lvl: 'C1' }, { w: 'conundrum', pos: 'noun', lvl: 'C1' }, { w: 'dichotomy', pos: 'noun', lvl: 'C1' },
   { w: 'meticulous', pos: 'adj', lvl: 'C1' }, { w: 'pragmatic', pos: 'adj', lvl: 'C1' }, { w: 'ubiquitous', pos: 'adj', lvl: 'C1' },
   { w: 'ostensibly', pos: 'adv', lvl: 'C1' }, { w: 'inherently', pos: 'adv', lvl: 'C1' }, { w: 'predominantly', pos: 'adv', lvl: 'C1' },
   { w: 'notwithstanding', pos: 'prep', lvl: 'C1' }, { w: 'irrespective', pos: 'prep', lvl: 'C1' }, { w: 'albeit', pos: 'conj', lvl: 'C1' },
   { w: 'whereupon', pos: 'adv', lvl: 'C1' }, { w: 'hitherto', pos: 'adv', lvl: 'C1' }, { w: 'forthwith', pos: 'adv', lvl: 'C1' }
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
