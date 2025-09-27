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
   { w: 'whereupon', pos: 'adv', lvl: 'C1' }, { w: 'hitherto', pos: 'adv', lvl: 'C1' }, { w: 'forthwith', pos: 'adv', lvl: 'C1' },

   // Palavras adicionais para garantir variedade (A1-A2 extras)
   { w: 'apple', pos: 'noun', lvl: 'A1' }, { w: 'tree', pos: 'noun', lvl: 'A1' }, { w: 'sun', pos: 'noun', lvl: 'A1' },
   { w: 'moon', pos: 'noun', lvl: 'A1' }, { w: 'star', pos: 'noun', lvl: 'A1' }, { w: 'door', pos: 'noun', lvl: 'A1' },
   { w: 'window', pos: 'noun', lvl: 'A1' }, { w: 'chair', pos: 'noun', lvl: 'A1' }, { w: 'table', pos: 'noun', lvl: 'A1' },
   { w: 'phone', pos: 'noun', lvl: 'A1' }, { w: 'computer', pos: 'noun', lvl: 'A1' }, { w: 'pen', pos: 'noun', lvl: 'A1' },
   { w: 'paper', pos: 'noun', lvl: 'A1' }, { w: 'money', pos: 'noun', lvl: 'A1' }, { w: 'game', pos: 'noun', lvl: 'A1' },
   { w: 'come', pos: 'verb', lvl: 'A1' }, { w: 'look', pos: 'verb', lvl: 'A1' }, { w: 'see', pos: 'verb', lvl: 'A1' },
   { w: 'hear', pos: 'verb', lvl: 'A1' }, { w: 'walk', pos: 'verb', lvl: 'A1' }, { w: 'stand', pos: 'verb', lvl: 'A1' },
   { w: 'sit', pos: 'verb', lvl: 'A1' }, { w: 'buy', pos: 'verb', lvl: 'A1' }, { w: 'sell', pos: 'verb', lvl: 'A1' },
   { w: 'open', pos: 'verb', lvl: 'A1' }, { w: 'close', pos: 'verb', lvl: 'A1' }, { w: 'give', pos: 'verb', lvl: 'A1' },
   { w: 'take', pos: 'verb', lvl: 'A1' }, { w: 'put', pos: 'verb', lvl: 'A1' }, { w: 'get', pos: 'verb', lvl: 'A1' },
   { w: 'green', pos: 'adj', lvl: 'A1' }, { w: 'blue', pos: 'adj', lvl: 'A1' }, { w: 'red', pos: 'adj', lvl: 'A1' },
   { w: 'yellow', pos: 'adj', lvl: 'A1' }, { w: 'black', pos: 'adj', lvl: 'A1' }, { w: 'white', pos: 'adj', lvl: 'A1' },
   { w: 'long', pos: 'adj', lvl: 'A1' }, { w: 'short', pos: 'adj', lvl: 'A1' }, { w: 'tall', pos: 'adj', lvl: 'A1' },
   { w: 'wide', pos: 'adj', lvl: 'A1' }, { w: 'narrow', pos: 'adj', lvl: 'A1' }, { w: 'thick', pos: 'adj', lvl: 'A1' },
   { w: 'thin', pos: 'adj', lvl: 'A1' }, { w: 'heavy', pos: 'adj', lvl: 'A1' }, { w: 'light', pos: 'adj', lvl: 'A1' },

   // A2 extras
   { w: 'person', pos: 'noun', lvl: 'A2' }, { w: 'place', pos: 'noun', lvl: 'A2' }, { w: 'thing', pos: 'noun', lvl: 'A2' },
   { w: 'idea', pos: 'noun', lvl: 'A2' }, { w: 'number', pos: 'noun', lvl: 'A2' }, { w: 'part', pos: 'noun', lvl: 'A2' },
   { w: 'world', pos: 'noun', lvl: 'A2' }, { w: 'hand', pos: 'noun', lvl: 'A2' }, { w: 'eye', pos: 'noun', lvl: 'A2' },
   { w: 'face', pos: 'noun', lvl: 'A2' }, { w: 'way', pos: 'noun', lvl: 'A2' }, { w: 'case', pos: 'noun', lvl: 'A2' },
   { w: 'question', pos: 'noun', lvl: 'A2' }, { w: 'answer', pos: 'noun', lvl: 'A2' }, { w: 'story', pos: 'noun', lvl: 'A2' },
   { w: 'feel', pos: 'verb', lvl: 'A2' }, { w: 'think', pos: 'verb', lvl: 'A2' }, { w: 'know', pos: 'verb', lvl: 'A2' },
   { w: 'learn', pos: 'verb', lvl: 'A2' }, { w: 'teach', pos: 'verb', lvl: 'A2' }, { w: 'study', pos: 'verb', lvl: 'A2' },
   { w: 'listen', pos: 'verb', lvl: 'A2' }, { w: 'speak', pos: 'verb', lvl: 'A2' }, { w: 'ask', pos: 'verb', lvl: 'A2' },
   { w: 'answer', pos: 'verb', lvl: 'A2' }, { w: 'tell', pos: 'verb', lvl: 'A2' }, { w: 'show', pos: 'verb', lvl: 'A2' },

   // B1 extras para garantir 100+ cartas
   { w: 'understand', pos: 'verb', lvl: 'B1' }, { w: 'explain', pos: 'verb', lvl: 'B1' }, { w: 'decide', pos: 'verb', lvl: 'B1' },
   { w: 'choose', pos: 'verb', lvl: 'B1' }, { w: 'change', pos: 'verb', lvl: 'B1' }, { w: 'turn', pos: 'verb', lvl: 'B1' },
   { w: 'build', pos: 'verb', lvl: 'B1' }, { w: 'break', pos: 'verb', lvl: 'B1' }, { w: 'fix', pos: 'verb', lvl: 'B1' },
   { w: 'carry', pos: 'verb', lvl: 'B1' }, { w: 'bring', pos: 'verb', lvl: 'B1' }, { w: 'send', pos: 'verb', lvl: 'B1' },

   // Mais palavras para completar 110+ cartas
   { w: 'receive', pos: 'verb', lvl: 'B1' }, { w: 'offer', pos: 'verb', lvl: 'B1' }, { w: 'accept', pos: 'verb', lvl: 'B1' },
   { w: 'refuse', pos: 'verb', lvl: 'B1' }, { w: 'agree', pos: 'verb', lvl: 'B1' }, { w: 'disagree', pos: 'verb', lvl: 'B1' },
   { w: 'join', pos: 'verb', lvl: 'B1' }, { w: 'leave', pos: 'verb', lvl: 'B1' }, { w: 'arrive', pos: 'verb', lvl: 'B1' },
   { w: 'depart', pos: 'verb', lvl: 'B1' }, { w: 'visit', pos: 'verb', lvl: 'B1' }, { w: 'return', pos: 'verb', lvl: 'B1' },

   { w: 'strong', pos: 'adj', lvl: 'A2' }, { w: 'weak', pos: 'adj', lvl: 'A2' }, { w: 'rich', pos: 'adj', lvl: 'A2' },
   { w: 'poor', pos: 'adj', lvl: 'A2' }, { w: 'smart', pos: 'adj', lvl: 'A2' }, { w: 'silly', pos: 'adj', lvl: 'A2' },
   { w: 'funny', pos: 'adj', lvl: 'A2' }, { w: 'serious', pos: 'adj', lvl: 'A2' }, { w: 'quiet', pos: 'adj', lvl: 'A2' },
   { w: 'loud', pos: 'adj', lvl: 'A2' }, { w: 'clean', pos: 'adj', lvl: 'A2' }, { w: 'dirty', pos: 'adj', lvl: 'A2' },

   { w: 'always', pos: 'adv', lvl: 'A2' }, { w: 'never', pos: 'adv', lvl: 'A2' }, { w: 'sometimes', pos: 'adv', lvl: 'A2' },
   { w: 'often', pos: 'adv', lvl: 'A2' }, { w: 'rarely', pos: 'adv', lvl: 'A2' }, { w: 'today', pos: 'adv', lvl: 'A2' },
   { w: 'tomorrow', pos: 'adv', lvl: 'A2' }, { w: 'yesterday', pos: 'adv', lvl: 'A2' }, { w: 'now', pos: 'adv', lvl: 'A2' },
   { w: 'later', pos: 'adv', lvl: 'A2' }, { w: 'early', pos: 'adv', lvl: 'A2' }, { w: 'late', pos: 'adv', lvl: 'A2' }
];

const POS_LABEL = {
   noun: 'Substantivo',
   verb: 'Verbo',
   adj: 'Adjetivo',
   adv: 'Advérbio',
   prep: 'Preposição',
   pron: 'Pronome'
};

const POS_COLORS = {
   noun: { bg: '#ef4444', text: '#ffffff' },       // Vermelho - Substantivos
   verb: { bg: '#3b82f6', text: '#ffffff' },       // Azul - Verbos
   adj: { bg: '#f59e0b', text: '#ffffff' },        // Laranja - Adjetivos
   adv: { bg: '#10b981', text: '#ffffff' },        // Verde - Advérbios
   prep: { bg: '#8b5cf6', text: '#ffffff' },       // Roxo - Preposições
   pron: { bg: '#f97316', text: '#ffffff' },       // Laranja escuro - Pronomes
   conj: { bg: '#06b6d4', text: '#ffffff' },       // Ciano - Conjunções
   interjection: { bg: '#ec4899', text: '#ffffff' } // Pink - Interjeições
};

// Sistema de Pontuação Exponencial
const EXPONENTIAL_POINTS = {
   0: 0, 1: 0, 2: 2, 3: 4, 4: 8, 5: 16
};

function calculateExponentialPoints(count) {
   return EXPONENTIAL_POINTS[Math.min(count, 5)] || 0;
}

// Objectives baseados em quantidade máxima com pontuação exponencial
const OBJECTIVES = [
   // Objetivos por tipo gramatical - todos níveis
   {
      id: 'verb-collection',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      label: 'Coleção de Verbos',
      type: 'verb',
      tooltip: 'Colete o máximo de verbos possível! Pontuação: 2 verbos = 2pts, 3 verbos = 4pts, 4 verbos = 8pts, 5 verbos = 16pts',
      videoUrl: 'tutorial-verbos.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'verb')),
      prog: (h) => count(h, 'verb') / 5
   },
   {
      id: 'noun-collection',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      label: 'Coleção de Substantivos',
      type: 'noun',
      tooltip: 'Colete o máximo de substantivos possível! Pontuação: 2 substantivos = 2pts, 3 substantivos = 4pts, 4 substantivos = 8pts, 5 substantivos = 16pts',
      videoUrl: 'tutorial-substantivos.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'noun')),
      prog: (h) => count(h, 'noun') / 5
   },
   {
      id: 'adj-collection',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      label: 'Coleção de Adjetivos',
      type: 'adj',
      tooltip: 'Colete o máximo de adjetivos possível! Pontuação: 2 adjetivos = 2pts, 3 adjetivos = 4pts, 4 adjetivos = 8pts, 5 adjetivos = 16pts',
      videoUrl: 'tutorial-adjetivos.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'adj')),
      prog: (h) => count(h, 'adj') / 5
   },
   {
      id: 'adv-collection',
      levels: ['A2', 'B1', 'B2', 'C1'],
      label: 'Coleção de Advérbios',
      type: 'adv',
      tooltip: 'Colete o máximo de advérbios possível! Pontuação: 2 advérbios = 2pts, 3 advérbios = 4pts, 4 advérbios = 8pts, 5 advérbios = 16pts',
      videoUrl: 'tutorial-adverbios.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'adv')),
      prog: (h) => count(h, 'adv') / 5
   },
   {
      id: 'prep-collection',
      levels: ['B1', 'B2', 'C1'],
      label: 'Coleção de Preposições',
      type: 'prep',
      tooltip: 'Colete o máximo de preposições possível! Pontuação: 2 preposições = 2pts, 3 preposições = 4pts, 4 preposições = 8pts, 5 preposições = 16pts',
      videoUrl: 'tutorial-preposicoes.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'prep')),
      prog: (h) => count(h, 'prep') / 5
   },
   {
      id: 'pron-collection',
      levels: ['A1', 'A2', 'B1', 'B2', 'C1'],
      label: 'Coleção de Pronomes',
      type: 'pron',
      tooltip: 'Colete o máximo de pronomes possível! Pontuação: 2 pronomes = 2pts, 3 pronomes = 4pts, 4 pronomes = 8pts, 5 pronomes = 16pts',
      videoUrl: 'tutorial-pronomes.mp4',
      calculate: (h) => calculateExponentialPoints(count(h, 'pron')),
      prog: (h) => count(h, 'pron') / 5
   },
   // Objetivos especiais avançados
   {
      id: 'perfect-collection',
      levels: ['C1'],
      label: 'Coleção Perfeita',
      type: 'special',
      tooltip: 'O desafio supremo: colete 5 cartas do mesmo tipo! Recompensa máxima de 16 pontos.',
      videoUrl: 'tutorial-colecao-perfeita.mp4',
      calculate: (h) => {
         const counts = ['verb', 'noun', 'adj', 'adv', 'prep', 'pron'].map(type => count(h, type));
         const maxCount = Math.max(...counts);
         return maxCount === 5 ? 16 : 0;
      },
      prog: (h) => {
         const counts = ['verb', 'noun', 'adj', 'adv', 'prep', 'pron'].map(type => count(h, type));
         const maxCount = Math.max(...counts);
         return maxCount / 5;
      }
   },
   {
      id: 'diversity-bonus',
      levels: ['B2', 'C1'],
      label: 'Bônus de Diversidade',
      type: 'special',
      tooltip: 'Tenha pelo menos 1 carta de diferentes tipos. Pontuação baseada na variedade: 3 tipos = 4pts, 4 tipos = 8pts, 5+ tipos = 16pts',
      videoUrl: 'tutorial-diversidade.mp4',
      calculate: (h) => {
         const distinctTypes = distinctPOS(h);
         if (distinctTypes >= 5) return 16;
         if (distinctTypes >= 4) return 8;
         if (distinctTypes >= 3) return 4;
         return 0;
      },
      prog: (h) => Math.min(distinctPOS(h) / 5, 1)
   }
];

// Game Configuration
const GAME_CONFIG = {
   maxRounds: 10,
   initialRerolls: 5,
   roundTimer: 20, // seconds
   handSize: 5
};

// Export for use in other modules
window.WORDS = WORDS;
window.POS_LABEL = POS_LABEL;
window.POS_COLORS = POS_COLORS;
window.OBJECTIVES = OBJECTIVES;
window.GAME_CONFIG = GAME_CONFIG;
window.EXPONENTIAL_POINTS = EXPONENTIAL_POINTS;
window.calculateExponentialPoints = calculateExponentialPoints;
